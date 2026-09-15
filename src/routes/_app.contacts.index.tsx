import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download, Search, UserPlus } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { Avatar, EmptyState, LoadingBlock, PageHeader, Pill } from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/contacts/")({
  head: () => ({
    meta: [
      { title: "Contacts — Lunara Box" },
      {
        name: "description",
        content: "Your full customer directory with lead status, source and history.",
      },
      { property: "og:title", content: "Contacts — Lunara Box" },
      { property: "og:description", content: "Your full customer directory and history." },
    ],
  }),
  component: Contacts,
});

const PAGE = 15;

function Contacts() {
  const { data, isLoading } = useQuery({ queryKey: ["contacts"], queryFn: api.contacts.list });
  const [q, setQ] = useState("");
  const [lead, setLead] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      (data ?? []).filter((c) => {
        if (lead !== "all" && c.lead !== lead) return false;
        if (
          q &&
          !`${c.name} ${c.company} ${c.email} ${c.phone}`.toLowerCase().includes(q.toLowerCase())
        )
          return false;
        return true;
      }),
    [data, q, lead],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Contacts"
        description={`${data?.length ?? 0} people your AI has spoken with.`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Export started")}>
              <Download /> Export
            </Button>
            <Button onClick={() => toast("Contact form opened")}>
              <UserPlus /> Add contact
            </Button>
          </>
        }
      />

      <Card className="gap-0 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search name, company, email or number"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={lead}
            onValueChange={(v) => {
              setLead(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All lead statuses</SelectItem>
              {["new", "qualified", "converted", "lost", "none"].map((l) => (
                <SelectItem key={l} value={l} className="capitalize">
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          {isLoading ? <LoadingBlock /> : null}
          {!isLoading && !rows.length ? (
            <EmptyState
              title="No contacts found"
              description="Try a different search or lead filter."
            />
          ) : null}
          {rows.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Last contact</TableHead>
                    <TableHead>AI employee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <Link
                          to="/contacts/$id"
                          params={{ id: c.id }}
                          className="flex items-center gap-3"
                        >
                          <Avatar name={c.name} hue={220 + ((c.name.length * 9) % 120)} size={32} />
                          <span>
                            <span className="block font-medium">{c.name}</span>
                            <span className="block text-xs text-muted-foreground">{c.email}</span>
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>{c.company}</TableCell>
                      <TableCell className="num text-sm">{c.phone}</TableCell>
                      <TableCell>
                        <Pill
                          tone={
                            c.lead === "qualified" || c.lead === "converted"
                              ? "success"
                              : c.lead === "lost"
                                ? "danger"
                                : "neutral"
                          }
                        >
                          {c.lead}
                        </Pill>
                      </TableCell>
                      <TableCell className="text-sm">{c.source}</TableCell>
                      <TableCell className="num text-sm">{c.lastContact}</TableCell>
                      <TableCell className="text-sm">{c.employeeName}</TableCell>
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
