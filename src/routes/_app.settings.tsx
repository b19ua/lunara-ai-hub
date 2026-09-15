import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DatabaseBackup, Download, ShieldCheck, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PageHeader, Pill, StatusDot } from "@/components/lunara/primitives";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Lunara Box" },
      {
        name: "description",
        content:
          "General, security, users, notifications, backup and update settings for your Lunara Box.",
      },
      { property: "og:title", content: "Settings — Lunara Box" },
      { property: "og:description", content: "Manage your Lunara Box settings." },
    ],
  }),
  component: Settings,
});

const users = [
  ["Alex Moraru", "alex@company.example", "Admin"],
  ["Diana Petrov", "diana@company.example", "Manager"],
  ["Ion Ciobanu", "ion@company.example", "Operator"],
  ["Maria Lupu", "maria@company.example", "Viewer"],
];

const notifications = [
  "Call completed",
  "Lead created",
  "Human handoff requested",
  "Campaign completed",
  "System failure",
  "WhatsApp disconnected",
  "CRM disconnected",
];

const backupContents = [
  "AI employees",
  "Settings",
  "Knowledge documents",
  "Contacts",
  "Conversations",
  "CRM configuration",
  "Call metadata",
  "Transcripts",
];

function Settings() {
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);

  function update() {
    setUpdating(true);
    let p = 0;
    const t = setInterval(() => {
      p += 14;
      setProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(t);
        setUpdating(false);
        toast.success("Updated to v1.0.4");
      }
    }, 300);
  }

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="Settings"
        description="Configure your Lunara Box once — it keeps running on its own."
      />

      <Tabs defaultValue="general" orientation="vertical" className="gap-6 lg:flex-row">
        <TabsList className="h-auto w-full flex-wrap justify-start lg:w-52 lg:flex-col lg:items-stretch">
          {["general", "security", "users", "notifications", "backup", "updates", "advanced"].map(
            (t) => (
              <TabsTrigger key={t} value={t} className="capitalize lg:justify-start">
                {t}
              </TabsTrigger>
            ),
          )}
        </TabsList>

        <div className="flex-1">
          <TabsContent value="general">
            <Card className="grid gap-4 p-5 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block">Company name</Label>
                <Input defaultValue="Lunara Demo Company" />
              </div>
              <div>
                <Label className="mb-1.5 block">Contact email</Label>
                <Input defaultValue="owner@company.example" />
              </div>
              <div>
                <Label className="mb-1.5 block">Interface language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        ["en", "English"],
                        ["ru", "Russian"],
                        ["ro", "Romanian"],
                        ["uk", "Ukrainian"],
                        ["de", "German"],
                        ["fr", "French"],
                        ["es", "Spanish"],
                      ] as const
                    ).map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Time zone</Label>
                <Input defaultValue="Europe/Chisinau (UTC+3)" />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="gap-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block">Change password</Label>
                  <Input type="password" placeholder="New password" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Session timeout</Label>
                  <Input defaultValue="30 minutes" />
                </div>
              </div>
              {[
                ["Restrict access to the local network", true],
                ["Use HTTPS for the interface", true],
                ["Keep an audit log of every action", true],
              ].map(([l, d]) => (
                <label
                  key={l as string}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
                >
                  {l} <Switch defaultChecked={d as boolean} />
                </label>
              ))}
              <div className="rounded-lg border border-border p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4 text-success" /> Stored API keys
                </p>
                <ul className="num mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>OpenAI · sk-••••••••••••4f2a</li>
                  <li>Google · AIza••••••••••9dc1</li>
                </ul>
              </div>
              <Button className="w-fit" onClick={() => toast.success("Security settings saved")}>
                Save
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="gap-0 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Team</h2>
                <Button size="sm" onClick={() => toast("Invite sent")}>
                  Invite user
                </Button>
              </div>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(([n, e, r]) => (
                    <TableRow key={e}>
                      <TableCell className="font-medium">{n}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e}</TableCell>
                      <TableCell>
                        <Pill tone={r === "Admin" ? "accent" : "neutral"}>{r}</Pill>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="gap-2 p-5">
              {notifications.map((n, i) => (
                <label
                  key={n}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
                >
                  {n} <Switch defaultChecked={i !== 0} />
                </label>
              ))}
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card className="gap-0 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Backup &amp; restore</h2>
                  <p className="text-sm text-muted-foreground">
                    Last backup: Sep 14, 2026 03:00 · 1.8 GB · Completed
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toast.success("Restore started")}>
                    <Upload /> Restore
                  </Button>
                  <Button onClick={() => toast.success("Backup started")}>
                    <DatabaseBackup /> Back up now
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium">What gets saved</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {backupContents.map((b) => (
                  <Pill key={b}>{b}</Pill>
                ))}
              </div>
              <label className="mt-4 flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm">
                Automatic nightly backup <Switch defaultChecked />
              </label>
            </Card>
          </TabsContent>

          <TabsContent value="updates">
            <Card className="gap-0 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <StatusDot state="warn" />
                  <div>
                    <p className="font-medium">Update available</p>
                    <p className="num text-sm text-muted-foreground">
                      Current v1.0.3 → latest v1.0.4
                    </p>
                  </div>
                </div>
                <Button onClick={update} disabled={updating}>
                  <Download /> {updating ? "Updating…" : "Install update"}
                </Button>
              </div>
              {updating ? <Progress value={progress} className="mt-4" /> : null}
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card className="gap-4 p-5">
              <p className="text-sm text-muted-foreground">
                These options are for technical users. You don't need them for normal use.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block">API base URL</Label>
                  <Input defaultValue="/api" className="num" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Local AI endpoint</Label>
                  <Input defaultValue="http://127.0.0.1:11434" className="num" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Telephony host</Label>
                  <Input defaultValue="asterisk:5038" className="num" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Database host</Label>
                  <Input defaultValue="postgres:5432" className="num" />
                </div>
              </div>
              <label className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm">
                Verbose diagnostic logs <Switch />
              </label>
              <Button
                className="w-fit"
                variant="outline"
                onClick={() => toast.success("Advanced settings saved")}
              >
                Save
              </Button>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
