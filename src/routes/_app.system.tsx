import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Activity, CheckCircle2, RefreshCw, TriangleAlert, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  LoadingCards,
  PageHeader,
  Pill,
  StatusDot,
  healthToDot,
} from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/system")({
  head: () => ({
    meta: [
      { title: "System — Lunara Box" },
      {
        name: "description",
        content:
          "Check that your AI, phone system, messaging and storage are all running normally.",
      },
      { property: "og:title", content: "System — Lunara Box" },
      { property: "og:description", content: "Check that everything is running normally." },
    ],
  }),
  component: System,
});

type Check = { name: string; result: "pass" | "warn" | "fail"; why: string; action?: string };

const checkList: Check[] = [
  { name: "AI engine", result: "pass", why: "Your AI is responding quickly." },
  { name: "Speech recognition", result: "pass", why: "Customer speech is being understood." },
  { name: "Voice output", result: "pass", why: "Your AI can speak on calls." },
  { name: "Phone system", result: "pass", why: "Calls are being received." },
  {
    name: "WhatsApp",
    result: "warn",
    why: "The connection dropped briefly and reconnected. If it keeps happening, link the device again.",
    action: "Reconnect WhatsApp",
  },
  { name: "Database", result: "pass", why: "All your data is saved correctly." },
  {
    name: "Storage",
    result: "warn",
    why: "You are using 78% of available space. Old recordings can be deleted.",
    action: "Manage recordings",
  },
  { name: "CRM connection", result: "pass", why: "Contacts and activities are syncing." },
  { name: "Email", result: "pass", why: "Your mailbox is connected." },
  { name: "Internet", result: "pass", why: "Outgoing connections work." },
];

const icons = {
  pass: <CheckCircle2 className="size-4 text-success" />,
  warn: <TriangleAlert className="size-4 text-warning" />,
  fail: <XCircle className="size-4 text-destructive" />,
};

function System() {
  const { data, isLoading } = useQuery({ queryKey: ["health"], queryFn: api.system.health });
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  function runCheck() {
    setRunning(true);
    setDone(false);
    setProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(t);
        setRunning(false);
        setDone(true);
        toast.success("System check complete", { description: "2 warnings found." });
      }
    }, 220);
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title="System"
        description="Everything that keeps your AI employees working."
        actions={
          <Button onClick={runCheck} disabled={running}>
            <RefreshCw className={cn(running && "animate-spin")} /> Run full system check
          </Button>
        }
      />

      {isLoading ? <LoadingCards /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data?.map((s) => (
          <Card key={s.id} className="gap-0 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </div>
              <StatusDot state={healthToDot(s.state)} />
            </div>
            <p className="num mt-3 text-sm text-muted-foreground">{s.detail}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 gap-0 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <h2 className="font-semibold">Diagnostics</h2>
          </div>
          {done ? <Pill tone="warning">2 warnings</Pill> : null}
        </div>

        {running ? (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Checking your system…</p>
            <Progress value={progress} className="mt-2" />
          </div>
        ) : null}

        {!running && !done ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Run a full check to confirm that AI, voice, telephony, messaging, storage and
            integrations all work.
          </p>
        ) : null}

        {done ? (
          <ul className="mt-4 space-y-2">
            {checkList.map((c) => (
              <li
                key={c.name}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-4 py-3"
              >
                {icons[c.result]}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.why}</p>
                </div>
                {c.action ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`${c.action} started`)}
                  >
                    {c.action}
                  </Button>
                ) : (
                  <Pill tone="success">Passed</Pill>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </Card>
    </div>
  );
}
