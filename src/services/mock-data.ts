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
} from "./types";

// Deterministic pseudo-random so SSR and client render identically.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Safe cyclic array access (the project enables noUncheckedIndexedAccess).
function at<T>(a: readonly T[], i: number): T {
  return a[((i % a.length) + a.length) % a.length] as T;
}

export const employees: AiEmployee[] = [
  {
    id: "anna",
    name: "Anna",
    role: "Sales Manager",
    status: "ready",
    mode: "local",
    brain: "Local AI · Qwen3 8B",
    voice: "Piper · English Female",
    language: "English",
    tone: "Friendly",
    channels: ["phone", "whatsapp", "web"],
    knowledgeDocs: 18,
    callsToday: 27,
    conversationsToday: 43,
    avatarHue: 288,
    instructions:
      "You are Anna, a professional sales assistant for Lunara. Qualify every inbound lead, answer product questions using the knowledge base, and book a meeting when the caller shows interest.",
  },
  {
    id: "mark",
    name: "Mark",
    role: "Customer Support",
    status: "busy",
    mode: "local",
    brain: "Local AI · Qwen3 14B",
    voice: "Piper · English Male",
    language: "English",
    tone: "Professional",
    channels: ["phone", "email", "web"],
    knowledgeDocs: 32,
    callsToday: 14,
    conversationsToday: 61,
    avatarHue: 240,
    instructions:
      "You are Mark, a calm and precise support agent. Resolve issues using the manuals, escalate complaints to a human immediately.",
  },
  {
    id: "sofia",
    name: "Sofia",
    role: "Receptionist",
    status: "ready",
    mode: "realtime",
    brain: "Realtime AI · GPT Realtime",
    voice: "OpenAI · Alloy",
    language: "English",
    tone: "Professional",
    channels: ["phone"],
    knowledgeDocs: 6,
    callsToday: 52,
    conversationsToday: 0,
    avatarHue: 200,
    instructions:
      "You are Sofia, the front desk. Greet callers, identify the reason for the call and route them to the right department.",
  },
  {
    id: "victor",
    name: "Victor",
    role: "Lead Qualification",
    status: "offline",
    mode: "local",
    brain: "Local AI · Llama 3.1 8B",
    voice: "Piper · English Male",
    language: "English",
    tone: "Concise",
    channels: ["phone", "whatsapp"],
    knowledgeDocs: 9,
    callsToday: 0,
    conversationsToday: 0,
    avatarHue: 155,
    instructions:
      "You are Victor. Run the BANT qualification script on every outbound call and record the result.",
  },
  {
    id: "elena",
    name: "Elena",
    role: "Appointment Booking",
    status: "ready",
    mode: "realtime",
    brain: "Realtime AI · Gemini Live",
    voice: "Google · Aoede",
    language: "Romanian",
    tone: "Friendly",
    channels: ["phone", "whatsapp", "email"],
    knowledgeDocs: 12,
    callsToday: 18,
    conversationsToday: 24,
    avatarHue: 330,
    instructions:
      "You are Elena. Book appointments in the calendar, always confirm the time zone and send a confirmation message.",
  },
];

const firstNames = [
  "John",
  "Maria",
  "David",
  "Elena",
  "Michael",
  "Ana",
  "Robert",
  "Ioana",
  "James",
  "Olga",
  "Daniel",
  "Cristina",
  "Andrei",
  "Laura",
  "Thomas",
  "Natalia",
  "Peter",
  "Sofia",
  "Victor",
  "Irina",
];
const lastNames = [
  "Smith",
  "Popescu",
  "Johnson",
  "Ionescu",
  "Brown",
  "Rusu",
  "Miller",
  "Ciobanu",
  "Davis",
  "Petrov",
  "Wilson",
  "Munteanu",
  "Moore",
  "Lungu",
  "Taylor",
  "Sokolov",
  "Anderson",
  "Balan",
  "Thomas",
  "Cojocaru",
];
const companies = [
  "Northwind Logistics",
  "Acme Retail",
  "Medcare Clinic",
  "BluePeak Finance",
  "Vertex Energy",
  "Orion Telecom",
  "Harbor Foods",
  "Cityline Realty",
  "Quantum Labs",
  "Sunrise Travel",
];
const sources = ["Website", "Inbound call", "WhatsApp", "Campaign", "Referral", "Email"];
const intents = [
  "Sales inquiry",
  "Support request",
  "Billing question",
  "Appointment",
  "Complaint",
  "Product information",
  "Delivery status",
  "Partnership",
];

