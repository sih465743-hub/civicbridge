import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/layout/shell";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <Page className="max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        The Favicons · SIH 26043
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink">About CivicBridge</h1>
      <p className="mt-4 text-muted">
        Civic complaints are usually fragmented. The same broken handpump may be
        reported seventeen times. Authorities see isolated messages. Universities
        never see the problem. CivicBridge treats a submission as an observation
        and constructs a reliable problem underneath it.
      </p>
      <h2 className="mt-10 font-display text-2xl">Product sentence</h2>
      <p className="mt-2 text-muted">
        Tell us what is wrong. We turn it into a problem the right people can act on.
      </p>
      <h2 className="mt-10 font-display text-2xl">Architecture sentence</h2>
      <p className="mt-2 text-muted">
        AI understands; PostgreSQL remembers; similarity search connects; geography
        locates; rules route; people act; messaging keeps citizens informed.
      </p>
      <h2 className="mt-10 font-display text-2xl">What this build includes</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
        <li>Web reporting and a WhatsApp-style intake using the same pipeline</li>
        <li>Grok structured extraction with a local heuristic fallback</li>
        <li>Report vs problem model with duplicate consolidation</li>
        <li>Public problem board that hides private citizen identity</li>
        <li>Officer, university and admin workspaces</li>
        <li>Signed-in “my reports” history</li>
      </ul>
      <h2 className="mt-10 font-display text-2xl">API keys later</h2>
      <p className="mt-2 text-sm text-muted">
        AI already uses the platform Grok key on the server. When you are ready
        for production WhatsApp, point a Twilio sandbox webhook at this app and
        drop in Twilio credentials on the host — no citizen-facing change required.
        There is no secret in the browser.
      </p>
      <p className="mt-8 text-sm text-subtle">Pratik and The Favicons.</p>
    </Page>
  );
}
