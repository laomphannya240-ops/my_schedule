import { useEffect, useRef } from 'react'
import {
  ACCENT_OPTIONS,
  BODY_WEIGHT_OPTIONS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  HEADING_WEIGHT_OPTIONS,
  THEME_OPTIONS,
} from '../data/appearance'
import IconButton from './IconButton'
import SegmentedControl from './SegmentedControl'
import {
  CheckIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  ResetIcon,
  SunIcon,
  TypeIcon,
  XIcon,
} from './Icons'

const THEME_ICONS = { sun: SunIcon, moon: MoonIcon, monitor: MonitorIcon }

const themeOptions = THEME_OPTIONS.map((option) => ({
  ...option,
  icon: THEME_ICONS[option.icon],
}))

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <p className="text-xs font-medium text-ink">{label}</p>
        {hint ? (
          <p className="text-[11px] text-ink-subtle">{hint}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}

function Section({ id, title, icon: SectionIcon, children }) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <h3 id={id} className="flex items-center gap-2 text-[13px] text-ink">
        <span className="grid size-6 place-items-center rounded-md bg-accent/10 text-accent">
          <SectionIcon className="size-3.5" />
        </span>
        {title}
      </h3>
      {children}
    </section>
  )
}

// A tiny composition that reacts to accent, font, size and weight choices.
function Preview() {
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-subtle">
            Preview
          </p>
          <p className="mt-1 truncate text-sm text-ink">Deep work session</p>
          <p className="mt-0.5 font-mono text-[11px] tabular-nums text-ink-muted">
            09:00–10:30
          </p>
        </div>
        <span className="grid size-5 shrink-0 place-items-center rounded-md bg-accent text-accent-contrast">
          <CheckIcon className="size-3" />
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-inset">
        <div className="h-full w-2/3 rounded-full bg-accent" />
      </div>
    </div>
  )
}

/**
 * Right-hand settings drawer. Rendered only while open, so focus handling and
 * the scroll lock can live in one effect. Every control is a native radio.
 */
export default function SettingsPanel({
  open,
  onClose,
  appearance,
  onChange,
  onReset,
}) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  // Ref keeps the effect from re-running whenever App re-renders (clock ticks).
  const closeHandler = useRef(onClose)
  useEffect(() => {
    closeHandler.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const panel = panelRef.current
    const previous = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const getFocusable = () =>
      panel
        ? Array.from(
            panel.querySelectorAll(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((element) => element.offsetParent !== null)
        : []

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeHandler.current()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (previous instanceof HTMLElement && previous.isConnected) {
        previous.focus()
      }
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="anim-fade absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="anim-panel relative flex h-full w-full max-w-[400px] flex-col border-l border-line bg-surface shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 id="settings-title" className="text-base text-ink">
              Settings
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Personalize how the planner looks.
            </p>
          </div>
          <IconButton
            ref={closeRef}
            label="Close settings"
            onClick={onClose}
            className="-mr-1 -mt-1"
          >
            <XIcon className="size-4" />
          </IconButton>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
          <Section id="appearance-title" title="Appearance" icon={PaletteIcon}>
            <Preview />

            <Field label="Theme">
              <SegmentedControl
                name="theme"
                label="Theme"
                value={appearance.theme}
                options={themeOptions}
                onChange={(value) => onChange({ theme: value })}
              />
            </Field>

            <Field label="Accent color" hint={appearance.accent}>
              <div
                role="radiogroup"
                aria-label="Accent color"
                className="grid grid-cols-4 gap-2"
              >
                {ACCENT_OPTIONS.map((option) => {
                  const active = option.value === appearance.accent

                  return (
                    <label
                      key={option.value}
                      className={`relative cursor-pointer rounded-lg border p-2 text-center transition-colors ${
                        active
                          ? 'border-accent bg-accent/5'
                          : 'border-line bg-surface-2 hover:border-line-strong'
                      }`}
                    >
                      <input
                        type="radio"
                        name="accent"
                        value={option.value}
                        checked={active}
                        onChange={() =>
                          onChange({ accent: option.value })
                        }
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className="mx-auto grid size-6 place-items-center rounded-full ring-1 ring-inset ring-black/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface"
                        style={{ backgroundColor: option.swatch }}
                      >
                        {active ? (
                          <CheckIcon className="size-3.5 text-white" />
                        ) : null}
                      </span>
                      <span
                        className={`mt-1.5 block text-[10px] font-medium ${
                          active ? 'text-accent' : 'text-ink-muted'
                        }`}
                      >
                        {option.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </Field>
          </Section>

          <Section id="typography-title" title="Typography" icon={TypeIcon}>
            <Field label="Font family">
              <div
                role="radiogroup"
                aria-label="Font family"
                className="grid grid-cols-2 gap-2"
              >
                {FONT_OPTIONS.map((option) => {
                  const active = option.value === appearance.font

                  return (
                    <label
                      key={option.value}
                      className={`relative cursor-pointer rounded-lg border p-2.5 transition-colors ${
                        active
                          ? 'border-accent bg-accent/5'
                          : 'border-line bg-surface-2 hover:border-line-strong'
                      }`}
                    >
                      <input
                        type="radio"
                        name="font"
                        value={option.value}
                        checked={active}
                        onChange={() => onChange({ font: option.value })}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className="block text-lg leading-none text-ink"
                        style={{ fontFamily: `"${option.label}", sans-serif` }}
                      >
                        Aa
                      </span>
                      <span className="mt-2 flex items-center justify-between gap-1">
                        <span
                          className={`text-[11px] font-medium ${
                            active ? 'text-accent' : 'text-ink-muted'
                          }`}
                        >
                          {option.label}
                        </span>
                        {active ? (
                          <CheckIcon className="size-3.5 shrink-0 text-accent" />
                        ) : null}
                      </span>
                      <span className="sr-only"> font</span>
                    </label>
                  )
                })}
              </div>
            </Field>

            <Field label="Font size">
              <SegmentedControl
                name="font-size"
                label="Font size"
                value={appearance.fontSize}
                options={FONT_SIZE_OPTIONS}
                onChange={(value) => onChange({ fontSize: value })}
              />
            </Field>

            <Field label="Heading weight">
              <SegmentedControl
                name="heading-weight"
                label="Heading weight"
                value={appearance.headingWeight}
                options={HEADING_WEIGHT_OPTIONS}
                onChange={(value) => onChange({ headingWeight: value })}
              />
            </Field>

            <Field label="Body text weight">
              <SegmentedControl
                name="body-weight"
                label="Body text weight"
                value={appearance.bodyWeight}
                options={BODY_WEIGHT_OPTIONS}
                onChange={(value) => onChange({ bodyWeight: value })}
                columns="grid-cols-2"
              />
            </Field>

            <p className="text-[11px] leading-relaxed text-ink-subtle">
              Timetable times stay in IBM Plex Mono for easy scanning.
            </p>
          </Section>
        </div>

        <footer className="border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-ink-muted transition duration-200 hover:border-line-strong hover:bg-inset hover:text-ink motion-safe:active:scale-[0.99]"
          >
            <ResetIcon className="size-3.5" />
            Reset to defaults
          </button>
          <p className="mt-2 text-center text-[11px] text-ink-subtle">
            Saved automatically in this browser.
          </p>
        </footer>
      </div>
    </div>
  )
}
