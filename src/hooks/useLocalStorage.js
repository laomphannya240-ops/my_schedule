import { useEffect, useState } from 'react'

/**
 * useState that also saves the value as JSON in localStorage.
 * Reading and writing are wrapped in try/catch: private browsing, blocked
 * storage or corrupted JSON should never crash the page.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      if (saved !== null) return JSON.parse(saved)
    } catch {
      // Fall back to the initial value below.
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  // Save after each change (writing in an effect keeps state updates pure).
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage may be full or blocked; the app still works this session.
    }
  }, [key, value])

  return [value, setValue]
}
