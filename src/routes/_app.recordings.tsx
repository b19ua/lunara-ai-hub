import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download, Play, Search, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pill,
  formatDuration,
} from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/recordings")({
  head: () => ({
    meta: [
      { title: "Recordings — Lunara Box" },
      {
        name: "description",
        content: "Listen to, download or delete recordings of every AI-handled call.",
      },
      { property: "og:title", content: "Recordings — Lunara Box" },
      { property: "og:description", content: "Listen to and manage your call recordings." },
    ],
  }),
  component: Recordings,
});

function Recordings() {
  const { data, isLoading } = useQuery({ queryKey: ["calls"], queryFn: api.calls.list });
  const [q, setQ] = useState("");
  const [dir, setDir] = useState("all");

  const rows = useMemo(
    () =>
      (data ?? []).filter((c) => {
        if (dir !== "all" && c.direction !== dir) return false;
        if (q && !`${c.contactName} ${c.employeeName}`.toLowerCase().includes(q.toLowerCase()))
          return false;
        return true;
      }),
    [data, q, dir],
  );

  return (
    <div className="mx-auto max-w-[1300px]">
      <PageHeader
        title="Recordings"
        description="Audio of your AI conversations, stored on your own machine."
      />

      <Card className="gap-0 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by customer or AI employee"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={dir} onValueChange={setDir}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All directions</SelectItem>
              <SelectItem value="inbound">Inbound</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          {isLoading ? <LoadingBlock /> : null}
          {!isLoading && !rows.length ? (
            <EmptyState
              title="No recordings yet"
              description="Recordings appear here once your AI handles calls."
            />
          ) : null}
          {rows.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>AI employee</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 25).map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="num text-sm">
                        {c.date} {c.time}
                      </TableCell>
                      <TableCell className="font-medium">{c.contactName}</TableCell>
                      <TableCell className="text-sm">{c.employeeName}</TableCell>
                      <TableCell>
                        <Pill tone="neutral" className="capitalize">
                          {c.direction}
                        </Pill>
                      </TableCell>
                      <TableCell className="num">{formatDuration(c.durationSec)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toast("Playing recording")}
                          >
                            <Play />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toast.success("Download started")}
                          >
                            <Download />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <Trash2 />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this recording?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  The audio will be permanently removed. The transcript and summary
                                  stay available.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => toast.success("Recording deleted")}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
