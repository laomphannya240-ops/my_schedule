import { formatClock, formatFullDate } from '../lib/dates'
import IconButton from './IconButton'
import { BookIcon, ClockIcon, MoonIcon, SlidersIcon, SunIcon } from './Icons'

/**
 * Brand mark, page title, full local date, live clock and the two global
 * actions. The clock is refreshed by the single useNow timer in App.
 */
export default function Header({
  now,
  resolvedTheme,
  onToggleTheme,
  onOpenSettings,
}) {
  const isDark = resolvedTheme === 'dark'

  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-contrast shadow-sm ring-1 ring-black/5 sm:size-11 dark:ring-white/10"
          >
            <BookIcon className="size-5" />
          </span>

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-subtle">
              Daily study schedule
            </p>
            <h1 className="mt-0.5 truncate text-2xl leading-tight text-ink sm:text-[28px]">
              Study Planner
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <IconButton
            label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            onClick={onToggleTheme}
          >
            {isDark ? (
              <SunIcon className="size-4" />
            ) : (
              <MoonIcon className="size-4" />
            )}
          </IconButton>

          <IconButton label="Open appearance settings" onClick={onOpenSettings}>
            <SlidersIcon className="size-4" />
          </IconButton>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5 text-[13px] text-ink-muted">
        <span>{formatFullDate(now)}</span>
        <span aria-hidden="true" className="hidden h-3 w-px bg-line-strong sm:block" />
        <time
          dateTime={now.toISOString()}
          className="inline-flex items-center gap-1.5 text-ink"
        >
          <ClockIcon className="size-3.5 text-ink-subtle" />
          <span className="font-mono text-[12.5px] font-medium tabular-nums tracking-tight">
            {formatClock(now)}
          </span>
        </time>
      </div>
    </header>
  )
}
