import { useEffect, useState } from "react";
import { getMyProfile, setMyRole, type ProfileRow } from "@/lib/civic/server";
import { Button } from "@/components/ui/button";

const ROLES = [
  { id: "citizen", label: "Citizen" },
  { id: "officer", label: "Officer" },
  { id: "university", label: "University" },
  { id: "admin", label: "Admin" },
] as const;

export function RoleSwitcher({
  needed,
  onReady,
}: {
  needed: "officer" | "university" | "admin";
  onReady?: (profile: ProfileRow) => void;
}) {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getMyProfile()
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        if (p) onReady?.(p);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load profile.");
      });
    return () => {
      cancelled = true;
    };
    // Load once per workspace; parent onReady is used only for the first paint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needed]);

  async function adopt() {
    setBusy(true);
    setError(null);
    try {
      await setMyRole({ data: { role: needed } });
      const next = await getMyProfile();
      setProfile(next);
      if (next) onReady?.(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not switch workspace.");
    } finally {
      setBusy(false);
    }
  }

  if (!profile) {
    return <p className="text-sm text-muted">{error ?? "Loading workspace…"}</p>;
  }

  if (profile.role === needed || profile.role === "admin") {
    return (
      <p className="text-sm text-muted">
        Signed in as {ROLES.find((r) => r.id === profile.role)?.label}.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-sm text-fg">
        This workspace is for {needed}s. Your current role is {profile.role}.
      </p>
      <Button className="mt-3" size="sm" disabled={busy} onClick={() => void adopt()}>
        {busy ? "Switching…" : `Enter as ${needed}`}
      </Button>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
