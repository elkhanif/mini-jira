"use client";

import { FormEvent, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api-client";
import { useCreateUser, useUsers } from "@/hooks/useUsers";
import { UserRole } from "@/lib/types";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("member");
  const [error, setError] = useState<string | null>(null);

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Signed in as {user?.name} ({user?.role}).</p>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createUser.mutateAsync({ name, email, password, role });
      setName("");
      setEmail("");
      setPassword("");
      setRole("member");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create user");
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage users (Admin only)</p>
      </div>

      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Users</h2>
        <div className="flex flex-col gap-2">
          {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
          {users?.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <Avatar user={u} />
                <span className="text-sm text-slate-800">{u.name}</span>
                <span className="text-xs text-slate-400">{u.email}</span>
              </div>
              <span className="rounded-full bg-surface px-2 py-0.5 text-xs capitalize text-slate-500">{u.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">New User</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="rounded-md border border-border px-3 py-2 text-sm"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? "Creating..." : "Create user"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
