import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/lunara/primitives";
import {
  AiModeCards,
  HardwareCard,
  LocalModelPicker,
  PipelinePreview,
  RealtimeProviderSetup,
  VoiceSelector,
} from "@/components/lunara/ai-setup";
import type { AiMode } from "@/services/types";

export const Route = createFileRoute("/_app/employees/new")({
  head: () => ({
    meta: [
      { title: "Create AI Employee — Lunara Box" },
      {
        name: "description",
        content: "Guided setup for a new AI employee: role, AI mode, model, voice and behaviour.",
      },
      { property: "og:title", content: "Create AI Employee — Lunara Box" },
      { property: "og:description", content: "Guided setup for a new AI employee." },
    ],
  }),
  component: NewEmployee,
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
const tones = ["Professional", "Friendly", "Formal", "Concise", "Custom"];
const languages = ["English", "Russian", "Romanian", "Ukrainian", "German", "French", "Spanish"];

function NewEmployee() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [role, setRole] = useState<string>();
  const [mode, setMode] = useState<AiMode>();
  const [model, setModel] = useState<string>();
  const [voice, setVoice] = useState<string>();
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [instructions, setInstructions] = useState("");

  const total = 6;
  const canContinue =
    step === 1
      ? name.trim().length > 1
      : step === 2
        ? !!role
        : step === 3
          ? !!mode
          : step === 4
            ? !!model
            : step === 5
              ? !!voice
              : true;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Create AI employee" description={`Step ${step} of ${total}`} />
      <Progress value={(step / total) * 100} className="mb-6" />

      <Card className="gap-0 p-6">
        {step === 1 ? (
          <>
            <h2 className="text-lg font-semibold">Name your AI employee</h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              Customers may hear this name when they call.
            </p>
            <Label htmlFor="n" className="mb-2 block">
              Name
            </Label>
            <Input
              id="n"
              placeholder="Anna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-sm"
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 className="text-lg font-semibold">What does this employee do?</h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              We tune the behaviour for the role you choose.
            </p>
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
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 className="text-lg font-semibold">Choose AI mode</h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              Lunara wires up the rest of the voice pipeline for you.
            </p>
            <AiModeCards value={mode} onChange={setMode} />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h2 className="text-lg font-semibold">
              {mode === "local" ? "Choose the AI brain" : "Connect a realtime provider"}
            </h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              {mode === "local"
                ? "Models are matched to your hardware."
                : "Models are loaded from your provider account."}
            </p>
            {mode === "local" ? (
              <div className="space-y-4">
                <HardwareCard />
                <LocalModelPicker selected={model} onSelect={(_i, n) => setModel(n)} />
              </div>
            ) : (
              <RealtimeProviderSetup onReady={(_p, m) => setModel(m)} />
            )}
          </>
        ) : null}

        {step === 5 ? (
          <>
            <h2 className="text-lg font-semibold">Voice</h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              How your AI employee sounds on calls.
            </p>
            <VoiceSelector mode={mode ?? "local"} value={voice} onChange={setVoice} />
          </>
        ) : null}

        {step === 6 ? (
          <>
            <h2 className="text-lg font-semibold">Behaviour</h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              Tone, language and any special instructions.
            </p>
            <div className="space-y-5">
              <div>
                <Label className="mb-2 block">Tone</Label>
                <div className="flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      variant={tone === t ? "default" : "outline"}
                      onClick={() => setTone(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Language</Label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <Button
                      key={l}
                      size="sm"
                      variant={language === l ? "default" : "outline"}
                      onClick={() => setLanguage(l)}
                    >
                      {l}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="ins" className="mb-2 block">
                  Custom instructions
                </Label>
                <Textarea
                  id="ins"
                  rows={6}
                  placeholder="You are a professional sales assistant…"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
              <PipelinePreview mode={mode ?? "local"} model={model} voice={voice} />
            </div>
          </>
        ) : null}
      </Card>

      <div className="mt-6 flex justify-between">
        <Button
          variant="ghost"
          onClick={() => (step === 1 ? navigate({ to: "/employees" }) : setStep((s) => s - 1))}
        >
          <ArrowLeft /> Back
        </Button>
        {step < total ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
            Continue <ArrowRight />
          </Button>
        ) : (
          <Button
            onClick={() => {
              toast.success(`${name} created`, {
                description: "Your AI employee is ready to take calls.",
              });
              void navigate({ to: "/employees" });
            }}
          >
            <Check /> Create employee
          </Button>
        )}
      </div>
    </div>
  );
}
