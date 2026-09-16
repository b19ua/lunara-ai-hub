import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Bot,
  ListChecks,
  MessageSquare,
  PanelRightOpen,
  SendHorizonal,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeader, Pill } from "@/components/lunara/primitives";
import {
  AssistantUnavailable,
  SystemActivityList,
  SystemStatusList,
  TaskCard,
} from "@/components/lunara/assistant";
import { api } from "@/services/api";
import { subscribeAssistantEvents } from "@/services/assistant-events";
import type { AssistantMessage, AssistantTask } from "@/services/types";

interface AssistantSearch {
  ask?: string;
}

export const Route = createFileRoute("/_app/assistant")({
  validateSearch: (search: Record<string, unknown>): AssistantSearch =>
    typeof search["ask"] === "string" ? { ask: search["ask"] } : {},
  head: () => ({
    meta: [
      { title: "Lunara Assistant — Lunara Box" },
      {
        name: "description",
        content:
          "Talk to Lunara Assistant to set up, check and repair your AI system without touching any technical settings.",
      },
      { property: "og:title", content: "Lunara Assistant — Lunara Box" },
      {
        property: "og:description",
        content: "The intelligent control center of your Lunara Box.",
      },
    ],
  }),
  component: AssistantPage,
});

const quickActions = [
  "Set up my Lunara Box",
  "Create an AI Employee",
  "Set up Local AI",
  "Connect WhatsApp",
  "Connect Phone",
  "Run System Check",
];

