"use client";

import * as React from "react";
import { BoardHeader } from "@/components/organisms/board-header";
import { KanbanBoardView } from "@/components/templates/kanban-board-view";
import { CardDetailModal } from "@/components/organisms/card-detail-modal";
import { ProjectManagementModal } from "@/components/organisms/project-management-modal";
import { AddColumnDialog } from "@/components/organisms/add-column-dialog";
import { BoardAppearanceModal } from "@/components/organisms/board-appearance-modal";
import { useKanbanStore } from "@/store/use-kanban-store";
import { useIsDark } from "@/hooks/use-is-dark";
import { getBoardBackgroundStyle } from "@/lib/board-themes";

export function BoardLayout() {
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = React.useState(false);
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = React.useState(false);

  const { boards, activeBoardId } = useKanbanStore();
  const currentBoard = boards[activeBoardId] || Object.values(boards)[0];
  const isDark = useIsDark();

  const backgroundStyle = React.useMemo(() => {
    return getBoardBackgroundStyle(currentBoard?.appearance, isDark);
  }, [currentBoard?.appearance, isDark]);

  return (
    <div
      className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors bg-cover bg-center bg-fixed"
      style={backgroundStyle}
    >
      {/* App & Board Header */}
      <BoardHeader
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenAddColumnModal={() => setIsAddColumnModalOpen(true)}
        onOpenAppearanceModal={() => setIsAppearanceModalOpen(true)}
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

      <BoardAppearanceModal
        isOpen={isAppearanceModalOpen}
        onClose={() => setIsAppearanceModalOpen(false)}
      />
    </div>
  );
}
