"use client";

import { FormEvent, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useComments, useCreateComment } from "@/hooks/useComments";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString();
}

export function CommentThread({ issueId }: { issueId: number }) {
  const { data: comments, isLoading } = useComments(issueId);
  const createComment = useCreateComment(issueId);
  const [body, setBody] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    await createComment.mutateAsync(body.trim());
    setBody("");
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-slate-700">Comments</h2>

      <div className="flex flex-col gap-3">
        {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
        {!isLoading && comments?.length === 0 && (
          <p className="text-sm text-slate-400">No comments yet.</p>
        )}
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar user={comment.user} />
            <div className="flex-1 rounded-md border border-border bg-white p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">{comment.user.name}</span>
                <span className="text-xs text-slate-400">{formatDateTime(comment.created_at)}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-slate-700">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          className="rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <div>
          <Button type="submit" disabled={!body.trim() || createComment.isPending}>
            {createComment.isPending ? "Posting..." : "Comment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
