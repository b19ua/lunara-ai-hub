import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Megaphone, PhoneOutgoing } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { PageHeader, Pill } from "@/components/lunara/primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/_app/calls/outbound")({
  head: () => ({
    meta: [
      { title: "Outbound calling — Lunara Box" },
      {
        name: "description",
        content: "Place a single AI call or launch an outbound calling campaign.",
      },
      { property: "og:title", content: "Outbound calling — Lunara Box" },
      { property: "og:description", content: "Place a single AI call or launch a campaign." },
    ],
  }),
  component: Outbound,
});

function Outbound() {
  const employees = useQuery({ queryKey: ["agents"], queryFn: api.agents.list });
  const numbers = useQuery({ queryKey: ["numbers"], queryFn: api.phone.numbers });
  const [phone, setPhone] = useState("");
  const [employee, setEmployee] = useState<string>();
  const [purpose, setPurpose] = useState("Sales follow-up");
  const [from, setFrom] = useState<string>();

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        title="Outbound calling"
        description="Let an AI employee place calls for you — one at a time or as a campaign."
        actions={
          <Button asChild variant="outline">
            <Link to="/campaigns">
              <Megaphone /> Campaigns
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="gap-0 p-6">
          <h2 className="text-lg font-semibold">Single call</h2>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">
            Your AI employee dials the number and handles the conversation.
          </p>

          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Phone number</Label>
              <Input
                placeholder="+1 202 555 0100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1.5 block">AI employee</Label>
              <Select value={employee ?? ""} onValueChange={setEmployee}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.data?.map((e) => (
                    <SelectItem key={e.id} value={e.name}>
                      {e.name} · {e.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Call from</Label>
              <Select value={from ?? ""} onValueChange={setFrom}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a number" />
                </SelectTrigger>
                <SelectContent>
                  {numbers.data?.map((n) => (
                    <SelectItem key={n.id} value={n.number}>
                      {n.number} · {n.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Purpose</Label>
              <Input value={purpose ?? ""} onChange={(e) => setPurpose(e.target.value)} />
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full" disabled={!phone || !employee}>
                  <PhoneOutgoing /> Start call
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Place this call now?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {employee} will call {phone} from {from ?? "your main number"} about “{purpose}
                    ”.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await api.calls.place(phone, employee as string);
                      toast.success("Calling…", {
                        description: `${employee} is dialling ${phone}`,
                      });
                    }}
                  >
                    Start call
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>

        <Card className="gap-0 p-6">
          <h2 className="text-lg font-semibold">Call campaign</h2>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">
            Upload a contact list and let your AI work through it within your calling hours.
          </p>
          <ul className="space-y-2 text-sm">
            {[
              "Upload CSV or XLSX contacts",
              "Automatic number validation",
              "Calling hours and retry rules",
              "Live progress and outcomes",
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5"
              >
                {f}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6">
            <Link to="/campaigns">
              <Megaphone /> Create campaign
            </Link>
          </Button>
          <div className="mt-6 rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
            <Pill tone="warning" className="mb-2">
              Before you dial
            </Pill>
            Make sure you have permission to call these contacts and that your calling hours respect
            local rules.
          </div>
        </Card>
      </div>
    </div>
  );
}
