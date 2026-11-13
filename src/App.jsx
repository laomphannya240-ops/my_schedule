import { useCallback, useEffect, useMemo, useState } from 'react'
import BlockList from './components/BlockList'
import CompletionToast from './components/Toast'
import Footer from './components/Footer'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import SettingsPanel from './components/SettingsPanel'
import StatsRow from './components/StatsRow'
import WeekStrip from './components/WeekStrip'
import { PLANNED_STUDY_HOURS, STUDY_BLOCKS } from './data/blocks'
import { useAppearance } from './hooks/useAppearance'
import { useNow } from './hooks/useNow'
import { useStudyData } from './hooks/useStudyData'
import { toDateKey } from './lib/dates'

const NO_TICKS = []

function App() {
  // One timer drives the header clock and the "Now" highlight.
  const now = useNow(30_000)
  const { appearance, resolvedTheme, update, reset, toggleTheme } =
    useAppearance()
  const { progress, toggle, clearToday, dayRatio, streak, hoursForDay } =
    useStudyData()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const todayKey = toDateKey(now)
  const tickedIds = useMemo(
    () => (Array.isArray(progress[todayKey]) ? progress[todayKey] : NO_TICKS),
    [progress, todayKey],
  )
  const doneCount = useMemo(
    () =>
      STUDY_BLOCKS.filter((block) => tickedIds.includes(block.id)).length,
    [tickedIds],
  )

  // Toast dismisses on its own; a new tick restarts the timer.
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const handleToggle = useCallback(
    (blockId) => {
      const block = STUDY_BLOCKS.find((item) => item.id === blockId)
      const wasDone = tickedIds.includes(blockId)

      toggle(blockId)
      if (!block) return

      setToast({
        id: Date.now(),
        done: !wasDone,
        title: block.title,
        count: doneCount + (wasDone ? -1 : 1),
        total: STUDY_BLOCKS.length,
      })
    },
    [doneCount, tickedIds, toggle],
  )

  const openSettings = useCallback(() => setSettingsOpen(true), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])
  const handleClear = useCallback(() => {
    clearToday()
    setToast(null)
  }, [clearToday])

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[720px] px-4 py-6 sm:py-10">
        <Header
          now={now}
          resolvedTheme={resolvedTheme}
          onToggleTheme={toggleTheme}
          onOpenSettings={openSettings}
        />

        <main className="space-y-4 sm:space-y-5">
          <StatsRow
            now={now}
            streak={streak()}
            doneHours={hoursForDay(todayKey)}
            plannedHours={PLANNED_STUDY_HOURS}
          />

          <ProgressBar
            ratio={dayRatio(todayKey)}
            done={doneCount}
            total={STUDY_BLOCKS.length}
          />

          <BlockList now={now} tickedIds={tickedIds} onToggle={handleToggle} />

          <WeekStrip now={now} dayRatio={dayRatio} />
        </main>

        <Footer onClear={handleClear} hasTicks={tickedIds.length > 0} />
      </div>

      <CompletionToast toast={toast} />

      <SettingsPanel
        open={settingsOpen}
        onClose={closeSettings}
        appearance={appearance}
        onChange={update}
        onReset={reset}
      />
    </div>
  )
}

export default App
