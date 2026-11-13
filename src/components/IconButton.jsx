/**
 * Square, icon-only button used in the header and the settings drawer.
 * The label is required so screen readers and hover tooltips stay useful.
 */
export default function IconButton({
  label,
  onClick,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-ink-muted transition duration-200 hover:border-line-strong hover:bg-inset hover:text-ink motion-safe:active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
