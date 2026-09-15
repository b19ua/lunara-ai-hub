import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QrCode, RefreshCw, Unplug } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeader, Pill, StatusDot } from "@/components/lunara/primitives";
import { Inbox } from "@/components/lunara/inbox";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp — Lunara Box" },
      {
        name: "description",
        content:
          "Connect WhatsApp and let your AI employees answer customer messages and voice notes.",
      },
      { property: "og:title", content: "WhatsApp — Lunara Box" },
      {
        property: "og:description",
        content: "Let your AI answer WhatsApp messages and voice notes.",
      },
    ],
  }),
  component: WhatsAppPage,
});

function QrDialog() {
  const [state, setState] = useState<"waiting" | "connected">("waiting");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode /> Connect WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link your WhatsApp account</DialogTitle>
          <DialogDescription>Scan this code with the phone that owns the number.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="grid size-48 grid-cols-10 gap-0.5 rounded-lg bg-card p-2 ring-1 ring-border">
            {Array.from({ length: 100 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-[1px]",
                  (i * 5) % 3 === 0 ? "bg-foreground" : "bg-transparent",
                )}
              />
            ))}
          </div>
          <ol className="space-y-1 text-sm text-muted-foreground">
            <li>1. Open WhatsApp</li>
            <li>2. Go to Linked Devices</li>
            <li>3. Tap “Link a Device”</li>
            <li>4. Scan this QR code</li>
          </ol>
          <Pill tone={state === "waiting" ? "warning" : "success"}>
            <StatusDot state={state === "waiting" ? "warn" : "ok"} />
            {state === "waiting" ? "Waiting for scan" : "Connected"}
          </Pill>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast("New code generated")}>
              <RefreshCw /> New code
            </Button>
            <Button
              onClick={() => {
                setState("connected");
                toast.success("WhatsApp connected");
              }}
            >
              I scanned it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WhatsAppPage() {
  const status = useQuery({ queryKey: ["wa", "status"], queryFn: api.whatsapp.status });

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="WhatsApp"
        description="Your AI replies to messages, documents and voice notes."
        actions={
          <>
            <QrDialog />
            <Button variant="outline" onClick={() => toast("WhatsApp disconnected")}>
              <Unplug /> Disconnect
            </Button>
          </>
        }
      />

      <Card className="mb-4 gap-0 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <StatusDot state={status.data?.connected ? "ok" : "error"} />
          <div>
            <p className="text-sm font-medium">
              {status.data?.connected ? "Connected" : "Not connected"}
            </p>
            <p className="text-xs text-muted-foreground">
              {status.data?.account ?? "Scan the QR code to link your account"}
            </p>
          </div>
        </div>
        <Pill tone="neutral">Linked since {status.data?.since ?? "—"}</Pill>
      </Card>

      <Inbox channel="whatsapp" showChannelFilter={false} />
    </div>
  );
}