export const contacts: Contact[] = Array.from({ length: 124 }, (_, i) => {
  const r = rng(i + 7);
  const first = at(firstNames, Math.floor(r() * firstNames.length));
  const last = at(lastNames, Math.floor(r() * lastNames.length));
  const company = at(companies, Math.floor(r() * companies.length));
  const leadPool = ["new", "qualified", "converted", "lost", "none"] as const;
  return {
    id: `ct-${1000 + i}`,
    name: `${first} ${last}`,
    phone: `+1 ${200 + (i % 700)} ${100 + (i % 899)} ${1000 + (i % 8999)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${at(company.split(" "), 0).toLowerCase()}.com`,
    company,
    tags: [at(sources, i), i % 3 === 0 ? "VIP" : "Standard"],
    lead: at(leadPool, i),
    source: at(sources, i),
    lastContact: `Sep ${1 + (i % 14)}, 2026`,
    employeeName: at(employees, i).name,
  };
});

const transcriptSample = (name: string) => [
  {
    at: 0,
    speaker: "AI" as const,
    text: "Thank you for calling Lunara, this is Anna. How can I help you today?",
  },
  {
    at: 4,
    speaker: "Customer" as const,
    text: `Hi, this is ${name}. I'd like to know more about your pricing for a team of twenty.`,
  },
  {
    at: 11,
    speaker: "AI" as const,
    text: "Of course. For twenty seats we have the Business plan, which includes unlimited AI minutes on your own hardware. Would you like me to walk you through it?",
  },
  {
    at: 19,
    speaker: "Customer" as const,
    text: "Yes please, and I'd also like to know if it works offline.",
  },
  {
    at: 24,
    speaker: "AI" as const,
    text: "It does — everything runs on your own computer, so calls keep working without an internet connection.",
  },
  {
    at: 32,
    speaker: "Customer" as const,
    text: "That's exactly what we need. Can we schedule a demo next week?",
  },
  {
    at: 37,
    speaker: "AI" as const,
    text: "Absolutely. I have Tuesday at 10:00 or Wednesday at 15:00 available.",
  },
  { at: 43, speaker: "Customer" as const, text: "Tuesday at 10 works." },
  {
    at: 46,
    speaker: "AI" as const,
    text: "Booked. I've sent a confirmation to your email. Thank you for calling!",
  },
];

