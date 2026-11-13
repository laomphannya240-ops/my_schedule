import { START_DATE, TOTAL_DAYS } from '../data/blocks'
import { daysBetween, toDateKey } from '../lib/dates'
import { formatHours } from '../lib/time'
import { CalendarIcon, ClockIcon, FlameIcon } from './Icons'

function StatCard({ label, value, hint, icon: StatIcon, tone }) {
  return (
    <article className="rounded-xl border border-line bg-surface p-3.5 transition-colors duration-200 hover:border-line-strong sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="pt-0.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
          {label}
        </p>
        <span
          className={`grid size-7 shrink-0 place-items-center rounded-md ${
            tone === 'success'
              ? 'bg-success/10 text-success'
              : 'bg-accent/10 text-accent'
          }`}
        >
          <StatIcon className="size-3.5" />
        </span>
      </div>

      <p className="mt-3 type-heading text-2xl leading-none tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-1.5 text-xs leading-snug text-ink-muted">{hint}</p>
    </article>
  )
}

// Three summary cards: plan day, streak and today's study hours.
export default function StatsRow({
  now,
  streak,
  doneHours,
  plannedHours,
}) {
  const rawDay = daysBetween(START_DATE, toDateKey(now)) + 1
  const planDay = Math.min(Math.max(rawDay, 0), TOTAL_DAYS)
  const daysLeft = Math.max(TOTAL_DAYS - rawDay, 0)

  let planHint = `of ${TOTAL_DAYS} days · ${daysLeft} left`
  if (rawDay < 1) {
    planHint = `Starts in ${1 - rawDay} day${rawDay === 0 ? '' : 's'}`
  } else if (rawDay === TOTAL_DAYS) {
    planHint = 'Final day of the plan'
  } else if (rawDay > TOTAL_DAYS) {
    planHint = 'Plan complete'
  }

  return (
    <section
      aria-label="Today at a glance"
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-3"
    >
      <StatCard
        label="Plan day"
        value={planDay === 0 ? 'Soon' : `Day ${planDay}`}
        hint={planHint}
        icon={CalendarIcon}
        tone="accent"
      />
      <StatCard
        label="Streak"
        value={`${streak} ${streak === 1 ? 'day' : 'days'}`}
        hint={streak === 0 ? 'Tick a block to begin' : 'Full days in a row'}
        icon={FlameIcon}
        tone="accent"
      />
      <StatCard
        label="Studied today"
        value={formatHours(doneHours)}
        hint={`of ${formatHours(plannedHours)} planned`}
        icon={ClockIcon}
        tone="success"
      />
    </section>
  )
}
