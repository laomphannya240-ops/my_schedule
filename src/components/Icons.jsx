// Small inline icon set. Everything uses currentColor and a 1.8px stroke so
// icons match the typography weight without shipping an icon library.
function Icon({ children, className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export function SunIcon({ className }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </Icon>
  )
}

export function MoonIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z" />
    </Icon>
  )
}

export function MonitorIcon({ className }) {
  return (
    <Icon className={className}>
      <rect x="2.5" y="4" width="19" height="13" rx="2.5" />
      <path d="M8.5 21h7M12 17v4" />
    </Icon>
  )
}

export function SlidersIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4 7h3M11 7h9" />
      <circle cx="9" cy="7" r="2" />
      <path d="M4 17h9M18 17h2" />
      <circle cx="16" cy="17" r="2" />
    </Icon>
  )
}

export function CheckIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </Icon>
  )
}

export function XIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  )
}

export function CalendarIcon({ className }) {
  return (
    <Icon className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </Icon>
  )
}

export function FlameIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-2.6-1.4-4.6-3.3-6.4-.5 1.6-1.3 2.7-2.5 3.3.2-2.9-1-5.5-3.4-7.2.1 2.5-1 4.3-2.3 5.8A8.4 8.4 0 0 0 5.5 15c0 3.6 2.6 6 6.5 6Z" />
    </Icon>
  )
}

export function ClockIcon({ className }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Icon>
  )
}

export function PaletteIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17h1.2a1.9 1.9 0 0 0 1.4-3.2 1.9 1.9 0 0 1 1.4-3.2h1.5a3 3 0 0 0 3-3c0-3.9-3.9-7.1-8.5-7.1Z" />
      <circle cx="7.8" cy="10.6" r=".9" fill="currentColor" stroke="none" />
      <circle cx="10.2" cy="7.6" r=".9" fill="currentColor" stroke="none" />
      <circle cx="14" cy="7.6" r=".9" fill="currentColor" stroke="none" />
      <circle cx="16.4" cy="10.6" r=".9" fill="currentColor" stroke="none" />
    </Icon>
  )
}

export function TypeIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4.5 6V4.5h15V6M12 4.5V20M8.5 20h7" />
    </Icon>
  )
}

export function ResetIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M3.5 9.5A8.5 8.5 0 1 1 4 15" />
      <path d="M3.5 4.5v5h5" />
    </Icon>
  )
}

export function CoffeeIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4.5 8.5h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5v-5Z" />
      <path d="M15.5 9.5H17a2.5 2.5 0 0 1 0 5h-1.5M7 4.5v1.5M11 4.5v1.5" />
    </Icon>
  )
}

export function BookIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 6.5C10.5 5 8.2 4.5 5 4.8v13.4c3.2-.3 5.5.2 7 1.6 1.5-1.4 3.8-1.9 7-1.6V4.8c-3.2-.3-5.5.2-7 1.6Z" />
      <path d="M12 6.5V19.8" />
    </Icon>
  )
}
