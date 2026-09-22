"use client";

import { useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        {user && (
          <>
            <Avatar user={user} size="sm" />
            <span className="text-sm font-medium text-slate-700">{user.name}</span>
            <span className="rounded-full bg-surface px-2 py-0.5 text-xs capitalize text-slate-500">
              {user.role}
            </span>
          </>
        )}
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
