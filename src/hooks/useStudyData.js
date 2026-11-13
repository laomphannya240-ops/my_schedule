import { useCallback, useMemo } from 'react'
import {
  START_DATE,
  STUDY_BLOCKS,
  TOTAL_STUDY_BLOCKS,
} from '../data/blocks'
import { addDays, startOfDay, toDateKey } from '../lib/dates'
import { minutesBetween } from '../lib/time'
import { useLocalStorage } from './useLocalStorage'

// One key holds all days: { "2026-11-13": ["eng", "fe"] }
const STORAGE_KEY = 'study-schedule:progress:v1'

function isProgressObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

// Read the ticked ids for one day, ignoring malformed saved data.
function tickedIdsFor(progress, dateKey) {
  const ids = progress?.[dateKey]
  return new Set(Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : [])
}

/**
 * All progress logic in one place:
 * - toggle / clearToday update localStorage
 * - dayRatio, streak and hoursForDay read from it
 */
export function useStudyData() {
  const [stored, setStored] = useLocalStorage(STORAGE_KEY, {})
  // Keep a stable object so the callbacks below only change when data changes.
  const progress = useMemo(
    () => (isProgressObject(stored) ? stored : {}),
    [stored],
  )

  const toggle = useCallback(
    (blockId) => {
      const isStudyBlock = STUDY_BLOCKS.some((block) => block.id === blockId)
      if (!isStudyBlock) return

      setStored((previous) => {
        const safe = isProgressObject(previous) ? previous : {}
        const dateKey = toDateKey(new Date())
        const ids = tickedIdsFor(safe, dateKey)

        if (ids.has(blockId)) ids.delete(blockId)
        else ids.add(blockId)

        return { ...safe, [dateKey]: [...ids] }
      })
    },
    [setStored],
  )

  const clearToday = useCallback(() => {
    setStored((previous) => {
      const safe = isProgressObject(previous) ? previous : {}
      const next = { ...safe }
      delete next[toDateKey(new Date())]
      return next
    })
  }, [setStored])

  const dayRatio = useCallback(
    (dateKey) => {
      if (TOTAL_STUDY_BLOCKS === 0) return 0
      const ids = tickedIdsFor(progress, dateKey)
      const done = STUDY_BLOCKS.filter((block) => ids.has(block.id)).length
      return done / TOTAL_STUDY_BLOCKS
    },
    [progress],
  )

  const hoursForDay = useCallback(
    (dateKey) => {
      const ids = tickedIdsFor(progress, dateKey)
      return STUDY_BLOCKS.filter((block) => ids.has(block.id)).reduce(
        (total, block) => total + minutesBetween(block.start, block.end) / 60,
        0,
      )
    },
    [progress],
  )

  // Count full days backwards. A partial today does not break the streak:
  // counting then simply starts at yesterday.
  const streak = useCallback(() => {
    let cursor = startOfDay(new Date())
    if (dayRatio(toDateKey(cursor)) < 1) cursor = addDays(cursor, -1)

    let count = 0
    while (
      toDateKey(cursor) >= START_DATE &&
      dayRatio(toDateKey(cursor)) === 1
    ) {
      count += 1
      cursor = addDays(cursor, -1)
    }
    return count
  }, [dayRatio])

  return { progress, toggle, clearToday, dayRatio, streak, hoursForDay }
}
