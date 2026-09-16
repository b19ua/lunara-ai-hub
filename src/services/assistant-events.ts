/**
 * Real-time assistant events.
 *
 * The backend will stream task events over SSE (or a WebSocket later). This
 * module keeps that wiring in one place so screens only subscribe to a typed
 * callback and never need a page refresh once streaming is connected.
 */

import { API_BASE_URL } from "./api/client";
import type { AssistantEvent } from "./types";

const STREAM_URL =
  (import.meta.env["VITE_LUNARA_EVENTS_URL"] as string | undefined) ??
  `${API_BASE_URL}/assistant/events`;

type Listener = (event: AssistantEvent) => void;

const listeners = new Set<Listener>();
let source: EventSource | null = null;

function ensureConnection() {
  if (source || typeof window === "undefined" || typeof EventSource === "undefined") return;
  try {
    source = new EventSource(STREAM_URL);
    source.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data) as AssistantEvent;
        listeners.forEach((l) => l(parsed));
      } catch {
        /* ignore malformed frames */
      }
    };
    source.onerror = () => {
      // Backend stream is not available yet — close quietly, the UI polls instead.
      source?.close();
      source = null;
    };
  } catch {
    source = null;
  }
}

/** Subscribe to backend task events. Returns an unsubscribe function. */
export function subscribeAssistantEvents(listener: Listener) {
  listeners.add(listener);
  ensureConnection();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      source?.close();
      source = null;
    }
  };
}
