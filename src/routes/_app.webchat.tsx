import { createFileRoute } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageHeader } from "@/components/lunara/primitives";
import { Inbox } from "@/components/lunara/inbox";

export const Route = createFileRoute("/_app/webchat")({
  head: () => ({
    meta: [
      { title: "Web chat — Lunara Box" },
      { name: "description", content: "Website chat conversations answered by your AI employees." },
      { property: "og:title", content: "Web chat — Lunara Box" },
      { property: "og:description", content: "Website chat answered by your AI employees." },
    ],
  }),
  component: WebChat,
});

const snippet = `<script src="http://localhost:8080/widget.js" data-employee="anna"></script>`;

function WebChat() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="Web chat"
        description="Conversations coming from the chat widget on your website."
      />

      <Card className="mb-4 gap-0 p-4">
        <p className="text-sm font-medium">Add the chat widget to your website</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="num flex-1 overflow-x-auto rounded-lg bg-muted px-3 py-2 text-xs">
            {snippet}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(snippet);
              toast.success("Snippet copied");
            }}
          >
            <Copy /> Copy
          </Button>
        </div>
      </Card>

      <Inbox channel="web" showChannelFilter={false} />
    </div>
  );
}
