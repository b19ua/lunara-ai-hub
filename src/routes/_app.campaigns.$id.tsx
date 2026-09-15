import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pause, Play, Square } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pill,
  StatusDot,
} from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/campaigns/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Campaign ${params.id} — Lunara Box` },
      {
        name: "description",
        content: "Live campaign progress: answered, qualified, appointments and conversions.",
      },
      { property: "og:title", content: "Campaign dashboard — Lunara Box" },
      { property: "og:description", content: "Live outbound campaign progress and outcomes." },
    ],
  }),
  component: CampaignDetail,
});

const live = [
  "Calling +1 202 555 0164…",
  "Answered · Maria Popescu",
  "Lead qualified · Acme Retail",
  "Appointment booked · Tue 10:00",
  "No answer · +1 202 555 0192",
  "Calling +1 202 555 0177…",
];

function CampaignDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => api.campaigns.get(id),
  });

  if (isLoading) return <LoadingBlock rows={5} />;
  if (!data) {
    return (
      <EmptyState
        title="Campaign not found"
        description="This campaign may have been deleted."
        action={
          <Button asChild>
            <Link to="/campaigns">Back to campaigns</Link>
          </Button>
        }
      />
    );
  }

  const pct = Math.round((data.stats.completed / data.stats.total) * 100);
  const s = data.stats;

  return (
    <div className="mx-auto max-w-[1200px]">
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/campaigns">
          <ArrowLeft /> Campaigns
        </Link>
      </Button>

      <PageHeader
        title={data.name}
        description={`${data.objective} · ${data.employeeName} · ${data.phone} · ${data.schedule}`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast("Campaign paused")}>
              <Pause /> Pause
            </Button>
            <Button variant="outline" onClick={() => toast.success("Campaign resumed")}>
              <Play /> Resume
            </Button>
            <Button variant="destructive" onClick={() => toast("Campaign stopped")}>
              <Square /> Stop
            </Button>
          </>
        }
      />

      <Card className="gap-0 p-5">
        <div className="mb-2 flex items-center justify-between">
          <Pill tone={data.status === "running" ? "success" : "warning"}>
            <StatusDot state={data.status === "running" ? "ok" : "warn"} /> {data.status}
          </Pill>
          <span className="num text-sm text-muted-foreground">
            {s.completed} of {s.total} contacts · {pct}%
          </span>
        </div>
        <Progress value={pct} />
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {[
          ["Queued", s.queued],
          ["Calling now", s.calling],
          ["Completed", s.completed],
          ["Answered", s.answered],
          ["No answer", s.noAnswer],
          ["Busy", s.busy],
          ["Failed", s.failed],
          ["Interested", s.interested],
          ["Not interested", s.notInterested],
          ["Qualified", s.qualified],
          ["Appointments", s.appointments],
          ["Conversions", s.conversions],
        ].map(([k, v]) => (
          <Card key={k as string} className="gap-0 p-4">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="num mt-1 text-2xl font-semibold">{v}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 gap-0 p-5">
        <h2 className="font-semibold">Live activity</h2>
        <ul className="mt-3 space-y-2">
          {live.map((l, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border px-4 py-2.5 text-sm"
            >
              <StatusDot state={i % 3 === 0 ? "warn" : "ok"} /> {l}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
