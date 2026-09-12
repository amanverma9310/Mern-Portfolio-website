import { api } from "../services/api";

// A random id kept only in memory (not localStorage/cookies) for the
// lifetime of this tab, purely so "today/this week" visit counts on the
// admin dashboard don't double-count every scroll/interaction as a new
// visitor. Nothing identifying is ever attached to it.
const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);

// All tracking calls are fire-and-forget: analytics must never block the UI
// or surface errors to the visitor.
function safeTrack(promise) {
  promise.catch(() => {});
}

export function trackPageView(page) {
  safeTrack(api.post("/analytics/event", { eventType: "page_view", page, sessionId }));
}

export function trackProjectView(projectId) {
  if (!projectId) return;
  safeTrack(
    api.post("/analytics/event", { eventType: "project_view", projectId, sessionId })
  );
}

export function trackResumeDownload() {
  safeTrack(api.post("/analytics/resume-download", { sessionId }));
}
