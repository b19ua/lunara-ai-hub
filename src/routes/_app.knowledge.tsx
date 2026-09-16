import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BookOpen, FileText, Trash2, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pill,
  StatusDot,
} from "@/components/lunara/primitives";
import { AskLunaraButton } from "@/components/lunara/assistant";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge — Lunara Box" },
      {
        name: "description",
        content:
          "Upload the documents your AI employees should know: FAQs, pricing, manuals and scripts.",
      },
      { property: "og:title", content: "Knowledge — Lunara Box" },
      {
        property: "og:description",
        content: "Upload the documents your AI employees should know.",
      },
    ],
  }),
  component: Knowledge,
});

function Knowledge() {
  const { data, isLoading } = useQuery({ queryKey: ["knowledge"], queryFn: api.knowledge.list });
  const [dragging, setDragging] = useState(false);

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="Knowledge"
        description="What should your AI employees know?"
        actions={<AskLunaraButton prompt="Organize my knowledge for my AI employees." />}
      />

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          toast.success("Upload started", { description: "We'll tell you when it's ready." });
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border p-12 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "hover:bg-muted/50",
        )}
      >
        <Upload className="size-7 text-primary" />
        <span className="font-medium">Drag documents here, or click to choose files</span>
        <span className="text-xs text-muted-foreground">
          PDF, DOCX, TXT, CSV, XLSX · up to 50 MB each
        </span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={() => toast.success("Upload started")}
        />
      </label>

      <Card className="mt-6 gap-0 p-5">
        <h2 className="font-semibold">Documents</h2>
        <div className="mt-4">
          {isLoading ? <LoadingBlock /> : null}
          {!isLoading && !data?.length ? (
            <EmptyState
              icon={<BookOpen className="size-5" />}
              title="No documents yet"
              description="Upload your FAQ, price list or product catalogue so your AI can answer accurately."
            />
          ) : null}
          {data?.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Used by</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="flex items-center gap-2 font-medium">
                        <FileText className="size-4 text-muted-foreground" /> {d.name}
                      </TableCell>
                      <TableCell className="num">{(d.sizeKb / 1024).toFixed(1)} MB</TableCell>
                      <TableCell>
                        <Pill
                          tone={
                            d.status === "ready"
                              ? "success"
                              : d.status === "processing"
                                ? "warning"
                                : "danger"
                          }
                        >
                          <StatusDot
                            state={
                              d.status === "ready"
                                ? "ok"
                                : d.status === "processing"
                                  ? "warn"
                                  : "error"
                            }
                          />
                          {d.status === "ready"
                            ? "Ready"
                            : d.status === "processing"
                              ? "Processing"
                              : "Could not be read"}
                        </Pill>
                      </TableCell>
                      <TableCell className="num text-sm">{d.uploaded}</TableCell>
                      <TableCell className="text-sm">{d.usedBy.join(", ") || "—"}</TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toast("Document removed")}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
