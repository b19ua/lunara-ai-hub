import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";
import type { HealthState, Sentiment } from "@/services/types";
import { AlertTriangle, RefreshCw } from "lucide-react";

/* --------------------------------------------------------------- status dot */
export function StatusDot({
  state,
  className,
}: {
  state: "ok" | "warn" | "error" | "idle";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block size-2 rounded-full",
        state === "ok" &&
          "bg-success shadow-[0_0_0_3px_color-mix(in_oklab,var(--success)_18%,transparent)]",
        state === "warn" &&
          "bg-warning shadow-[0_0_0_3px_color-mix(in_oklab,var(--warning)_18%,transparent)]",
        state === "error" &&
          "bg-destructive shadow-[0_0_0_3px_color-mix(in_oklab,var(--destructive)_18%,transparent)]",
        state === "idle" && "bg-muted-foreground/50",
        className,
      )}
    />
  );
}

export function healthToDot(state: HealthState) {
  return state === "healthy" ? "ok" : state === "degraded" ? "warn" : "error";
}

/* --------------------------------------------------------------- pill badge */
export function Pill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "accent";
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        tone === "neutral" && "border-border bg-muted text-muted-foreground",
        tone === "success" && "border-success/25 bg-success/10 text-success",
        tone === "warning" && "border-warning/30 bg-warning/12 text-warning",
        tone === "danger" && "border-destructive/25 bg-destructive/10 text-destructive",
        tone === "info" && "border-info/25 bg-info/10 text-info",
        tone === "accent" && "border-accent/25 bg-accent/10 text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function sentimentTone(s: Sentiment) {
  return s === "positive" ? "success" : s === "negative" ? "danger" : "neutral";
}

/* --------------------------------------------------------------- page header */
export function PageHeader({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        {children}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/* --------------------------------------------------------------- stat card */
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
  rows,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "neutral" | "accent";
  rows?: { label: string; value: ReactNode }[];
}) {
  return (
    <Card className="gap-0 p-5 transition-shadow hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon ? (
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              tone === "accent" ? "bg-accent/12 text-accent" : "bg-primary/10 text-primary",
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="num mt-3 text-3xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      {rows ? (
        <dl className="mt-4 space-y-1.5 border-t border-border pt-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="num font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Card>
  );
}

/* --------------------------------------------------------------- empty state */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      {icon ? (
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/* --------------------------------------------------------------- loading */
export function LoadingBlock({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function LoadingCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- error state */
export function ErrorState({
  title = "Something isn't responding",
  description = "Lunara Box could not load this information right now.",
  onRetry,
  actions,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center">
      <AlertTriangle className="mb-3 size-6 text-destructive" />
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 flex gap-2">
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw /> Try again
          </Button>
        ) : null}
        {actions}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- misc */
export function formatDuration(sec: number) {
  if (!sec) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export function Avatar({
  name,
  hue = 280,
  size = 40,
}: {
  name: string;
  hue?: number;
  size?: number;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-primary-foreground"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(140deg, oklch(0.55 0.16 ${hue}), oklch(0.4 0.14 ${hue + 25}))`,
      }}
    >
      {name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