export const calls: CallRecord[] = Array.from({ length: 68 }, (_, i): CallRecord => {
  const c = at(contacts, i * 2);
  const emp = at(employees, i);
  const statuses = ["ai_handled", "completed", "transferred", "missed", "failed"] as const;
  const status = at(statuses, i % 5 === 4 ? (i % 2 === 0 ? 3 : 4) : i % 3);
  const direction = i % 3 === 0 ? "outbound" : "inbound";
  return {
    id: `cl-${5000 + i}`,
    date: `Sep ${15 - (i % 14)}, 2026`,
    time: `${String(8 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    contactName: c.name,
    phone: c.phone,
    employeeId: emp.id,
    employeeName: emp.name,
    durationSec: status === "missed" ? 0 : 45 + ((i * 37) % 540),
    status,
    direction,
    intent: at(intents, i),
    lead: at(["new", "qualified", "converted", "none"] as const, i),
    result:
      status === "missed" ? "No answer" : i % 3 === 0 ? "Qualified lead" : "Information provided",
    sentiment: at(["positive", "neutral", "negative"] as const, i),
    ...(direction === "outbound" ? { campaignId: "cmp-1" } : {}),
    recorded: status !== "missed",
    summary: `${c.name} from ${c.company} called about ${at(intents, i).toLowerCase()}. The AI answered all questions using the product knowledge base and ${i % 3 === 0 ? "qualified the caller as a sales lead" : "provided the requested information"}.`,
    transcript: status === "missed" ? [] : transcriptSample(c.name),
    actions:
      status === "missed"
        ? []
        : [
            "Customer created",
            "Lead created",
            ...(i % 3 === 0 ? ["Appointment booked", "Follow-up scheduled"] : []),
          ],
  };
});

export const conversations: Conversation[] = Array.from({ length: 104 }, (_, i): Conversation => {
  const c = at(contacts, i * 3);
  const channels = ["whatsapp", "email", "web", "sms", "phone"] as const;
  const channel = at(channels, i % (i % 7 === 0 ? 5 : 3));
  const emp = at(employees, i);
  return {
    id: `cv-${8000 + i}`,
    contactName: c.name,
    handle: channel === "email" ? c.email : c.phone,
    channel,
    employeeName: emp.name,
    lastMessage:
      i % 4 === 0
        ? "Thanks, that answers my question!"
        : i % 4 === 1
          ? "Can someone call me back today?"
          : i % 4 === 2
            ? "I sent the documents you asked for."
            : "What are your opening hours?",
    lastActivity: `${1 + (i % 59)} min ago`,
    unread: i % 5 === 0 ? 1 + (i % 3) : 0,
    status: i % 6 === 0 ? "needs_human" : i % 9 === 0 ? "closed" : "ai_handled",
    sentiment: at(["positive", "neutral", "negative"] as const, i),
    lead: at(["new", "qualified", "converted", "none"] as const, i),
    messages: [
      {
        id: `m${i}-1`,
        from: "customer",
        at: "10:02",
        kind: "text",
        text: "Hi, I saw your offer online. Is it still available?",
      },
      {
        id: `m${i}-2`,
        from: "ai",
        at: "10:02",
        kind: "text",
        text: `Hello ${at(c.name.split(" "), 0)}! Yes, the September offer runs until the end of the month. Would you like the details?`,
      },
      {
        id: `m${i}-3`,
        from: "customer",
        at: "10:04",
        kind: "voice",
        durationSec: 14,
        text: "Voice message",
        transcription: "Yes please, send me the details and the price for two units.",
      },
      {
        id: `m${i}-4`,
        from: "ai",
        at: "10:04",
        kind: "text",
        text: "Two units come to $1,480 including delivery. I can reserve them for you today.",
      },
      {
        id: `m${i}-5`,
        from: "customer",
        at: "10:07",
        kind: "document",
        fileName: "purchase-order.pdf",
        text: "Document",
      },
      {
        id: `m${i}-6`,
        from: "ai",
        at: "10:08",
        kind: "text",
        text: "Received your purchase order — I've created the record and a colleague will confirm shortly.",
      },
    ],
  };
});

export const campaigns: Campaign[] = [
  {
    id: "cmp-1",
    name: "September Sales Outreach",
    objective: "Sales",
    employeeName: "Anna",
    phone: "+1 202 555 0147",
    status: "running",
    schedule: "09:00 – 18:00",
    stats: {
      total: 1248,
      queued: 612,
      calling: 8,
      completed: 628,
      answered: 441,
      noAnswer: 132,
      busy: 38,
      failed: 17,
      interested: 196,
      notInterested: 148,
      qualified: 121,
      appointments: 44,
      conversions: 27,
    },
  },
  {
    id: "cmp-2",
    name: "Payment Reminders — Q3",
    objective: "Payment reminder",
    employeeName: "Victor",
    phone: "+1 202 555 0188",
    status: "paused",
    schedule: "10:00 – 17:00",
    stats: {
      total: 384,
      queued: 121,
      calling: 0,
      completed: 263,
      answered: 198,
      noAnswer: 44,
      busy: 12,
      failed: 9,
      interested: 0,
      notInterested: 0,
      qualified: 0,
      appointments: 0,
      conversions: 152,
    },
  },
  {
    id: "cmp-3",
    name: "Clinic Follow-up",
    objective: "Customer follow-up",
    employeeName: "Elena",
    phone: "+373 22 555 014",
    status: "completed",
    schedule: "09:00 – 16:00",
    stats: {
      total: 212,
      queued: 0,
      calling: 0,
      completed: 212,
      answered: 174,
      noAnswer: 27,
      busy: 6,
      failed: 5,
      interested: 91,
      notInterested: 42,
      qualified: 63,
      appointments: 58,
      conversions: 51,
    },
  },
];

export const knowledgeDocs: KnowledgeDoc[] = [
  {
    id: "kd-1",
    name: "Company FAQ.pdf",
    sizeKb: 842,
    status: "ready",
    uploaded: "Sep 2, 2026",
    usedBy: ["Anna", "Sofia"],
    type: "PDF",
  },
  {
    id: "kd-2",
    name: "Product catalog 2026.pdf",
    sizeKb: 5320,
    status: "ready",
    uploaded: "Sep 3, 2026",
    usedBy: ["Anna"],
    type: "PDF",
  },
  {
    id: "kd-3",
    name: "Pricing.xlsx",
    sizeKb: 118,
    status: "ready",
    uploaded: "Sep 5, 2026",
    usedBy: ["Anna", "Elena"],
    type: "XLSX",
  },
  {
    id: "kd-4",
    name: "Support manual.docx",
    sizeKb: 2140,
    status: "processing",
    uploaded: "Sep 15, 2026",
    usedBy: ["Mark"],
    type: "DOCX",
  },
  {
    id: "kd-5",
    name: "Refund policy.txt",
    sizeKb: 24,
    status: "ready",
    uploaded: "Aug 28, 2026",
    usedBy: ["Mark", "Anna"],
    type: "TXT",
  },
  {
    id: "kd-6",
    name: "Sales scripts.docx",
    sizeKb: 402,
    status: "error",
    uploaded: "Sep 14, 2026",
    usedBy: [],
    type: "DOCX",
  },
];

export const localHealth: ServiceHealth[] = [
  {
    id: "ai",
    name: "AI Engine",
    description: "Understands and answers your customers",
    state: "healthy",
    detail: "Qwen3 8B loaded · 12 ms avg",
    mode: "local",
  },
  {
    id: "ollama",
    name: "Local Model Runtime",
    description: "Runs the AI model on your computer",
    state: "healthy",
    detail: "2 models installed",
    mode: "local",
  },
  {
    id: "stt",
    name: "Speech Recognition",
    description: "Turns what callers say into text",
    state: "healthy",
    detail: "Ready · English",
    mode: "local",
  },
  {
    id: "tts",
    name: "Voice",
    description: "Speaks to your callers",
    state: "healthy",
    detail: "4 voices installed",
    mode: "local",
  },
  {
    id: "phone",
    name: "Phone System",
    description: "Receives and places calls",
    state: "healthy",
    detail: "3 numbers connected",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Handles customer messages",
    state: "healthy",
    detail: "Connected as Lunara Sales",
  },
  {
    id: "db",
    name: "Database",
    description: "Stores your contacts and history",
    state: "healthy",
    detail: "4.2 GB used",
  },
  {
    id: "storage",
    name: "Storage",
    description: "Keeps recordings and documents",
    state: "degraded",
    detail: "78% of 200 GB used",
  },
];

export const realtimeHealth: ServiceHealth[] = [
  {
    id: "gateway",
    name: "Realtime Gateway",
    description: "Connects your phone line to the cloud voice model",
    state: "healthy",
    detail: "Running · 2 active sessions",
    mode: "realtime",
  },
  {
    id: "provider",
    name: "AI Provider",
    description: "OpenAI Realtime",
    state: "healthy",
    detail: "Connected · key ••••4f2a",
    mode: "realtime",
  },
];

export const activity: ActivityEvent[] = [
  { id: "a1", at: "Just now", type: "call", text: "Anna answered a call from +1 202 555 0164" },
  { id: "a2", at: "1 min ago", type: "message", text: "New WhatsApp message from Maria Popescu" },
  { id: "a3", at: "3 min ago", type: "lead", text: "Lead qualified — David Johnson, Acme Retail" },
  {
    id: "a4",
    at: "6 min ago",
    type: "appointment",
    text: "Appointment booked for Tue 10:00 by Elena",
  },
  {
    id: "a5",
    at: "9 min ago",
    type: "handoff",
    text: "Human handoff requested on call with Olga Petrov",
  },
  { id: "a6", at: "12 min ago", type: "call", text: "Sofia completed an inbound call · 2m 14s" },
  {
    id: "a7",
    at: "15 min ago",
    type: "system",
    text: "Campaign “September Sales Outreach” reached 50% progress",
  },
  {
    id: "a8",
    at: "18 min ago",
    type: "message",
    text: "Mark replied to an email from Harbor Foods",
  },
];

export const phoneNumbers: PhoneNumber[] = [
  {
    id: "pn-1",
    number: "+1 202 555 0147",
    label: "Main sales line",
    employeeName: "Anna",
    handling: "ai_all",
    recording: true,
    transcription: true,
    summary: true,
    state: "healthy",
  },
  {
    id: "pn-2",
    number: "+1 202 555 0188",
    label: "Support line",
    employeeName: "Mark",
    handling: "ai_delayed",
    recording: true,
    transcription: true,
    summary: true,
    state: "healthy",
  },
  {
    id: "pn-3",
    number: "+373 22 555 014",
    label: "Chisinau office",
    employeeName: "Elena",
    handling: "human_first",
    recording: false,
    transcription: true,
    summary: true,
    state: "degraded",
  },
];

export const crmIntegrations: CrmIntegration[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Sync contacts, deals and activities",
    connected: true,
    kind: "oauth",
    records: 4218,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Enterprise CRM with full object mapping",
    connected: false,
    kind: "oauth",
  },
  {
    id: "bitrix24",
    name: "Bitrix24",
    description: "Connect with an inbound webhook",
    connected: false,
    kind: "webhook",
  },
  {
    id: "freescout",
    name: "FreeScout",
    description: "Built-in local helpdesk",
    connected: true,
    kind: "local",
    records: 812,
  },
];

export const localModels: LocalModel[] = [
  {
    id: "qwen3-8b",
    name: "Qwen3 8B",
    size: "4.7 GB",
    ramGb: 8,
    quality: 4,
    speed: 5,
    recommended: true,
    installed: true,
  },
  { id: "qwen3-14b", name: "Qwen3 14B", size: "8.2 GB", ramGb: 16, quality: 5, speed: 3 },
  { id: "qwen3-32b", name: "Qwen3 32B", size: "19 GB", ramGb: 32, quality: 5, speed: 2 },
  {
    id: "llama31-8b",
    name: "Llama 3.1 8B",
    size: "4.9 GB",
    ramGb: 8,
    quality: 4,
    speed: 4,
    installed: true,
  },
  { id: "mistral-7b", name: "Mistral 7B", size: "4.1 GB", ramGb: 8, quality: 3, speed: 5 },
];

export const realtimeModels: Record<string, RealtimeModel[]> = {
  openai: [
    {
      id: "gpt-realtime",
      name: "GPT Realtime",
      quality: "Highest",
      latency: "~320 ms",
      cost: "$$$",
      recommended: true,
    },
    {
      id: "gpt-realtime-mini",
      name: "GPT Realtime Mini",
      quality: "High",
      latency: "~240 ms",
      cost: "$$",
    },
  ],
  google: [
    {
      id: "gemini-live",
      name: "Gemini Live",
      quality: "High",
      latency: "~300 ms",
      cost: "$$",
      recommended: true,
    },
    {
      id: "gemini-live-flash",
      name: "Gemini Live Flash",
      quality: "Good",
      latency: "~190 ms",
      cost: "$",
    },
  ],
};

export const appointments: Appointment[] = Array.from({ length: 14 }, (_, i): Appointment => ({
  id: `ap-${i}`,
  title: i % 2 === 0 ? "Product demo" : "Follow-up call",
  contactName: at(contacts, i * 5).name,
  start: `Sep ${15 + (i % 7)}, 2026 ${String(9 + (i % 8)).padStart(2, "0")}:00`,
  durationMin: i % 2 === 0 ? 45 : 30,
  channel: i % 3 === 0 ? "whatsapp" : "phone",
  employeeName: at(employees, i).name,
}));

export const hardware = {
  cpu: "AMD Ryzen 7 5800X · 8 cores",
  ram: "32 GB",
  gpu: "NVIDIA RTX 3060 · 12 GB (detected)",
  disk: "512 GB SSD · 78% used",
};

export const analyticsSeries = Array.from({ length: 30 }, (_, i) => {
  const r = rng(i + 31);
  const inbound = 40 + Math.round(r() * 60);
  const outbound = 20 + Math.round(r() * 70);
  return {
    day: `Aug ${17 + i > 31 ? i - 14 : 17 + i}`,
    inbound,
    outbound,
    answered: Math.round((inbound + outbound) * 0.78),
    missed: Math.round((inbound + outbound) * 0.09),
    leads: Math.round((inbound + outbound) * 0.21),
    appointments: Math.round((inbound + outbound) * 0.08),
  };
});
