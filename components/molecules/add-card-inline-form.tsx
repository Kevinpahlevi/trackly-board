"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import { useKanbanStore } from "@/store/use-kanban-store";

interface AddCardInlineFormProps {
  columnId: string;
}

export function AddCardInlineForm({ columnId }: AddCardInlineFormProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const addCard = useKanbanStore((state) => state.addCard);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) return;
    addCard(columnId, title);
    setTitle("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setTitle("");
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 rounded-[10px] transition-colors cursor-pointer text-left"
      >
        <Plus className="h-4 w-4" />
        <span>Add a card</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-1 space-y-2">
      <Textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a title for this card..."
        className="min-h-[64px] text-xs py-2 px-2.5 bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-600 shadow-sm"
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" className="h-7 text-xs px-3">
          Add card
        </Button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setTitle("");
          }}
          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
