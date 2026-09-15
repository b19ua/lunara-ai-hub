import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  FileText,
  Globe,
  Mail,
  MessageSquare,
  Mic,
  PhoneCall,
  Play,
  Search,
  Send,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { Avatar, EmptyState, LoadingBlock, Pill, sentimentTone } from "./primitives";
import type { Channel, Conversation } from "@/services/types";

const channelIcon: Record<Channel, React.ReactNode> = {
  phone: <PhoneCall className="size-3.5" />,
  whatsapp: <MessageSquare className="size-3.5" />,
  email: <Mail className="size-3.5" />,
  web: <Globe className="size-3.5" />,
  sms: <MessageSquare className="size-3.5" />,
};

const filters = ["All", "Unread", "Needs attention", "AI handled", "Positive", "Negative"];

export function Inbox({
  channel,
  showChannelFilter = true,
}: {
  channel?: Channel;
  showChannelFilter?: boolean;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: api.conversations.list,
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState<string>(channel ?? "all");
  const [selectedId, setSelectedId] = useState<string>();
  const [draft, setDraft] = useState("");

  const list = useMemo(() => {
    return (data ?? []).filter((c) => {
      if (channel && c.channel !== channel) return false;
      if (!channel && channelFilter !== "all" && c.channel !== channelFilter) return false;
      if (filter === "Unread" && !c.unread) return false;
      if (filter === "Needs attention" && c.status !== "needs_human") return false;
      if (filter === "AI handled" && c.status !== "ai_handled") return false;
      if (filter === "Positive" && c.sentiment !== "positive") return false;
      if (filter === "Negative" && c.sentiment !== "negative") return false;
      if (
        query &&
        !`${c.contactName} ${c.lastMessage} ${c.handle}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [data, channel, channelFilter, filter, query]);

  const selected: Conversation | undefined = list.find((c) => c.id === selectedId) ?? list[0];

  if (isLoading) return <LoadingBlock rows={6} />;

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card className="gap-0 p-0">
        <div className="space-y-3 border-b border-border p-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search conversations"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {showChannelFilter && !channel ? (
            <Tabs value={channelFilter} onValueChange={setChannelFilter}>
              <TabsList className="w-full">
                {["all", "phone", "whatsapp", "email", "web"].map((c) => (
                  <TabsTrigger key={c} value={c} className="capitalize">
                    {c}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : null}
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border border-border px-2.5 py-1 text-xs transition-colors",
                  filter === f
                    ? "border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[560px]">
          {list.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No conversations"
                description="Nothing matches these filters yet."
              />
            </div>
          ) : null}
          <ul className="divide-y divide-border">
            {list.slice(0, 40).map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                    selected?.id === c.id && "bg-muted",
                  )}
                >
                  <Avatar
                    name={c.contactName}
                    hue={200 + ((c.contactName.length * 7) % 120)}
                    size={36}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{c.contactName}</p>
                      <span className="ml-auto text-[11px] text-muted-foreground">
                        {c.lastActivity}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="flex size-5 items-center justify-center rounded bg-muted text-muted-foreground">
                        {channelIcon[c.channel]}
                      </span>
                      {c.status === "needs_human" ? <Pill tone="warning">Needs human</Pill> : null}
                      {c.unread ? <Pill tone="accent">{c.unread} new</Pill> : null}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Card>

      {selected ? (
        <Card className="gap-0 p-0">
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <Avatar name={selected.contactName} hue={260} size={40} />
            <div className="min-w-0">
              <p className="font-semibold">{selected.contactName}</p>
              <p className="num text-xs text-muted-foreground">
                {selected.handle} · {selected.lastActivity}
              </p>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Pill tone="info">
                <Bot className="size-3" /> {selected.employeeName}
              </Pill>
              <Pill tone={sentimentTone(selected.sentiment)}>{selected.sentiment}</Pill>
              <Pill tone={selected.lead === "qualified" ? "success" : "neutral"}>
                {selected.lead} lead
              </Pill>
            </div>
          </div>

          <ScrollArea className="h-[420px] p-4">
            <ul className="space-y-3">
              {selected.messages.map((m) => (
                <li
                  key={m.id}
                  className={cn("flex", m.from === "customer" ? "justify-start" : "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-xl px-4 py-2.5 text-sm",
                      m.from === "customer" ? "bg-muted" : "bg-primary/10",
                    )}
                  >
                    <p className="mb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {m.from === "customer"
                        ? selected.contactName
                        : m.from === "ai"
                          ? selected.employeeName
                          : "Operator"}{" "}
                      · {m.at}
                    </p>
                    {m.kind === "voice" ? (
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast("Playing voice message…")}
                        >
                          <Play /> Play · {m.durationSec}s
                        </Button>
                        <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                          <Mic className="mt-0.5 size-3" /> “{m.transcription}”
                        </p>
                      </div>
                    ) : m.kind === "document" ? (
                      <span className="flex items-center gap-2">
                        <FileText className="size-4" /> {m.fileName}
                      </span>
                    ) : (
                      m.text
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>

          <div className="space-y-3 border-t border-border p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("AI will continue this conversation")}
              >
                <Bot /> Let AI handle
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast("You have taken over")}>
                <UserRound /> Take over
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Lead created in CRM")}
              >
                <UserPlus /> Create CRM lead
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Call scheduled")}>
                <PhoneCall /> Schedule call
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Write a reply…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && draft.trim()) {
                    toast.success("Reply sent");
                    setDraft("");
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (draft.trim()) {
                    toast.success("Reply sent");
                    setDraft("");
                  }
                }}
              >
                <Send /> Send
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex items-center justify-center p-10">
          <EmptyState
            title="Select a conversation"
            description="Choose a conversation on the left to read and reply."
          />
        </Card>
      )}
    </div>
  );
}
