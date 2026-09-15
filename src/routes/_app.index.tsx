import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Bot,
  CalendarCheck,
  Clock,
  MessageSquare,
  PhoneCall,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  EmptyState,
  LoadingCards,
  PageHeader,
  Pill,
  StatCard,
  StatusDot,
  healthToDot,
} from "@/components/lunara/primitives";
import { api } from "@/services/api";
import { useAppState } from "@/state/app-state";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Overview — Lunara Box AI Calls" },
      {
        name: "description",
        content:
          "Live overview of your AI communication center: calls, conversations, leads and system health.",
      },
      { property: "og:title", content: "Overview — Lunara Box AI Calls" },
      { property: "og:description", content: "Live overview of your AI communication center." },
    ],
  }),
  component: Overview,
});

const activityTone = {
  call: "info",
  message: "accent",
  lead: "success",
  appointment: "success",
  handoff: "warning",
  system: "neutral",
} as const;

function Overview() {
  const { setupComplete } = useAppState();
  const health = useQuery({ queryKey: ["health"], queryFn: api.system.health });
  const activity = useQuery({ queryKey: ["activity"], queryFn: api.system.activity });
  const employees = useQuery({ queryKey: ["agents"], queryFn: api.agents.list });

  const active = employees.data?.filter((e) => e.status === "ready").length ?? 0;
  const busy = employees.data?.filter((e) => e.status === "busy").length ?? 0;
  const offline = employees.data?.filter((e) => e.status === "offline").length ?? 0;

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Good morning, Alex"
        description="Your AI communication center is running normally."
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/test-ai">
                <Sparkles /> Test AI
              </Link>
            </Button>
            <Button asChild>
              <Link to="/employees/new">
                <Bot /> New AI Employee
              </Link>
            </Button>
          </>
        }
      />

      {!setupComplete ? (
        <Card className="mb-6 border-accent/30 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Finish setting up Lunara Box</p>
            <p className="text-sm text-muted-foreground">
              Create your first AI employee and go live in a few minutes.
            </p>
          </div>
          <Button asChild>
            <Link to="/welcome">Start setup</Link>
          </Button>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Calls today"
          value="111"
          icon={<PhoneCall className="size-4" />}
          hint="+12% vs yesterday"
          rows={[
            { label: "Inbound", value: 78 },
            { label: "Outbound", value: 33 },
            { label: "Missed", value: 4 },
            { label: "AI handled", value: "96%" },
            { label: "Human handoff", value: 5 },
          ]}
        />
        <StatCard
          label="Conversations"
          value="128"
          icon={<MessageSquare className="size-4" />}
          tone="accent"
          hint="Across all channels"
          rows={[
            { label: "WhatsApp", value: 74 },
            { label: "Email", value: 31 },
            { label: "Web chat", value: 18 },
            { label: "SMS", value: 5 },
          ]}
        />
        <StatCard
          label="AI minutes"
          value="418"
          icon={<Clock className="size-4" />}
          hint="Used today"
          rows={[
            { label: "This month", value: "6,942" },
            { label: "Avg per call", value: "3m 46s" },
          ]}
        />
        <StatCard
          label="Leads"
          value="37"
          icon={<TrendingUp className="size-4" />}
          tone="accent"
          hint="Created today"
          rows={[
            { label: "New", value: 37 },
            { label: "Qualified", value: 21 },
            { label: "Converted", value: 9 },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">AI employees</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/employees">
                  View all <ArrowUpRight />
                </Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="num mt-1 text-2xl font-semibold text-success">{active}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Busy</p>
                <p className="num mt-1 text-2xl font-semibold text-warning">{busy}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Offline</p>
                <p className="num mt-1 text-2xl font-semibold text-muted-foreground">{offline}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {employees.data?.slice(0, 3).map((e) => (
                <Link
                  key={e.id}
                  to="/employees/$id"
                  params={{ id: e.id }}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/60"
                >
                  <div className="flex items-center gap-3">
                    <StatusDot
                      state={e.status === "ready" ? "ok" : e.status === "busy" ? "warn" : "idle"}
                    />
                    <div>
                      <p className="text-sm font-medium">{e.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.role} · {e.brain}
                      </p>
                    </div>
                  </div>
                  <span className="num hidden text-xs text-muted-foreground sm:block">
                    {e.callsToday} calls · {e.conversationsToday} chats
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Appointments</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/calendar">
                  Calendar <ArrowUpRight />
                </Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="num mt-1 text-2xl font-semibold">6</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Upcoming (7 days)</p>
                <p className="num mt-1 text-2xl font-semibold">23</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border p-4">
              <CalendarCheck className="size-5 text-success" />
              <div className="text-sm">
                <p className="font-medium">Next: Product demo · 11:30</p>
                <p className="text-muted-foreground">
                  Booked by Elena during a WhatsApp conversation
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-base font-semibold">Live activity</h2>
            <ul className="mt-4 space-y-3">
              {activity.isLoading ? <LoadingCards count={1} /> : null}
              {activity.data?.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <Pill tone={activityTone[a.type]} className="mt-0.5 h-fit capitalize">
                    {a.type}
                  </Pill>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.at}</p>
                  </div>
                </li>
              ))}
              {!activity.isLoading && !activity.data?.length ? (
                <EmptyState
                  title="No activity yet"
                  description="Events appear here as your AI handles calls and messages."
                />
              ) : null}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">System health</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/system">
                  Details <ArrowUpRight />
                </Link>
              </Button>
            </div>
            <ul className="mt-4 space-y-2.5">
              {health.data?.slice(0, 6).map((h) => (
                <li key={h.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <StatusDot state={healthToDot(h.state)} /> {h.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{h.detail}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Storage</span>
                <span className="num">78% of 200 GB</span>
              </div>
              <Progress value={78} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
