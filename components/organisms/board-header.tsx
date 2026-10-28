"use client";

import * as React from "react";
import Image from "next/image";
import {
  Plus,
  Settings,
  Download,
  Palette,
  Info,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { ProjectSwitcher } from "@/components/molecules/project-switcher";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { SearchFilterBar } from "@/components/molecules/search-filter-bar";
import { useKanbanStore } from "@/store/use-kanban-store";
import { exportToJson, generateBoardExportFileName } from "@/lib/storage";

interface BoardHeaderProps {
  onOpenProjectModal: () => void;
  onOpenAddColumnModal: () => void;
  onOpenAppearanceModal?: () => void;
  onOpenAboutModal?: () => void;
}

export function BoardHeader({
  onOpenProjectModal,
  onOpenAddColumnModal,
  onOpenAppearanceModal,
  onOpenAboutModal,
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
    const filename = generateBoardExportFileName(currentBoard.title);
    exportToJson(currentBoard, filename);
  };

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Top Navbar: Brand + Project Switcher + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-[10px] overflow-hidden flex items-center justify-center shadow-xs shrink-0 ring-1 ring-slate-200/80 dark:ring-slate-800 bg-white dark:bg-slate-900">
              <Image
                src="/icon.png"
                alt="Trackly Logo"
                width={32}
                height={32}
                className="h-full w-full object-cover rounded-[10px]"
                priority
              />
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

          {/* Board Appearance Modal Trigger */}
          {onOpenAppearanceModal && (
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={onOpenAppearanceModal}
              title="Customize Board Background & Blur"
            >
              <Palette className="h-3.5 w-3.5" />
            </Button>
          )}

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

          {/* About Trackly Modal Trigger */}
          {onOpenAboutModal && (
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={onOpenAboutModal}
              title="About Trackly & Credits"
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
          )}

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
            {onOpenAppearanceModal && (
              <button
                type="button"
                onClick={onOpenAppearanceModal}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] bg-slate-200/60 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer"
                title="Change board background & blur"
              >
                <Palette className="h-3 w-3 text-indigo-500" />
                <span>Background & Blur</span>
              </button>
            )}
            <span>
              {currentBoard.columns.length} columns •{" "}
              {Object.keys(currentBoard.cards).length} cards
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Saved locally</span>
            </span>

            <div className="h-3 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            {/* Author Attribution */}
            <a
              href="https://kplevi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium hidden sm:inline"
              title="Made by kplevi.dev"
            >
              by <span className="underline decoration-indigo-400/50 underline-offset-2 font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">kplevi.dev</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
