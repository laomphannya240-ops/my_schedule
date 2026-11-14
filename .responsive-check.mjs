import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--remote-debugging-port=9223',
  '--remote-allow-origins=*', '--user-data-dir=D:\\Project\\study-schedule\\.responsive-check\\profile-final6',
  'about:blank',
], { stdio: 'ignore' })

try {
  let version
  for (let i = 0; i < 50; i++) {
    try { version = await (await fetch('http://127.0.0.1:9223/json/version')).json(); break } catch { await delay(200) }
  }
  if (!version) throw new Error('Chrome DevTools did not start')
  const target = await (await fetch('http://127.0.0.1:9223/json/new?http://127.0.0.1:5173/', { method: 'PUT' })).json()
  console.log('target', target.url, target.webSocketDebuggerUrl)
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
  let nextId = 0
  const pending = new Map()
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message)
      pending.delete(message.id)
    }
  }
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++nextId
    pending.set(id, resolve)
    ws.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async (expression) => {
    const response = await send('Runtime.evaluate', { returnByValue: true, expression })
    if (response.result?.exceptionDetails) throw new Error(response.result.exceptionDetails.text)
    return response.result.result.value
  }
  await send('Page.enable')
  await send('Runtime.enable')
  const pageLoaded = new Promise((resolve) => ws.addEventListener('message', function loaded(event) {
    const message = JSON.parse(event.data)
    if (message.method === 'Page.loadEventFired') { ws.removeEventListener('message', loaded); resolve() }
  }))
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' })
  await pageLoaded
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    const emulated = await send('Emulation.setDeviceMetricsOverride', { width, height: 1100, deviceScaleFactor: 1, mobile: false })
    if (width === 320) console.log('emulation', JSON.stringify(emulated))
    const result = await send('Runtime.evaluate', { returnByValue: true, expression: `(() => { const overflow=[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>${width}+1).map(e=>({tag:e.tagName,cls:typeof e.className==='string'?e.className:'',text:(e.innerText||'').slice(0,30),left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right),width:Math.round(e.getBoundingClientRect().width),scroll:e.scrollWidth,client:e.clientWidth})).sort((a,b)=>b.right-a.right).slice(0,14);return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,overflow} })()` })
    console.log(JSON.stringify(result.result?.result?.value || result.result?.result?.description || result))
    if (width <= 390) {
      const shot = await send('Page.captureScreenshot', { format: 'png' })
      await writeFile(`.responsive-check/cdp-${width}.png`, Buffer.from(shot.result.data, 'base64'))
    }
    if (width === 320) {
      const details = await send('Runtime.evaluate', { returnByValue: true, expression: `(() => {let e=document.body;let arr=[];for(let i=0;e&&i<8;i++,e=e.firstElementChild){const r=e.getBoundingClientRect(),c=getComputedStyle(e);arr.push({tag:e.tagName,id:e.id,cls:e.className,width:Math.round(r.width),left:Math.round(r.left),right:Math.round(r.right),min:c.minWidth,display:c.display,columns:c.gridTemplateColumns})}return {client:document.documentElement.clientWidth,body:document.body.getBoundingClientRect().width,arr}})()` })
      console.log('ancestors', JSON.stringify(details))
    }
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 1100, deviceScaleFactor: 1, mobile: false })
  const capturePage = async (name) => {
    const metrics = await evaluate(`({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth})`)
    const shot = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(`.responsive-check/${name}.png`, Buffer.from(shot.result.data, 'base64'))
    console.log(name, JSON.stringify(metrics))
  }
  await evaluate(`[...document.querySelectorAll('nav button')].find(b=>b.textContent.includes('Calendar')).click()`)
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Weekly').click()`)
  await capturePage('weekly-320')
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Monthly').click()`)
  await capturePage('monthly-320')
  await evaluate(`[...document.querySelectorAll('nav button')].find(b=>b.textContent.includes('Settings')).click()`)
  await capturePage('settings-320')
  await evaluate(`document.querySelector('header button:last-child').click()`)
  await capturePage('form-320')
  console.log('form controls', JSON.stringify(await evaluate(`({dialogWidth:Math.round(document.querySelector('form').getBoundingClientRect().width),inputs:[...document.querySelectorAll('form input,form select,form textarea')].map(e=>Math.round(e.getBoundingClientRect().height)),colorTargets:[...document.querySelectorAll('form button[aria-label]')].map(e=>Math.round(e.getBoundingClientRect().height))})`)))
  await evaluate(`document.querySelector('form button[type=button]').click()`)
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
  await evaluate(`[...document.querySelectorAll('nav button')].find(b=>b.textContent.includes('Dashboard')).click()`)
  const baseCount = await evaluate(`JSON.parse(localStorage.getItem('study-schedule:planner:v1')||'[]').length`)
  await evaluate(`document.querySelector('header button:last-child').click()`)
  await evaluate(`(()=>{const f=document.querySelector('form');const i=f.querySelectorAll('input');const set=(e,v)=>{const p=Object.getPrototypeOf(e);Object.getOwnPropertyDescriptor(p,'value').set.call(e,v);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))};set(i[0],'Viewport smoke test');set(i[1],'Testing')})()`)
  await evaluate(`[...document.querySelectorAll('form button')].find(b=>b.textContent.includes('Save schedule')).click()`)
  await delay(100)
  const added = await evaluate(`document.body.innerText.includes('Viewport smoke test') && JSON.parse(localStorage.getItem('study-schedule:planner:v1')).length===${baseCount + 1}`)
  await evaluate(`[...document.querySelectorAll('article')].find(a=>a.innerText.includes('Viewport smoke test')).querySelectorAll('button')[1].click()`)
  const openedEdit = await evaluate(`!!document.querySelector('form')`)
  const editResult = await evaluate(`(()=>{const e=document.querySelector('form input');const p=Object.getPrototypeOf(e);Object.getOwnPropertyDescriptor(p,'value').set.call(e,'Viewport edited');e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));const value=e.value;document.querySelector('form button:not([type=button])').click();return value})()`)
  await delay(100)
  const edited = await evaluate(`JSON.parse(localStorage.getItem('study-schedule:planner:v1')).some(s=>s.title==='Viewport edited')`)
  const pageLoadedAgain = new Promise((resolve) => ws.addEventListener('message', function loaded(event) {
    const message = JSON.parse(event.data)
    if (message.method === 'Page.loadEventFired') { ws.removeEventListener('message', loaded); resolve() }
  }))
  await send('Page.reload')
  await pageLoadedAgain
  const persisted = await evaluate(`JSON.parse(localStorage.getItem('study-schedule:planner:v1')).some(s=>s.title==='Viewport edited')`)
  await evaluate(`window.confirm=()=>true;[...document.querySelectorAll('article')].find(a=>a.innerText.includes('Viewport edited')).querySelectorAll('button')[3].click()`)
  const deleted = await evaluate(`!JSON.parse(localStorage.getItem('study-schedule:planner:v1')).some(s=>s.title==='Viewport edited') && JSON.parse(localStorage.getItem('study-schedule:planner:v1')).length===${baseCount}`)
  await evaluate(`[...document.querySelectorAll('nav button')].find(b=>b.textContent.includes('Settings')).click()`)
  await evaluate(`(()=>{const s=document.querySelectorAll('section select');const p=Object.getPrototypeOf(s[0]);Object.getOwnPropertyDescriptor(p,'value').set.call(s[0],'km');s[0].dispatchEvent(new Event('change',{bubbles:true}));})()`)
  await delay(100)
  const khmer = await evaluate(`JSON.parse(localStorage.getItem('study-schedule:planner-settings:v1')).language==='km'`)
  console.log('smoke', JSON.stringify({ added, openedEdit, editResult, edited, persisted, deleted, khmer, remainingCount: await evaluate(`JSON.parse(localStorage.getItem('study-schedule:planner:v1')).length`) }))
  ws.close()
} finally {
  chrome.kill()
}
