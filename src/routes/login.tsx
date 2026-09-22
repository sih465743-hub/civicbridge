import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Page } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

function grokHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host.endsWith(".grok-sandbox.com") || host.endsWith(".grok.com");
}

function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const showGrok = grokHost();

async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.trim().split("@")[0] || "Citizen",
          callbackURL: "/report",
        });
        if (err) throw new Error(err.message || "Could not create account");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/report",
        });
        if (err) throw new Error(err.message || "Could not sign in");
      }
      window.location.href = "/report";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setPending(false);
    }
  }

  return (
    <Page className="grid min-h-[70vh] place-items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-widest text-muted">CivicBridge</p>
          <CardTitle>{mode === "signup" ? "Create an account" : "Sign in to report and act"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted">
            Citizens submit reports. Officers update status. Universities claim problems. Your
            reports stay attached to your account.
          </p>

          {!authEnabled ? (
            <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted">
              Local demo mode is on. You are already signed in as Dev User. Remove
              VITE_AUTH_ENABLED=false from .env and restart to use real email accounts.
            </p>
          ) : (
            <form className="space-y-3" onSubmit={onSubmit}>
              {mode === "signup" ? (
                <div className="space-y-1">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
              ) : null}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
              </div>
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
              </Button>
              <button type="button" className="w-full text-sm text-muted underline" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(null); }}>
                {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
              </button>
            </form>
          )}

          {authEnabled && showGrok
            ? GROK_PROVIDERS.map((p) => (
                <button key={p.providerId} type="button" onClick={() => signIn(p.providerId, { callbackURL: "/report" })} className="h-11 w-full rounded-md border border-border bg-bg text-sm font-medium hover:bg-surface">
                  Continue with {p.label}
                </button>
              ))
            : null}

          <Link to="/" className="block pt-1 text-sm text-muted underline">Back to home</Link>
        </CardContent>
      </Card>
    </Page>
  );
}