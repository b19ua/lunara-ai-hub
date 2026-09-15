import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { calls, contacts, conversations, employees, knowledgeDocs } from "@/services/mock-data";
import { Bot, BookOpen, Contact2, MessageSquare, PhoneCall } from "lucide-react";

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const navigate = useNavigate();
  const go = (to: string) => {
    onOpenChange(false);
    void navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search contacts, calls, transcripts, messages…" />
      <CommandList>
        <CommandEmpty>Nothing matched your search.</CommandEmpty>

        <CommandGroup heading="AI Employees">
          {employees.map((e) => (
            <CommandItem
              key={e.id}
              value={`${e.name} ${e.role}`}
              onSelect={() => go(`/employees/${e.id}`)}
            >
              <Bot /> {e.name} · <span className="text-muted-foreground">{e.role}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Contacts">
          {contacts.slice(0, 8).map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.name} ${c.company} ${c.phone}`}
              onSelect={() => go(`/contacts/${c.id}`)}
            >
              <Contact2 /> {c.name} · <span className="text-muted-foreground">{c.company}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Calls & transcripts">
          {calls.slice(0, 6).map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.contactName} ${c.intent} ${c.phone}`}
              onSelect={() => go(`/calls/${c.id}`)}
            >
              <PhoneCall /> {c.contactName} ·{" "}
              <span className="text-muted-foreground">
                {c.intent} · {c.date}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Conversations">
          {conversations.slice(0, 5).map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.contactName} ${c.lastMessage}`}
              onSelect={() => go("/conversations")}
            >
              <MessageSquare /> {c.contactName} ·{" "}
              <span className="text-muted-foreground">{c.channel}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Knowledge">
          {knowledgeDocs.map((d) => (
            <CommandItem key={d.id} value={d.name} onSelect={() => go("/knowledge")}>
              <BookOpen /> {d.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