function AssistantPage() {
  const { ask } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [localMessages, setLocalMessages] = useState<AssistantMessage[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const conversation = useQuery({
    queryKey: ["assistant", "conversation", conversationId],
    queryFn: () => api.assistant.getConversation(conversationId as string),
    enabled: !!conversationId,
    retry: false,
  });

  const tasks = useQuery({
    queryKey: ["assistant", "tasks"],
    queryFn: api.assistant.getTasks,
    retry: false,
    refetchInterval: 8000,
  });

  const status = useQuery({
    queryKey: ["system", "status"],
    queryFn: api.systemControl.getStatus,
    retry: false,
  });

  const activity = useQuery({
    queryKey: ["system", "activity", "assistant"],
    queryFn: api.systemControl.getActivity,
    retry: false,
  });

  // Backend task events (SSE) — no page refresh needed once streaming is live.
  useEffect(
    () =>
      subscribeAssistantEvents(() => {
        void qc.invalidateQueries({ queryKey: ["assistant"] });
        void qc.invalidateQueries({ queryKey: ["system"] });
      }),
    [qc],
  );

  const send = useMutation({
    mutationFn: (text: string) =>
      api.assistant.sendMessage({
        text,
        ...(conversationId ? { conversationId } : {}),
      }),
    onSuccess: (res) => {
      setConversationId(res.conversationId);
      void qc.invalidateQueries({ queryKey: ["assistant"] });
      void qc.invalidateQueries({ queryKey: ["system"] });
    },
    onError: () => {
      toast.error("Lunara Assistant is not available", {
        description: "Your Lunara backend is not responding yet, so nothing was sent.",
      });
    },
  });

  const decide = useMutation({
    mutationFn: ({
      task,
      action,
      value,
    }: {
      task: AssistantTask;
      action: "approve" | "cancel";
      value?: string;
    }) =>
      action === "approve"
        ? api.assistant.approveTask(task.id, value ? { value } : undefined)
        : api.assistant.cancelTask(task.id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["assistant", "tasks"] }),
    onError: () =>
      toast.error("Lunara could not update this task", {
        description: "The Lunara backend is not responding right now.",
      }),
  });

  const submit = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setLocalMessages((m) => [
      ...m,
      {
        id: `local-${Date.now()}`,
        role: "user",
        text: value,
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setDraft("");
    send.mutate(value);
    inputRef.current?.focus();
  };

  // Contextual request from another page (?ask=…)
  useEffect(() => {
    if (!ask) return;
    setDraft(ask);
    void navigate({ to: "/assistant", search: {}, replace: true });
    inputRef.current?.focus();
  }, [ask, navigate]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages.length, conversation.data?.messages.length]);

  const messages: AssistantMessage[] = conversation.data?.messages ?? localMessages;
  const backendDown = send.isError || tasks.isError;
  const openTasks = (tasks.data ?? []).filter(
    (t) => t.status !== "completed" && t.status !== "cancelled",
  );

  const activityPanel = (
    <div className="space-y-6">
      <Card className="gap-0 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <ListChecks className="size-4 text-primary" /> Current tasks
        </h2>
        <div className="mt-4 space-y-3">
          {tasks.isLoading ? <Skeleton className="h-20 rounded-lg" /> : null}
          {tasks.isError ? (
            <p className="text-sm text-muted-foreground">
              Task information will appear here once your Lunara backend is connected.
            </p>
          ) : null}
          {!tasks.isLoading && !tasks.isError && openTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing is running right now.</p>
          ) : null}
          {openTasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              busy={decide.isPending}
              onApprove={(task) => decide.mutate({ task, action: "approve" })}
              onCancel={(task) => decide.mutate({ task, action: "cancel" })}
              onSubmitInput={(task, value) => decide.mutate({ task, action: "approve", value })}
            />
          ))}
        </div>
      </Card>

      <Card className="gap-0 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Bot className="size-4 text-primary" /> System status
        </h2>
        <div className="mt-3">
          {status.isLoading ? <Skeleton className="h-28 rounded-lg" /> : null}
          {status.isError ? (
            <p className="text-sm text-muted-foreground">
              Live system status comes from your Lunara backend. It is not reporting yet.
            </p>
          ) : null}
          {status.data ? (
            <SystemStatusList
              items={status.data}
              onFix={(item) => submit(`Fix ${item.name.toLowerCase()} automatically.`)}
            />
          ) : null}
        </div>
      </Card>

      <Card className="gap-0 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Activity className="size-4 text-primary" /> System activity
        </h2>
        <div className="mt-4">
          {activity.isLoading ? <Skeleton className="h-24 rounded-lg" /> : null}
          {activity.isError ? (
            <p className="text-sm text-muted-foreground">
              Recent operations appear here once your Lunara backend is connected.
            </p>
          ) : null}
          {activity.data?.length ? <SystemActivityList entries={activity.data} /> : null}
          {activity.data && activity.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No operations yet.</p>
          ) : null}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Lunara Assistant"
        description="Tell Lunara what you need and it takes care of your system."
        actions={
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="xl:hidden">
                <PanelRightOpen /> System activity
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto p-5">
              <SheetHeader className="p-0 pb-4">
                <SheetTitle>System activity</SheetTitle>
              </SheetHeader>
              {activityPanel}
            </SheetContent>
          </Sheet>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="flex min-h-[560px] flex-col gap-0 p-0">
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {messages.length === 0 ? (
              <div className="py-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">Welcome to Lunara</h2>
                <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                  I&apos;m ready to help you set up and manage your AI system.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {quickActions.map((q) => (
                    <Button key={q} variant="outline" size="sm" onClick={() => submit(q)}>
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex flex-col gap-1", m.role === "user" && "items-end")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-muted/40",
                  )}
                >
                  {m.text}
                </div>
                <span className="num text-[11px] text-muted-foreground">{m.at}</span>
              </div>
            ))}

            {send.isPending ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                Checking your system…
              </p>
            ) : null}

            {backendDown ? (
              <AssistantUnavailable
                action={
                  <Button variant="outline" onClick={() => void tasks.refetch()}>
                    Try again
                  </Button>
                }
              />
            ) : null}

            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-4">
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                submit(draft);
              }}
            >
              <Textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(draft);
                  }
                }}
                rows={2}
                placeholder="Ask Lunara to set something up, check your system or fix a problem…"
                className="min-h-[56px] resize-none"
              />
              <Button type="submit" size="icon" disabled={!draft.trim() || send.isPending}>
                <SendHorizonal />
              </Button>
            </form>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquare className="size-3.5" />
              Lunara performs every change on your box — your browser never runs commands.
              {openTasks.length ? (
                <Pill tone="info" className="ml-auto">
                  {openTasks.length} running
                </Pill>
              ) : null}
            </p>
          </div>
        </Card>

        <aside className="hidden xl:block">{activityPanel}</aside>
      </div>
    </div>
  );
}
