"use client";

import * as React from "react";
import {
  FolderKanban,
  Trash2,
  Edit2,
  Check,
  Download,
  Upload,
  RotateCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { useKanbanStore } from "@/store/use-kanban-store";
import { exportToJson, validateWorkspace } from "@/lib/storage";

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const accentColors = [
  { name: "Indigo", value: "indigo", bg: "bg-indigo-500" },
  { name: "Emerald", value: "emerald", bg: "bg-emerald-500" },
  { name: "Blue", value: "blue", bg: "bg-blue-500" },
  { name: "Rose", value: "rose", bg: "bg-rose-500" },
  { name: "Amber", value: "amber", bg: "bg-amber-500" },
  { name: "Purple", value: "purple", bg: "bg-purple-500" },
];

export function ProjectManagementModal({
  isOpen,
  onClose,
}: ProjectManagementModalProps) {
  const {
    boards,
    activeBoardId,
    setActiveBoardId,
    createBoard,
    updateBoard,
    deleteBoard,
    importWorkspace,
    resetToSampleData,
  } = useKanbanStore();

  const [activeTab, setActiveTab] = React.useState<"list" | "create">("list");
  const [newTitle, setNewTitle] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [newAccentColor, setNewAccentColor] = React.useState("indigo");

  const [editingBoardId, setEditingBoardId] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const boardList = Object.values(boards);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createBoard(newTitle, newDescription, newAccentColor);
    setNewTitle("");
    setNewDescription("");
    setActiveTab("list");
    onClose();
  };

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingBoardId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      updateBoard(id, { title: editingTitle.trim() });
    }
    setEditingBoardId(null);
  };

  const handleDelete = (id: string) => {
    if (boardList.length <= 1) {
      alert("You must keep at least one project board.");
      return;
    }
    if (confirm("Are you sure you want to delete this project and all its data?")) {
      deleteBoard(id);
    }
  };

  const handleExportWorkspace = () => {
    exportToJson(
      { activeBoardId, boards },
      `trackly-workspace-${new Date().toISOString().split("T")[0]}.json`
    );
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const valid = validateWorkspace(parsed);
        if (valid) {
          importWorkspace(valid);
          alert("Workspace successfully imported!");
          onClose();
        } else {
          alert("Invalid workspace format. Please provide a valid Trackly JSON file.");
        }
      } catch {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    if (confirm("Reset workspace to initial sample projects? This will replace current boards.")) {
      resetToSampleData();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[640px] w-[95vw] p-5 sm:p-6 overflow-hidden">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <DialogTitle>Project Management</DialogTitle>
          </div>
          <DialogDescription>
            Switch projects, create a new workspace, or backup and restore your boards.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 -mt-1">
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === "list"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            All Projects ({boardList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === "create"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            + New Project
          </button>
        </div>

        {activeTab === "list" ? (
          <div className="space-y-3 pt-1">
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {boardList.map((board) => {
                const isSelected = board.id === activeBoardId;
                const cardCount = Object.keys(board.cards).length;

                return (
                  <div
                    key={board.id}
                    className={`flex items-center justify-between p-3 rounded-[10px] border transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                      <div className="h-3 w-3 rounded-full bg-indigo-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        {editingBoardId === board.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="h-7 text-xs"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              className="h-7 text-xs px-2"
                              onClick={() => handleSaveRename(board.id)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                                {board.title}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded-[10px]">
                                  Active
                                </span>
                              )}
                            </div>
                            {board.description && (
                              <p className="text-xs text-slate-500 truncate">
                                {board.description}
                              </p>
                            )}
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {board.columns.length} columns • {cardCount} cards
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isSelected && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2.5 rounded-[10px]"
                          onClick={() => {
                            setActiveBoardId(board.id);
                            onClose();
                          }}
                        >
                          Switch
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 text-slate-400 hover:text-slate-700 rounded-[10px]"
                        onClick={() => handleStartRename(board.id, board.title)}
                        title="Rename project"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 text-slate-400 hover:text-red-500 rounded-[10px]"
                        onClick={() => handleDelete(board.id)}
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Workspace Backup & Restore Actions Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 px-2.5 rounded-[10px]"
                  onClick={handleExportWorkspace}
                >
                  <Download className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Export Backup</span>
                </Button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportFile}
                  accept=".json"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 px-2.5 rounded-[10px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Import JSON</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-slate-500 hover:text-red-500 h-8 rounded-[10px]"
                onClick={handleReset}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Sample</span>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Project Title *
              </label>
              <Input
                placeholder="e.g. Mobile App V2, Marketing Campaign..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                autoFocus
                className="rounded-[10px]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Description (Optional)
              </label>
              <Textarea
                placeholder="What is this project board about?"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="min-h-[80px] rounded-[10px]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Accent Theme Color
              </label>
              <div className="flex items-center gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setNewAccentColor(color.value)}
                    className={`h-7 w-7 rounded-full ${color.bg} flex items-center justify-center transition-all cursor-pointer ${
                      newAccentColor === color.value
                        ? "ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {newAccentColor === color.value && (
                      <Check className="h-4 w-4 text-white stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("list")}
                className="rounded-[10px]"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="rounded-[10px]">
                Create Project
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
