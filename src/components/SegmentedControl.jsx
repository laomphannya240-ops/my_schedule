/**
 * Segmented radio group. Native inputs keep arrow-key navigation and screen
 * reader semantics; the visible track is styled with peer-* variants.
 *
 * options: [{ value, label, icon? }]
 * icon is an icon component (SunIcon, MoonIcon, ...).
 */
export default function SegmentedControl({
  name,
  label,
  value,
  options,
  onChange,
  columns = 'grid-cols-3',
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`grid gap-1 rounded-lg border border-line bg-inset p-1 ${columns}`}
    >
      {options.map((option) => {
        const OptionIcon = option.icon
        const active = option.value === value

        return (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-surface ${
                active
                  ? 'bg-surface text-accent shadow-sm ring-1 ring-accent/25'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {OptionIcon ? <OptionIcon className="size-3.5" /> : null}
              {option.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
