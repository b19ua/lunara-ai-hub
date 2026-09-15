import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bot, Globe, Mail, MessageSquare, Pause, PhoneCall, Settings2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Avatar,
  EmptyState,
  LoadingCards,
  PageHeader,
  Pill,
  StatusDot,
} from "@/components/lunara/primitives";
import { api } from "@/services/api";
import type { Channel } from "@/services/types";

export const Route = createFileRoute("/_app/employees/")({
  head: () => ({
    meta: [
      { title: "AI Employees — Lunara Box" },
      {
        name: "description",
        content: "Manage the AI employees that answer your calls, messages and emails.",
      },
      { property: "og:title", content: "AI Employees — Lunara Box" },
      {
        property: "og:description",
        content: "Manage the AI employees that answer your calls and messages.",
      },
    ],
  }),
  component: EmployeesPage,
});

const channelIcon: Record<Channel, React.ReactNode> = {
  phone: <PhoneCall className="size-3.5" />,
  whatsapp: <MessageSquare className="size-3.5" />,
  email: <Mail className="size-3.5" />,
  web: <Globe className="size-3.5" />,
  sms: <MessageSquare className="size-3.5" />,
};

function EmployeesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["agents"], queryFn: api.agents.list });

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="AI Employees"
        description="Each employee has its own brain, voice, channels and knowledge."
        actions={
          <Button asChild>
            <Link to="/employees/new">
              <Bot /> Create AI Employee
            </Link>
          </Button>
        }
      />

      {isLoading ? <LoadingCards count={6} /> : null}

      {!isLoading && !data?.length ? (
        <EmptyState
          icon={<Bot className="size-5" />}
          title="No AI employees yet"
          description="Create your first AI employee and start handling calls automatically."
          action={
            <Button asChild>
              <Link to="/employees/new">Create AI Employee</Link>
            </Button>
          }
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.map((e) => (
          <Card key={e.id} className="gap-0 p-5">
            <div className="flex items-start gap-3">
              <Avatar name={e.name} hue={e.avatarHue} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{e.name}</p>
                <p className="text-sm text-muted-foreground">{e.role}</p>
              </div>
              <Pill
                tone={
                  e.status === "ready" ? "success" : e.status === "busy" ? "warning" : "neutral"
                }
              >
                <StatusDot
                  state={e.status === "ready" ? "ok" : e.status === "busy" ? "warn" : "idle"}
                />
                {e.status === "ready"
                  ? "Ready"
                  : e.status === "busy"
                    ? "Busy"
                    : e.status === "paused"
                      ? "Paused"
                      : "Offline"}
              </Pill>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Brain</dt>
                <dd className="truncate font-medium">{e.brain}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Voice</dt>
                <dd className="truncate font-medium">{e.voice}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Channels</dt>
                <dd className="flex gap-1.5">
                  {e.channels.map((c) => (
                    <span
                      key={c}
                      className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground"
                    >
                      {channelIcon[c]}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Knowledge</dt>
                <dd className="num font-medium">{e.knowledgeDocs} documents</dd>
              </div>
            </dl>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-3 text-center">
              <div>
                <p className="num text-lg font-semibold">{e.callsToday}</p>
                <p className="text-xs text-muted-foreground">calls today</p>
              </div>
              <div>
                <p className="num text-lg font-semibold">{e.conversationsToday}</p>
                <p className="text-xs text-muted-foreground">conversations</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link to="/employees/$id" params={{ id: e.id }}>
                  Open
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/employees/$id" params={{ id: e.id }}>
                  <Settings2 /> Edit
                </Link>
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast(`${e.name} paused`)}>
                <Pause />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
