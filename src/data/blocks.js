// ---------------------------------------------------------------------------
// Your study plan. Everything on the page comes from this file, so you can
// change the schedule here without touching the components.
// ---------------------------------------------------------------------------

// Day 1 of the plan (a local date, written as YYYY-MM-DD).
export const START_DATE = '2026-10-02'

// How many days the plan lasts.
export const TOTAL_DAYS = 56

// Times use 24-hour "HH:MM". `study: true` blocks get a checkbox.
export const BLOCKS = [
  {
    id: 'eng',
    start: '12:30',
    end: '13:30',
    title: 'English',
    sub: 'VOA Learning English: vocabulary, listening, shadowing',
    study: true,
  },
  {
    id: 'fe',
    start: '13:30',
    end: '15:00',
    title: 'Frontend',
    sub: 'HTML, CSS, JavaScript, React, Tailwind',
    study: true,
  },
  {
    id: 'br1',
    start: '15:00',
    end: '15:30',
    title: 'Break',
    sub: 'Walk, water, stretch',
    study: false,
  },
  {
    id: 'be1',
    start: '15:30',
    end: '18:00',
    title: 'Backend lesson',
    sub: 'PHP, SQL, Laravel, API',
    study: true,
  },
  {
    id: 'br2',
    start: '18:00',
    end: '19:00',
    title: 'Dinner break',
    sub: 'Away from the screen',
    study: false,
  },
  {
    id: 'be2',
    start: '19:00',
    end: '22:00',
    title: 'Backend practice',
    sub: 'Build the Student Management System',
    study: true,
  },
  {
    id: 'rev',
    start: '22:00',
    end: '23:00',
    title: 'Review and notes',
    sub: 'Write what you learned today',
    study: true,
  },
]

// ---------------------------------------------------------------------------
// Values calculated from the plan above. Components reuse these instead of
// hard-coding numbers, so the stats stay correct when you edit the schedule.
// ---------------------------------------------------------------------------

export const STUDY_BLOCKS = BLOCKS.filter((block) => block.study)

export const TOTAL_STUDY_BLOCKS = STUDY_BLOCKS.length

export const PLANNED_STUDY_HOURS = STUDY_BLOCKS.reduce((total, block) => {
  const [startHour, startMinute] = block.start.split(':').map(Number)
  const [endHour, endMinute] = block.end.split(':').map(Number)
  const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute)
  return total + Math.max(0, minutes) / 60
}, 0)
