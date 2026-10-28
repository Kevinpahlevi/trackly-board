"use client";

import * as React from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { PriorityLevel } from "@/types/kanban";
import { useKanbanStore } from "@/store/use-kanban-store";

export function SearchFilterBar() {
  const {
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
  } = useKanbanStore();

  const priorities: { label: string; value: PriorityLevel | "all" }[] = [
    { label: "All Priorities", value: "all" },
    { label: "Urgent", value: "urgent" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-44 sm:w-60">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Filter cards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 pr-7 h-8 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-[10px] border border-slate-200 dark:border-slate-700">
        <span className="px-2 text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Filter className="h-3 w-3" />
        </span>
        {priorities.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setSelectedPriority(item.value)}
            className={`px-2 py-1 text-[11px] font-medium rounded-[10px] transition-all cursor-pointer ${
              selectedPriority === item.value
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
