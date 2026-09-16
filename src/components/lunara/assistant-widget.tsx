import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api } from "@/services/api";

const quick = [
  { label: "Check System", prompt: "Run a full system check." },
  { label: "Create AI Employee", prompt: "Create an AI employee for me." },
  { label: "Connect WhatsApp", prompt: "Connect WhatsApp." },
];

export function AssistantWidget() {
  const tasks = useQuery({
    queryKey: ["assistant", "tasks"],
    queryFn: api.assistant.getTasks,
    retry: false,
  });

  const active = tasks.data?.find((t) => t.status === "running" || t.status === "pending");
  const needsYou = tasks.data?.find(
    (t) => t.status === "waiting_approval" || t.status === "waiting_input",
  );

  return (
    <Card className="mb-6 gap-0 p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Lunara Assistant</p>
          <p className="text-sm text-muted-foreground">
            {needsYou
              ? `${needsYou.title} needs your answer.`
              : active
                ? `${active.title}${typeof active.progress === "number" ? ` — ${Math.round(active.progress)}%` : ""}`
                : tasks.isError
                  ? "Connect your Lunara backend to let the assistant manage your system."
                  : "Ask Lunara to set up, check or repair anything on your box."}
          </p>

          {active && typeof active.progress === "number" ? (
            <Progress value={active.progress} className="mt-3 max-w-sm" />
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {quick.map((q) => (
              <Button key={q.label} asChild variant="outline" size="sm">
                <Link to="/assistant" search={{ ask: q.prompt }}>
                  {q.label}
                </Link>
              </Button>
            ))}
            <Button asChild size="sm">
              <Link to="/assistant">Open Assistant</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
