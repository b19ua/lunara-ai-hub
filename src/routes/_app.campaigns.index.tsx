import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Megaphone, Play, Rocket, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
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
import { EmptyState, LoadingCards, PageHeader, Pill } from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/campaigns/")({
  head: () => ({
    meta: [
      { title: "Call campaigns — Lunara Box" },
      {
        name: "description",
        content: "Create and monitor outbound AI calling campaigns with live outcomes.",
      },
      { property: "og:title", content: "Call campaigns — Lunara Box" },
      { property: "og:description", content: "Create and monitor outbound AI calling campaigns." },
    ],
  }),
  component: Campaigns,
});

const objectives = [
  "Sales",
  "Lead qualification",
  "Appointment booking",
  "Customer follow-up",
  "Survey",
  "Payment reminder",
  "Custom",
];

function CampaignWizard() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const employees = useQuery({ queryKey: ["agents"], queryFn: api.agents.list });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Megaphone /> Create campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New calling campaign</DialogTitle>
          <DialogDescription>Step {step} of 4</DialogDescription>
        </DialogHeader>
        <Progress value={(step / 4) * 100} />

        {step === 1 ? (
          <div className="space-y-3">
            <Label>Campaign name</Label>
            <Input
              placeholder="September Sales Outreach"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border p-10 text-center hover:bg-muted/50">
              <Upload className="size-6 text-primary" />
              <span className="text-sm font-medium">Drop your contact file here</span>
              <span className="text-xs text-muted-foreground">
                CSV or XLSX · name, phone, company, email and custom fields
              </span>
              <input type="file" className="hidden" onChange={() => setUploaded(true)} />
            </label>
            {uploaded ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Imported", "1,248 contacts"],
                  ["Valid numbers", "1,196"],
                  ["Invalid", "52"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p className="num text-lg font-semibold">{v}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block">AI employee</Label>
              <Select defaultValue="Anna">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees.data?.map((e) => (
                    <SelectItem key={e.id} value={e.name}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Objective</Label>
              <Select defaultValue="Sales">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Calling hours</Label>
              <Input defaultValue="09:00 – 18:00" />
            </div>
            <div>
              <Label className="mb-1.5 block">Max concurrent calls</Label>
              <Input defaultValue="8" />
            </div>
            <div>
              <Label className="mb-1.5 block">Max attempts</Label>
              <Input defaultValue="3" />
            </div>
            <div>
              <Label className="mb-1.5 block">Delay between attempts</Label>
              <Input defaultValue="4 hours" />
            </div>
            <div className="sm:col-span-2 space-y-2">
              {[
                "Leave a voicemail",
                "Record calls",
                "Transcribe calls",
                "AI summary",
                "Update CRM",
              ].map((s, i) => (
                <div
                  key={s}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm"
                >
                  {s} <Switch defaultChecked={i !== 0} />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
            <p className="font-semibold">You are about to start an outbound calling campaign.</p>
            <dl className="mt-4 space-y-2 text-sm">
              {[
                ["Contacts", "1,248"],
                ["Estimated calls", "1,248"],
                ["AI employee", "Anna"],
                ["Phone", "+1 202 555 0147"],
                ["Calling schedule", "09:00 – 18:00"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="num font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <DialogFooter>
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          ) : null}
          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && name.trim().length < 3}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={() =>
                toast.success("Campaign launched", {
                  description: "Calls start within your calling hours.",
                })
              }
            >
              <Rocket /> Launch campaign
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Campaigns() {
  const { data, isLoading } = useQuery({ queryKey: ["campaigns"], queryFn: api.campaigns.list });

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title="Call campaigns"
        description="Outbound calling at scale, handled by your AI employees."
        actions={<CampaignWizard />}
      />

      {isLoading ? <LoadingCards count={3} /> : null}

      {!isLoading && !data?.length ? (
        <EmptyState
          icon={<Megaphone className="size-5" />}
          title="No campaigns yet"
          description="Upload a contact list and let your AI employee work through it."
          action={<CampaignWizard />}
        />
      ) : null}

      <div className="space-y-4">
        {data?.map((c) => {
          const pct = Math.round((c.stats.completed / c.stats.total) * 100);
          return (
            <Card key={c.id} className="gap-0 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{c.name}</h2>
                    <Pill
                      tone={
                        c.status === "running"
                          ? "success"
                          : c.status === "paused"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {c.status}
                    </Pill>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.objective} · {c.employeeName} · {c.phone} · {c.schedule}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/campaigns/$id" params={{ id: c.id }}>
                    <Play /> Open dashboard
                  </Link>
                </Button>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span className="num">
                    {c.stats.completed} of {c.stats.total} called
                  </span>
                  <span className="num">{pct}%</span>
                </div>
                <Progress value={pct} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  ["Answered", c.stats.answered],
                  ["Qualified", c.stats.qualified],
                  ["Appointments", c.stats.appointments],
                  ["Conversions", c.stats.conversions],
                  ["Failed", c.stats.failed],
                ].map(([k, v]) => (
                  <div key={k as string} className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p className="num text-lg font-semibold">{v}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
