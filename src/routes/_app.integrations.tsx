import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, CalendarDays, Mail, MessageCircle, Phone, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, Pill, StatusDot } from "@/components/lunara/primitives";

export const Route = createFileRoute("/_app/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — Lunara Box" },
      {
        name: "description",
        content:
          "Everything Lunara Box connects to: phone, WhatsApp, email, CRM, calendar and AI providers.",
      },
      { property: "og:title", content: "Integrations — Lunara Box" },
      { property: "og:description", content: "Everything Lunara Box connects to." },
    ],
  }),
  component: Integrations,
});

type Item = { name: string; desc: string; connected: boolean; icon: ReactNode; to: string };

const items: Item[] = [
  {
    name: "Phone system",
    desc: "Receive and place calls on your own numbers.",
    connected: true,
    icon: <Phone className="size-5" />,
    to: "/phone",
  },
  {
    name: "WhatsApp",
    desc: "Answer customer messages and voice notes.",
    connected: true,
    icon: <MessageCircle className="size-5" />,
    to: "/whatsapp",
  },
  {
    name: "Gmail",
    desc: "Read, draft and send customer email.",
    connected: true,
    icon: <Mail className="size-5" />,
    to: "/email",
  },
  {
    name: "CRM",
    desc: "Push contacts, leads and activities automatically.",
    connected: true,
    icon: <Building2 className="size-5" />,
    to: "/crm",
  },
  {
    name: "Calendar",
    desc: "Let your AI book appointments for you.",
    connected: true,
    icon: <CalendarDays className="size-5" />,
    to: "/calendar",
  },
  {
    name: "Realtime AI providers",
    desc: "Use a cloud AI model instead of the local one.",
    connected: false,
    icon: <Sparkles className="size-5" />,
    to: "/employees",
  },
];

function Integrations() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="Integrations"
        description="Everything your AI employees are plugged into."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((i) => (
          <Card key={i.name} className="gap-0 p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {i.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{i.name}</p>
                  {i.connected ? (
                    <Pill tone="success">
                      <StatusDot state="ok" /> Connected
                    </Pill>
                  ) : (
                    <Pill tone="neutral">Optional</Pill>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{i.desc}</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-fit">
              <Link to={i.to}>{i.connected ? "Manage" : "Set up"}</Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
