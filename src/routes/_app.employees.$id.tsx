import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, BookOpen, Check, Pause, Save, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Avatar,
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pill,
  StatusDot,
} from "@/components/lunara/primitives";
import { PipelinePreview, VoiceSelector } from "@/components/lunara/ai-setup";
import { api } from "@/services/api";
import { knowledgeDocs } from "@/services/mock-data";

export const Route = createFileRoute("/_app/employees/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `AI Employee ${params.id} — Lunara Box` },
      {
        name: "description",
        content:
          "Configure the brain, voice, channels, knowledge and handoff rules of this AI employee.",
      },
      { property: "og:title", content: "AI Employee — Lunara Box" },
      { property: "og:description", content: "Configure brain, voice, channels and knowledge." },
    ],
  }),
  component: EmployeeDetail,
});

const triggers = [
  "Customer requests a human",
  "AI confidence too low",
  "Complaint detected",
  "Sensitive issue",
  "Sales escalation",
];

function EmployeeDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => api.agents.get(id),
  });
  const [voice, setVoice] = useState<string>();
  const [instructions, setInstructions] = useState<string>();

  if (isLoading) return <LoadingBlock rows={6} />;
  if (!data) {
    return (
      <EmptyState
        title="AI employee not found"
        description="This employee may have been removed."
        action={
          <Button asChild>
            <Link to="/employees">Back to AI employees</Link>
          </Button>
        }
      />
    );
  }

  const assigned = knowledgeDocs.filter((d) => d.usedBy.includes(data.name));
  const unassigned = knowledgeDocs.filter((d) => !d.usedBy.includes(data.name));

  return (
    <div className="mx-auto max-w-[1200px]">
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/employees">
          <ArrowLeft /> AI Employees
        </Link>
      </Button>

      <PageHeader
        title={data.name}
        description={`${data.role} · ${data.brain}`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast(`${data.name} paused`)}>
              <Pause /> Pause
            </Button>
            <Button asChild variant="outline">
              <Link to="/test-ai">
                <Sparkles /> Test
              </Link>
            </Button>
            <Button onClick={() => toast.success("Changes saved")}>
              <Save /> Save
            </Button>
          </>
        }
      >
        <div className="mt-3 flex items-center gap-3">
          <Avatar name={data.name} hue={data.avatarHue} size={32} />
          <Pill
            tone={
              data.status === "ready" ? "success" : data.status === "busy" ? "warning" : "neutral"
            }
          >
            <StatusDot
              state={data.status === "ready" ? "ok" : data.status === "busy" ? "warn" : "idle"}
            />
            {data.status}
          </Pill>
          <Pill tone="info">{data.mode === "local" ? "Local AI" : "Realtime AI"}</Pill>
        </div>
      </PageHeader>

      <div className="mb-6">
        <PipelinePreview mode={data.mode} model={data.brain} voice={data.voice} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="behavior">Behaviour</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="handoff">Human handoff</TabsTrigger>
          <TabsTrigger value="crm">CRM actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-4 md:grid-cols-3">
          {[
            { k: "Calls today", v: data.callsToday },
            { k: "Conversations today", v: data.conversationsToday },
            { k: "Knowledge documents", v: data.knowledgeDocs },
          ].map((s) => (
            <Card key={s.k} className="gap-0 p-5">
              <p className="text-sm text-muted-foreground">{s.k}</p>
              <p className="num mt-2 text-3xl font-semibold">{s.v}</p>
            </Card>
          ))}
          <Card className="gap-0 p-5 md:col-span-3">
            <h3 className="font-semibold">Channels</h3>
            <div className="mt-3 space-y-3">
              {(["phone", "whatsapp", "email", "web"] as const).map((c) => (
                <div
                  key={c}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <span className="text-sm font-medium capitalize">
                    {c === "web" ? "Web chat" : c}
                  </span>
                  <Switch defaultChecked={data.channels.includes(c)} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <Card className="gap-0 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block">Tone</Label>
                <Input defaultValue={data.tone} />
              </div>
              <div>
                <Label className="mb-2 block">Language</Label>
                <Input defaultValue={data.language} />
              </div>
            </div>
            <div className="mt-4">
              <Label className="mb-2 block">Custom instructions</Label>
              <Textarea
                rows={8}
                value={instructions ?? data.instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <VoiceSelector
            mode={data.mode}
            value={voice ?? data.voice.split("· ")[1]}
            onChange={setVoice}
          />
        </TabsContent>

        <TabsContent value="knowledge">
          <Card className="gap-0 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Knowledge assigned to {data.name}</h3>
              <Button asChild variant="outline" size="sm">
                <Link to="/knowledge">
                  <BookOpen /> Manage knowledge
                </Link>
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {assigned.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Check className="size-4 text-success" /> {d.name}
                  </span>
                  <Switch defaultChecked />
                </li>
              ))}
            </ul>
            <p className="mt-6 mb-2 text-sm font-medium text-muted-foreground">Not assigned</p>
            <ul className="space-y-2">
              {unassigned.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-3 text-sm"
                >
                  {d.name} <Switch />
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="handoff">
          <Card className="gap-0 p-5">
            <h3 className="font-semibold">When should a human take over?</h3>
            <ul className="mt-4 space-y-2">
              {triggers.map((t, i) => (
                <li
                  key={t}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
                >
                  {t} <Switch defaultChecked={i < 3} />
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Label className="mb-2 block">Transfer calls to</Label>
              <Input defaultValue="+1 202 555 0100 · Operator desk" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="crm">
          <Card className="gap-0 p-5">
            <h3 className="font-semibold">Actions {data.name} may perform</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Create contact",
                "Create lead",
                "Update contact",
                "Create deal",
                "Create task",
                "Create note",
                "Create activity",
                "Create appointment",
              ].map((a, i) => (
                <li
                  key={a}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
                >
                  {a} <Switch defaultChecked={i < 6} />
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
