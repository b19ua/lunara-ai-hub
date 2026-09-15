import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, Check, Plug } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LoadingCards, PageHeader, Pill, StatusDot } from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/crm")({
  head: () => ({
    meta: [
      { title: "CRM — Lunara Box" },
      {
        name: "description",
        content:
          "Connect HubSpot, Salesforce, Bitrix24 or FreeScout and map your data automatically.",
      },
      { property: "og:title", content: "CRM — Lunara Box" },
      { property: "og:description", content: "Connect your CRM and map data automatically." },
    ],
  }),
  component: Crm,
});

const mappings = [
  ["Lunara contact", "CRM contact"],
  ["Lunara lead", "CRM lead"],
  ["Lunara company", "CRM company"],
  ["Call", "CRM activity"],
  ["WhatsApp conversation", "CRM activity"],
  ["Email", "CRM activity"],
  ["Appointment", "CRM meeting"],
];

const actions = [
  "Create contact",
  "Create lead",
  "Update contact",
  "Create deal",
  "Create task",
  "Create note",
  "Create activity",
  "Create appointment",
];

function Crm() {
  const { data, isLoading } = useQuery({ queryKey: ["crm"], queryFn: api.crm.integrations });

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title="CRM"
        description="Keep every call, message and appointment in the system your team already uses."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Primary CRM</span>
            <Select defaultValue="hubspot">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["hubspot", "salesforce", "bitrix24", "freescout"].map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {isLoading ? <LoadingCards /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((i) => (
          <Card key={i.id} className="gap-0 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-sm text-muted-foreground">{i.description}</p>
                </div>
              </div>
              {i.connected ? (
                <Pill tone="success">
                  <StatusDot state="ok" /> Connected
                </Pill>
              ) : (
                <Pill tone="neutral">Not connected</Pill>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="num text-xs text-muted-foreground">
                {i.records
                  ? `${i.records.toLocaleString()} records synced`
                  : i.kind === "webhook"
                    ? "Uses an inbound webhook"
                    : "Sign in to connect"}
              </span>
              <Button
                size="sm"
                variant={i.connected ? "outline" : "default"}
                onClick={() =>
                  toast.success(i.connected ? `${i.name} settings saved` : `${i.name} connected`)
                }
              >
                {i.connected ? (
                  "Configure"
                ) : (
                  <>
                    <Plug /> Connect
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="mapping" className="mt-6">
        <TabsList>
          <TabsTrigger value="mapping">Data mapping</TabsTrigger>
          <TabsTrigger value="actions">Allowed AI actions</TabsTrigger>
        </TabsList>

        <TabsContent value="mapping">
          <Card className="gap-0 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Data mapping</h2>
              <label className="flex items-center gap-2 text-sm">
                Automatic synchronisation <Switch defaultChecked />
              </label>
            </div>
            <ul className="mt-4 space-y-2">
              {mappings.map(([a, b]) => (
                <li
                  key={a}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm"
                >
                  <span>{a}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-right font-medium">{b}</span>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card className="gap-0 p-5">
            <h2 className="font-semibold">What your AI may create in the CRM</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {actions.map((a, i) => (
                <li
                  key={a}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Check className="size-4 text-success" /> {a}
                  </span>
                  <Switch defaultChecked={i < 6} />
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
