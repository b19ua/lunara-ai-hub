import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/lunara/primitives";
import { Inbox } from "@/components/lunara/inbox";

export const Route = createFileRoute("/_app/conversations/")({
  head: () => ({
    meta: [
      { title: "Conversations — Lunara Box" },
      {
        name: "description",
        content: "One inbox for phone, WhatsApp, email, web chat and SMS conversations.",
      },
      { property: "og:title", content: "Conversations — Lunara Box" },
      { property: "og:description", content: "One inbox for every customer channel." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="Conversations"
        description="Every customer conversation, on every channel, in one place."
      />
      <Inbox />
    </div>
  ),
});
