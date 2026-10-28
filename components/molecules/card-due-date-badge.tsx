import * as React from "react";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardDueDateBadgeProps {
  dueDate?: string;
  className?: string;
}

export function CardDueDateBadge({ dueDate, className }: CardDueDateBadgeProps) {
  if (!dueDate) return null;

  const targetDate = new Date(dueDate);
  if (isNaN(targetDate.getTime())) return null;

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const isOverdue = diffMs < 0;

  // Calculate day difference
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDay = new Date(targetDate);
  targetDay.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isDueToday = diffDays === 0;
  const isDueSoon = diffDays > 0 && diffDays <= 2;

  const hasTime = dueDate.includes("T");
  const formattedDate = targetDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const formattedTime = hasTime
    ? targetDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  let titleText = "";
  if (isOverdue) {
    const hoursOverdue = Math.max(1, Math.round(Math.abs(diffMs) / (1000 * 60 * 60)));
    titleText =
      hoursOverdue > 24
        ? `Overdue by ${Math.round(hoursOverdue / 24)} day(s)`
        : `Overdue by ${hoursOverdue} hour(s)`;
  } else if (isDueToday) {
    titleText = hasTime ? `Due today at ${formattedTime}` : "Due today";
  } else {
    titleText = `Due in ${diffDays} day(s)${hasTime ? ` at ${formattedTime}` : ""}`;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-[10px] transition-colors",
        isOverdue
          ? "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-900/40"
          : isDueToday
          ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-900/40"
          : isDueSoon
          ? "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40"
          : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60",
        className
      )}
      title={titleText}
    >
      {hasTime ? (
        <Clock className="h-3 w-3 shrink-0" />
      ) : (
        <Calendar className="h-3 w-3 shrink-0" />
      )}
      <span>{formattedDate}</span>
      {hasTime && <span className="opacity-75">{formattedTime}</span>}
    </div>
  );
}
