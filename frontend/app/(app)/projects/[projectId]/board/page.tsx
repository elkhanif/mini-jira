"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { KanbanBoard } from "@/components/board/KanbanBoard";
import { CreateIssueDialog } from "@/components/board/CreateIssueDialog";
import { Button } from "@/components/ui/Button";
import { useProject } from "@/hooks/useProjects";
import { useIssues } from "@/hooks/useIssues";

export default function ProjectBoardPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);

  const { data: project } = useProject(projectId);
  const { data: issues, isLoading } = useIssues(projectId);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {project ? `${project.key} — ${project.name}` : "Board"}
          </h1>
          <p className="text-sm text-slate-500">Drag cards between columns to update status</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${projectId}/settings`}>
            <Button variant="secondary">Settings</Button>
          </Link>
          <Button onClick={() => setShowCreate(true)}>New Issue</Button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
      {issues && <KanbanBoard projectId={projectId} issues={issues} />}

      {showCreate && <CreateIssueDialog projectId={projectId} onClose={() => setShowCreate(false)} />}
    </div>
  );
}
