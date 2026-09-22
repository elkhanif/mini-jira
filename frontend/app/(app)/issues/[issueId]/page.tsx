"use client";

import { useParams } from "next/navigation";

import { ActivityHistory } from "@/components/issue/ActivityHistory";
import { CommentThread } from "@/components/issue/CommentThread";
import { PriorityBadge, TypeBadge } from "@/components/ui/Badge";
import { useIssue, useUpdateIssue, useUpdateIssueStatus } from "@/hooks/useIssues";
import { useProjectMembers } from "@/hooks/useProjects";
import { IssuePriority, IssueStatus, ISSUE_STATUSES, ISSUE_STATUS_LABELS } from "@/lib/types";

export default function IssueDetailPage() {
  const params = useParams<{ issueId: string }>();
  const issueId = Number(params.issueId);

  const { data: issue, isLoading } = useIssue(issueId);
  const { data: members } = useProjectMembers(issue?.project_id ?? Number.NaN);
  const updateIssue = useUpdateIssue(issueId, issue?.project_id ?? Number.NaN);
  const updateStatus = useUpdateIssueStatus(issue?.project_id ?? Number.NaN);

  if (isLoading || !issue) {
    return <p className="text-sm text-slate-400">Loading...</p>;
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="font-mono">{issue.issue_key}</span>
          <TypeBadge type={issue.type} />
        </div>
        <h1 className="mt-1 text-xl font-bold text-slate-900">{issue.title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-6 md:col-span-2">
          <section>
            <h2 className="mb-2 text-sm font-semibold text-slate-700">Description</h2>
            <p className="whitespace-pre-wrap rounded-md border border-border bg-white p-4 text-sm text-slate-700">
              {issue.description || "No description provided."}
            </p>
          </section>

          <CommentThread issueId={issueId} />
          <ActivityHistory issueId={issueId} />
        </div>

        <aside className="flex flex-col gap-4 rounded-lg border border-border bg-white p-4">
          <div>
            <label className="text-xs font-medium uppercase text-slate-400">Status</label>
            <select
              value={issue.status}
              onChange={(e) => updateStatus.mutate({ issueId, status: e.target.value as IssueStatus })}
              className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-sm"
            >
              {ISSUE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {ISSUE_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase text-slate-400">Priority</label>
            <div className="mt-1 flex items-center justify-between">
              <select
                value={issue.priority}
                onChange={(e) => updateIssue.mutate({ priority: e.target.value as IssuePriority })}
                className="w-full rounded-md border border-border px-2 py-1.5 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="mt-2">
              <PriorityBadge priority={issue.priority} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase text-slate-400">Assignee</label>
            <select
              value={issue.assignee?.id ?? ""}
              onChange={(e) =>
                updateIssue.mutate({ assignee_id: e.target.value ? Number(e.target.value) : null })
              }
              className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-sm"
            >
              <option value="">Unassigned</option>
              {members?.map((member) => (
                <option key={member.user.id} value={member.user.id}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase text-slate-400">Reporter</label>
            <p className="mt-1 text-sm text-slate-700">{issue.reporter.name}</p>
          </div>

          <div>
            <label className="text-xs font-medium uppercase text-slate-400">Due Date</label>
            <input
              type="date"
              value={issue.due_date ?? ""}
              onChange={(e) => updateIssue.mutate({ due_date: e.target.value || null })}
              className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase text-slate-400">Created</label>
            <p className="mt-1 text-sm text-slate-700">{new Date(issue.created_at).toLocaleString()}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
