import { useAppearance } from './useAppearance'

/**
 * Backwards-compatible wrapper. The app now uses useAppearance (theme, accent,
 * fonts), but keeping this hook means older imports do not break.
 */
export function useTheme() {
  const { resolvedTheme, toggleTheme } = useAppearance()
  return { theme: resolvedTheme, toggleTheme }
}
