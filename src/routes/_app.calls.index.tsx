import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download, PhoneIncoming, PhoneOutgoing, Search } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import {
  EmptyState,
  LoadingBlock,
  PageHeader,
  Pill,
  formatDuration,
  sentimentTone,
} from "@/components/lunara/primitives";
import { api } from "@/services/api";
import type { CallStatus } from "@/services/types";

export const Route = createFileRoute("/_app/calls/")({
  validateSearch: (s: Record<string, unknown>) => ({
    direction: (s["direction"] as string) ?? "all",
  }),
  head: () => ({
    meta: [
      { title: "Calls — Lunara Box" },
      {
        name: "description",
        content: "Every inbound and outbound call with intent, outcome, transcript and recording.",
      },
      { property: "og:title", content: "Calls — Lunara Box" },
      {
        property: "og:description",
        content: "Every inbound and outbound call handled by your AI.",
      },
    ],
  }),
  component: CallsPage,
});

const statusTone: Record<CallStatus, "success" | "info" | "warning" | "danger" | "neutral"> = {
  ai_handled: "success",
  completed: "info",
  transferred: "warning",
  missed: "neutral",
  failed: "danger",
};
const statusLabel: Record<CallStatus, string> = {
  ai_handled: "AI handled",
  completed: "Completed",
  transferred: "Transferred",
  missed: "Missed",
  failed: "Failed",
};

const PAGE = 12;

function CallsPage() {
  const { direction } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["calls"], queryFn: api.calls.list });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return (data ?? []).filter((c) => {
      if (direction !== "all" && c.direction !== direction) return false;
      if (status !== "all" && c.status !== status) return false;
      if (
        query &&
        !`${c.contactName} ${c.phone} ${c.intent} ${c.employeeName}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [data, direction, status, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Calls"
        description="Every conversation your AI had on the phone."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Export started", {
                  description: "We'll notify you when the file is ready.",
                })
              }
            >
              <Download /> Export
            </Button>
            <Button asChild>
              <Link to="/calls/outbound">
                <PhoneOutgoing /> New outbound call
              </Link>
            </Button>
          </>
        }
      />

      <Card className="gap-0 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Tabs
            value={direction}
            onValueChange={(v) => {
              void navigate({ search: { direction: v } });
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="inbound">
                <PhoneIncoming className="size-3.5" /> Inbound
              </TabsTrigger>
              <TabsTrigger value="outbound">
                <PhoneOutgoing className="size-3.5" /> Outbound
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search caller, number, intent…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.entries(statusLabel).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          {isLoading ? <LoadingBlock /> : null}

          {!isLoading && rows.length === 0 ? (
            <EmptyState
              icon={<PhoneIncoming className="size-5" />}
              title="No calls match your filters"
              description="Try a different search term, status or direction."
            />
          ) : null}

          {rows.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Caller</TableHead>
                    <TableHead>AI Employee</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((c) => (
                    <TableRow key={c.id} className="cursor-pointer">
                      <TableCell className="whitespace-nowrap">
                        <Link to="/calls/$id" params={{ id: c.id }} className="block">
                          <span className="num text-sm">{c.date}</span>
                          <span className="num block text-xs text-muted-foreground">{c.time}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to="/calls/$id" params={{ id: c.id }} className="block">
                          <span className="font-medium">{c.contactName}</span>
                          <span className="num block text-xs text-muted-foreground">{c.phone}</span>
                        </Link>
                      </TableCell>
                      <TableCell>{c.employeeName}</TableCell>
                      <TableCell className="num">{formatDuration(c.durationSec)}</TableCell>
                      <TableCell>
                        <Pill tone={statusTone[c.status]}>{statusLabel[c.status]}</Pill>
                      </TableCell>
                      <TableCell className="text-sm">{c.intent}</TableCell>
                      <TableCell>
                        <Pill
                          tone={
                            c.lead === "qualified" || c.lead === "converted" ? "success" : "neutral"
                          }
                        >
                          {c.lead}
                        </Pill>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="flex items-center gap-2">
                          <Pill tone={sentimentTone(c.sentiment)}>{c.sentiment}</Pill>
                          {c.result}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </div>

        {pages > 1 ? (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(pages, 5) }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(pages, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </Card>
    </div>
  );
}
