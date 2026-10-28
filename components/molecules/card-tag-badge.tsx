import * as React from "react";
import { Badge } from "@/components/atoms/badge";
import { CardTag } from "@/types/kanban";
import { cn } from "@/lib/utils";

interface CardTagBadgeProps {
  tag: CardTag;
  onRemove?: () => void;
  className?: string;
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  emerald: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  green: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  amber: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  yellow: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  rose: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  red: "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  purple: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  indigo: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  cyan: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  orange: "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  pink: "bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  slate: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export function CardTagBadge({ tag, onRemove, className }: CardTagBadgeProps) {
  const isHex = tag.color.startsWith("#");
  const colorClass = !isHex
    ? colorMap[tag.color.toLowerCase()] || colorMap.indigo
    : "border";

  const customStyle = isHex
    ? {
        backgroundColor: `${tag.color}1f`,
        borderColor: `${tag.color}66`,
        color: tag.color,
      }
    : undefined;

  return (
    <Badge
      style={customStyle}
      className={cn(
        "px-2 py-0.5 text-[11px] font-medium border rounded-[10px] transition-all",
        colorClass,
        className
      )}
    >
      <span>{tag.label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          ×
        </button>
      )}
    </Badge>
  );
}
