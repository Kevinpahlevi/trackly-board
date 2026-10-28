"use client";

import * as React from "react";
import { FolderKanban, Check, Plus, ChevronDown, Layers } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { useKanbanStore } from "@/store/use-kanban-store";

interface ProjectSwitcherProps {
  onOpenNewProjectModal: () => void;
}

export function ProjectSwitcher({ onOpenNewProjectModal }: ProjectSwitcherProps) {
  const { boards, activeBoardId, setActiveBoardId } = useKanbanStore();
  const activeBoard = boards[activeBoardId] || Object.values(boards)[0];
  const boardList = Object.values(boards);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 font-medium text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs max-w-[220px]"
        >
          <FolderKanban className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="truncate">{activeBoard ? activeBoard.title : "Select Project"}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-1.5 text-xs text-slate-500">
          <Layers className="h-3.5 w-3.5" />
          <span>Projects ({boardList.length})</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-60 overflow-y-auto">
          {boardList.map((board) => {
            const cardCount = Object.keys(board.cards).length;
            const isSelected = board.id === activeBoardId;
            return (
              <DropdownMenuItem
                key={board.id}
                onClick={() => setActiveBoardId(board.id)}
                className="flex items-center justify-between cursor-pointer py-2"
              >
                <div className="flex flex-col truncate pr-2">
                  <span className={`text-sm font-medium truncate ${isSelected ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
                    {board.title}
                  </span>
                  <span className="text-xs text-slate-400">
                    {board.columns.length} columns • {cardCount} cards
                  </span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-indigo-600 shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onOpenNewProjectModal}
          className="gap-2 text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
