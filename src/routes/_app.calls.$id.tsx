import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRightLeft,
  Check,
  Download,
  FileText,
  Pause,
  PhoneCall,
  Play,
  Search,
  UserPlus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pill,
  formatDuration,
  sentimentTone,
} from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/calls/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Call ${params.id} — Lunara Box` },
      {
        name: "description",
        content: "Recording, AI summary, intent, outcome and full transcript of this call.",
      },
      { property: "og:title", content: "Call details — Lunara Box" },
      { property: "og:description", content: "Recording, AI summary and full transcript." },
    ],
  }),
  component: CallDetails,
});

function CallDetails() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["call", id],
    queryFn: () => api.calls.get(id),
  });
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState([0]);
  const [q, setQ] = useState("");

  if (isLoading) return <LoadingBlock rows={6} />;
  if (!data) {
    return (
      <EmptyState
        title="Call not found"
        description="This call may have been deleted or the link is out of date."
        action={
          <Button asChild>
            <Link to="/calls" search={{ direction: "all" }}>
              Back to calls
            </Link>
          </Button>
        }
      />
    );
  }

  const transcript = data.transcript.filter(
    (t) => !q || t.text.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-[1200px]">
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/calls" search={{ direction: "all" }}>
          <ArrowLeft /> Calls
        </Link>
      </Button>

      <PageHeader
        title={data.contactName}
        description={`${data.phone} · ${data.date} at ${data.time} · ${formatDuration(data.durationSec)} · ${data.direction}`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Transcript downloaded")}>
              <FileText /> Transcript
            </Button>
            <Button variant="outline" onClick={() => toast.success("Added to CRM")}>
              <UserPlus /> Add to CRM
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>
                  <PhoneCall /> Call back
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Call {data.contactName} back?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {data.employeeName} will place a call to {data.phone} right now.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => toast.success("Calling…")}>
                    Start call
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {data.recorded ? (
            <Card className="gap-0 p-5">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  className="size-11 rounded-full"
                  onClick={() => setPlaying((p) => !p)}
                >
                  {playing ? <Pause /> : <Play />}
                </Button>
                <div className="flex-1">
                  <Slider value={pos} max={data.durationSec} onValueChange={setPos} />
                  <div className="num mt-1.5 flex justify-between text-xs text-muted-foreground">
                    <span>{formatDuration(pos[0] ?? 0)}</span>
                    <span>{formatDuration(data.durationSec)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toast.success("Recording downloaded")}
                >
                  <Download />
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-5 text-sm text-muted-foreground">
              No recording available for this call.
            </Card>
          )}

          <Card className="gap-0 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Transcript</h2>
              <div className="relative w-56">
                <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-8 pl-8 text-xs"
                  placeholder="Search transcript"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            {transcript.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No transcript lines matched.
              </p>
            ) : (
              <ul className="space-y-3">
                {transcript.map((t, i) => (
                  <li
                    key={i}
                    className={cn("flex gap-3", t.speaker === "AI" && "flex-row-reverse")}
                  >
                    <span className="num w-10 shrink-0 pt-2 text-xs text-muted-foreground">
                      {String(Math.floor(t.at / 60)).padStart(2, "0")}:
                      {String(t.at % 60).padStart(2, "0")}
                    </span>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-xl px-4 py-2.5 text-sm",
                        t.speaker === "AI" ? "bg-primary/10 text-foreground" : "bg-muted",
                      )}
                    >
                      <p className="mb-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {t.speaker}
                      </p>
                      {t.text}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="gap-0 p-5">
            <h2 className="font-semibold">AI summary</h2>
            <p className="mt-2 text-sm text-muted-foreground">{data.summary}</p>
            <dl className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Intent</dt>
                <dd className="font-medium">{data.intent}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Outcome</dt>
                <dd className="font-medium">{data.result}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Sentiment</dt>
                <dd>
                  <Pill tone={sentimentTone(data.sentiment)}>{data.sentiment}</Pill>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">AI employee</dt>
                <dd className="font-medium">{data.employeeName}</dd>
              </div>
            </dl>
          </Card>

          <Card className="gap-0 p-5">
            <h2 className="font-semibold">AI actions</h2>
            {data.actions.length ? (
              <ul className="mt-3 space-y-2">
                {data.actions.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-success" /> {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No actions were taken on this call.
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => toast("Transfer started")}
            >
              <ArrowRightLeft /> Transfer to a colleague
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
