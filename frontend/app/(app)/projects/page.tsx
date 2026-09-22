"use client";

import { useState } from "react";

import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { useProjects } from "@/hooks/useProjects";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">All projects you're a member of</p>
        </div>
        {user?.role === "admin" && <Button onClick={() => setShowCreate(true)}>New Project</Button>}
      </div>

      {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
      {!isLoading && projects?.length === 0 && (
        <p className="text-sm text-slate-400">No projects yet.</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {showCreate && <CreateProjectDialog onClose={() => setShowCreate(false)} />}
    </div>
  );
}
