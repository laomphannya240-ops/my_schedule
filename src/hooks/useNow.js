import { useEffect, useState } from 'react'

/**
 * Returns the current Date and refreshes it on an interval.
 * App.jsx uses one 30-second timer for both the clock and the "Now" block.
 */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())
    const timer = window.setInterval(tick, intervalMs)

    // Catch up immediately when the tab becomes visible after being idle.
    document.addEventListener('visibilitychange', tick)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [intervalMs])

  return now
}
