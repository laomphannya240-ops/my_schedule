// Date helpers that always work with the user's *local* calendar day.

const pad = (value) => String(value).padStart(2, '0')

// Date -> "YYYY-MM-DD". (toISOString would use UTC and can shift the day.)
export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// "YYYY-MM-DD" -> Date at local midnight.
export function fromDateKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// Add days on the calendar, which also works across daylight-saving changes.
export function addDays(date, amount) {
  const next = startOfDay(date)
  next.setDate(next.getDate() + amount)
  return next
}

// Whole calendar days from startKey to endKey (positive when end is later).
export function daysBetween(startKey, endKey) {
  const start = fromDateKey(startKey)
  const end = fromDateKey(endKey)
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.round((endUtc - startUtc) / 86_400_000)
}

const fullDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const weekdayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
})

export function formatFullDate(date) {
  return fullDateFormatter.format(date)
}

export function formatWeekday(date) {
  return weekdayFormatter.format(date)
}

// Always a 24-hour clock, e.g. "09:05".
export function formatClock(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}
