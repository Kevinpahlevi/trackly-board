import * as React from "react";
import { AlertCircle, ArrowDown, ArrowUp, Flame } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { PriorityLevel } from "@/types/kanban";
import { cn } from "@/lib/utils";

interface CardPriorityBadgeProps {
  priority: PriorityLevel;
  showIconOnly?: boolean;
  className?: string;
}

export function CardPriorityBadge({
  priority,
  showIconOnly = false,
  className,
}: CardPriorityBadgeProps) {
  switch (priority) {
    case "urgent":
      return (
        <Badge
          variant="destructive"
          className={cn("gap-1 text-[11px] font-semibold uppercase tracking-wider py-0.5", className)}
        >
          <Flame className="h-3 w-3 text-red-500 fill-red-500" />
          {!showIconOnly && <span>Urgent</span>}
        </Badge>
      );
    case "high":
      return (
        <Badge
          variant="warning"
          className={cn("gap-1 text-[11px] font-medium py-0.5", className)}
        >
          <ArrowUp className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          {!showIconOnly && <span>High</span>}
        </Badge>
      );
    case "medium":
      return (
        <Badge
          variant="primary"
          className={cn("gap-1 text-[11px] font-medium py-0.5", className)}
        >
          <AlertCircle className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
          {!showIconOnly && <span>Medium</span>}
        </Badge>
      );
    case "low":
    default:
      return (
        <Badge
          variant="default"
          className={cn("gap-1 text-[11px] text-slate-500 font-medium py-0.5", className)}
        >
          <ArrowDown className="h-3 w-3 text-slate-400" />
          {!showIconOnly && <span>Low</span>}
        </Badge>
      );
  }
}
