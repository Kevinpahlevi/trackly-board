"use client";

import * as React from "react";
import { Plus, Columns } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useKanbanStore } from "@/store/use-kanban-store";

interface AddColumnDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddColumnDialog({ isOpen, onClose }: AddColumnDialogProps) {
  const [columnTitle, setColumnTitle] = React.useState("");
  const addColumn = useKanbanStore((state) => state.addColumn);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!columnTitle.trim()) return;
    addColumn(columnTitle.trim());
    setColumnTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Columns className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <DialogTitle>Add New Column</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Column Title *
            </label>
            <Input
              placeholder="e.g. Backlog, Testing, Blocked, Done..."
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Add Column</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
