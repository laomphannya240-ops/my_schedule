# Daily Study Schedule

A one-page study timetable built with React and Tailwind CSS. Tick study blocks
as you finish them and the page calculates today's progress, your streak and the
last seven days. Everything stays in your browser — there is no backend.

## Run it

```bash
npm install
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production build in dist/
npm run preview  # preview the production build
npm run lint     # oxlint
```

## Edit your schedule

All plan data lives in `src/data/blocks.js`:

- `START_DATE` — Day 1 of the plan, as a local `YYYY-MM-DD` date.
- `TOTAL_DAYS` — how long the plan lasts.
- `BLOCKS` — the timetable rows. Times use 24-hour `HH:MM`; `study: true` gives
  a row a checkbox, `study: false` renders it as a dashed break row.

Study blocks, total study hours and total block counts are derived from
`BLOCKS`, so the stats update automatically when you edit the file.

## Folder structure

```text
src/
  data/blocks.js          Plan data and derived totals
  lib/dates.js            Local-date helpers (keys, day math, formatting)
  lib/time.js             "HH:MM" parsing and hour formatting
  hooks/
    useLocalStorage.js    Safe JSON persistence with try/catch
    useNow.js             Current Date, refreshed every 30 s
    useTheme.js           Light/dark theme, remembers the user's choice
    useStudyData.js       Ticks, clearToday, dayRatio, streak, hours
  components/
    Header.jsx            Title, full date, live 24-hour clock
    StatsRow.jsx          Plan day, streak, studied hours
    ProgressBar.jsx       Accessible progressbar + percent
    BlockList.jsx         Maps every row from blocks.js
    BlockItem.jsx         Time, title, sub text, checkbox, now/done states
    WeekStrip.jsx         Last 7 days with percent done
    Footer.jsx            Clear today's ticks, switch theme
  App.jsx                 Page composition and shared state
  index.css               Tailwind import, dark variant, fonts, base styles
```

## Stored data

Progress is saved under `study-schedule:progress:v1` as:

```json
{ "2026-11-13": ["eng", "fe"] }
```

The theme is saved under `study-schedule:theme` (`"light"` or `"dark"`). Until
you press **Switch theme**, the page follows your operating system preference.
Clearing browser storage resets everything.
