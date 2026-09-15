import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Ear,
  MessageSquare,
  Mic,
  PhoneCall,
  Rocket,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AiModeCards,
  HardwareCard,
  LocalModelPicker,
  PipelinePreview,
  RealtimeProviderSetup,
  VoiceSelector,
} from "@/components/lunara/ai-setup";
import { StatusDot } from "@/components/lunara/primitives";
import { useAppState } from "@/state/app-state";
import type { AiMode } from "@/services/types";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Lunara Box AI Calls" },
      {
        name: "description",
        content: "Set up your first AI employee: brain, voice, phone, WhatsApp and knowledge.",
      },
      { property: "og:title", content: "Welcome to Lunara Box" },
      {
        property: "og:description",
        content: "Set up your first AI employee in a few guided steps.",
      },
    ],
  }),
  component: Welcome,
});

const roles = [
  "Receptionist",
  "Sales",
  "Customer Support",
  "Lead Qualification",
  "Appointment Booking",
  "Customer Service",
  "Collections",
  "Custom",
];

const steps = [
  "Start",
  "Name",
  "Role",
  "AI mode",
  "Model",
  "Voice",
  "Phone",
  "WhatsApp",
  "Knowledge",
  "Test",
  "Finish",
];

function Welcome() {
  const navigate = useNavigate();
  const { completeSetup } = useAppState();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Anna");
  const [role, setRole] = useState("Sales");
  const [mode, setMode] = useState<AiMode>();
  const [model, setModel] = useState<string>();
  const [voice, setVoice] = useState<string>();
  const [phoneConnected, setPhoneConnected] = useState(false);
  const [waConnected, setWaConnected] = useState(false);
  const [docs, setDocs] = useState<string[]>([]);
  const [testReply, setTestReply] = useState<string>();

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canContinue =
    step === 1
      ? name.trim().length > 1
      : step === 3
        ? !!mode
        : step === 4
          ? !!model
          : step === 5
            ? !!voice
            : true;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/30">
            <span className="block size-3.5 rounded-full bg-primary" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-[0.14em]">LUNARA BOX</p>
            <p className="text-[10px] font-medium tracking-[0.3em] text-muted-foreground">
              AI CALLS
            </p>
          </div>
          {step > 0 ? (
            <div className="ml-auto w-48">
              <Progress value={(step / (steps.length - 1)) * 100} />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                Step {step} of {steps.length - 1}
              </p>
            </div>
          ) : null}
        </div>

        {step === 0 ? (
          <Card className="gap-0 p-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Welcome to Lunara Box</h1>
            <p className="mt-2 text-muted-foreground">
              Let's set up your first AI employee. It takes a few minutes and you never have to
              touch a configuration file.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: <Brain className="size-4" />,
                  t: "Choose a brain",
                  d: "Local or realtime AI",
                },
                {
                  icon: <PhoneCall className="size-4" />,
                  t: "Connect channels",
                  d: "Phone and WhatsApp",
                },
                { icon: <BookOpen className="size-4" />, t: "Add knowledge", d: "Your documents" },
              ].map((f) => (
                <div key={f.t} className="rounded-xl border border-border p-4 text-left">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {f.icon}
                  </span>
                  <p className="mt-3 text-sm font-medium">{f.t}</p>
                  <p className="text-xs text-muted-foreground">{f.d}</p>
                </div>
              ))}
            </div>
            <Button size="lg" className="mt-8 w-full sm:mx-auto sm:w-64" onClick={next}>
              Start setup <ArrowRight />
            </Button>
          </Card>
        ) : null}

        {step === 1 ? (
          <StepCard
            title="Name your AI employee"
            description="This is the name your team will see."
          >
            <Label htmlFor="name" className="mb-2 block">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-sm"
            />
          </StepCard>
        ) : null}

        {step === 2 ? (
          <StepCard title="What does this employee do?" description="You can change this later.">
            <div className="grid gap-3 sm:grid-cols-2">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-xl border border-border p-4 text-left text-sm font-medium transition-colors hover:bg-muted",
                    role === r && "border-primary bg-primary/5",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </StepCard>
        ) : null}

        {step === 3 ? (
          <StepCard
            title="Choose AI mode"
            description="Lunara builds the rest of the setup for you."
          >
            <AiModeCards value={mode} onChange={setMode} />
          </StepCard>
        ) : null}

        {step === 4 ? (
          <StepCard
            title={mode === "local" ? "Choose the AI brain" : "Connect your realtime provider"}
            description={
              mode === "local"
                ? "We checked your hardware and marked the best fit."
                : "Enter your key, then pick a model."
            }
          >
            {mode === "local" ? (
              <div className="space-y-4">
                <HardwareCard />
                <LocalModelPicker selected={model} onSelect={(_id, n) => setModel(n)} />
              </div>
            ) : (
              <RealtimeProviderSetup onReady={(_p, m) => setModel(m)} />
            )}
          </StepCard>
        ) : null}

        {step === 5 ? (
          <StepCard
            title="Pick a voice"
            description="This is how your AI employee will sound on the phone."
          >
            <VoiceSelector mode={mode ?? "local"} value={voice} onChange={setVoice} />
          </StepCard>
        ) : null}

        {step === 6 ? (
          <StepCard
            title="Connect a phone number"
            description="Your AI answers calls on this number."
          >
            <div className="space-y-3">
              <Label>SIP provider account</Label>
              <Input placeholder="Server, e.g. sip.myprovider.com" />
              <Input placeholder="Username" />
              <Input type="password" placeholder="Password" />
              <Button
                onClick={() => {
                  setPhoneConnected(true);
                  toast.success("Phone number connected");
                }}
                disabled={phoneConnected}
              >
                {phoneConnected ? (
                  <>
                    <Check /> Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                You can also connect an existing phone system later.
              </p>
            </div>
          </StepCard>
        ) : null}

        {step === 7 ? (
          <StepCard title="Connect WhatsApp" description="Let your AI reply to customer messages.">
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border p-8">
              <div className="grid size-40 grid-cols-8 gap-0.5 rounded-lg bg-card p-2 ring-1 ring-border">
                {Array.from({ length: 64 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "rounded-[1px]",
                      (i * 7) % 3 === 0 ? "bg-foreground" : "bg-transparent",
                    )}
                  />
                ))}
              </div>
              <ol className="space-y-1 text-sm text-muted-foreground">
                <li>1. Open WhatsApp on your phone</li>
                <li>2. Go to Linked Devices</li>
                <li>3. Tap “Link a Device”</li>
                <li>4. Scan this code</li>
              </ol>
              <Button
                variant={waConnected ? "outline" : "default"}
                onClick={() => {
                  setWaConnected(true);
                  toast.success("WhatsApp connected");
                }}
              >
                {waConnected ? (
                  <>
                    <Check /> Connected
                  </>
                ) : (
                  "I scanned the code"
                )}
              </Button>
            </div>
          </StepCard>
        ) : null}

        {step === 8 ? (
          <StepCard
            title="What should your AI employee know?"
            description="Upload your documents — we handle the rest."
          >
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border p-10 text-center hover:bg-muted/50">
              <Upload className="size-6 text-primary" />
              <span className="text-sm font-medium">Drag files here or click to upload</span>
              <span className="text-xs text-muted-foreground">PDF, DOCX, TXT, CSV, XLSX</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const names = Array.from(e.target.files ?? []).map((f) => f.name);
                  setDocs((d) => [...d, ...(names.length ? names : ["Product catalog.pdf"])]);
                  toast.success("Documents uploaded", {
                    description: "Processing in the background.",
                  });
                }}
              />
            </label>
            {docs.length ? (
              <ul className="mt-4 space-y-2">
                {docs.map((d) => (
                  <li
                    key={d}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
                  >
                    {d} <StatusDot state="ok" />
                  </li>
                ))}
              </ul>
            ) : null}
          </StepCard>
        ) : null}

        {step === 9 ? (
          <StepCard title={`Test ${name}`} description="Ask a question the way a customer would.">
            <div className="space-y-3">
              <Input
                placeholder="Hello, what services do you provide?"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setTestReply(
                      `Hi! I'm ${name}, ${role.toLowerCase()} at your company. We help customers with calls, WhatsApp and email — all handled automatically. Would you like a quick demo?`,
                    );
                  }
                }}
              />
              {testReply ? (
                <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
                  {testReply}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Press Enter to send your test message.
                </p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast("Starting voice test…")}>
                  <Mic /> Voice test
                </Button>
                <Button variant="outline" onClick={() => toast("Calling your phone…")}>
                  <PhoneCall /> Call me
                </Button>
              </div>
            </div>
          </StepCard>
        ) : null}

        {step === 10 ? (
          <Card className="gap-0 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-success/12 text-success">
              <Check className="size-6" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">{name} is ready</h2>
            <p className="mt-1 text-muted-foreground">Everything is connected and tested.</p>
            <div className="mt-6">
              <PipelinePreview mode={mode ?? "local"} model={model} voice={voice} />
            </div>
            <ul className="mt-6 grid gap-2 text-left sm:grid-cols-2">
              {[
                { icon: <Brain className="size-4" />, t: "Brain", d: model ?? "Ready" },
                { icon: <Ear className="size-4" />, t: "Hearing", d: "Ready" },
                { icon: <Mic className="size-4" />, t: "Voice", d: voice ?? "Ready" },
                {
                  icon: <PhoneCall className="size-4" />,
                  t: "Phone",
                  d: phoneConnected ? "Connected" : "Skipped",
                },
                {
                  icon: <MessageSquare className="size-4" />,
                  t: "WhatsApp",
                  d: waConnected ? "Connected" : "Skipped",
                },
                {
                  icon: <BookOpen className="size-4" />,
                  t: "Knowledge",
                  d: `${docs.length} documents`,
                },
              ].map((r) => (
                <li
                  key={r.t}
                  className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
                >
                  <span className="text-primary">{r.icon}</span>
                  <span className="text-sm font-medium">{r.t}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{r.d}</span>
                  <StatusDot state="ok" />
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="mt-8 w-full"
              onClick={() => {
                completeSetup();
                toast.success(`${name} is live`);
                void navigate({ to: "/" });
              }}
            >
              <Rocket /> Go live
            </Button>
          </Card>
        ) : null}

        {step > 0 && step < 10 ? (
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={back}>
              <ArrowLeft /> Back
            </Button>
            <div className="flex gap-2">
              {step > 5 ? (
                <Button variant="ghost" onClick={next}>
                  Skip
                </Button>
              ) : null}
              <Button onClick={next} disabled={!canContinue}>
                Continue <ArrowRight />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StepCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-0 p-6 sm:p-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{description}</p>
      {children}
    </Card>
  );
}
