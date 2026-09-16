import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleSlash,
  Loader2,
  ShieldQuestion,
  Sparkles,
  Wand2,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Pill, StatusDot } from "./primitives";
import type {
  AssistantTask,
  DiagnosticCheck,
  SystemActivityEntry,
  SystemState,
  SystemStatusItem,
  TaskStatus,
} from "@/services/types";

/* ------------------------------------------------------------- status labels */
const statusMeta: Record<TaskStatus, { label: string; tone: Parameters<typeof Pill>[0]["tone"] }> =
  {
    pending: { label: "Waiting to start", tone: "neutral" },
    running: { label: "Working", tone: "info" },
    waiting_approval: { label: "Needs your approval", tone: "warning" },
    waiting_input: { label: "Needs your answer", tone: "warning" },
    completed: { label: "Completed", tone: "success" },
    failed: { label: "Could not finish", tone: "danger" },
    cancelled: { label: "Cancelled", tone: "neutral" },
  };

export const systemStateMeta: Record<
  SystemState,
  { label: string; dot: "ok" | "warn" | "error" | "idle" }
> = {
  ready: { label: "Ready", dot: "ok" },
  connected: { label: "Connected", dot: "ok" },
  running: { label: "Running", dot: "ok" },
  checking: { label: "Checking", dot: "warn" },
  warning: { label: "Warning", dot: "warn" },
  error: { label: "Error", dot: "error" },
  not_configured: { label: "Not configured", dot: "idle" },
};

