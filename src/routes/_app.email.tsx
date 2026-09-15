import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, Plug } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { PageHeader, Pill, StatusDot } from "@/components/lunara/primitives";
import { Inbox } from "@/components/lunara/inbox";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/email")({
  head: () => ({
    meta: [
      { title: "Email — Lunara Box" },
      {
        name: "description",
        content: "Connect Gmail and let your AI read, summarise and answer customer email.",
      },
      { property: "og:title", content: "Email — Lunara Box" },
      {
        property: "og:description",
        content: "Let your AI read, summarise and answer customer email.",
      },
    ],
  }),
  component: EmailPage,
});

const abilities = [
  "Read incoming messages",
  "Draft responses",
  "Send responses",
  "Summarise long threads",
  "Create CRM records",
  "Create tasks",
  "Extract contacts",
  "Extract leads",
];

function EmailPage() {
  const status = useQuery({ queryKey: ["email", "status"], queryFn: api.email.status });

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="Email"
        description="Gmail conversations handled by your AI employees."
        actions={
          <Button variant="outline" onClick={() => toast.success("Gmail reconnected")}>
            <Plug /> Reconnect Gmail
          </Button>
        }
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <Card className="gap-0 p-4 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Mail className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{status.data?.provider} connected</p>
              <p className="text-xs text-muted-foreground">{status.data?.account}</p>
            </div>
            <StatusDot state="ok" className="ml-auto" />
          </div>
        </Card>
        <Card className="gap-0 p-4 lg:col-span-2">
          <p className="mb-3 text-sm font-medium">What your AI may do with email</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {abilities.map((a, i) => (
              <label
                key={a}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                {a} <Switch defaultChecked={i < 6} />
              </label>
            ))}
          </div>
        </Card>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["Inbox", "Sent", "Follow-up", "AI handled", "Needs human"].map((f, i) => (
          <Pill key={f} tone={i === 0 ? "info" : "neutral"}>
            {f}
          </Pill>
        ))}
      </div>

      <Inbox channel="email" showChannelFilter={false} />
    </div>
  );
}
