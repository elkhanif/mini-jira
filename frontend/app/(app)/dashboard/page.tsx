"use client";

import { IssueListItem } from "@/components/dashboard/IssueListItem";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDashboardSummary, useMyIssues, useRecentIssues } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: myIssues, isLoading: myIssuesLoading } = useMyIssues();
  const { data: recentIssues, isLoading: recentLoading } = useRecentIssues();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of all your projects and issues</p>
      </div>

      {!summaryLoading && summary && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Projects" value={summary.total_projects} />
          <StatCard label="Total Issues" value={summary.total_issues} />
          <StatCard label="To Do" value={summary.todo} />
          <StatCard label="In Progress" value={summary.in_progress} />
          <StatCard label="Review" value={summary.review} />
          <StatCard label="Done" value={summary.done} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">My Assigned Issues</h2>
          <div className="flex flex-col gap-2">
            {!myIssuesLoading && myIssues?.issues.length === 0 && (
              <p className="text-sm text-slate-400">No issues assigned to you.</p>
            )}
            {myIssues?.issues.map((issue) => (
              <IssueListItem key={issue.id} issue={issue} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Recent Issues</h2>
          <div className="flex flex-col gap-2">
            {!recentLoading && recentIssues?.issues.length === 0 && (
              <p className="text-sm text-slate-400">No issues yet.</p>
            )}
            {recentIssues?.issues.map((issue) => (
              <IssueListItem key={issue.id} issue={issue} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
