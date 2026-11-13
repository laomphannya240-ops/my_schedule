// Footer action. Theme and appearance now live in the header.
export default function Footer({ onClear, hasTicks }) {
  return (
    <footer className="mt-6 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-ink-subtle">
        Progress and appearance stay in this browser. No account, no server.
      </p>

      <button
        type="button"
        onClick={onClear}
        disabled={!hasTicks}
        className="self-start rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-muted transition duration-200 enabled:hover:border-line-strong enabled:hover:bg-inset enabled:hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 motion-safe:enabled:active:scale-95 sm:self-auto"
      >
        Clear today&apos;s ticks
      </button>
    </footer>
  )
}
