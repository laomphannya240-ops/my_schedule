import { useCallback, useEffect, useMemo } from "react";
import { BLOCKS } from "../data/blocks";
import { toDateKey } from "../lib/dates";
import { useLocalStorage } from "./useLocalStorage";

const KEY = "study-schedule:planner:v1";
const PROGRESS_KEY = "study-schedule:daily-progress:v1";
const COLORS = ["blue", "violet", "emerald", "orange", "rose", "cyan"];

function signature(item) {
  return JSON.stringify([
    item.title,
    item.subject,
    item.start,
    item.end,
    item.description,
    item.color,
    item.priority,
  ]);
}

function makeSamples() {
  const today = toDateKey(new Date());
  let completed = [];
  try {
    const legacy = JSON.parse(
      window.localStorage.getItem("study-schedule:progress:v1") || "{}",
    );
    completed = Array.isArray(legacy?.[today]) ? legacy[today] : [];
  } catch {
    // Corrupt legacy progress is ignored while initializing the planner.
  }
  return BLOCKS.filter((block) => block.study).map((block, index) => ({
    id: `sample-${block.id}`,
    title: block.title,
    subject: block.title,
    date: today,
    start: block.start,
    end: block.end,
    description: block.sub,
    color: COLORS[index % COLORS.length],
    priority: index === 1 ? "high" : "medium",
    status: completed.includes(block.id) ? "completed" : "pending",
  }));
}

function sanitize(value) {
  if (!Array.isArray(value)) return null;
  return value.filter(
    (item) =>
      item && typeof item.id === "string" && typeof item.title === "string",
  );
}

// Older versions copied the same plan into every date. Collapse those copies
// back into one editable daily template, keeping the newest template version.
function uniqueTemplates(value) {
  const items = sanitize(value) || [];
  const latest = new Map();
  for (const item of items) {
    const key = item.start && item.end
      ? `slot:${item.start}:${item.end}`
      : signature(item);
    const current = latest.get(key);
    if (!current || (item.date || "") >= (current.date || "")) {
      latest.set(key, item);
    }
  }
  return [...latest.values()];
}

function initialProgress() {
  try {
    const existing = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "null");
    if (existing && typeof existing === "object" && !Array.isArray(existing)) {
      return existing;
    }
    const items = sanitize(
      JSON.parse(window.localStorage.getItem(KEY) || "null"),
    ) || makeSamples();
    const progress = {};
    for (const item of items) {
      if (!item.date || !item.status) continue;
      progress[item.date] ||= {};
      progress[item.date][signature(item)] = item.status;
    }
    return progress;
  } catch {
    return {};
  }
}

export function usePlannerData() {
  const [stored, setStored] = useLocalStorage(KEY, makeSamples);
  const schedules = useMemo(() => uniqueTemplates(stored), [stored]);
  const [progress, setProgress] = useLocalStorage(PROGRESS_KEY, initialProgress);

  useEffect(() => {
    if (JSON.stringify(stored) !== JSON.stringify(schedules)) setStored(schedules);
  }, [stored, schedules, setStored]);

  const add = useCallback(
    (item) =>
      setStored((old) => [
        ...(uniqueTemplates(old) || []),
        { ...item, id: crypto.randomUUID(), status: "pending" },
      ]),
    [setStored],
  );
  const update = useCallback(
    (id, changes) =>
      setStored((old) =>
        (uniqueTemplates(old) || []).map((item) => {
          if (item.id !== id) return item;
          const { status: _status, ...templateChanges } = changes;
          return { ...item, ...templateChanges, date: item.date };
        }),
      ),
    [setStored],
  );
  const setStatus = useCallback(
    (item, date, status) =>
      setProgress((old) => ({
        ...old,
        [date]: { ...(old?.[date] || {}), [signature(item)]: status },
      })),
    [setProgress],
  );
  const statusFor = useCallback(
    (item, date) => progress?.[date]?.[signature(item)] || "pending",
    [progress],
  );
  const replaceProgress = useCallback(
    (value) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        setProgress(value);
      }
    },
    [setProgress],
  );
  const remove = useCallback(
    (id) =>
      setStored((old) => (uniqueTemplates(old) || []).filter((item) => item.id !== id)),
    [setStored],
  );
  const duplicate = useCallback(
    (id) =>
      setStored((old) => {
        const items = uniqueTemplates(old) || [];
        const item = items.find((entry) => entry.id === id);
        return item
          ? [...items, { ...item, id: crypto.randomUUID(), title: `${item.title} (copy)` }]
          : items;
      }),
    [setStored],
  );
  const replace = useCallback(
    (items) => setStored(uniqueTemplates(items) || []),
    [setStored],
  );
  const reset = useCallback(() => {
    setStored([]);
    setProgress({});
  }, [setStored, setProgress]);

  return { schedules, progress, statusFor, setStatus, replaceProgress, add, update, remove, duplicate, replace, reset };
}
