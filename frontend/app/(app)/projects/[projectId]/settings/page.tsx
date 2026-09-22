"use client";

import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api-client";
import {
  useAddProjectMember,
  useProject,
  useProjectMembers,
  useRemoveProjectMember,
  useUpdateProject,
} from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";

export default function ProjectSettingsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);
  const { user } = useAuth();

  const { data: project } = useProject(projectId);
  const { data: members } = useProjectMembers(projectId);
  const { data: allUsers } = useUsers();
  const updateProject = useUpdateProject(projectId);
  const addMember = useAddProjectMember(projectId);
  const removeMember = useRemoveProjectMember(projectId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description ?? "");
    }
  }, [project]);

  const isAdmin = user?.role === "admin";
  const memberUserIds = new Set(members?.map((m) => m.user.id));
  const availableUsers = allUsers?.filter((u) => !memberUserIds.has(u.id)) ?? [];

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await updateProject.mutateAsync({ name, description });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update project");
    }
  }

  async function handleAddMember(event: FormEvent) {
    event.preventDefault();
    if (!selectedUserId) return;
    await addMember.mutateAsync(Number(selectedUserId));
    setSelectedUserId("");
  }

  if (!project) {
    return <p className="text-sm text-slate-400">Loading...</p>;
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Project Settings</h1>
        <p className="text-sm text-slate-500">{project.key}</p>
      </div>

      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Details</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isAdmin}
              className="rounded-md border border-border px-3 py-2 text-sm disabled:bg-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isAdmin}
              className="rounded-md border border-border px-3 py-2 text-sm disabled:bg-surface"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {isAdmin && (
            <div>
              <Button type="submit" disabled={updateProject.isPending}>
                {updateProject.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          )}
        </form>
      </section>

      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Members</h2>
        <div className="flex flex-col gap-2">
          {members?.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <Avatar user={member.user} />
                <span className="text-sm text-slate-800">{member.user.name}</span>
                <span className="text-xs text-slate-400">{member.user.email}</span>
              </div>
              {isAdmin && (
                <Button
                  variant="ghost"
                  onClick={() => removeMember.mutate(member.user.id)}
                  disabled={removeMember.isPending}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <form onSubmit={handleAddMember} className="mt-4 flex gap-2">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="">Select a user to add...</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <Button type="submit" disabled={!selectedUserId || addMember.isPending}>
              Add
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
