import * as mock from "../mock-data";
import type {
  ActivityEvent,
  AiEmployee,
  Appointment,
  CallRecord,
  Campaign,
  Contact,
  Conversation,
  CrmIntegration,
  KnowledgeDoc,
  LocalModel,
  PhoneNumber,
  RealtimeModel,
  ServiceHealth,
} from "../types";
import { delay, request, USE_MOCK } from "./client";
import { assistantApi, systemControlApi, tasksApi } from "./assistant";

export { assistantApi, systemControlApi, tasksApi } from "./assistant";

/* ------------------------------------------------------------------ /api/system */
export const systemApi = {
  health: (): Promise<ServiceHealth[]> =>
    USE_MOCK ? delay(mock.localHealth) : request("/system/health"),
  realtimeHealth: (): Promise<ServiceHealth[]> =>
    USE_MOCK ? delay(mock.realtimeHealth) : request("/system/health?mode=realtime"),
  hardware: () =>
    USE_MOCK ? delay(mock.hardware) : request<typeof mock.hardware>("/system/hardware"),
  activity: (): Promise<ActivityEvent[]> =>
    USE_MOCK ? delay(mock.activity, 200) : request("/system/activity"),
  version: () =>
    delay({
      current: "v1.0.3",
      latest: "v1.0.4",
      notes: "Faster campaign dialing, WhatsApp stability fixes, new Romanian voices.",
    }),
  diagnostics: () =>
    delay(
      [
        { id: "ai", name: "AI engine", state: "pass", message: "Responding in 38 ms" },
        {
          id: "voice",
          name: "Voice",
          state: "pass",
          message: "Speech recognition and voice ready",
        },
        { id: "phone", name: "Telephony", state: "pass", message: "3 numbers registered" },
        {
          id: "whatsapp",
          name: "WhatsApp",
          state: "fail",
          message: "WhatsApp connection lost",
          why: "Your AI cannot receive or reply to WhatsApp messages.",
          action: "Reconnect WhatsApp",
        },
        { id: "db", name: "Database", state: "pass", message: "Healthy" },
        {
          id: "storage",
          name: "Storage",
          state: "warn",
          message: "78% of disk used",
          why: "Recordings may stop saving when the disk is full.",
          action: "Open storage settings",
        },
        { id: "crm", name: "CRM", state: "pass", message: "HubSpot connected" },
        { id: "email", name: "Email", state: "pass", message: "Gmail connected" },
        { id: "internet", name: "Internet", state: "pass", message: "Online" },
      ] as const,
      1200,
    ),
  backup: () => delay({ last: "Sep 14, 2026 03:00", size: "1.8 GB", status: "Completed" }),
};

/* ------------------------------------------------------------------ /api/agents */
export const agentsApi = {
  list: (): Promise<AiEmployee[]> => (USE_MOCK ? delay(mock.employees) : request("/agents")),
  get: (id: string): Promise<AiEmployee | undefined> =>
    USE_MOCK ? delay(mock.employees.find((e) => e.id === id)) : request(`/agents/${id}`),
  create: (data: Partial<AiEmployee>) => delay({ id: "new", ...data }, 700),
  update: (id: string, data: Partial<AiEmployee>) => delay({ id, ...data }, 500),
  test: (message: string) =>
    delay(
      {
        reply: `Thanks for asking! We provide AI-powered phone, WhatsApp and email handling that runs entirely on your own computer. You asked: “${message}”. Would you like me to book a short demo?`,
      },
      900,
    ),
};

/* ------------------------------------------------------------------ /api/models + /api/ai */
export const modelsApi = {
  local: (): Promise<LocalModel[]> =>
    USE_MOCK ? delay(mock.localModels) : request("/models/local"),
  realtime: (provider: string): Promise<RealtimeModel[]> =>
    USE_MOCK
      ? delay(mock.realtimeModels[provider] ?? [], 1100)
      : request(`/models/realtime/${provider}`),
  /** Cloud models (OpenRouter today) always come from the backend — never hardcoded,
   *  and the provider key stays on the Lunara Box. */
  cloud: (provider: string): Promise<RealtimeModel[]> => request(`/models/cloud/${provider}`),
  install: (id: string) => delay({ id, status: "ready" }, 600),
  connectProvider: (provider: string, _apiKey: string) =>
    delay({ provider, connected: true }, 1200),
};

