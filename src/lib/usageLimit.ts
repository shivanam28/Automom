const STORAGE_KEY = "automom:download-count";
export const FREE_DOWNLOAD_LIMIT = 5;

/**
 * Client-side only — localStorage doesn't exist during server rendering,
 * so every function here must only ever be called from useEffect or an
 * event handler, never during the initial render pass.
 */
export function getDownloadCount(): number {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

export function getRemainingDownloads(): number {
  return Math.max(0, FREE_DOWNLOAD_LIMIT - getDownloadCount());
}

export function incrementDownloadCount(): void {
  localStorage.setItem(STORAGE_KEY, String(getDownloadCount() + 1));
}

export function hasReachedLimit(): boolean {
  return getDownloadCount() >= FREE_DOWNLOAD_LIMIT;
}

// Set right before sending the user into Clerk's sign-in flow, so we know
// to auto-resume the download once they're back and authenticated —
// otherwise signing in would just leave them back on the results page
// with no indication their original action ever happened.
const PENDING_DOWNLOAD_KEY = "automom:pending-download";

export function markPendingDownload(): void {
  sessionStorage.setItem(PENDING_DOWNLOAD_KEY, "1");
}

export function consumePendingDownload(): boolean {
  const wasPending = sessionStorage.getItem(PENDING_DOWNLOAD_KEY) === "1";
  if (wasPending) sessionStorage.removeItem(PENDING_DOWNLOAD_KEY);
  return wasPending;
}
