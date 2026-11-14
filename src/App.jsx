import { useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  Download,
  LayoutDashboard,
  Moon,
  Plus,
  Search,
  Settings2,
  Sun,
  Upload,
  X,
  ChevronRight,
} from "lucide-react";
import { useAppearance } from "./hooks/useAppearance";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { usePlannerData } from "./hooks/usePlannerData";
import { addDays, toDateKey } from "./lib/dates";

const todayKey = toDateKey(new Date());
const todayDate = new Date();
const defaults = { language: "en", weekStarts: "monday", timeFormat: "24" };
const words = {
  en: {
    planner: "Study Planner",
    dashboard: "Dashboard",
    calendar: "Calendar",
    settings: "Settings",
    welcome: "Welcome back",
    subtitle: "Make today count. Your next learning session is within reach.",
    add: "New schedule",
    today: "Today",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    total: "Total schedules",
    completed: "Completed",
    pending: "Pending",
    completion: "Completion",
    overview: "Today's study overview",
    upcoming: "Upcoming sessions",
    weeklyProgress: "Weekly progress",
    search: "Search schedules…",
    subject: "Subject",
    day: "Day",
    status: "Status",
    all: "All",
    title: "Title",
    date: "Date",
    start: "Start time",
    end: "End time",
    description: "Description",
    color: "Color label",
    priority: "Priority",
    save: "Save schedule",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    duplicate: "Duplicate",
    done: "Completed",
    inProgress: "In progress",
    low: "Low",
    medium: "Medium",
    high: "High",
    noSchedules: "No schedules for this date.",
    previous: "Previous",
    next: "Next",
    export: "Export JSON",
    import: "Import JSON",
    reset: "Reset all data",
    language: "Language",
    weekStarts: "Week starts on",
    timeFormat: "Time format",
    monday: "Monday",
    sunday: "Sunday",
    confirmDelete: "Delete this schedule?",
    confirmReset:
      "Delete all schedules and reset settings? This cannot be undone.",
    invalidTime: "End time must be later than start time.",
    nameRequired: "Enter a title and subject.",
    chooseDate: "Choose a date",
    saved: "Saved in this browser",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    open: "Open",
    close: "Close",
    descriptionHint: "What will you focus on?",
    tasks: "Tasks",
    searchFilter: "Search and filter",
    noResults: "No schedules match these filters.",
  },
  km: {
    planner: "ផែនការសិក្សា",
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    calendar: "ប្រតិទិន",
    settings: "ការកំណត់",
    welcome: "សូមស្វាគមន៍មកវិញ",
    subtitle: "ចាប់ផ្តើមថ្ងៃនេះឱ្យមានប្រសិទ្ធភាព។ ពេលសិក្សាបន្ទាប់កំពុងរង់ចាំអ្នក។",
    add: "បន្ថែមកាលវិភាគ",
    today: "ថ្ងៃនេះ",
    daily: "ប្រចាំថ្ងៃ",
    weekly: "ប្រចាំសប្ដាហ៍",
    monthly: "ប្រចាំខែ",
    total: "កាលវិភាគសរុប",
    completed: "បានបញ្ចប់",
    pending: "កំពុងរង់ចាំ",
    completion: "ភាគរយបញ្ចប់",
    overview: "ទិដ្ឋភាពសិក្សាថ្ងៃនេះ",
    upcoming: "ម៉ោងសិក្សាបន្ទាប់",
    weeklyProgress: "វឌ្ឍនភាពប្រចាំសប្ដាហ៍",
    search: "ស្វែងរកកាលវិភាគ…",
    subject: "មុខវិជ្ជា",
    day: "ថ្ងៃ",
    status: "ស្ថានភាព",
    all: "ទាំងអស់",
    title: "ចំណងជើង",
    date: "កាលបរិច្ឆេទ",
    start: "ម៉ោងចាប់ផ្តើម",
    end: "ម៉ោងបញ្ចប់",
    description: "ការពិពណ៌នា",
    color: "ពណ៌សម្គាល់",
    priority: "អាទិភាព",
    save: "រក្សាទុក",
    cancel: "បោះបង់",
    edit: "កែប្រែ",
    delete: "លុប",
    duplicate: "ចម្លង",
    done: "បានបញ្ចប់",
    inProgress: "កំពុងធ្វើ",
    low: "ទាប",
    medium: "មធ្យម",
    high: "ខ្ពស់",
    noSchedules: "គ្មានកាលវិភាគសម្រាប់ថ្ងៃនេះទេ។",
    previous: "មុន",
    next: "បន្ទាប់",
    export: "នាំចេញ JSON",
    import: "នាំចូល JSON",
    reset: "សម្អាតទិន្នន័យ",
    language: "ភាសា",
    weekStarts: "ចាប់ផ្តើមសប្ដាហ៍",
    timeFormat: "ទម្រង់ម៉ោង",
    monday: "ថ្ងៃចន្ទ",
    sunday: "ថ្ងៃអាទិត្យ",
    confirmDelete: "លុបកាលវិភាគនេះឬ?",
    confirmReset: "លុបកាលវិភាគទាំងអស់ និងកំណត់ឡើងវិញឬ? មិនអាចត្រឡប់វិញបានទេ។",
    invalidTime: "ម៉ោងបញ្ចប់ត្រូវតែក្រោយម៉ោងចាប់ផ្តើម។",
    nameRequired: "សូមបញ្ចូលចំណងជើង និងមុខវិជ្ជា។",
    chooseDate: "ជ្រើសរើសកាលបរិច្ឆេទ",
    saved: "រក្សាទុកក្នុង browser នេះ",
    theme: "រូបរាង",
    light: "ភ្លឺ",
    dark: "ងងឹត",
    open: "បើក",
    close: "បិទ",
    descriptionHint: "តើអ្នកនឹងផ្តោតលើអ្វី?",
    tasks: "កិច្ចការ",
    searchFilter: "ស្វែងរក និងត្រង",
    noResults: "រកមិនឃើញកាលវិភាគតាមលក្ខខណ្ឌនេះទេ។",
  },
};
const colors = {
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  orange: "bg-orange-500",
  rose: "bg-rose-500",
  cyan: "bg-cyan-500",
};
const keyDate = (date) => toDateKey(date);
const weekStart = (date, starts) => {
  const d = new Date(date);
  const day = starts === "sunday" ? d.getDay() : (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};
const pretty = (date, locale, options) =>
  new Intl.DateTimeFormat(locale, options).format(date);
const timeLabel = (value, format) => {
  if (format === "24") return value;
  const [h, m] = value.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
const emptyForm = (date = todayKey) => ({
  title: "",
  subject: "",
  date,
  start: "09:00",
  end: "10:00",
  description: "",
  color: "blue",
  priority: "medium",
  status: "pending",
});

function Icon({ name, className = "size-5" }) {
  const icons = {
    grid: LayoutDashboard,
    calendar: CalendarDays,
    plus: Plus,
    settings: Settings2,
    search: Search,
    sun: Sun,
    moon: Moon,
    close: X,
    check: Check,
    chevron: ChevronRight,
    clock: Clock3,
    download: Download,
    upload: Upload,
  };
  const IconComponent = icons[name] || LayoutDashboard;
  return (
    <IconComponent aria-hidden="true" className={className} strokeWidth={1.8} />
  );
}

function ScheduleForm({ initial, onSave, onCancel, t }) {
  const [form, setForm] = useState(initial || emptyForm());
  const [error, setError] = useState("");
  const field = (key) => (event) =>
    setForm((old) => ({ ...old, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.subject.trim())
      return setError(t.nameRequired);
    if (form.end <= form.start) return setError(t.invalidTime);
    onSave({
      ...form,
      title: form.title.trim(),
      subject: form.subject.trim(),
      description: form.description.trim(),
    });
  };
  const input =
    "mt-1 min-h-11 w-full rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-base text-ink outline-none transition focus:border-accent sm:text-sm";
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto overscroll-contain rounded-t-3xl border border-line bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl sm:rounded-3xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">
              {t.planner}
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              {initial?.id ? t.edit : t.add}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label={t.close}
            className="grid min-h-11 min-w-11 place-items-center rounded-xl p-2 text-ink-muted hover:bg-inset"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-ink-muted sm:col-span-2">
            {t.title}
            <input
              value={form.title}
              onChange={field("title")}
              className={input}
              maxLength={100}
              required
            />
          </label>
          <label className="text-xs font-semibold text-ink-muted">
            {t.subject}
            <input
              value={form.subject}
              onChange={field("subject")}
              className={input}
              maxLength={60}
              required
            />
          </label>
          <label className="text-xs font-semibold text-ink-muted">
            {t.date}
            <input
              type="date"
              value={form.date}
              onChange={field("date")}
              className={input}
            />
          </label>
          <label className="text-xs font-semibold text-ink-muted">
            {t.start}
            <input
              type="time"
              value={form.start}
              onChange={field("start")}
              className={input}
            />
          </label>
          <label className="text-xs font-semibold text-ink-muted">
            {t.end}
            <input
              type="time"
              value={form.end}
              onChange={field("end")}
              className={input}
            />
          </label>
          <label className="text-xs font-semibold text-ink-muted">
            {t.priority}
            <select
              value={form.priority}
              onChange={field("priority")}
              className={input}
            >
              <option value="low">{t.low}</option>
              <option value="medium">{t.medium}</option>
              <option value="high">{t.high}</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-ink-muted">
            {t.status}
            <select
              value={form.status}
              onChange={field("status")}
              className={input}
            >
              <option value="pending">{t.pending}</option>
              <option value="in-progress">{t.inProgress}</option>
              <option value="completed">{t.completed}</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-ink-muted sm:col-span-2">
            {t.color}
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(colors).map(([name, cls]) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setForm((old) => ({ ...old, color: name }))}
                  aria-label={name}
                  className={`grid size-9 shrink-0 place-items-center rounded-full ring-offset-2 sm:size-11 ${form.color === name ? "ring-2 ring-accent" : ""}`}
                >
                  <span aria-hidden="true" className={`size-7 rounded-full ${cls}`} />
                </button>
              ))}
            </div>
          </label>
          <label className="text-xs font-semibold text-ink-muted sm:col-span-2">
            {t.description}
            <textarea
              value={form.description}
              onChange={field("description")}
              placeholder={t.descriptionHint}
              rows="3"
              className={`${input} resize-y`}
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-rose-500">
            {error}
          </p>
        )}
        <div className="sticky bottom-0 -mx-4 mt-5 flex justify-end gap-2 border-t border-line bg-surface/95 px-4 pt-3 backdrop-blur sm:static sm:mx-0 sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 flex-1 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-inset sm:flex-none sm:px-4"
          >
            {t.cancel}
          </button>
          <button type="submit" className="min-h-11 flex-1 rounded-xl bg-accent px-3 py-2.5 text-sm font-semibold text-accent-contrast shadow-lg shadow-accent/20 sm:flex-none sm:px-5">
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
}

