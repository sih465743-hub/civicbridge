import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const links = [
  { to: "/report", label: "Report" },
  { to: "/problems", label: "Problems" },
  { to: "/whatsapp", label: "WhatsApp" },
  { to: "/my-reports", label: "My reports" },
  { to: "/officer", label: "Officer" },
  { to: "/university", label: "University" },
  { to: "/admin", label: "Admin" },
  { to: "/about", label: "About" },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, isPending } = useCurrentUserState();

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-sm bg-primary text-sm font-semibold text-primary-fg">
              C
            </span>
            <span className="font-display text-lg text-ink">CivicBridge</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-sm px-2 py-1.5 text-sm text-muted hover:bg-surface hover:text-fg"
                activeProps={{ className: "bg-surface text-fg" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="h-8 w-24 animate-pulse rounded-full bg-border" />
            ) : user ? (
              <SignedIn>
                <div className="hidden sm:block">
                  <UserButton />
                </div>
              </SignedIn>
            ) : (
              <SignedOut>
                <Link
                  to="/login"
                  className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
              </SignedOut>
            )}
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-md border border-border bg-surface lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-border bg-surface px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-sm px-2 py-2.5 text-sm"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>CivicBridge — The Favicons · SIH 26043 · Government of Jharkhand</p>
          <p>AI understands. People act.</p>
        </div>
      </footer>
    </div>
  );
}

export function Page({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto max-w-6xl px-4 py-10", className)}>{children}</div>;
}
