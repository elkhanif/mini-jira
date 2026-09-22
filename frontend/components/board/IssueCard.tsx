"use client";

import { useDraggable } from "@dnd-kit/core";
import Link from "next/link";
import clsx from "clsx";

import { Avatar } from "@/components/ui/Avatar";
import { PriorityBadge } from "@/components/ui/Badge";
import { Issue } from "@/lib/types";

export function IssueCard({ issue }: { issue: Issue }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={clsx(
        "flex flex-col gap-2 rounded-md border border-border bg-white p-3 shadow-sm",
        isDragging ? "z-10 opacity-50" : "hover:border-slate-300"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-slate-400">{issue.issue_key}</span>
        <PriorityBadge priority={issue.priority} />
      </div>
      <Link
        href={`/issues/${issue.id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-medium text-slate-800 hover:underline"
      >
        {issue.title}
      </Link>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {issue.due_date ? new Date(issue.due_date).toLocaleDateString() : "No due date"}
        </span>
        <Avatar user={issue.assignee} />
      </div>
    </div>
  );
}
