// Domain types for the Lunara Box control panel.
// These mirror the shape of the future Lunara backend API responses.

export type AiMode = "local" | "realtime";
export type EmployeeStatus = "ready" | "busy" | "offline" | "paused";
export type Channel = "phone" | "whatsapp" | "email" | "web" | "sms";
export type CallDirection = "inbound" | "outbound";
export type CallStatus = "ai_handled" | "transferred" | "missed" | "failed" | "completed";
export type HealthState = "healthy" | "degraded" | "down";
export type LeadStatus = "new" | "qualified" | "converted" | "lost" | "none";
export type Sentiment = "positive" | "neutral" | "negative";

export interface AiEmployee {
  id: string;
  name: string;
  role: string;
  status: EmployeeStatus;
  mode: AiMode;
  brain: string;
  voice: string;
  language: string;
  tone: string;
  channels: Channel[];
  knowledgeDocs: number;
  callsToday: number;
  conversationsToday: number;
  avatarHue: number;
  instructions: string;
}

export interface CallRecord {
  id: string;
  date: string;
  time: string;
  contactName: string;
  phone: string;
  employeeId: string;
  employeeName: string;
  durationSec: number;
  status: CallStatus;
  direction: CallDirection;
  intent: string;
  lead: LeadStatus;
  result: string;
  sentiment: Sentiment;
  campaignId?: string;
  recorded: boolean;
  summary: string;
  transcript: { at: number; speaker: "AI" | "Customer"; text: string }[];
  actions: string[];
}

export interface Conversation {
  id: string;
  contactName: string;
  handle: string;
  channel: Channel;
  employeeName: string;
  lastMessage: string;
  lastActivity: string;
  unread: number;
  status: "ai_handled" | "needs_human" | "closed";
  sentiment: Sentiment;
  lead: LeadStatus;
  messages: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  from: "customer" | "ai" | "human";
  at: string;
  text: string;
  kind: "text" | "voice" | "image" | "document";
  transcription?: string;
  durationSec?: number;
  fileName?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  tags: string[];
  lead: LeadStatus;
  source: string;
  lastContact: string;
  employeeName: string;
}

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  employeeName: string;
  phone: string;
  status: "draft" | "running" | "paused" | "completed";
  schedule: string;
  stats: {
    total: number;
    queued: number;
    calling: number;
    completed: number;
    answered: number;
    noAnswer: number;
    busy: number;
    failed: number;
    interested: number;
    notInterested: number;
    qualified: number;
    appointments: number;
    conversions: number;
  };
}

export interface KnowledgeDoc {
  id: string;
  name: string;
  sizeKb: number;
  status: "processing" | "ready" | "error";
  uploaded: string;
  usedBy: string[];
  type: string;
}

export interface ServiceHealth {
  id: string;
  name: string;
  description: string;
  state: HealthState;
  detail: string;
  mode?: AiMode;
}

export interface ActivityEvent {
  id: string;
  at: string;
  type: "call" | "message" | "lead" | "appointment" | "handoff" | "system";
  text: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  label: string;
  employeeName: string;
  handling: "ai_all" | "human_first" | "ai_delayed";
  recording: boolean;
  transcription: boolean;
  summary: boolean;
  state: HealthState;
}

export interface CrmIntegration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  kind: "oauth" | "webhook" | "local";
  records?: number;
}

export interface LocalModel {
  id: string;
  name: string;
  size: string;
  ramGb: number;
  quality: 1 | 2 | 3 | 4 | 5;
  speed: 1 | 2 | 3 | 4 | 5;
  recommended?: boolean;
  installed?: boolean;
}

export interface RealtimeModel {
  id: string;
  name: string;
  quality: string;
  latency: string;
  cost: string;
  recommended?: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  contactName: string;
  start: string;
  durationMin: number;
  channel: Channel;
  employeeName: string;
}

/* ------------------------------------------------------------------ Lunara Assistant
 * Shapes below mirror the future Lunara backend API (System Agent driven).
 * The frontend only reads them — it never controls services directly.
 */

export type TaskStatus =
  | "pending"
  | "running"
  | "waiting_approval"
  | "waiting_input"
  | "completed"
  | "failed"
  | "cancelled";

export interface TaskStep {
  label: string;
  state: "pending" | "active" | "done" | "failed";
}

export interface TaskApproval {
  question: string;
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface TaskInputOption {
  value: string;
  label: string;
  description?: string;
}

export interface TaskInputRequest {
  question: string;
  detail?: string;
  kind: "text" | "choice" | "qr";
  options?: TaskInputOption[];
  placeholder?: string;
  qrCode?: string;
}

export interface AssistantTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  progress?: number;
  currentStep?: string;
  steps?: TaskStep[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
  technical?: string;
  approval?: TaskApproval;
  input?: TaskInputRequest;
}

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: string;
  state?: "streaming" | "complete" | "error";
  taskIds?: string[];
}

export interface AssistantConversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: AssistantMessage[];
}

export type SystemState =
  "ready" | "connected" | "running" | "checking" | "warning" | "error" | "not_configured";

export interface SystemStatusItem {
  id: string;
  name: string;
  state: SystemState;
  detail?: string;
  fixAvailable?: boolean;
}

export interface SystemActivityEntry {
  id: string;
  at: string;
  text: string;
  level?: "info" | "warning" | "error";
  technical?: string;
}

export interface DiagnosticCheck {
  id: string;
  name: string;
  state: "pass" | "warn" | "fail";
  message: string;
  fixAvailable?: boolean;
  technical?: string;
}

/** Events the backend will stream over SSE / WebSocket. */
export type AssistantEventType =
  | "task_started"
  | "task_progress"
  | "task_completed"
  | "task_failed"
  | "approval_required"
  | "user_input_required"
  | "service_check"
  | "service_restarted"
  | "model_downloading"
  | "model_ready"
  | "configuration_changed"
  | "test_started"
  | "test_completed"
  | "system_ready";

export interface AssistantEvent {
  type: AssistantEventType;
  taskId?: string;
  conversationId?: string;
  payload?: unknown;
}
