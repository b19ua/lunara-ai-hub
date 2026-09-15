import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Mail, MessageSquare, PhoneCall, StickyNote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Avatar,
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pill,
  formatDuration,
} from "@/components/lunara/primitives";
import { api } from "@/services/api";
import { calls, conversations, appointments } from "@/services/mock-data";

export const Route = createFileRoute("/_app/contacts/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Contact ${params.id} — Lunara Box` },
      {
        name: "description",
        content: "Full customer profile: calls, messages, emails, appointments and AI summaries.",
      },
      { property: "og:title", content: "Contact — Lunara Box" },
      { property: "og:description", content: "Full customer profile and conversation history." },
    ],
  }),
  component: ContactDetail,
});

function ContactDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["contact", id],
    queryFn: () => api.contacts.get(id),
  });

  if (isLoading) return <LoadingBlock rows={5} />;
  if (!data) {
    return (
      <EmptyState
        title="Contact not found"
        description="This contact may have been removed."
        action={
          <Button asChild>
            <Link to="/contacts">Back to contacts</Link>
          </Button>
        }
      />
    );
  }

  const theirCalls = calls.filter((c) => c.contactName === data.name).slice(0, 6);
  const theirChats = conversations.filter((c) => c.contactName === data.name).slice(0, 5);
  const theirAppts = appointments.filter((a) => a.contactName === data.name);

  return (
    <div className="mx-auto max-w-[1200px]">
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/contacts">
          <ArrowLeft /> Contacts
        </Link>
      </Button>

      <PageHeader
        title={data.name}
        description={`${data.company} · ${data.email} · ${data.phone}`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast("Calling…")}>
              <PhoneCall /> Call
            </Button>
            <Button variant="outline" onClick={() => toast("Message composer opened")}>
              <MessageSquare /> Message
            </Button>
            <Button onClick={() => toast.success("Synced to CRM")}>Sync to CRM</Button>
          </>
        }
      >
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Avatar name={data.name} hue={250} size={32} />
          <Pill tone={data.lead === "qualified" ? "success" : "neutral"}>{data.lead} lead</Pill>
          {data.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
          <Pill tone="info">Assigned to {data.employeeName}</Pill>
        </div>
      </PageHeader>

      <Tabs defaultValue="timeline">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card className="gap-0 p-5">
            <ul className="space-y-4">
              {[
                {
                  icon: <PhoneCall className="size-4" />,
                  t: "Inbound call · 4m 12s",
                  d: "AI qualified the lead and booked a demo",
                  at: "Sep 14, 2026",
                },
                {
                  icon: <MessageSquare className="size-4" />,
                  t: "WhatsApp conversation",
                  d: "Customer asked about delivery times",
                  at: "Sep 12, 2026",
                },
                {
                  icon: <Mail className="size-4" />,
                  t: "Email reply sent by AI",
                  d: "Pricing sheet attached",
                  at: "Sep 10, 2026",
                },
                {
                  icon: <CalendarDays className="size-4" />,
                  t: "Appointment booked",
                  d: "Product demo · Tue 10:00",
                  at: "Sep 9, 2026",
                },
              ].map((e) => (
                <li key={e.t} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {e.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{e.t}</p>
                    <p className="text-sm text-muted-foreground">{e.d}</p>
                    <p className="num text-xs text-muted-foreground">{e.at}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="calls">
          <Card className="gap-0 p-5">
            {theirCalls.length ? (
              <ul className="divide-y divide-border">
                {theirCalls.map((c) => (
                  <li key={c.id}>
                    <Link
                      to="/calls/$id"
                      params={{ id: c.id }}
                      className="flex items-center justify-between py-3 text-sm hover:text-primary"
                    >
                      <span>
                        {c.date} {c.time} · {c.intent}
                      </span>
                      <span className="num text-muted-foreground">
                        {formatDuration(c.durationSec)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No calls yet"
                description="Calls with this contact will appear here."
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="gap-0 p-5">
            {theirChats.length ? (
              <ul className="divide-y divide-border">
                {theirChats.map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                    <span>
                      {c.channel} · {c.lastMessage}
                    </span>
                    <span className="text-muted-foreground">{c.lastActivity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No messages yet"
                description="WhatsApp, email and chat threads appear here."
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="gap-0 p-5">
            {theirAppts.length ? (
              <ul className="divide-y divide-border">
                {theirAppts.map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                    <span>{a.title}</span>
                    <span className="num text-muted-foreground">{a.start}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No appointments"
                description="Meetings booked by your AI will appear here."
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="gap-0 p-5">
            <Textarea rows={6} placeholder="Add a note about this customer…" />
            <Button className="mt-3 w-fit" onClick={() => toast.success("Note saved")}>
              <StickyNote /> Save note
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
