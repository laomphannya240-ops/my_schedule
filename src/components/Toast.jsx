import { CheckIcon, XIcon } from './Icons'

/**
 * Small confirmation pill shown after ticking or unticking a block.
 * The live region is always mounted so screen readers announce changes.
 */
export default function CompletionToast({ toast }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4"
    >
      {toast ? (
        <div
          key={toast.id}
          role="status"
          aria-label={
            toast.done
              ? `${toast.title} complete, ${toast.count} of ${toast.total} blocks done`
              : `${toast.title} reopened, ${toast.count} of ${toast.total} blocks done`
          }
          className="anim-toast pointer-events-auto flex items-center gap-2.5 rounded-full border border-line bg-surface/95 py-2 pr-3.5 pl-2.5 text-xs shadow-lg shadow-black/5 backdrop-blur-sm dark:shadow-black/30"
        >
          <span
            className={`grid size-5 shrink-0 place-items-center rounded-full ${
              toast.done
                ? 'bg-success text-success-contrast'
                : 'bg-inset text-ink-muted'
            }`}
          >
            {toast.done ? (
              <CheckIcon className="size-3" />
            ) : (
              <XIcon className="size-3" />
            )}
          </span>
          <span className="text-ink">
            {toast.done ? `${toast.title} complete` : `${toast.title} reopened`}
          </span>
          <span className="tabular-nums text-ink-subtle">
            · {toast.count} of {toast.total}
          </span>
        </div>
      ) : null}
    </div>
  )
}
