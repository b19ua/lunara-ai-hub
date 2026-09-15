import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  Cloud,
  Cpu,
  Download,
  HardDrive,
  Loader2,
  MonitorSmartphone,
  Play,
  ShieldCheck,
  Volume2,
  Wifi,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { hardware } from "@/services/mock-data";
import { Pill, StatusDot } from "./primitives";
import type { AiMode } from "@/services/types";

/* ----------------------------------------------------------- mode selection */
export function AiModeCards({
  value,
  onChange,
}: {
  value?: AiMode | undefined;
  onChange: (m: AiMode) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card
        className={cn(
          "cursor-pointer gap-0 p-6 transition-all hover:shadow-[var(--shadow-float)]",
          value === "local" && "border-primary ring-2 ring-primary/30",
        )}
        onClick={() => onChange("local")}
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Cpu className="size-5" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Local AI</h3>
        <p className="text-sm text-muted-foreground">Everything runs on your computer.</p>
        <ul className="mt-4 space-y-2 text-sm">
          {[
            "Completely private",
            "No cloud AI subscription",
            "Works without internet",
            "Your data never leaves the box",
          ].map((b) => (
            <li key={b} className="flex items-center gap-2">
              <Check className="size-4 text-success" /> {b}
            </li>
          ))}
        </ul>
        <Button
          className="mt-6 w-full"
          variant={value === "local" ? "default" : "outline"}
          onClick={() => onChange("local")}
        >
          Use Local AI
        </Button>
      </Card>

      <Card
        className={cn(
          "cursor-pointer gap-0 p-6 transition-all hover:shadow-[var(--shadow-float)]",
          value === "realtime" && "border-accent ring-2 ring-accent/30",
        )}
        onClick={() => onChange("realtime")}
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
          <Cloud className="size-5" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Realtime AI</h3>
        <p className="text-sm text-muted-foreground">Use a realtime cloud voice model.</p>
        <ul className="mt-4 space-y-2 text-sm">
          {[
            "Extremely natural conversations",
            "Very low latency",
            "Premium AI models",
            "No local hardware requirements",
          ].map((b) => (
            <li key={b} className="flex items-center gap-2">
              <Check className="size-4 text-success" /> {b}
            </li>
          ))}
        </ul>
        <Button
          className="mt-6 w-full"
          variant={value === "realtime" ? "default" : "outline"}
          onClick={() => onChange("realtime")}
        >
          Use Realtime AI
        </Button>
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------- pipeline preview */
export function PipelinePreview({
  mode,
  model,
  voice,
}: {
  mode: AiMode;
  model?: string | undefined;
  voice?: string | undefined;
}) {
  const steps =
    mode === "local"
      ? [
          { label: "Phone", value: "Your number" },
          { label: "Hearing", value: "Automatic speech recognition" },
          { label: "Brain", value: model ?? "Local model" },
          { label: "Voice", value: voice ?? "Local voice" },
        ]
      : [
          { label: "Phone", value: "Your number" },
          { label: "Realtime gateway", value: "Built in" },
          { label: "Brain & voice", value: model ?? "Realtime model" },
        ];

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/40 p-4">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          <div className="rounded-lg bg-card px-3 py-2 shadow-[var(--shadow-card)]">
            <p className="text-[10px] tracking-wide text-muted-foreground uppercase">{s.label}</p>
            <p className="text-sm font-medium">{s.value}</p>
          </div>
          {i < steps.length - 1 ? <span className="text-muted-foreground">→</span> : null}
        </div>
      ))}
      <Pill tone="success" className="ml-auto">
        Pipeline configured automatically
      </Pill>
    </div>
  );
}

/* ----------------------------------------------------------- hardware */
export function HardwareCard() {
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-center gap-2">
        <MonitorSmartphone className="size-4 text-primary" />
        <h3 className="font-semibold">Your computer</h3>
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          { k: "Processor", v: hardware.cpu, icon: <Cpu className="size-4" /> },
          { k: "Memory", v: hardware.ram, icon: <HardDrive className="size-4" /> },
          { k: "Graphics", v: hardware.gpu, icon: <ShieldCheck className="size-4" /> },
          { k: "Disk", v: hardware.disk, icon: <HardDrive className="size-4" /> },
        ].map((r) => (
          <div key={r.k} className="flex items-start gap-3 rounded-lg border border-border p-3">
            <span className="mt-0.5 text-muted-foreground">{r.icon}</span>
            <div>
              <dt className="text-xs text-muted-foreground">{r.k}</dt>
              <dd className="text-sm font-medium">{r.v}</dd>
            </div>
          </div>
        ))}
      </dl>
    </Card>
  );
}

