import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Mic, PhoneCall, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeader, Pill } from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/test-ai")({
  head: () => ({
    meta: [
      { title: "Test AI — Lunara Box" },
      {
        name: "description",
        content: "Chat, speak or place a real test call to check how your AI employee responds.",
      },
      { property: "og:title", content: "Test AI — Lunara Box" },
      { property: "og:description", content: "Try your AI employee before going live." },
    ],
  }),
  component: TestAi,
});

type Msg = { from: "you" | "ai"; text: string };

const replies: string[] = [
  "Hello! Thanks for reaching out. How can I help you today?",
  "We're open Monday to Friday, 9am to 6pm. Would you like me to book you a slot?",
  "I can put that on the calendar for Tuesday at 10:00. Shall I confirm it?",
  "I've noted your details and created a lead for our sales team.",
];

function TestAi() {
  const { data: employees } = useQuery({ queryKey: ["agents"], queryFn: api.agents.list });
  const [messages, setMessages] = useState<Msg[]>([{ from: "ai", text: replies[0] as string }]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);

  function send() {
    if (!draft.trim()) return;
    const text = draft;
    setDraft("");
    setMessages((m) => [...m, { from: "you", text }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [
        ...m,
        { from: "ai", text: replies[m.length % replies.length] as string },
      ]);
    }, 900);
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <PageHeader
        title="Test your AI"
        description="Try a conversation before your customers do."
        actions={
          <Select {...(employees?.[0]?.name ? { defaultValue: employees[0].name } : {})}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Choose AI employee" />
            </SelectTrigger>
            <SelectContent>
              {employees?.map((e) => (
                <SelectItem key={e.id} value={e.name}>
                  {e.name} · {e.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <Tabs defaultValue="text">
        <TabsList className="mb-4">
          <TabsTrigger value="text">Text test</TabsTrigger>
          <TabsTrigger value="voice">Voice test</TabsTrigger>
          <TabsTrigger value="phone">Phone test</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Card className="gap-0 p-5">
            <div className="max-h-[420px] space-y-3 overflow-y-auto">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex", m.from === "you" ? "justify-end" : "justify-start")}
                >
                  <p
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                      m.from === "you" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
              {thinking ? <p className="text-sm text-muted-foreground">AI is typing…</p> : null}
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                value={draft}
                placeholder="Write something a customer might say…"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <Button onClick={send}>
                <Send /> Send
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card className="items-center gap-3 p-10 text-center">
            <button
              onClick={() => {
                setListening((l) => !l);
                toast(listening ? "Stopped listening" : "Listening…");
              }}
              className={cn(
                "flex size-24 items-center justify-center rounded-full transition-colors",
                listening ? "bg-destructive text-white" : "bg-primary text-primary-foreground",
              )}
            >
              <Mic className="size-9" />
            </button>
            <p className="font-medium">
              {listening ? "Listening — speak now" : "Tap to speak to your AI"}
            </p>
            <p className="text-sm text-muted-foreground">
              You'll hear the reply in the voice your AI uses on calls.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="phone">
          <Card className="gap-0 p-5">
            <Label className="mb-1.5 block">Your phone number</Label>
            <Input placeholder="+1 202 555 0111" className="max-w-sm" />
            <p className="mt-2 text-sm text-muted-foreground">
              Your AI will call this number so you can hear a real conversation.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Button onClick={() => toast.success("Calling you now")}>
                <PhoneCall /> Call me
              </Button>
              <Pill tone="info">Uses one of your connected numbers</Pill>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
