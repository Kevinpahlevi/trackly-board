"use client";

import * as React from "react";
import { BoardHeader } from "@/components/organisms/board-header";
import { KanbanBoardView } from "@/components/templates/kanban-board-view";
import { CardDetailModal } from "@/components/organisms/card-detail-modal";
import { ProjectManagementModal } from "@/components/organisms/project-management-modal";
import { AddColumnDialog } from "@/components/organisms/add-column-dialog";

export function BoardLayout() {
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col canvas-ambient-glow text-slate-900 dark:text-slate-100 transition-colors">
      {/* App & Board Header */}
      <BoardHeader
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenAddColumnModal={() => setIsAddColumnModalOpen(true)}
      />

      {/* Main Kanban Board View */}
      <main className="flex-1 flex flex-col min-h-0">
        <KanbanBoardView
          onOpenAddColumnModal={() => setIsAddColumnModalOpen(true)}
        />
      </main>

      {/* Modals & Dialogs */}
      <CardDetailModal />

      <ProjectManagementModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <AddColumnDialog
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
      />
    </div>
  );
}
