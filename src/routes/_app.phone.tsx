import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Phone, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pill,
  StatusDot,
} from "@/components/lunara/primitives";
import { AskLunaraButton } from "@/components/lunara/assistant";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/phone")({
  head: () => ({
    meta: [
      { title: "Phone system — Lunara Box" },
      {
        name: "description",
        content: "Connect phone numbers and choose how your AI answers each of them.",
      },
      { property: "og:title", content: "Phone system — Lunara Box" },
      {
        property: "og:description",
        content: "Connect phone numbers and decide how your AI answers.",
      },
    ],
  }),
  component: PhonePage,
});

const sources = [
  {
    id: "sip",
    title: "SIP provider",
    desc: "You have a phone number from an internet phone provider.",
  },
  {
    id: "pbx",
    title: "Existing phone system",
    desc: "Your company already has a phone system we can plug into.",
  },
  { id: "device", title: "SIP desk phone", desc: "Connect a physical desk phone or softphone." },
];

function AddNumberWizard() {
  const [step, setStep] = useState(0);
  const [source, setSource] = useState("sip");

  return (
    <Dialog onOpenChange={() => setStep(0)}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add phone number
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 0 ? "Where does your number come from?" : "Connection details"}
          </DialogTitle>
          <DialogDescription>
            {step === 0
              ? "Pick the option that matches your setup."
              : "We'll handle the rest automatically."}
          </DialogDescription>
        </DialogHeader>

        {step === 0 ? (
          <RadioGroup value={source} onValueChange={setSource} className="gap-2">
            {sources.map((s) => (
              <label
                key={s.id}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors",
                  source === s.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <RadioGroupItem value={s.id} className="mt-1" />
                <span>
                  <span className="block text-sm font-medium">{s.title}</span>
                  <span className="block text-sm text-muted-foreground">{s.desc}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        ) : (
          <div className="grid gap-3">
            <div>
              <Label className="mb-1.5 block">Phone number</Label>
              <Input placeholder="+1 202 555 0199" />
            </div>
            <div>
              <Label className="mb-1.5 block">Server address</Label>
              <Input placeholder="sip.provider.com" />
            </div>
            <div>
              <Label className="mb-1.5 block">Username</Label>
              <Input placeholder="account name" />
            </div>
            <div>
              <Label className="mb-1.5 block">Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <Button variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
          ) : null}
          <Button
            onClick={() => (step === 0 ? setStep(1) : toast.success("Phone number connected"))}
          >
            {step === 0 ? "Continue" : "Connect number"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PhonePage() {
  const { data, isLoading } = useQuery({ queryKey: ["phone"], queryFn: api.phone.numbers });
  const { data: employees } = useQuery({ queryKey: ["agents"], queryFn: api.agents.list });

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="Phone system"
        description="Your numbers and who answers them."
        actions={
          <>
            <AskLunaraButton prompt="Check my phone system." label="Ask Lunara to check my phone" />
            <AddNumberWizard />
          </>
        }
      />

      <Card className="mb-4 flex-row items-center gap-3 p-4">
        <StatusDot state="ok" />
        <div>
          <p className="text-sm font-medium">Phone system connected</p>
          <p className="text-xs text-muted-foreground">
            Calls are being received and answered normally.
          </p>
        </div>
        <Pill tone="success" className="ml-auto">
          Healthy
        </Pill>
      </Card>

      {isLoading ? <LoadingBlock /> : null}
      {!isLoading && !data?.length ? (
        <EmptyState
          icon={<Phone className="size-5" />}
          title="No phone connected"
          description="Connect a number so your AI employees can take calls."
          action={<AddNumberWizard />}
        />
      ) : null}

      <div className="grid gap-4">
        {data?.map((n) => (
          <Card key={n.id} className="gap-0 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="num text-lg font-semibold">{n.number}</span>
              <Pill tone="neutral">{n.label}</Pill>
              <Pill tone={n.state === "healthy" ? "success" : "warning"}>
                <StatusDot state={n.state === "healthy" ? "ok" : "warn"} />
                {n.state === "healthy" ? "Active" : "Needs attention"}
              </Pill>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-1.5 block">Answered by</Label>
                <Select defaultValue={n.employeeName}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((e) => (
                      <SelectItem key={e.id} value={e.name}>
                        {e.name} · {e.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Answering rule</Label>
                <Select defaultValue="ai">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">AI answers all calls</SelectItem>
                    <SelectItem value="human">Human first, AI as backup</SelectItem>
                    <SelectItem value="delay">AI answers after 15 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {["Record calls", "Write transcripts", "AI call summary"].map((t) => (
                <label
                  key={t}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  {t} <Switch defaultChecked />
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
