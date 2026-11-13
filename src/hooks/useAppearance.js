import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  APPEARANCE_KEY,
  DEFAULT_APPEARANCE,
  readInitialAppearance,
  sanitizeAppearance,
} from '../data/appearance'
import { useLocalStorage } from './useLocalStorage'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function prefersDark() {
  return window.matchMedia(DARK_QUERY).matches
}

/**
 * One hook for every appearance preference: theme mode, accent, font family,
 * font size and weights.
 *
 * Values live in localStorage and are mirrored onto <html> as data attributes
 * before paint (index.html does the same for the very first render). All
 * colours therefore come from CSS variables and switch instantly, without
 * re-rendering any component that only uses those variables.
 */
export function useAppearance() {
  const [stored, setStored] = useLocalStorage(
    APPEARANCE_KEY,
    readInitialAppearance,
  )
  const [systemDark, setSystemDark] = useState(prefersDark)

  const appearance = useMemo(() => sanitizeAppearance(stored), [stored])
  const resolvedTheme =
    appearance.theme === 'system'
      ? systemDark
        ? 'dark'
        : 'light'
      : appearance.theme

  // Follow the operating system while (and only while) the mode is "system".
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const handleChange = (event) => setSystemDark(event.matches)

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  // Keep the document in sync with the saved settings.
  useEffect(() => {
    const root = document.documentElement

    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.style.colorScheme = resolvedTheme
    root.dataset.accent = appearance.accent
    root.dataset.font = appearance.font
    root.dataset.fontSize = appearance.fontSize
    root.dataset.headingWeight = appearance.headingWeight
    root.dataset.bodyWeight = appearance.bodyWeight

    // Match the browser / installed-app chrome to the canvas colour.
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolvedTheme === 'dark' ? '#09090b' : '#f5f5f7')
  }, [appearance, resolvedTheme])

  // Merge one setting at a time and validate the result.
  const update = useCallback(
    (patch) => {
      setStored((previous) => ({
        ...sanitizeAppearance(previous),
        ...patch,
      }))
    },
    [setStored],
  )

  const reset = useCallback(() => {
    setStored({ ...DEFAULT_APPEARANCE })
  }, [setStored])

  // Header button: choose the opposite of what is currently visible. Coming
  // from "system", this also pins the result to an explicit mode.
  const toggleTheme = useCallback(() => {
    setStored((previous) => {
      const current = sanitizeAppearance(previous)
      const isDark =
        current.theme === 'dark' ||
        (current.theme === 'system' && prefersDark())

      return { ...current, theme: isDark ? 'light' : 'dark' }
    })
  }, [setStored])

  return {
    appearance,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    update,
    reset,
    toggleTheme,
  }
}