/* ------------------------------------------------------------- technical note */
export function TechnicalDetails({ text }: { text: string }) {
  return (
    <Collapsible className="mt-3">
      <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronRight className="size-3" /> Technical details
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="num mt-2 overflow-x-auto rounded-lg bg-muted/60 p-3 text-[11px] whitespace-pre-wrap text-muted-foreground">
          {text}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ------------------------------------------------------------------ task card */
export function TaskCard({
  task,
  onApprove,
  onCancel,
  onSubmitInput,
  busy,
}: {
  task: AssistantTask;
  onApprove?: (task: AssistantTask, value?: string) => void;
  onCancel?: (task: AssistantTask) => void;
  onSubmitInput?: (task: AssistantTask, value: string) => void;
  busy?: boolean;
}) {
  const meta = statusMeta[task.status];
  const icon =
    task.status === "completed" ? (
      <CheckCircle2 className="size-4 text-success" />
    ) : task.status === "failed" ? (
      <XCircle className="size-4 text-destructive" />
    ) : task.status === "cancelled" ? (
      <CircleSlash className="size-4 text-muted-foreground" />
    ) : task.status === "waiting_approval" || task.status === "waiting_input" ? (
      <ShieldQuestion className="size-4 text-warning" />
    ) : task.status === "running" ? (
      <Loader2 className="size-4 animate-spin text-primary" />
    ) : (
      <Sparkles className="size-4 text-muted-foreground" />
    );

  const needsDecision = task.status === "waiting_approval" || task.status === "waiting_input";

  return (
    <Card
      className={cn(
        "gap-0 p-4",
        needsDecision && "border-warning/40 bg-warning/[0.04]",
        task.status === "failed" && "border-destructive/30 bg-destructive/[0.04]",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{task.title}</p>
            <Pill tone={meta.tone}>{meta.label}</Pill>
          </div>
          {task.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
          ) : null}

          {typeof task.progress === "number" && task.status === "running" ? (
            <div className="mt-3">
              <Progress value={task.progress} />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{task.currentStep ?? "Working…"}</span>
                <span className="num">{Math.round(task.progress)}%</span>
              </div>
            </div>
          ) : null}

          {task.steps?.length ? (
            <ul className="mt-3 space-y-1.5">
              {task.steps.map((s) => (
                <li key={s.label} className="flex items-center gap-2 text-sm">
                  {s.state === "done" ? (
                    <Check className="size-3.5 text-success" />
                  ) : s.state === "active" ? (
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                  ) : s.state === "failed" ? (
                    <XCircle className="size-3.5 text-destructive" />
                  ) : (
                    <span className="size-3.5 rounded-full border border-border" />
                  )}
                  <span
                    className={cn(s.state === "pending" && "text-muted-foreground")}
                  >
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {task.status === "waiting_approval" && task.approval ? (
            <div className="mt-3 rounded-lg border border-warning/30 bg-card p-3">
              <p className="text-sm font-medium">{task.approval.question}</p>
              {task.approval.detail ? (
                <p className="mt-1 text-sm text-muted-foreground">{task.approval.detail}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" disabled={busy} onClick={() => onApprove?.(task)}>
                  {task.approval.confirmLabel ?? "Approve"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => onCancel?.(task)}
                >
                  {task.approval.cancelLabel ?? "Cancel"}
                </Button>
              </div>
            </div>
          ) : null}

          {task.status === "waiting_input" && task.input ? (
            <TaskInputCard task={task} onSubmit={onSubmitInput} busy={busy} />
          ) : null}

          {task.status === "failed" && task.error ? (
            <p className="mt-3 flex items-start gap-2 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              {task.error}
            </p>
          ) : null}

          {task.technical ? <TechnicalDetails text={task.technical} /> : null}

          {(task.startedAt ?? task.completedAt) ? (
            <p className="num mt-3 text-xs text-muted-foreground">
              {task.startedAt ? `Started ${task.startedAt}` : null}
              {task.startedAt && task.completedAt ? " · " : null}
              {task.completedAt ? `Finished ${task.completedAt}` : null}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function TaskInputCard({
  task,
  onSubmit,
  busy,
}: {
  task: AssistantTask;
  onSubmit?: (task: AssistantTask, value: string) => void;
  busy?: boolean;
}) {
  const input = task.input!;
  return (
    <div className="mt-3 rounded-lg border border-border bg-card p-3">
      <p className="text-sm font-medium">{input.question}</p>
      {input.detail ? (
        <p className="mt-1 text-sm text-muted-foreground">{input.detail}</p>
      ) : null}

      {input.kind === "choice" ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {input.options?.map((o) => (
            <button
              key={o.value}
              disabled={busy}
              onClick={() => onSubmit?.(task, o.value)}
              className="rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:border-primary hover:bg-muted/60"
            >
              <span className="font-medium">{o.label}</span>
              {o.description ? (
                <span className="block text-xs text-muted-foreground">{o.description}</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {input.kind === "qr" ? (
        <div className="mt-3 flex flex-col items-center gap-3 rounded-lg bg-muted/50 p-4">
          <div className="num flex size-40 items-center justify-center rounded-lg border border-border bg-card text-center text-xs break-all text-muted-foreground">
            {input.qrCode ?? "Waiting for the code…"}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Open WhatsApp → Linked Devices → Link a Device → scan this code.
          </p>
        </div>
      ) : null}

      {input.kind === "text" ? (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const value = new FormData(e.currentTarget).get("answer");
            if (typeof value === "string" && value.trim()) onSubmit?.(task, value.trim());
          }}
        >
          <input
            name="answer"
            placeholder={input.placeholder ?? "Type your answer"}
            className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          />
          <Button size="sm" type="submit" disabled={busy}>
            Send
          </Button>
        </form>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------- system activity */
export function SystemActivityList({ entries }: { entries: SystemActivityEntry[] }) {
  return (
    <ul className="space-y-3">
      {entries.map((e) => (
        <li key={e.id} className="flex gap-3">
          <span className="num w-12 shrink-0 pt-0.5 text-xs text-muted-foreground">{e.at}</span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm leading-snug">
              <StatusDot
                state={e.level === "error" ? "error" : e.level === "warning" ? "warn" : "ok"}
                className="shrink-0"
              />
              {e.text}
            </p>
            {e.technical ? <TechnicalDetails text={e.technical} /> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* --------------------------------------------------------- system status list */
export function SystemStatusList({
  items,
  onFix,
}: {
  items: SystemStatusItem[];
  onFix?: (item: SystemStatusItem) => void;
}) {
  return (
    <ul className="divide-y divide-border">
      {items.map((s) => {
        const meta = systemStateMeta[s.state];
        return (
          <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-medium">
                <StatusDot state={meta.dot} /> {s.name}
              </p>
              {s.detail ? (
                <p className="mt-0.5 pl-4 text-xs text-muted-foreground">{s.detail}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">{meta.label}</span>
              {s.fixAvailable && onFix ? (
                <Button size="sm" variant="outline" onClick={() => onFix(s)}>
                  <Wand2 /> Fix automatically
                </Button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------- diagnostics */
export function DiagnosticsList({
  checks,
  onFix,
}: {
  checks: DiagnosticCheck[];
  onFix?: (check: DiagnosticCheck) => void;
}) {
  return (
    <ul className="space-y-2">
      {checks.map((c) => (
        <li
          key={c.id}
          className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-medium">
              {c.state === "pass" ? (
                <Check className="size-4 text-success" />
              ) : c.state === "warn" ? (
                <AlertTriangle className="size-4 text-warning" />
              ) : (
                <XCircle className="size-4 text-destructive" />
              )}
              {c.name}
            </p>
            <p className="mt-0.5 pl-6 text-sm text-muted-foreground">{c.message}</p>
            {c.technical ? (
              <div className="pl-6">
                <TechnicalDetails text={c.technical} />
              </div>
            ) : null}
          </div>
          {c.fixAvailable && onFix ? (
            <Button size="sm" variant="outline" onClick={() => onFix(c)}>
              <Wand2 /> Fix automatically
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------ not connected */
export function AssistantUnavailable({
  title = "Lunara Assistant is not connected yet",
  description = "This Lunara Box is not reporting an assistant service right now. Once your Lunara backend is running, conversations, tasks and system checks appear here automatically.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Sparkles className="size-5" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------- ask Lunara */
export function AskLunaraButton({
  prompt,
  label = "Ask Lunara",
  variant = "outline",
  className,
}: {
  prompt: string;
  label?: string;
  variant?: "outline" | "default" | "ghost";
  className?: string;
}) {
  return (
    <Button asChild variant={variant} className={className}>
      <Link to="/assistant" search={{ ask: prompt }}>
        <Sparkles /> {label}
      </Link>
    </Button>
  );
}
