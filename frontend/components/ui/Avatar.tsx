import { User } from "@/lib/types";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function Avatar({ user, size = "sm" }: { user: User | null; size?: "sm" | "md" }) {
  const dimension = size === "sm" ? "h-6 w-6 text-xs" : "h-9 w-9 text-sm";

  if (!user) {
    return (
      <div
        className={`flex ${dimension} items-center justify-center rounded-full border border-dashed border-border text-slate-400`}
        title="Unassigned"
      >
        ?
      </div>
    );
  }

  return (
    <div
      className={`flex ${dimension} items-center justify-center rounded-full bg-slate-700 font-semibold text-white`}
      title={user.name}
    >
      {initials(user.name)}
    </div>
  );
}
