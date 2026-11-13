// ---------------------------------------------------------------------------
// Appearance options and defaults. This file is the single source of truth for
// the settings panel, the pre-paint script in index.html and the CSS palettes.
// ---------------------------------------------------------------------------

export const APPEARANCE_KEY = 'study-schedule:appearance:v1'

// The previous version stored only "light" or "dark" here. It is read once to
// migrate an existing choice into the new appearance object.
export const LEGACY_THEME_KEY = 'study-schedule:theme'

export const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'monitor' },
]

export const ACCENT_OPTIONS = [
  { value: 'blue', label: 'Blue', swatch: '#2563eb' },
  { value: 'indigo', label: 'Indigo', swatch: '#4f46e5' },
  { value: 'violet', label: 'Violet', swatch: '#7c3aed' },
  { value: 'emerald', label: 'Emerald', swatch: '#059669' },
  { value: 'rose', label: 'Rose', swatch: '#e11d48' },
  { value: 'orange', label: 'Orange', swatch: '#ea580c' },
  { value: 'teal', label: 'Teal', swatch: '#0d9488' },
]

export const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter', note: 'Neutral' },
  { value: 'space-grotesk', label: 'Space Grotesk', note: 'Geometric' },
  { value: 'ibm-plex-sans', label: 'IBM Plex Sans', note: 'Technical' },
  { value: 'dm-sans', label: 'DM Sans', note: 'Soft' },
  { value: 'plus-jakarta-sans', label: 'Plus Jakarta Sans', note: 'Modern' },
]

export const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

export const HEADING_WEIGHT_OPTIONS = [
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semibold' },
  { value: 'bold', label: 'Bold' },
]

export const BODY_WEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
]

export const DEFAULT_APPEARANCE = {
  theme: 'system',
  accent: 'blue',
  font: 'inter',
  fontSize: 'medium',
  headingWeight: 'semibold',
  bodyWeight: 'normal',
}

const ALLOWED = {
  theme: THEME_OPTIONS.map((option) => option.value),
  accent: ACCENT_OPTIONS.map((option) => option.value),
  font: FONT_OPTIONS.map((option) => option.value),
  fontSize: FONT_SIZE_OPTIONS.map((option) => option.value),
  headingWeight: HEADING_WEIGHT_OPTIONS.map((option) => option.value),
  bodyWeight: BODY_WEIGHT_OPTIONS.map((option) => option.value),
}

/**
 * Keeps only known keys with known values. A corrupted or outdated object in
 * localStorage should never break rendering or produce an unknown data
 * attribute, so every value falls back to the default.
 */
export function sanitizeAppearance(value) {
  const next = { ...DEFAULT_APPEARANCE }
  if (!value || typeof value !== 'object') return next

  for (const key of Object.keys(ALLOWED)) {
    if (ALLOWED[key].includes(value[key])) next[key] = value[key]
  }
  return next
}

/**
 * Called by useLocalStorage only when no appearance object is saved yet, so an
 * older "study-schedule:theme" choice is not lost on upgrade.
 */
export function readInitialAppearance() {
  let legacyTheme = null
  try {
    legacyTheme = window.localStorage.getItem(LEGACY_THEME_KEY)
  } catch {
    // Storage may be blocked; the default (system) still applies.
  }

  return sanitizeAppearance({
    theme:
      legacyTheme === 'light' || legacyTheme === 'dark'
        ? legacyTheme
        : DEFAULT_APPEARANCE.theme,
  })
}
