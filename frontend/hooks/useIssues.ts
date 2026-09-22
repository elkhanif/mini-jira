import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { Issue, IssueHistoryEntry, IssuePriority, IssueStatus, IssueType } from "@/lib/types";

export function useIssues(projectId: number) {
  return useQuery({
    queryKey: ["projects", projectId, "issues"],
    queryFn: () => api.get<Issue[]>(`/projects/${projectId}/issues`),
    enabled: Number.isFinite(projectId),
  });
}

export function useIssue(issueId: number) {
  return useQuery({
    queryKey: ["issues", issueId],
    queryFn: () => api.get<Issue>(`/issues/${issueId}`),
    enabled: Number.isFinite(issueId),
  });
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  type: IssueType;
  priority: IssuePriority;
  assignee_id?: number | null;
  due_date?: string | null;
}

export function useCreateIssue(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIssueInput) => api.post<Issue>(`/projects/${projectId}/issues`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "issues"] });
    },
  });
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  type?: IssueType;
  priority?: IssuePriority;
  assignee_id?: number | null;
  due_date?: string | null;
}

export function useUpdateIssue(issueId: number, projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateIssueInput) => api.put<Issue>(`/issues/${issueId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", issueId] });
      queryClient.invalidateQueries({ queryKey: ["issues", issueId, "history"] });
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "issues"] });
    },
  });
}

export function useUpdateIssueStatus(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ issueId, status }: { issueId: number; status: IssueStatus }) =>
      api.patch<Issue>(`/issues/${issueId}/status`, { status }),
    onMutate: async ({ issueId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["projects", projectId, "issues"] });
      const previous = queryClient.getQueryData<Issue[]>(["projects", projectId, "issues"]);

      queryClient.setQueryData<Issue[]>(["projects", projectId, "issues"], (old) =>
        old?.map((issue) => (issue.id === issueId ? { ...issue, status } : issue))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["projects", projectId, "issues"], context.previous);
      }
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "issues"] });
      queryClient.invalidateQueries({ queryKey: ["issues", variables.issueId, "history"] });
    },
  });
}

export function useIssueHistory(issueId: number) {
  return useQuery({
    queryKey: ["issues", issueId, "history"],
    queryFn: () => api.get<IssueHistoryEntry[]>(`/issues/${issueId}/history`),
    enabled: Number.isFinite(issueId),
  });
}
