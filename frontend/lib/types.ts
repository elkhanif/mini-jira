export type UserRole = "admin" | "member";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Project {
  id: number;
  key: string;
  name: string;
  description: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: number;
  user: User;
  joined_at: string;
}

export type IssueType = "task" | "bug" | "story";
export type IssuePriority = "low" | "medium" | "high" | "critical";
export type IssueStatus = "todo" | "in_progress" | "review" | "done";

export const ISSUE_STATUSES: IssueStatus[] = ["todo", "in_progress", "review", "done"];

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

export const ISSUE_PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export interface Issue {
  id: number;
  project_id: number;
  issue_key: string;
  title: string;
  description: string | null;
  type: IssueType;
  priority: IssuePriority;
  status: IssueStatus;
  assignee: User | null;
  reporter: User;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  issue_id: number;
  user: User;
  body: string;
  created_at: string;
}

export interface IssueHistoryEntry {
  id: number;
  actor: User;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

export interface DashboardSummary {
  total_projects: number;
  total_issues: number;
  todo: number;
  in_progress: number;
  review: number;
  done: number;
}