/* ------------------------------------------------------------------ /api/voice */
export const voiceApi = {
  list: () =>
    delay([
      { id: "en-f-amy", language: "English", gender: "Female", name: "Amy" },
      { id: "en-f-kate", language: "English", gender: "Female", name: "Kate" },
      { id: "en-m-joe", language: "English", gender: "Male", name: "Joe" },
      { id: "ro-f-mihaela", language: "Romanian", gender: "Female", name: "Mihaela" },
      { id: "ru-f-irina", language: "Russian", gender: "Female", name: "Irina" },
      { id: "de-m-thorsten", language: "German", gender: "Male", name: "Thorsten" },
    ]),
};

/* ------------------------------------------------------------------ /api/phone */
export const phoneApi = {
  numbers: (): Promise<PhoneNumber[]> =>
    USE_MOCK ? delay(mock.phoneNumbers) : request("/phone/numbers"),
  add: (data: Record<string, unknown>) => delay({ id: "pn-new", ...data }, 900),
};

/* ------------------------------------------------------------------ /api/calls */
export const callsApi = {
  list: (): Promise<CallRecord[]> => (USE_MOCK ? delay(mock.calls) : request("/calls")),
  get: (id: string): Promise<CallRecord | undefined> =>
    USE_MOCK ? delay(mock.calls.find((c) => c.id === id)) : request(`/calls/${id}`),
  place: (phone: string, employeeId: string) => delay({ id: "cl-new", phone, employeeId }, 800),
};

/* ------------------------------------------------------------------ /api/campaigns */
export const campaignsApi = {
  list: (): Promise<Campaign[]> => (USE_MOCK ? delay(mock.campaigns) : request("/campaigns")),
  get: (id: string) => delay(mock.campaigns.find((c) => c.id === id)),
  setState: (id: string, state: Campaign["status"]) => delay({ id, state }, 400),
  create: (data: Record<string, unknown>) => delay({ id: "cmp-new", ...data }, 900),
};

/* ------------------------------------------------------------------ /api/conversations + channels */
export const conversationsApi = {
  list: (): Promise<Conversation[]> =>
    USE_MOCK ? delay(mock.conversations) : request("/conversations"),
  get: (id: string) => delay(mock.conversations.find((c) => c.id === id)),
  send: (id: string, text: string) => delay({ id, text }, 300),
};

export const whatsappApi = {
  status: () =>
    delay({ connected: true, account: "Lunara Sales · +1 202 555 0147", since: "Sep 2, 2026" }),
  qr: () => delay({ code: "LUNARA-WA-LINK-9F27-A31C", expiresIn: 42 }, 900),
};

export const emailApi = {
  status: () => delay({ connected: true, account: "sales@lunara.example", provider: "Gmail" }),
};

/* ------------------------------------------------------------------ /api/contacts */
export const contactsApi = {
  list: (): Promise<Contact[]> => (USE_MOCK ? delay(mock.contacts) : request("/contacts")),
  get: (id: string) => delay(mock.contacts.find((c) => c.id === id)),
};

/* ------------------------------------------------------------------ /api/crm */
export const crmApi = {
  integrations: (): Promise<CrmIntegration[]> =>
    USE_MOCK ? delay(mock.crmIntegrations) : request("/crm/integrations"),
  connect: (id: string) => delay({ id, connected: true }, 900),
};

/* ------------------------------------------------------------------ /api/calendar */
export const calendarApi = {
  appointments: (): Promise<Appointment[]> =>
    USE_MOCK ? delay(mock.appointments) : request("/calendar/appointments"),
};

/* ------------------------------------------------------------------ /api/knowledge */
export const knowledgeApi = {
  list: (): Promise<KnowledgeDoc[]> =>
    USE_MOCK ? delay(mock.knowledgeDocs) : request("/knowledge"),
  upload: (name: string) => delay({ id: "kd-new", name, status: "processing" }, 800),
};

/* ------------------------------------------------------------------ /api/analytics */
export const analyticsApi = {
  series: () => delay(mock.analyticsSeries),
};

export const api = {
  assistant: assistantApi,
  tasks: tasksApi,
  systemControl: systemControlApi,
  system: systemApi,
  agents: agentsApi,
  models: modelsApi,
  voice: voiceApi,
  phone: phoneApi,
  calls: callsApi,
  campaigns: campaignsApi,
  conversations: conversationsApi,
  whatsapp: whatsappApi,
  email: emailApi,
  contacts: contactsApi,
  crm: crmApi,
  calendar: calendarApi,
  knowledge: knowledgeApi,
  analytics: analyticsApi,
};
