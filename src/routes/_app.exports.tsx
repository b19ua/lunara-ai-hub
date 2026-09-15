import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, PackageCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PageHeader, Pill } from "@/components/lunara/primitives";

export const Route = createFileRoute("/_app/exports")({
  head: () => ({
    meta: [
      { title: "Export center — Lunara Box" },
      {
        name: "description",
        content:
          "Export transcripts, conversations, contacts and calls as TXT, CSV, JSON, PDF or DOCX.",
      },
      { property: "og:title", content: "Export center — Lunara Box" },
      {
        property: "og:description",
        content: "Export your transcripts, conversations and contacts.",
      },
    ],
  }),
  component: Exports,
});

const datasets = [
  ["All phone transcripts", "68 calls"],
  ["All WhatsApp conversations", "42 threads"],
  ["All email conversations", "31 threads"],
  ["All web chat conversations", "18 threads"],
  ["Contacts", "124 people"],
  ["Calls with metadata", "68 records"],
  ["Campaign results", "3 campaigns"],
];

function Exports() {
  const [selected, setSelected] = useState<string[]>(["All phone transcripts"]);
  const [progress, setProgress] = useState<number | null>(null);

  function run() {
    if (!selected.length) {
      toast.error("Choose at least one dataset");
      return;
    }
    setProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += 12;
      setProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(t);
        toast.success("Export ready", { description: "Your download has started." });
        setTimeout(() => setProgress(null), 1200);
      }
    }, 260);
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <PageHeader
        title="Export center"
        description="Take your data with you at any time. Everything stays on your machine."
      />

      <Card className="gap-0 p-5">
        <h2 className="font-semibold">What do you want to export?</h2>
        <ul className="mt-4 space-y-2">
          {datasets.map(([name = "", hint]) => (
            <li key={name}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm">
                <Checkbox
                  checked={selected.includes(name)}
                  onCheckedChange={(v) =>
                    setSelected((s) => (v ? [...s, name] : s.filter((x) => x !== name)))
                  }
                />
                <span className="font-medium">{name}</span>
                <Pill className="ml-auto">{hint}</Pill>
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Select defaultValue="csv">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["txt", "csv", "json", "pdf", "docx"].map((f) => (
                <SelectItem key={f} value={f} className="uppercase">
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={run} disabled={progress !== null}>
            <Download /> Start export
          </Button>
          {progress !== null ? (
            <span className="num text-sm text-muted-foreground">Preparing… {progress}%</span>
          ) : null}
        </div>

        {progress !== null ? <Progress value={progress} className="mt-3" /> : null}
      </Card>

      <Card className="mt-4 gap-0 p-5">
        <h2 className="font-semibold">Recent exports</h2>
        <ul className="mt-3 divide-y divide-border text-sm">
          {[
            ["contacts-2026-09-14.csv", "1.2 MB"],
            ["transcripts-september.pdf", "18.4 MB"],
            ["whatsapp-threads.json", "4.1 MB"],
          ].map(([f, s]) => (
            <li key={f} className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2">
                <PackageCheck className="size-4 text-success" /> {f}
              </span>
              <span className="num text-muted-foreground">{s}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
