import Link from "next/link";

import { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}/board`}
      className="flex flex-col gap-2 rounded-lg border border-border bg-white p-5 hover:border-slate-300"
    >
      <div className="flex items-center gap-2">
        <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">{project.key}</span>
        <span className="font-semibold text-slate-900">{project.name}</span>
      </div>
      {project.description && <p className="line-clamp-2 text-sm text-slate-500">{project.description}</p>}
    </Link>
  );
}
