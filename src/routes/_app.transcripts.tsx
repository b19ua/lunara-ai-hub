import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download, FileText, Search } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { EmptyState, LoadingBlock, PageHeader, Pill } from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/transcripts")({
  head: () => ({
    meta: [
      { title: "Transcripts — Lunara Box" },
      {
        name: "description",
        content: "Search and download transcripts from every call and conversation.",
      },
      { property: "og:title", content: "Transcripts — Lunara Box" },
      { property: "og:description", content: "Search and download every conversation transcript." },
    ],
  }),
  component: Transcripts,
});

function Transcripts() {
  const { data, isLoading } = useQuery({ queryKey: ["calls"], queryFn: api.calls.list });
  const { data: employees } = useQuery({ queryKey: ["agents"], queryFn: api.agents.list });
  const [q, setQ] = useState("");
  const [employee, setEmployee] = useState("all");

  const rows = useMemo(
    () =>
      (data ?? []).filter((c) => {
        if (employee !== "all" && c.employeeName !== employee) return false;
        if (
          q &&
          !`${c.contactName} ${c.intent} ${c.summary}`.toLowerCase().includes(q.toLowerCase())
        )
          return false;
        return true;
      }),
    [data, q, employee],
  );

  return (
    <div className="mx-auto max-w-[1300px]">
      <PageHeader
        title="Transcripts"
        description="Every word your AI exchanged with a customer, searchable and exportable."
        actions={
          <Button variant="outline" onClick={() => toast.success("CSV export started")}>
            <Download /> Export CSV
          </Button>
        }
      />

      <Card className="gap-0 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search inside transcripts"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={employee} onValueChange={setEmployee}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All AI employees</SelectItem>
              {employees?.map((e) => (
                <SelectItem key={e.id} value={e.name}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          {isLoading ? <LoadingBlock /> : null}
          {!isLoading && !rows.length ? (
            <EmptyState
              icon={<FileText className="size-5" />}
              title="No transcripts found"
              description="Adjust your search or filters."
            />
          ) : null}
          {rows.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>AI employee</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 30).map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="num text-sm">
                        {c.date} {c.time}
                      </TableCell>
                      <TableCell className="font-medium">{c.contactName}</TableCell>
                      <TableCell>
                        <Pill tone="info">Phone</Pill>
                      </TableCell>
                      <TableCell className="text-sm">{c.employeeName}</TableCell>
                      <TableCell className="text-sm">{c.intent}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" asChild>
                            <Link to="/calls/$id" params={{ id: c.id }}>
                              View
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Download /> Download
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {["TXT", "PDF", "DOCX"].map((f) => (
                                <DropdownMenuItem
                                  key={f}
                                  onClick={() => toast.success(`${f} download started`)}
                                >
                                  Download {f}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
