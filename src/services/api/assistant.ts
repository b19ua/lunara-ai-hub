/**
 * Lunara Assistant API.
 *
 * These endpoints are served by the Lunara backend, which in turn drives the
 * Lunara System Agent. The browser never talks to services directly and there
 * is no mock layer here on purpose: until the backend endpoints exist the UI
 * shows a clean "not connected" state instead of a fake success.
 */

import type {
  AssistantConversation,
  AssistantMessage,
  AssistantTask,
  DiagnosticCheck,
  SystemActivityEntry,
  SystemStatusItem,
} from "../types";
import { request } from "./client";

export interface SendMessagePayload {
  conversationId?: string;
  text: string;
  /** Optional page context so the assistant knows where the request came from. */
  context?: { page?: string; entityId?: string };
}

export interface SendMessageResult {
  conversationId: string;
  messages: AssistantMessage[];
  tasks?: AssistantTask[];
}

export const assistantApi = {
  sendMessage: (payload: SendMessagePayload): Promise<SendMessageResult> =>
    request("/assistant/messages", { method: "POST", body: JSON.stringify(payload) }),

  getConversations: (): Promise<AssistantConversation[]> => request("/assistant/conversations"),

  getConversation: (id: string): Promise<AssistantConversation> =>
    request(`/assistant/conversations/${id}`),

  getTasks: (): Promise<AssistantTask[]> => request("/assistant/tasks"),

  getTask: (id: string): Promise<AssistantTask> => request(`/assistant/tasks/${id}`),

  approveTask: (id: string, input?: Record<string, unknown>): Promise<AssistantTask> =>
    request(`/assistant/tasks/${id}/approve`, {
      method: "POST",
      body: JSON.stringify(input ?? {}),
    }),

  cancelTask: (id: string): Promise<AssistantTask> =>
    request(`/assistant/tasks/${id}/cancel`, { method: "POST" }),
};

export const tasksApi = {
  list: assistantApi.getTasks,
  get: assistantApi.getTask,
  approve: assistantApi.approveTask,
  cancel: assistantApi.cancelTask,
};

export const systemControlApi = {
  getStatus: (): Promise<SystemStatusItem[]> => request("/system/status"),
  getActivity: (): Promise<SystemActivityEntry[]> => request("/system/activity"),
  getDiagnostics: (): Promise<DiagnosticCheck[]> => request("/system/diagnostics"),
};
