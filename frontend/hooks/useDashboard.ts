import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { DashboardSummary, Issue } from "@/lib/types";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => api.get<DashboardSummary>("/dashboard/summary"),
  });
}

export function useMyIssues() {
  return useQuery({
    queryKey: ["dashboard", "my-issues"],
    queryFn: () => api.get<{ issues: Issue[] }>("/dashboard/my-issues"),
  });
}

export function useRecentIssues(limit = 10) {
  return useQuery({
    queryKey: ["dashboard", "recent-issues", limit],
    queryFn: () => api.get<{ issues: Issue[] }>(`/dashboard/recent-issues?limit=${limit}`),
  });
}
