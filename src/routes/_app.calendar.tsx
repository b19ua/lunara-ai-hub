import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Plug } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pill,
  StatusDot,
} from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Lunara Box" },
      {
        name: "description",
        content: "Appointments your AI booked, synced with Google, Microsoft or your CRM calendar.",
      },
      { property: "og:title", content: "Calendar — Lunara Box" },
      { property: "og:description", content: "Appointments booked by your AI employees." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: api.calendar.appointments,
  });

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title="Calendar"
        description="Your AI books appointments directly into these calendars."
        actions={
          <Button variant="outline" onClick={() => toast.success("Calendar connected")}>
            <Plug /> Connect calendar
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[
          ["Google Calendar", true],
          ["Microsoft Calendar", false],
          ["CRM calendar", true],
        ].map(([n, c]) => (
          <Card key={n as string} className="gap-0 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{n}</p>
              <StatusDot state={c ? "ok" : "idle"} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {c ? "Connected" : "Not connected"}
            </p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="today">
        <TabsList className="mb-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {["today", "week", "month"].map((v) => (
          <TabsContent key={v} value={v}>
            <Card className="gap-0 p-5">
              {isLoading ? <LoadingBlock /> : null}
              {!isLoading && !data?.length ? (
                <EmptyState
                  icon={<CalendarDays className="size-5" />}
                  title="No appointments"
                  description="Appointments booked by your AI will show up here."
                />
              ) : null}
              <ul className="divide-y divide-border">
                {data?.slice(0, v === "today" ? 4 : v === "week" ? 9 : 14).map((a) => (
                  <li key={a.id} className="flex flex-wrap items-center gap-3 py-3">
                    <span className="num w-44 text-sm text-muted-foreground">{a.start}</span>
                    <span className="font-medium">{a.title}</span>
                    <span className="text-sm text-muted-foreground">{a.contactName}</span>
                    <Pill tone="info" className="ml-auto">
                      {a.employeeName}
                    </Pill>
                    <Pill>{a.durationMin} min</Pill>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="settings">
          <Card className="grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block">Working hours</Label>
              <Input defaultValue="09:00 – 18:00" />
            </div>
            <div>
              <Label className="mb-1.5 block">Available days</Label>
              <Input defaultValue="Monday – Friday" />
            </div>
            <div>
              <Label className="mb-1.5 block">Appointment duration</Label>
              <Input defaultValue="30 minutes" />
            </div>
            <div>
              <Label className="mb-1.5 block">Buffer between meetings</Label>
              <Input defaultValue="10 minutes" />
            </div>
            <div>
              <Label className="mb-1.5 block">Time zone</Label>
              <Input defaultValue="Europe/Chisinau (UTC+3)" />
            </div>
            <div className="flex items-end">
              <Button onClick={() => toast.success("Calendar settings saved")}>Save</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
