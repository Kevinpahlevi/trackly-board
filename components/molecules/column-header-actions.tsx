"use client";

import * as React from "react";
import { MoreHorizontal, Trash2, Edit2, PlusCircle } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { useKanbanStore } from "@/store/use-kanban-store";

interface ColumnHeaderActionsProps {
  columnId: string;
  onStartRename: () => void;
  onOpenAddCard: () => void;
}

export function ColumnHeaderActions({
  columnId,
  onStartRename,
  onOpenAddCard,
}: ColumnHeaderActionsProps) {
  const deleteColumn = useKanbanStore((state) => state.deleteColumn);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this column and all its cards?")) {
      deleteColumn(columnId);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onOpenAddCard} className="gap-2 cursor-pointer">
          <PlusCircle className="h-4 w-4 text-slate-500" />
          <span>Add Card</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onStartRename} className="gap-2 cursor-pointer">
          <Edit2 className="h-4 w-4 text-slate-500" />
          <span>Rename Column</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="gap-2 text-red-600 dark:text-red-400 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Column</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
