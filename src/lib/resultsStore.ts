import type { MeetingMinutes } from "@/types/meeting";

const STORAGE_KEY = "automom:latest-minutes";

/**
 * We use sessionStorage rather than a database to pass results between
 * routes. This keeps the MVP simple (no persistence layer needed yet)
 * but means results survive a refresh within the same tab/session only
 * — not a shareable cross-device link. That's a deliberate MVP tradeoff,
 * not an oversight; true sharing would need server-side storage keyed
 * by an ID, which is a real v2 feature.
 */
export function saveResults(minutes: MeetingMinutes): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(minutes));
}

export function loadResults(): MeetingMinutes | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as MeetingMinutes;
  } catch {
    return null;
  }
}

export function clearResults(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