/* ----------------------------------------------------------- local model picker */
function Meter({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn("h-1.5 w-3 rounded-full", i <= value ? "bg-primary" : "bg-muted")}
        />
      ))}
    </span>
  );
}

export function LocalModelPicker({
  selected,
  onSelect,
}: {
  selected?: string | undefined;
  onSelect: (id: string, name: string) => void;
}) {
  const models = useQuery({ queryKey: ["models", "local"], queryFn: api.models.local });
  const [installing, setInstalling] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [installed, setInstalled] = useState<string[]>([]);

  const install = (id: string, name: string) => {
    setInstalling(id);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setInstalling(null);
          setInstalled((prev) => [...prev, id]);
          onSelect(id, name);
          toast.success(`${name} is ready`, {
            description: "Your AI brain is installed and tested.",
          });
          return 100;
        }
        return p + 8;
      });
    }, 180);
  };

  return (
    <div className="space-y-3">
      {models.isLoading ? (
        <p className="text-sm text-muted-foreground">Checking available models…</p>
      ) : null}
      {models.data?.map((m) => {
        const isInstalled = m.installed || installed.includes(m.id);
        const fits = m.ramGb <= 32;
        return (
          <Card
            key={m.id}
            className={cn(
              "gap-0 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
              selected === m.id && "border-primary ring-2 ring-primary/25",
            )}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{m.name}</p>
                {m.recommended ? <Pill tone="accent">Recommended for your computer</Pill> : null}
                {isInstalled ? (
                  <Pill tone="success">
                    <StatusDot state="ok" /> Installed
                  </Pill>
                ) : null}
                {!fits ? <Pill tone="warning">Needs more memory</Pill> : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="num">{m.size}</span>
                <span className="num">{m.ramGb} GB memory</span>
                <span className="flex items-center gap-1.5">
                  Quality <Meter value={m.quality} />
                </span>
                <span className="flex items-center gap-1.5">
                  Speed <Meter value={m.speed} />
                </span>
              </div>
              {installing === m.id ? (
                <div className="mt-3 max-w-sm">
                  <Progress value={progress} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {progress < 60
                      ? "Downloading model…"
                      : progress < 90
                        ? "Installing…"
                        : "Testing…"}
                  </p>
                </div>
              ) : null}
            </div>
            <div className="mt-3 shrink-0 sm:mt-0">
              {isInstalled ? (
                <Button
                  variant={selected === m.id ? "default" : "outline"}
                  onClick={() => onSelect(m.id, m.name)}
                >
                  {selected === m.id ? (
                    <>
                      <Check /> Selected
                    </>
                  ) : (
                    "Use this model"
                  )}
                </Button>
              ) : (
                <Button onClick={() => install(m.id, m.name)} disabled={installing !== null}>
                  {installing === m.id ? <Loader2 className="animate-spin" /> : <Download />}{" "}
                  Install model
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------- realtime provider */
export function RealtimeProviderSetup({
  onReady,
}: {
  onReady: (provider: string, model: string) => void;
}) {
  const [provider, setProvider] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [state, setState] = useState<"idle" | "connecting" | "connected">("idle");
  const [model, setModel] = useState<string | null>(null);

  const models = useQuery({
    queryKey: ["models", "realtime", provider],
    queryFn: () => api.models.realtime(provider as string),
    enabled: state === "connected" && !!provider,
  });

  const connect = async () => {
    if (apiKey.trim().length < 8) {
      toast.error("That key looks too short", {
        description: "Paste the full key from your provider's dashboard.",
      });
      return;
    }
    setState("connecting");
    await api.models.connectProvider(provider as string, apiKey);
    setState("connected");
    toast.success("Provider connected");
  };

  const providers = [
    { id: "openai", name: "OpenAI", desc: "GPT Realtime voice models" },
    { id: "google", name: "Google Gemini", desc: "Gemini Live realtime voice" },
    { id: "other", name: "Other provider", desc: "Coming soon", disabled: true },
  ];

  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-2 block">AI provider</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {providers.map((p) => (
            <Card
              key={p.id}
              onClick={() => !p.disabled && (setProvider(p.id), setState("idle"), setModel(null))}
              className={cn(
                "gap-1 p-4",
                p.disabled ? "opacity-50" : "cursor-pointer hover:border-accent",
                provider === p.id && "border-accent ring-2 ring-accent/25",
              )}
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {provider && provider !== "other" ? (
        <div className="space-y-3 rounded-xl border border-border p-4">
          <Label htmlFor="apikey">API key</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="apikey"
              type="password"
              placeholder="••••••••••••••••••••"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={state === "connected"}
            />
            <Button onClick={connect} disabled={state !== "idle"}>
              {state === "connecting" ? (
                <>
                  <Loader2 className="animate-spin" /> Connecting…
                </>
              ) : state === "connected" ? (
                <>
                  <Check /> Connected
                </>
              ) : (
                <>
                  <Wifi /> Connect
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your key is stored on this machine and never shown again after saving.
          </p>
          {state === "connected" ? (
            <p className="flex items-center gap-2 text-sm">
              <StatusDot state="ok" /> Connected · key ••••{apiKey.slice(-4)}
            </p>
          ) : null}
        </div>
      ) : null}

      {state === "connected" ? (
        <div>
          <Label className="mb-2 block">
            {models.isLoading ? "Retrieving available models…" : "Available realtime models"}
          </Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {models.data?.map((m) => (
              <Card
                key={m.id}
                onClick={() => {
                  setModel(m.id);
                  onReady(provider as string, m.name);
                }}
                className={cn(
                  "cursor-pointer gap-1 p-4",
                  model === m.id && "border-accent ring-2 ring-accent/25",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{m.name}</p>
                  {m.recommended ? <Pill tone="accent">Recommended</Pill> : null}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <span>
                    Quality
                    <br />
                    <span className="font-medium text-foreground">{m.quality}</span>
                  </span>
                  <span>
                    Latency
                    <br />
                    <span className="num font-medium text-foreground">{m.latency}</span>
                  </span>
                  <span>
                    Cost
                    <br />
                    <span className="font-medium text-foreground">{m.cost}</span>
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------- voice */
export function VoiceSelector({
  mode,
  value,
  onChange,
}: {
  mode: AiMode;
  value?: string | undefined;
  onChange: (v: string) => void;
}) {
  const voices = useQuery({ queryKey: ["voices"], queryFn: api.voice.list });
  const [language, setLanguage] = useState("English");
  const [gender, setGender] = useState("Female");

  if (mode === "realtime") {
    return (
      <Card className="gap-0 p-5">
        <h3 className="font-semibold">Voice</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Voice is handled by your selected realtime AI model.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Provider", "OpenAI"],
            ["Model", "GPT Realtime"],
            ["Voice", value ?? "Alloy"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border p-3">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="text-sm font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex gap-2">
          {["Alloy", "Verse", "Aria"].map((v) => (
            <Button
              key={v}
              size="sm"
              variant={value === v ? "default" : "outline"}
              onClick={() => onChange(v)}
            >
              {v}
            </Button>
          ))}
        </div>
      </Card>
    );
  }

  const filtered = voices.data?.filter((v) => v.language === language && v.gender === gender) ?? [];

  return (
    <div className="space-y-4">
      <Card className="gap-0 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Speech recognition</h3>
            <p className="text-sm text-muted-foreground">
              Understands what your callers say. Model chosen automatically.
            </p>
          </div>
          <Pill tone="success">
            <StatusDot state="ok" /> Ready
          </Pill>
        </div>
      </Card>

      <Card className="gap-0 p-5">
        <div className="flex items-center gap-2">
          <Volume2 className="size-4 text-primary" />
          <h3 className="font-semibold">Voice</h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block text-xs">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["English", "Romanian", "Russian", "German"].map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No voice available for this combination yet.
            </p>
          ) : null}
          {filtered.map((v) => (
            <div
              key={v.id}
              className={cn(
                "flex items-center justify-between rounded-lg border border-border px-4 py-3",
                value === v.name && "border-primary bg-primary/5",
              )}
            >
              <div>
                <p className="text-sm font-medium">{v.name}</p>
                <p className="text-xs text-muted-foreground">
                  {v.language} · {v.gender}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => toast("Playing voice preview…")}>
                  <Play /> Preview
                </Button>
                <Button
                  size="sm"
                  variant={value === v.name ? "default" : "outline"}
                  onClick={() => onChange(v.name)}
                >
                  {value === v.name ? "Selected" : "Use voice"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
