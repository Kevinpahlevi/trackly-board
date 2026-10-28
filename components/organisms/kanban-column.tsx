"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { KanbanCardItem, KanbanColumnItem } from "@/types/kanban";
import { KanbanCard } from "./kanban-card";
import { ColumnHeaderActions } from "@/components/molecules/column-header-actions";
import { AddCardInlineForm } from "@/components/molecules/add-card-inline-form";
import { useKanbanStore } from "@/store/use-kanban-store";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  column: KanbanColumnItem;
  cards: Record<string, KanbanCardItem>;
  isOverlay?: boolean;
}

export function KanbanColumn({ column, cards, isOverlay = false }: KanbanColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleValue, setTitleValue] = React.useState(column.title);

  const updateColumnTitle = useKanbanStore((state) => state.updateColumnTitle);
  const searchQuery = useKanbanStore((state) => state.searchQuery.toLowerCase());
  const selectedPriority = useKanbanStore((state) => state.selectedPriority);
  const appearance = useKanbanStore((state) => {
    const activeBoard = state.boards[state.activeBoardId] || Object.values(state.boards)[0];
    return activeBoard?.appearance;
  });
  const blurPx = appearance?.blurIntensity ?? 10;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: isOverlay,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    backdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
    WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
  };

  // Filter cards in this column
  const filteredCardIds = React.useMemo(() => {
    return column.cardIds.filter((id) => {
      const card = cards[id];
      if (!card) return false;

      // Search match
      if (
        searchQuery &&
        !card.title.toLowerCase().includes(searchQuery) &&
        !card.description?.toLowerCase().includes(searchQuery)
      ) {
        return false;
      }

      // Priority match
      if (selectedPriority !== "all" && card.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [column.cardIds, cards, searchQuery, selectedPriority]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleValue.trim() && titleValue !== column.title) {
      updateColumnTitle(column.id, titleValue);
    } else {
      setTitleValue(column.title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    } else if (e.key === "Escape") {
      setTitleValue(column.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col w-72 sm:w-80 shrink-0 max-h-[calc(100vh-140px)] rounded-[10px] bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs",
        isDragging && "opacity-30 border-dashed border-indigo-400",
        isOverlay && "shadow-2xl ring-2 ring-indigo-500/20 rotate-1 bg-slate-100 dark:bg-slate-900 z-50 rounded-[10px]"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-1">
          {/* Column Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded cursor-grab active:cursor-grabbing shrink-0"
            title="Drag to reorder column"
          >
            <GripHorizontal className="h-4 w-4" />
          </div>

          {isEditingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="text-sm font-semibold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-indigo-500 outline-none w-full text-slate-900 dark:text-slate-100"
            />
          ) : (
            <span
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate cursor-pointer select-none"
              title="Double click to rename"
            >
              {column.title}
            </span>
          )}

          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-1.5 py-0.5 rounded-[10px] shrink-0">
            {filteredCardIds.length}
          </span>
        </div>

        <ColumnHeaderActions
          columnId={column.id}
          onStartRename={() => setIsEditingTitle(true)}
          onOpenAddCard={() => {
            const addCard = useKanbanStore.getState().addCard;
            addCard(column.id, "New Task");
          }}
        />
      </div>

      {/* Cards List Droppable Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[60px]">
        <SortableContext
          items={filteredCardIds}
          strategy={verticalListSortingStrategy}
        >
          {filteredCardIds.map((cardId) => {
            const card = cards[cardId];
            if (!card) return null;
            return <KanbanCard key={card.id} card={card} />;
          })}
        </SortableContext>

        {filteredCardIds.length === 0 && (
          <div className="h-16 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[10px] text-xs text-slate-400 select-none">
            Drop cards here
          </div>
        )}
      </div>

      {/* Column Footer: Inline Card Form */}
      <div className="p-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <AddCardInlineForm columnId={column.id} />
      </div>
    </div>
  );
}
