import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingCards, PageHeader, StatCard } from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Lunara Box" },
      {
        name: "description",
        content:
          "Call volume, AI resolution rate, response times, leads, appointments and conversions.",
      },
      { property: "og:title", content: "Analytics — Lunara Box" },
      {
        property: "og:description",
        content: "Call volume, AI resolution rate, leads and conversions.",
      },
    ],
  }),
  component: Analytics,
});

const ranges = ["Today", "7 days", "30 days", "90 days", "Custom"];

function Analytics() {
  const { data, isLoading } = useQuery({ queryKey: ["analytics"], queryFn: api.analytics.series });
  const [range, setRange] = useState("30 days");

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Analytics"
        description="How your AI communication center is performing."
        actions={
          <div className="flex flex-wrap gap-1.5">
            {ranges.map((r) => (
              <Button
                key={r}
                size="sm"
                variant={range === r ? "default" : "outline"}
                onClick={() => setRange(r)}
              >
                {r}
              </Button>
            ))}
          </div>
        }
      />

      {isLoading ? <LoadingCards /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total calls"
          value="3,184"
          hint="+8.4% vs previous period"
          rows={[
            { label: "Inbound", value: "1,946" },
            { label: "Outbound", value: "1,238" },
          ]}
        />
        <StatCard
          label="AI resolution rate"
          value="91%"
          tone="accent"
          hint="Handled without a human"
          rows={[
            { label: "Human handoff", value: "9%" },
            { label: "Avg duration", value: "3m 41s" },
          ]}
        />
        <StatCard
          label="Leads generated"
          value="642"
          hint="Across all channels"
          rows={[
            { label: "Qualified", value: "381" },
            { label: "Conversion", value: "18.2%" },
          ]}
        />
        <StatCard
          label="Avg response time"
          value="4.2s"
          tone="accent"
          hint="First reply on messages"
          rows={[
            { label: "WhatsApp", value: "3.1s" },
            { label: "Email", value: "48s" },
          ]}
        />
      </div>

      <Tabs defaultValue="calls" className="mt-6">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="calls">
          <Card className="gap-0 p-5">
            <h2 className="mb-4 font-semibold">Call volume</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inbound"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.18}
                  />
                  <Area
                    type="monotone"
                    dataKey="outbound"
                    stroke="var(--chart-2)"
                    fill="var(--chart-2)"
                    fillOpacity={0.18}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="gap-0 p-5">
            <h2 className="mb-4 font-semibold">Answered vs missed</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="answered" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="missed" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes">
          <Card className="gap-0 p-5">
            <h2 className="mb-4 font-semibold">Leads and appointments</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="appointments"
                    stroke="var(--chart-5)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Campaign calls" value="1,103" />
            <StatCard label="Answer rate" value="70%" tone="accent" />
            <StatCard label="Qualified rate" value="27%" />
            <StatCard label="Conversion" value="12%" tone="accent" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
