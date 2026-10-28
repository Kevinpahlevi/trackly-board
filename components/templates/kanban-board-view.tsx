"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { KanbanColumn } from "@/components/organisms/kanban-column";
import { KanbanCard } from "@/components/organisms/kanban-card";
import { useKanbanStore } from "@/store/use-kanban-store";

interface KanbanBoardViewProps {
  onOpenAddColumnModal: () => void;
}

export function KanbanBoardView({ onOpenAddColumnModal }: KanbanBoardViewProps) {
  const {
    boards,
    activeBoardId,
    moveCard,
    reorderColumns,
    activeDraggingCardId,
    activeDraggingColumnId,
    setActiveDraggingCardId,
    setActiveDraggingColumnId,
  } = useKanbanStore();

  const board = boards[activeBoardId] || Object.values(boards)[0];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px threshold to separate regular clicks from drag interactions
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!board) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-slate-400">No project board found. Please create one.</p>
      </div>
    );
  }

  const columnIds = board.columns.map((c) => c.id);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const type = active.data.current?.type;

    if (type === "Card") {
      setActiveDraggingCardId(active.id as string);
    } else if (type === "Column") {
      setActiveDraggingColumnId(active.id as string);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";
    const isOverAColumn = over.data.current?.type === "Column";

    // Handle cross-column dragging while hovering
    if (isActiveACard && (isOverACard || isOverAColumn)) {
      moveCard(activeId, overId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDraggingCardId(null);
    setActiveDraggingColumnId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn && activeId !== overId) {
      reorderColumns(activeId, overId);
      return;
    }

    const isActiveACard = active.data.current?.type === "Card";
    if (isActiveACard && activeId !== overId) {
      moveCard(activeId, overId);
    }
  };

  const activeDraggingCard = activeDraggingCardId
    ? board.cards[activeDraggingCardId]
    : null;

  const activeDraggingColumn = activeDraggingColumnId
    ? board.columns.find((c) => c.id === activeDraggingColumnId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto p-4 sm:p-6">
        <div className="flex items-start gap-4 h-full min-w-max pb-4">
          {/* Reorderable Columns */}
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={board.cards}
              />
            ))}
          </SortableContext>

          {/* New Column Quick Action Button */}
          <button
            type="button"
            onClick={onOpenAddColumnModal}
            className="w-72 sm:w-80 h-14 shrink-0 rounded-[10px] border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add another column</span>
          </button>
        </div>
      </div>

      {/* Floating Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeDraggingCard && (
          <div className="w-72 sm:w-80">
            <KanbanCard card={activeDraggingCard} isOverlay />
          </div>
        )}
        {activeDraggingColumn && (
          <KanbanColumn
            column={activeDraggingColumn}
            cards={board.cards}
            isOverlay
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
