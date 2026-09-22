"use client";

import { IssueListItem } from "@/components/dashboard/IssueListItem";
import { useMyIssues } from "@/hooks/useDashboard";

export default function MyIssuesPage() {
  const { data, isLoading } = useMyIssues();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Issues</h1>
        <p className="text-sm text-slate-500">Issues assigned to you across all projects</p>
      </div>

      <div className="flex flex-col gap-2">
        {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
        {!isLoading && data?.issues.length === 0 && (
          <p className="text-sm text-slate-400">No issues assigned to you.</p>
        )}
        {data?.issues.map((issue) => (
          <IssueListItem key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
