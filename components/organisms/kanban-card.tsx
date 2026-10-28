"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { KanbanCardItem } from "@/types/kanban";
import { CardTagBadge } from "@/components/molecules/card-tag-badge";
import { CardPriorityBadge } from "@/components/molecules/card-priority-badge";
import { CardChecklistCounter } from "@/components/molecules/card-checklist-counter";
import { CardDueDateBadge } from "@/components/molecules/card-due-date-badge";
import { useKanbanStore } from "@/store/use-kanban-store";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  card: KanbanCardItem;
  isOverlay?: boolean;
}

export function KanbanCard({ card, isOverlay = false }: KanbanCardProps) {
  const setEditingCardId = useKanbanStore((state) => state.setEditingCardId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleClick = () => {
    // If the click was not on the drag handle, open modal
    if (isOverlay || isDragging) return;
    setEditingCardId(card.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col gap-2 rounded-[10px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600/60 hover:shadow-md transition-all cursor-pointer select-none",
        isDragging && "opacity-30 border-dashed border-indigo-400 bg-indigo-50/20",
        isOverlay &&
          "shadow-2xl border-indigo-500 ring-2 ring-indigo-500/20 rotate-1 scale-[1.02] cursor-grabbing bg-white dark:bg-slate-900 z-50 rounded-[10px]"
      )}
    >
      {/* Top Bar: Drag Handle + Tags + Priority */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-1 overflow-hidden">
          {card.tags.slice(0, 3).map((tag) => (
            <CardTagBadge key={tag.id} tag={tag} />
          ))}
          {card.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 font-medium">
              +{card.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <CardPriorityBadge priority={card.priority} showIconOnly />
          {/* Dedicated Drag Handle for high precision */}
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="p-0.5 text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            title="Drag card"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Card Title */}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-3">
        {card.title}
      </h4>

      {/* Card Description preview (if exists) */}
      {card.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Footer Meta: Subtasks Checklist & Due Date */}
      {(card.checklist.length > 0 || card.dueDate) && (
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 mt-0.5">
          <CardChecklistCounter checklist={card.checklist} />
          <CardDueDateBadge dueDate={card.dueDate} />
        </div>
      )}
    </div>
  );
}