function SessionCard({
  item,
  t,
  timeFormat,
  onEdit,
  onToggle,
  onDelete,
  onDuplicate,
}) {
  const completed = item.status === "completed";
  return (
    <article className="group min-w-0 rounded-2xl border border-line bg-surface p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5">
      <div className="flex gap-3">
        <span
          className={`mt-1 h-11 w-1.5 shrink-0 rounded-full ${colors[item.color] || colors.blue}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-semibold ${completed ? "text-ink-muted line-through" : "text-ink"}`}
            >
              {item.title}
            </h3>
            <span className="rounded-full bg-inset px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
              {item.subject}
            </span>
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.priority === "high" ? "bg-rose-500/10 text-rose-500" : item.priority === "low" ? "bg-slate-500/10 text-ink-muted" : "bg-amber-500/10 text-amber-600"}`}
            >
              {t[item.priority]}
            </span>
          </div>
          <p className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-ink-muted">
            <Icon name="clock" className="size-3.5" />
            {timeLabel(item.start, timeFormat)} –{" "}
            {timeLabel(item.end, timeFormat)}
            {item.description && (
              <span className="ml-1 min-w-0 flex-1 truncate">· {item.description}</span>
            )}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span
              className={`text-[11px] font-semibold ${completed ? "text-emerald-600" : "text-ink-subtle"}`}
            >
              {
                t[
                  item.status === "in-progress"
                    ? "inProgress"
                    : item.status === "completed"
                      ? "completed"
                      : "pending"
                ]
              }
            </span>
            <div className="flex flex-wrap items-center justify-start gap-1 sm:justify-end">
              <button
                onClick={() => onToggle(item)}
                className={`min-h-11 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${completed ? "bg-emerald-500/10 text-emerald-600" : "bg-accent/10 text-accent hover:bg-accent/15"}`}
              >
                {completed ? t.open : t.done}
              </button>
              <button
                onClick={() => onEdit(item)}
                aria-label={t.edit}
                className="min-h-11 rounded-lg px-2 py-1.5 text-xs text-ink-muted hover:bg-inset"
              >
                {t.edit}
              </button>
              <button
                onClick={() => onDuplicate(item.id)}
                aria-label={t.duplicate}
                className="min-h-11 rounded-lg px-2 py-1.5 text-xs text-ink-muted hover:bg-inset"
              >
                {t.duplicate}
              </button>
              <button
                onClick={() => onDelete(item.id)}
                aria-label={t.delete}
                className="min-h-11 rounded-lg px-2 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const {
    appearance,
    resolvedTheme,
    toggleTheme,
    update: updateAppearance,
  } = useAppearance();
  const { schedules, add, update, remove, duplicate, replace, reset } =
    usePlannerData();
  const [prefs, setPrefs] = useLocalStorage(
    "study-schedule:planner-settings:v1",
    defaults,
  );
  const [view, setView] = useState("dashboard");
  const [calendarMode, setCalendarMode] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [modal, setModal] = useState(null);
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const importRef = useRef(null);
  const t = words[prefs.language === "km" ? "km" : "en"];
  const locale = prefs.language === "km" ? "km-KH" : "en-US";
  const date = new Date(`${selectedDate}T12:00:00`);
  const chosen = useMemo(
    () =>
      schedules
        .filter((s) => s.date === selectedDate)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [schedules, selectedDate],
  );
  const todayItems = useMemo(
    () =>
      schedules
        .filter((s) => s.date === todayKey)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [schedules],
  );
  const done = todayItems.filter((s) => s.status === "completed").length;
  const percent = todayItems.length
    ? Math.round((done / todayItems.length) * 100)
    : 0;
  const subjects = [...new Set(schedules.map((s) => s.subject))].sort();
  const filtered = schedules
    .filter(
      (s) =>
        (!query ||
          `${s.title} ${s.subject} ${s.description}`
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        (subjectFilter === "all" || s.subject === subjectFilter) &&
        (dayFilter === "all" ||
          new Date(`${s.date}T12:00:00`).getDay() === Number(dayFilter)) &&
        (statusFilter === "all" || s.status === statusFilter),
    )
    .sort(
      (a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start),
    );
  const week = weekStart(date, prefs.weekStarts);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const weeklyPct = (d) => {
    const items = schedules.filter((s) => s.date === keyDate(d));
    return items.length
      ? Math.round(
          (items.filter((s) => s.status === "completed").length /
            items.length) *
            100,
        )
      : 0;
  };
  const beginEdit = (item) => setModal(item);
  const saveForm = (item) => {
    if (item.id) update(item.id, item);
    else add(item);
    setModal(null);
  };
  const toggleItem = (item) =>
    update(item.id, {
      status: item.status === "completed" ? "pending" : "completed",
    });
  const removeItem = (id) => {
    if (window.confirm(t.confirmDelete)) remove(id);
  };
  const changePeriod = (amount) => {
    if (calendarMode === "monthly") {
      const next = new Date(date);
      next.setDate(1);
      next.setMonth(next.getMonth() + amount);
      setSelectedDate(keyDate(next));
    } else {
      const step = calendarMode === "weekly" ? 7 : 1;
      setSelectedDate(keyDate(addDays(date, amount * step)));
    }
  };
  const exportData = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          { version: 1, schedules, settings: prefs, appearance },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "study-planner-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const importData = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const list = Array.isArray(data) ? data : data.schedules;
      if (
        !Array.isArray(list) ||
        list.some(
          (s) =>
            !s ||
            typeof s.title !== "string" ||
            typeof s.date !== "string" ||
            !/^\d{2}:\d{2}$/.test(s.start) ||
            !/^\d{2}:\d{2}$/.test(s.end) ||
            s.end <= s.start,
        )
      )
        throw new Error("invalid");
      replace(list);
      if (data.settings) setPrefs({ ...defaults, ...data.settings });
    } catch {
      window.alert("Invalid planner JSON file.");
    }
    event.target.value = "";
  };
  const resetAll = () => {
    if (window.confirm(t.confirmReset)) {
      reset();
      setPrefs(defaults);
      updateAppearance({ theme: "light" });
      setSelectedDate(todayKey);
    }
  };
  const navigate = (page) => {
    setView(page);
    if (page === "calendar") setSelectedDate(todayKey);
  };
  const inputClass =
    "min-h-11 rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-base text-ink outline-none focus:border-accent sm:text-sm";

  const renderSidebar = () => (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface/75 px-5 py-6 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="grid size-10 place-items-center rounded-2xl bg-accent text-accent-contrast shadow-lg shadow-accent/20">
          <Icon name="calendar" />
        </div>
        <div>
          <p className="font-bold">{t.planner}</p>
          <p className="text-[11px] text-ink-subtle">PERSONAL WORKSPACE</p>
        </div>
      </div>
      <p className="mb-2 mt-10 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-ink-subtle">
        MENU
      </p>
      {[
        ["dashboard", "grid"],
        ["calendar", "calendar"],
        ["settings", "settings"],
      ].map(([id, icon]) => (
        <button
          key={id}
          onClick={() => navigate(id)}
          className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${view === id ? "bg-accent/10 text-accent" : "text-ink-muted hover:bg-inset hover:text-ink"}`}
        >
          <Icon name={icon} className="size-4" />
          {t[id]}
        </button>
      ))}
      <div className="mt-auto rounded-2xl bg-gradient-to-br from-accent/15 to-violet-500/5 p-4">
        <p className="text-xs font-semibold">{t.saved}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
          Your schedules are stored locally on this device.
        </p>
      </div>
    </aside>
  );
  const renderHeader = () => (
    <header className="flex items-center justify-between gap-3">
      <div className="lg:hidden">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-contrast">
            <Icon name="calendar" className="size-4" />
          </span>
          <span className="font-bold">{t.planner}</span>
        </div>
      </div>
      <div className="hidden lg:block">
        <p className="text-xs font-medium text-ink-subtle">
          {pretty(todayDate, locale, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label={t.theme}
          className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-line bg-surface p-2.5 text-ink-muted transition hover:text-accent"
        >
          <Icon
            name={resolvedTheme === "dark" ? "sun" : "moon"}
            className="size-4"
          />
        </button>
        <button
          onClick={() => setModal(emptyForm(selectedDate))}
          aria-label={t.add}
          title={t.add}
          className="flex items-center gap-2 rounded-xl bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-contrast shadow-lg shadow-accent/20 transition hover:-translate-y-0.5"
        >
          <Icon name="plus" className="size-4" />
          <span className="hidden sm:inline">{t.add}</span>
        </button>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen lg:flex">
      {renderSidebar()}
      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full min-w-0 max-w-[1440px] px-4 pb-24 pt-4 sm:px-7 sm:pt-7 lg:px-10 lg:pb-10">
          {renderHeader()}
          {view === "settings" ? (
            <section className="mx-auto mt-10 max-w-3xl">
              <p className="text-sm font-semibold text-accent">{t.planner}</p>
              <h1 className="mt-2 text-3xl font-bold">{t.settings}</h1>
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  [
                    t.language,
                    "language",
                    [
                      ["en", "English"],
                      ["km", "ខ្មែរ"],
                    ],
                  ],
                  [
                    t.weekStarts,
                    "weekStarts",
                    [
                      ["monday", t.monday],
                      ["sunday", t.sunday],
                    ],
                  ],
                  [
                    t.timeFormat,
                    "timeFormat",
                    [
                      ["24", "24-hour"],
                      ["12", "12-hour"],
                    ],
                  ],
                ].map(([label, key, options]) => (
                  <label
                    key={key}
                    className="rounded-2xl border border-line bg-surface p-5 text-sm font-semibold"
                  >
                    {label}
                    <select
                      value={prefs[key] || defaults[key]}
                      onChange={(e) =>
                        setPrefs((old) => ({ ...old, [key]: e.target.value }))
                      }
                      className={`${inputClass} mt-3 block w-full`}
                    >
                      {options.map(([v, l]) => (
                        <option value={v} key={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
                <label className="rounded-2xl border border-line bg-surface p-5 text-sm font-semibold">
                  {t.theme}
                  <select
                    value={
                      appearance.theme === "system"
                        ? resolvedTheme
                        : appearance.theme
                    }
                    onChange={(e) =>
                      updateAppearance({ theme: e.target.value })
                    }
                    className={`${inputClass} mt-3 block w-full`}
                  >
                    <option value="light">{t.light}</option>
                    <option value="dark">{t.dark}</option>
                  </select>
                </label>
              </div>
              <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
                <h2 className="font-semibold">{t.planner} · JSON</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Backup or restore your schedules on this device.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={exportData}
                    className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast"
                  >
                    <Icon name="download" className="size-4" />
                    {t.export}
                  </button>
                  <button
                    onClick={() => importRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold hover:bg-inset"
                  >
                    <Icon name="upload" className="size-4" />
                    {t.import}
                  </button>
                  <input
                    ref={importRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={importData}
                  />
                  <button
                    onClick={resetAll}
                    className="ml-auto rounded-xl border border-rose-500/30 px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-500/10"
                  >
                    {t.reset}
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <>
              <section className="mb-7 mt-8 flex flex-wrap items-end justify-between gap-4">
                <div className="w-full min-w-0 sm:flex-1">
                  <p className="text-sm font-semibold text-accent">
                    {t.welcome} 👋
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-4xl">
                    {pretty(todayDate, locale, { weekday: "long" })}{" "}
                    {t.today.toLowerCase()}
                  </h1>
                  <p className="mt-2 max-w-xl break-words text-sm text-ink-muted">
                    {t.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => navigate("calendar")}
                  className="min-h-11 max-w-full self-start whitespace-normal rounded-xl border border-line bg-surface px-4 py-2.5 text-left text-sm font-semibold hover:border-accent/40 sm:self-auto"
                >
                  {pretty(new Date(`${todayKey}T12:00:00`), locale, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  <span className="ml-1 text-accent">→</span>
                </button>
              </section>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  [
                    t.total,
                    schedules.length,
                    "calendar",
                    "from-accent/10 text-accent",
                  ],
                  [
                    t.completed,
                    done,
                    "check",
                    "from-emerald-500/10 text-emerald-600",
                  ],
                  [
                    t.pending,
                    Math.max(0, todayItems.length - done),
                    "clock",
                    "from-amber-500/10 text-amber-600",
                  ],
                  [
                    t.completion,
                    `${percent}%`,
                    "grid",
                    "from-violet-500/10 text-violet-500",
                  ],
                ].map(([label, value, icon, cls]) => (
                  <article
                    key={label}
                    className={`rounded-2xl border border-line bg-gradient-to-br ${cls} to-surface p-5`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-ink-muted">
                        {label}
                      </p>
                      <Icon name={icon} className="size-4" />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-ink">{value}</p>
                    {label === t.completion && (
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-inset">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    )}
                  </article>
                ))}
              </div>
              <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,.85fr)]">
                <section className="min-w-0 rounded-3xl border border-line bg-surface p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold">
                        {view === "calendar" ? t.calendar : t.overview}
                      </h2>
                      <p className="mt-1 text-xs text-ink-muted">
                        {pretty(date, locale, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between gap-1 rounded-xl bg-inset p-1 sm:w-auto sm:justify-start">
                      {["daily", "weekly", "monthly"].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setCalendarMode(mode);
                            setView("calendar");
                          }}
                          className={`min-h-11 flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold sm:flex-none sm:px-2.5 ${calendarMode === mode ? "bg-surface text-accent shadow-sm" : "text-ink-muted"}`}
                        >
                          {t[mode]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex w-full justify-between gap-1 sm:w-auto sm:justify-start sm:gap-2">
                      <button
                        onClick={() => changePeriod(-1)}
                        className="min-h-11 whitespace-nowrap rounded-lg border border-line px-2.5 py-1.5 text-xs hover:bg-inset sm:px-3 sm:text-sm"
                      >
                        ‹ {t.previous}
                      </button>
                      <button
                        onClick={() => setSelectedDate(todayKey)}
                        className="min-h-11 whitespace-nowrap rounded-lg border border-line px-2.5 py-1.5 text-xs hover:bg-inset sm:px-3 sm:text-sm"
                      >
                        {t.today}
                      </button>
                      <button
                        onClick={() => changePeriod(1)}
                        className="min-h-11 whitespace-nowrap rounded-lg border border-line px-2.5 py-1.5 text-xs hover:bg-inset sm:px-3 sm:text-sm"
                      >
                        {t.next} ›
                      </button>
                    </div>
                    <p className="w-full truncate text-left text-xs font-semibold text-ink-muted sm:w-auto sm:text-right">
                      {calendarMode === "monthly"
                        ? pretty(date, locale, {
                            month: "long",
                            year: "numeric",
                          })
                        : calendarMode === "weekly"
                          ? `${pretty(weekDates[0], locale, { month: "short", day: "numeric" })} – ${pretty(weekDates[6], locale, { month: "short", day: "numeric" })}`
                          : pretty(date, locale, {
                              month: "short",
                              day: "numeric",
                            })}
                    </p>
                  </div>
                  {calendarMode === "weekly" && (
                    <div className="mt-4 grid grid-cols-7 gap-1">
                      {weekDates.map((d) => (
                        <button
                          key={keyDate(d)}
                          onClick={() => setSelectedDate(keyDate(d))}
                          className={`rounded-xl px-1 py-2 text-center ${keyDate(d) === selectedDate ? "bg-accent text-accent-contrast" : "hover:bg-inset"}`}
                        >
                          <span className="block text-[10px] opacity-75">
                            {pretty(d, locale, { weekday: "short" })}
                          </span>
                          <span className="mt-1 block text-sm font-bold">
                            {d.getDate()}
                          </span>
                          <span className="mx-auto mt-1 block h-1 w-1 rounded-full bg-current opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}
                  {calendarMode === "monthly" && (
                    <div className="mt-4 grid grid-cols-7 gap-1">
                      {Array.from(
                        {
                          length:
                            (new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              1,
                            ).getDay() -
                              (prefs.weekStarts === "monday" ? 1 : 0) +
                              7) %
                            7,
                        },
                        (_, i) => (
                          <span key={`blank${i}`} />
                        ),
                      )}
                      {Array.from(
                        {
                          length: new Date(
                            date.getFullYear(),
                            date.getMonth() + 1,
                            0,
                          ).getDate(),
                        },
                        (_, i) => {
                          const d = new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            i + 1,
                          );
                          const ds = keyDate(d);
                          const count = schedules.filter(
                            (s) => s.date === ds,
                          ).length;
                          return (
                            <button
                              key={ds}
                              onClick={() => setSelectedDate(ds)}
                              className={`relative min-h-10 rounded-xl text-sm ${ds === selectedDate ? "bg-accent text-accent-contrast" : ds === todayKey ? "border border-accent text-accent" : "hover:bg-inset"}`}
                            >
                              {d.getDate()}
                              {count > 0 && (
                                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current" />
                              )}
                            </button>
                          );
                        },
                      )}
                    </div>
                  )}
                  <div className="mt-5 space-y-3">
                    {chosen.length ? (
                      chosen.map((item) => (
                        <SessionCard
                          key={item.id}
                          item={item}
                          t={t}
                          timeFormat={prefs.timeFormat || "24"}
                          onEdit={beginEdit}
                          onToggle={toggleItem}
                          onDelete={removeItem}
                          onDuplicate={duplicate}
                        />
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-line py-10 text-center">
                        <p className="text-sm text-ink-muted">
                          {t.noSchedules}
                        </p>
                        <button
                          onClick={() => setModal(emptyForm(selectedDate))}
                          className="mt-3 text-sm font-semibold text-accent"
                        >
                          + {t.add}
                        </button>
                      </div>
                    )}
                  </div>
                </section>
                <div className="min-w-0 space-y-5">
                  <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">
                          {t.weeklyProgress}
                        </h2>
                        <p className="mt-1 text-xs text-ink-muted">
                          {t.completion}
                        </p>
                      </div>
                      <span className="rounded-xl bg-accent/10 px-3 py-1.5 text-sm font-bold text-accent">
                        {Math.round(
                          weekDates.reduce((sum, d) => sum + weeklyPct(d), 0) /
                            7,
                        )}
                        %
                      </span>
                    </div>
                    <div className="mt-6 flex h-36 items-end justify-between gap-2">
                      {weekDates.map((d) => {
                        const pct = weeklyPct(d);
                        return (
                          <button
                            key={keyDate(d)}
                            onClick={() => {
                              setSelectedDate(keyDate(d));
                              setView("calendar");
                            }}
                            className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                          >
                            <span className="text-[10px] text-ink-subtle">
                              {pct}%
                            </span>
                            <span
                              className={`w-full max-w-9 rounded-t-lg transition-all ${keyDate(d) === todayKey ? "bg-accent" : "bg-accent/35 group-hover:bg-accent/60"}`}
                              style={{ height: `${Math.max(5, pct)}%` }}
                            />
                            <span className="text-[10px] font-medium text-ink-muted">
                              {pretty(d, locale, { weekday: "short" })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                  <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">{t.upcoming}</h2>
                        <p className="mt-1 text-xs text-ink-muted">
                          {
                            todayItems.filter((s) => s.status !== "completed")
                              .length
                          }{" "}
                          {t.pending.toLowerCase()}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("calendar")}
                        className="text-xs font-semibold text-accent"
                      >
                        {t.open} →
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {todayItems
                        .filter((s) => s.status !== "completed")
                        .slice(0, 4)
                        .map((item) => (
                          <button
                            key={item.id}
                            onClick={() => beginEdit(item)}
                            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-inset"
                          >
                            <span
                              className={`h-9 w-1 rounded-full ${colors[item.color] || colors.blue}`}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold">
                                {item.title}
                              </span>
                              <span className="text-xs text-ink-muted">
                                {item.subject}
                              </span>
                            </span>
                            <span className="text-xs tabular-nums text-ink-muted">
                              {timeLabel(item.start, prefs.timeFormat || "24")}
                            </span>
                          </button>
                        ))}
                      {todayItems.filter((s) => s.status !== "completed")
                        .length === 0 && (
                        <p className="py-5 text-center text-sm text-ink-muted">
                          {t.noSchedules}
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
              <section className="mt-6 rounded-3xl border border-line bg-surface p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{t.tasks}</h2>
                    <p className="mt-1 text-xs text-ink-muted">
                      {t.searchFilter}
                    </p>
                  </div>
                  <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                    <label className="relative col-span-2 min-w-0 sm:min-w-[180px] sm:flex-1">
                      <Icon
                        name="search"
                        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
                      />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t.search}
                        className={`${inputClass} w-full pl-9`}
                      />
                    </label>
                    <select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                        className={`${inputClass} w-full min-w-0 sm:w-auto`}
                    >
                      <option value="all">
                        {t.subject}: {t.all}
                      </option>
                      {subjects.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <select
                      value={dayFilter}
                      onChange={(e) => setDayFilter(e.target.value)}
                      className={`${inputClass} w-full min-w-0 sm:w-auto`}
                    >
                      <option value="all">
                        {t.day}: {t.all}
                      </option>
                      {Array.from({ length: 7 }, (_, i) => i).map((i) => (
                        <option key={i} value={i}>
                          {pretty(new Date(2024, 0, 7 + i), locale, {
                            weekday: "long",
                          })}
                        </option>
                      ))}
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`${inputClass} w-full min-w-0 sm:w-auto`}
                    >
                      <option value="all">
                        {t.status}: {t.all}
                      </option>
                      {["pending", "in-progress", "completed"].map((s) => (
                        <option key={s} value={s}>
                          {t[s === "in-progress" ? "inProgress" : s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
                  {filtered.length ? (
                    filtered.map((item) => (
                      <SessionCard
                        key={item.id}
                        item={item}
                        t={t}
                        timeFormat={prefs.timeFormat || "24"}
                        onEdit={beginEdit}
                        onToggle={toggleItem}
                        onDelete={removeItem}
                        onDuplicate={duplicate}
                      />
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-ink-muted md:col-span-2">
                      {t.noResults}
                    </p>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-line bg-surface/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-lg lg:hidden">
        {[
          ["dashboard", "grid"],
          ["calendar", "calendar"],
          ["settings", "settings"],
        ].map(([id, icon]) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-semibold ${view === id ? "text-accent" : "text-ink-muted"}`}
          >
            <Icon name={icon} className="size-5" />
            {t[id]}
          </button>
        ))}
      </nav>
      {modal && (
        <ScheduleForm
          key={modal.id || "new"}
          initial={modal}
          onSave={saveForm}
          onCancel={() => setModal(null)}
          t={t}
          locale={locale}
        />
      )}
    </div>
  );
}
