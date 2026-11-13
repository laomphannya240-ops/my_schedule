import {
  addDays,
  formatFullDate,
  formatWeekday,
  startOfDay,
  toDateKey,
} from '../lib/dates'

/**
 * Seven compact cards: the six previous days plus today. Today uses the accent
 * colour; fully completed days get a subtle success tint.
 */
export default function WeekStrip({ now, dayRatio }) {
  const today = startOfDay(now)
  const days = Array.from({ length: 7 }, (_, index) =>
    addDays(today, index - 6),
  )
  const todayKey = toDateKey(today)
  const percents = days.map((date) =>
    Math.round(dayRatio(toDateKey(date)) * 100),
  )
  const average = Math.round(
    percents.reduce((total, percent) => total + percent, 0) / days.length,
  )

  return (
    <section
      aria-labelledby="week-title"
      className="rounded-xl border border-line bg-surface p-4 transition-colors duration-200 sm:p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 id="week-title" className="text-base text-ink">
          Last 7 days
        </h2>
        <p className="text-[11px] text-ink-subtle">
          Average{' '}
          <span className="font-medium tabular-nums text-ink-muted">
            {average}%
          </span>
        </p>
      </div>

      <ol className="mt-3.5 grid grid-cols-7 gap-1.5">
        {days.map((date, index) => {
          const dateKey = toDateKey(date)
          const percent = percents[index]
          const isToday = dateKey === todayKey
          const complete = percent === 100

          return (
            <li
              key={dateKey}
              aria-current={isToday ? 'date' : undefined}
              aria-label={`${formatFullDate(date)}: ${percent}% done${
                isToday ? ', today' : ''
              }`}
              className={`rounded-lg border px-0.5 py-2 text-center transition duration-200 motion-safe:hover:scale-[1.04] ${
                complete
                  ? 'border-success/30 bg-success/[0.07]'
                  : 'border-line bg-surface-2'
              } ${isToday ? 'ring-1 ring-accent/60' : ''}`}
            >
              <p
                className={`truncate text-[9px] font-semibold uppercase tracking-wide ${
                  isToday
                    ? 'text-accent'
                    : complete
                      ? 'text-success'
                      : 'text-ink-subtle'
                }`}
              >
                {formatWeekday(date)}
              </p>
              <p className="mt-0.5 font-mono text-[10px] tabular-nums text-ink-muted">
                {date.getDate()}
              </p>
              <p
                className={`mt-1 text-[11px] font-semibold tabular-nums ${
                  complete
                    ? 'text-success'
                    : isToday
                      ? 'text-accent'
                      : 'text-ink-muted'
                }`}
              >
                {percent}%
              </p>
              <span
                aria-hidden="true"
                className="mx-auto mt-1 block h-1 w-5 overflow-hidden rounded-full bg-line"
              >
                <span
                  style={{ width: `${percent}%` }}
                  className={`block h-full rounded-full ${
                    complete ? 'bg-success' : 'bg-accent'
                  }`}
                />
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
