// Small helpers for "HH:MM" strings and hour totals.

export function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesBetween(start, end) {
  return Math.max(0, toMinutes(end) - toMinutes(start))
}

// Is the given Date inside a block's time range today?
export function isTimeInBlock(block, date) {
  const current = date.getHours() * 60 + date.getMinutes()
  return current >= toMinutes(block.start) && current < toMinutes(block.end)
}

// 4 -> "4h", 4.5 -> "4.5h" (all current durations are whole or half hours).
export function formatHours(hours) {
  if (hours === 0) return '0h'
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`
}
