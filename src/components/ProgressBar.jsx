/**
 * Today's completion percentage. The fill uses the accent colour and switches
 * to the success colour once every block is done. Width animates unless the
 * user prefers reduced motion (handled globally in index.css).
 */
export default function ProgressBar({ ratio, done, total }) {
  const percent = Math.round(ratio * 100)
  const complete = percent === 100

  return (
    <section
      aria-labelledby="progress-title"
      className="rounded-xl border border-line bg-surface p-4 transition-colors duration-200 sm:p-5"
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="progress-title" className="text-[15px] text-ink">
            Daily progress
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            {done} of {total} study blocks complete
          </p>
        </div>
        <p
          aria-live="polite"
          className={`type-heading flex items-baseline text-2xl leading-none tabular-nums ${
            complete ? 'text-success' : 'text-ink'
          }`}
        >
          {percent}
          <span className="ml-0.5 text-sm font-medium text-ink-subtle">%</span>
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Today's study progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-4 h-2 overflow-hidden rounded-full bg-inset ring-1 ring-inset ring-line"
      >
        <div
          style={{ width: `${percent}%` }}
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            complete ? 'bg-success' : 'bg-accent'
          }`}
        />
      </div>
    </section>
  )
}
