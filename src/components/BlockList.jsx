import { BLOCKS, PLANNED_STUDY_HOURS, STUDY_BLOCKS } from '../data/blocks'
import { formatHours } from '../lib/time'
import BlockItem from './BlockItem'

// Renders every row from blocks.js in the order given there, as a timeline.
export default function BlockList({ now, tickedIds, onToggle }) {
  const ticked = new Set(tickedIds)

  return (
    <section aria-labelledby="timetable-title">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h2 id="timetable-title" className="text-base text-ink sm:text-[17px]">
          Today&apos;s schedule
        </h2>
        <p className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted">
          {STUDY_BLOCKS.length} study blocks · {formatHours(PLANNED_STUDY_HOURS)}{' '}
          planned
        </p>
      </div>

      <ol className="space-y-2">
        {BLOCKS.map((block, index) => (
          <BlockItem
            key={block.id}
            block={block}
            now={now}
            done={ticked.has(block.id)}
            onToggle={onToggle}
            isFirst={index === 0}
            isLast={index === BLOCKS.length - 1}
          />
        ))}
      </ol>
    </section>
  )
}
