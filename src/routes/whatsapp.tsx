import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { submitCivicReport } from "@/lib/civic/server";

export const Route = createFileRoute("/whatsapp")({ component: WhatsAppPage });

type Bubble = { from: "citizen" | "bridge"; text: string };

export function WhatsAppPage() {
  const { user, isPending } = useCurrentUserState();
  const [draft, setDraft] = useState("Handpump broken beside Ward 4 school, no water.");
  const [busy, setBusy] = useState(false);
  const [thread, setThread] = useState<Bubble[]>([
    {
      from: "bridge",
      text: "Namaste. Send a civic problem in your own words. Voice notes will use the same pipeline once Twilio is connected.",
    },
  ]);

  if (isPending) {
    return (
      <Page>
        <div className="h-64 animate-pulse rounded-xl bg-border/60" />
      </Page>
    );
  }
  if (!user) return <RedirectToSignIn />;

  async function send() {
    const text = draft.trim();
    if (!text) return;
    setBusy(true);
    setThread((t) => [...t, { from: "citizen", text }]);
    setDraft("");
    try {
      const out = await submitCivicReport({
        data: { text, locality: "Ward 4", district: "Ranchi", source: "whatsapp" },
      });
      const reply =
        out.relationship === "same"
          ? `Received. This matches an existing master challenge: “${out.problem.title}” (${out.problem.report_count} reports). Status: ${out.problem.status}.`
          : `Received. New master challenge opened: “${out.problem.title}”. You can follow it on the public board.`;
      setThread((t) => [...t, { from: "bridge", text: reply }]);
    } catch (e) {
      setThread((t) => [
        ...t,
        {
          from: "bridge",
          text: e instanceof Error ? e.message : "Could not process that message.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page className="max-w-xl">
      <h1 className="font-display text-4xl text-ink">WhatsApp intake</h1>
      <p className="mt-2 text-sm text-muted">
        Production uses Twilio webhooks. This sandbox runs the same AI +
        dedup pipeline from a chat so you can demo it without keys. Point a
        Twilio WhatsApp sandbox at the deployed webhook when you are ready.
      </p>
      <div className="mt-6 flex min-h-[420px] flex-col rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-4 py-3 text-sm font-medium">
          CivicBridge · Jharkhand
        </div>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
          {thread.map((b, i) => (
            <div
              key={i}
              className={
                b.from === "citizen"
                  ? "ml-10 rounded-lg bg-primary px-3 py-2 text-sm text-primary-fg"
                  : "mr-10 rounded-lg bg-bg px-3 py-2 text-sm text-fg"
              }
            >
              {b.text}
            </div>
          ))}
        </div>
        <form
          className="flex gap-2 border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <input
            className="h-11 flex-1 rounded-md border border-border bg-bg px-3 text-sm"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a complaint…"
          />
          <Button type="submit" disabled={busy}>
            {busy ? "…" : "Send"}
          </Button>
        </form>
      </div>
    </Page>
  );
}
