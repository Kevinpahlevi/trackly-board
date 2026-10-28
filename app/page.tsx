"use client";

import * as React from "react";
import { BoardLayout } from "@/components/templates/board-layout";
import { useIsMounted } from "@/hooks/use-is-mounted";

export default function Home() {
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col canvas-ambient-glow animate-pulse">
        {/* Header Skeleton */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-[10px] bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-24 rounded-[10px] bg-slate-200 dark:bg-slate-800" />
            <div className="h-7 w-40 rounded-[10px] bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-48 rounded-[10px] bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-24 rounded-[10px] bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        {/* Subheader Skeleton */}
        <div className="h-9 border-b border-slate-100 dark:border-slate-850 bg-slate-100/60 dark:bg-slate-900/60 px-4 flex items-center justify-between">
          <div className="h-4 w-48 rounded-[10px] bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-32 rounded-[10px] bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Columns Skeleton */}
        <div className="flex-1 p-6 flex items-start gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-72 sm:w-80 h-[500px] rounded-[10px] bg-slate-200/60 dark:bg-slate-800/60 shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  return <BoardLayout />;
}
