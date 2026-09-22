import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { Comment } from "@/lib/types";

export function useComments(issueId: number) {
  return useQuery({
    queryKey: ["issues", issueId, "comments"],
    queryFn: () => api.get<Comment[]>(`/issues/${issueId}/comments`),
    enabled: Number.isFinite(issueId),
  });
}

export function useCreateComment(issueId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => api.post<Comment>(`/issues/${issueId}/comments`, { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", issueId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["issues", issueId, "history"] });
    },
  });
}
