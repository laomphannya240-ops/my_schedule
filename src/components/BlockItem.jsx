import { isTimeInBlock } from '../lib/time'
import { CheckIcon, CoffeeIcon } from './Icons'

const CARD_TONE = {
  done: 'border-line bg-surface-2',
  now: 'border-accent/40 bg-accent/[0.055]',
  break: 'border-dashed border-line bg-transparent',
  todo: 'border-line bg-surface hover:border-line-strong hover:bg-surface-2',
}

const DOT_TONE = {
  done: 'bg-success ring-4 ring-success/15',
  now: 'bg-accent ring-4 ring-accent/20',
  break: 'border border-line-strong bg-surface ring-4 ring-canvas',
  todo: 'bg-line-strong ring-4 ring-canvas',
}

/**
 * One row on the timetable rail: time labels, a node, then the block card.
 * The node line is split across rows so it starts and ends at the first and
 * last dots instead of running past the list.
 */
export default function BlockItem({
  block,
  done,
  now,
  onToggle,
  isFirst = false,
  isLast = false,
}) {
  const isNow = isTimeInBlock(block, now)
  const isBreak = !block.study
  const state = done ? 'done' : isNow ? 'now' : isBreak ? 'break' : 'todo'

  const lineClass =
    isFirst && isLast
      ? 'hidden'
      : isFirst
        ? 'top-5 bottom-0'
        : isLast
          ? 'top-0 h-5'
          : 'inset-y-0'

  return (
    <li className="grid grid-cols-[38px_12px_minmax(0,1fr)] gap-x-2 sm:grid-cols-[46px_14px_minmax(0,1fr)] sm:gap-x-3">
      <time
        dateTime={block.start}
        className={`pt-3 text-right font-mono text-[10.5px] leading-4 tabular-nums sm:text-[11px] ${
          isNow && !done ? 'text-accent' : 'text-ink-muted'
        }`}
      >
        <span className="block font-medium">{block.start}</span>
        <span className="block text-[10px] font-normal text-ink-subtle">
          {block.end}
        </span>
      </time>

      <div className="relative flex justify-center pt-4">
        <span
          aria-hidden="true"
          className={`absolute left-1/2 w-px -translate-x-1/2 bg-line ${lineClass}`}
        />
        <span
          aria-hidden="true"
          className={`relative z-10 size-2 rounded-full ${DOT_TONE[state]}`}
        />
      </div>

      <div
        className={`rounded-xl border px-3 py-2.5 transition-colors duration-200 sm:px-3.5 sm:py-3 ${CARD_TONE[state]}`}
      >
        <div className="flex items-start gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3
                className={`text-[13.5px] leading-5 ${
                  done
                    ? 'text-ink-muted line-through decoration-success/40'
                    : isBreak
                      ? 'text-ink-muted'
                      : 'text-ink'
                }`}
              >
                {block.title}
              </h3>

              {isNow && !done ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-accent-contrast">
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-current opacity-80 motion-safe:animate-pulse"
                  />
                  Now
                </span>
              ) : null}

              {done ? <span className="sr-only">Completed</span> : null}
            </div>

            <p
              className={`mt-0.5 text-xs leading-snug ${
                done ? 'text-ink-subtle' : 'text-ink-muted'
              }`}
            >
              {block.sub}
            </p>
          </div>

          {block.study ? (
            <label className="relative -m-1 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:scale-105 motion-safe:active:scale-95">
              <input
                type="checkbox"
                checked={done}
                onChange={() => onToggle(block.id)}
                aria-label={
                  done
                    ? `Mark ${block.title} as not done`
                    : `Mark ${block.title} as done`
                }
                className="peer size-5 cursor-pointer appearance-none rounded-[6px] border-[1.5px] border-ink-subtle bg-surface transition-colors duration-200 checked:border-accent checked:bg-accent"
              />
              <CheckIcon className="pointer-events-none absolute size-3.5 scale-50 text-accent-contrast opacity-0 transition duration-150 peer-checked:scale-100 peer-checked:opacity-100" />
            </label>
          ) : (
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-md bg-inset text-ink-subtle"
            >
              <CoffeeIcon className="size-3.5" />
            </span>
          )}
        </div>
      </div>
    </li>
  )
}
