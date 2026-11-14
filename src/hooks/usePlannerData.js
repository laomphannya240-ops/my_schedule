import { useCallback, useMemo } from "react";
import { BLOCKS } from "../data/blocks";
import { toDateKey } from "../lib/dates";
import { useLocalStorage } from "./useLocalStorage";

const KEY = "study-schedule:planner:v1";
const today = toDateKey(new Date());
const COLORS = ["blue", "violet", "emerald", "orange", "rose", "cyan"];

function makeSamples() {
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

export function usePlannerData() {
  const [stored, setStored] = useLocalStorage(KEY, makeSamples);
  const schedules = useMemo(() => sanitize(stored) || [], [stored]);

  const add = useCallback(
    (item) =>
      setStored((old) => [
        ...(sanitize(old) || []),
        { ...item, id: crypto.randomUUID() },
      ]),
    [setStored],
  );
  const update = useCallback(
    (id, changes) =>
      setStored((old) =>
        (sanitize(old) || []).map((item) =>
          item.id === id ? { ...item, ...changes } : item,
        ),
      ),
    [setStored],
  );
  const remove = useCallback(
    (id) =>
      setStored((old) =>
        (sanitize(old) || []).filter((item) => item.id !== id),
      ),
    [setStored],
  );
  const duplicate = useCallback(
    (id) =>
      setStored((old) => {
        const items = sanitize(old) || [];
        const item = items.find((entry) => entry.id === id);
        return item
          ? [
              ...items,
              {
                ...item,
                id: crypto.randomUUID(),
                title: `${item.title} (copy)`,
              },
            ]
          : items;
      }),
    [setStored],
  );
  const replace = useCallback(
    (items) => setStored(sanitize(items) || []),
    [setStored],
  );
  const reset = useCallback(() => setStored([]), [setStored]);

  return { schedules, add, update, remove, duplicate, replace, reset };
}
