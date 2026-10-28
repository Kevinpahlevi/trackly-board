import * as React from "react";
import { CheckSquare } from "lucide-react";
import { ChecklistItem } from "@/types/kanban";
import { cn } from "@/lib/utils";

interface CardChecklistCounterProps {
  checklist: ChecklistItem[];
  className?: string;
}

export function CardChecklistCounter({
  checklist,
  className,
}: CardChecklistCounterProps) {
  if (!checklist || checklist.length === 0) return null;

  const total = checklist.length;
  const completed = checklist.filter((item) => item.completed).length;
  const isAllCompleted = total > 0 && completed === total;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-1.5 py-0.5 rounded-[10px]",
        isAllCompleted
          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
          : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800",
        className
      )}
      title={`${completed} of ${total} checklist subtasks completed`}
    >
      <CheckSquare className="h-3 w-3 stroke-[2.5]" />
      <span>
        {completed}/{total}
      </span>
    </div>
  );
}
