"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

import { KanbanColumn } from "@/components/board/KanbanColumn";
import { useUpdateIssueStatus } from "@/hooks/useIssues";
import { Issue, IssueStatus, ISSUE_STATUSES } from "@/lib/types";

export function KanbanBoard({ projectId, issues }: { projectId: number; issues: Issue[] }) {
  const updateStatus = useUpdateIssueStatus(projectId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const issueId = Number(active.id);
    const newStatus = over.id as IssueStatus;
    const issue = issues.find((i) => i.id === issueId);

    if (issue && issue.status !== newStatus) {
      updateStatus.mutate({ issueId, status: newStatus });
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {ISSUE_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            issues={issues.filter((issue) => issue.status === status)}
          />
        ))}
      </div>
    </DndContext>
  );
}
