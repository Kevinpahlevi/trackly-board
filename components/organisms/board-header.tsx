"use client";

import * as React from "react";
import {
  Kanban,
  Plus,
  Settings,
  Download,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { ProjectSwitcher } from "@/components/molecules/project-switcher";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { SearchFilterBar } from "@/components/molecules/search-filter-bar";
import { useKanbanStore } from "@/store/use-kanban-store";
import { exportToJson } from "@/lib/storage";

interface BoardHeaderProps {
  onOpenProjectModal: () => void;
  onOpenAddColumnModal: () => void;
}

export function BoardHeader({
  onOpenProjectModal,
  onOpenAddColumnModal,
}: BoardHeaderProps) {
  const { boards, activeBoardId, updateBoard } = useKanbanStore();
  const currentBoard = boards[activeBoardId] || Object.values(boards)[0];

  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleValue, setTitleValue] = React.useState("");

  const startEditingTitle = () => {
    setTitleValue(currentBoard?.title || "");
    setIsEditingTitle(true);
  };

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleValue.trim() && titleValue !== currentBoard?.title && currentBoard) {
      updateBoard(currentBoard.id, { title: titleValue.trim() });
    }
  };

  const handleExportCurrentBoard = () => {
    if (!currentBoard) return;
    exportToJson(
      currentBoard,
      `${currentBoard.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-board.json`
    );
  };

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Top Navbar: Brand + Project Switcher + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-[10px] bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Kanban className="h-4 w-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 hidden sm:inline">
              Trackly
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Project Switcher */}
          <ProjectSwitcher onOpenNewProjectModal={onOpenProjectModal} />
        </div>

        {/* Global Controls & Tools */}
        <div className="flex items-center gap-2">
          {/* Search & Filter */}
          <SearchFilterBar />

          <div className="h-4 w-px bg-slate-200 dark:border-slate-800 hidden md:block" />

          {/* Add Column Button */}
          <Button
            size="sm"
            onClick={onOpenAddColumnModal}
            className="gap-1.5 h-8 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Add Column</span>
          </Button>

          {/* Export Current Board */}
          <Button
            variant="outline"
            size="icon-sm"
            className="h-8 w-8"
            onClick={handleExportCurrentBoard}
            title="Export this board to JSON"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>

          {/* Manage Projects Modal Trigger */}
          <Button
            variant="outline"
            size="icon-sm"
            className="h-8 w-8"
            onClick={onOpenProjectModal}
            title="Manage Projects & Backup"
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>

          {/* Dark Mode Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Sub-header: Current Project Title & Quick Stats */}
      {currentBoard && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            {isEditingTitle ? (
              <input
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                autoFocus
                className="font-bold text-sm bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-500 outline-none text-slate-900 dark:text-slate-100"
              />
            ) : (
              <h1
                onClick={startEditingTitle}
                className="font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer truncate"
                title="Click to rename board title"
              >
                {currentBoard.title}
              </h1>
            )}
            {currentBoard.description && (
              <span className="text-slate-400 hidden lg:inline truncate max-w-md">
                • {currentBoard.description}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <span>
              {currentBoard.columns.length} columns •{" "}
              {Object.keys(currentBoard.cards).length} cards
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Saved locally</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
