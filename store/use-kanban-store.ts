import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  KanbanBoard,
  KanbanCardItem,
  KanbanColumnItem,
  KanbanWorkspace,
  PriorityLevel,
  CardTag,
} from "@/types/kanban";
import { initialWorkspace } from "@/lib/initial-data";
import { getCookie, setCookie } from "@/lib/storage";

interface KanbanState {
  activeBoardId: string;
  boards: Record<string, KanbanBoard>;
  searchQuery: string;
  selectedPriority: PriorityLevel | "all";
  selectedTag: string | "all";
  activeDraggingCardId: string | null;
  activeDraggingColumnId: string | null;
  editingCardId: string | null;

  // Selectors / Helpers
  getActiveBoard: () => KanbanBoard | undefined;

  // Project / Board Actions
  setActiveBoardId: (id: string) => void;
  createBoard: (title: string, description?: string, accentColor?: string) => string;
  updateBoard: (boardId: string, updates: Partial<KanbanBoard>) => void;
  deleteBoard: (boardId: string) => void;

  // Column Actions
  addColumn: (title: string) => void;
  updateColumnTitle: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (activeId: string, overId: string) => void;

  // Card Actions
  addCard: (columnId: string, title: string) => void;
  updateCard: (cardId: string, updates: Partial<KanbanCardItem>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (activeId: string, overId: string) => void;

  // Checklist Actions
  toggleChecklistItem: (cardId: string, itemId: string) => void;
  addChecklistItem: (cardId: string, text: string) => void;
  deleteChecklistItem: (cardId: string, itemId: string) => void;

  // Tag Actions
  addTagToCard: (cardId: string, tag: CardTag) => void;
  removeTagFromCard: (cardId: string, tagId: string) => void;

  // Comment Actions
  addCardComment: (cardId: string, text: string, author?: string) => void;
  deleteCardComment: (cardId: string, commentId: string) => void;

  // UI / Modal / Filter Actions
  setEditingCardId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPriority: (priority: PriorityLevel | "all") => void;
  setSelectedTag: (tag: string | "all") => void;
  setActiveDraggingCardId: (id: string | null) => void;
  setActiveDraggingColumnId: (id: string | null) => void;

  // Workspace Maintenance
  importWorkspace: (workspace: KanbanWorkspace) => void;
  resetToSampleData: () => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      activeBoardId: initialWorkspace.activeBoardId,
      boards: initialWorkspace.boards,
      searchQuery: "",
      selectedPriority: "all",
      selectedTag: "all",
      activeDraggingCardId: null,
      activeDraggingColumnId: null,
      editingCardId: null,

      getActiveBoard: () => {
        const state = get();
        return state.boards[state.activeBoardId] || Object.values(state.boards)[0];
      },

      setActiveBoardId: (id: string) => {
        set({ activeBoardId: id });
        setCookie("trackly_active_board", id);
      },

      createBoard: (title: string, description = "", accentColor = "indigo") => {
        const id = `board-${Date.now()}`;
        const newBoard: KanbanBoard = {
          id,
          title: title.trim() || "Untitled Project",
          description: description.trim(),
          accentColor,
          createdAt: new Date().toISOString(),
          columns: [
            { id: `col-${Date.now()}-1`, title: "To Do", cardIds: [] },
            { id: `col-${Date.now()}-2`, title: "In Progress", cardIds: [] },
            { id: `col-${Date.now()}-3`, title: "Done", cardIds: [] },
          ],
          cards: {},
        };

        set((state) => ({
          boards: { ...state.boards, [id]: newBoard },
          activeBoardId: id,
        }));
        setCookie("trackly_active_board", id);
        return id;
      },

      updateBoard: (boardId: string, updates: Partial<KanbanBoard>) => {
        set((state) => {
          const current = state.boards[boardId];
          if (!current) return state;
          return {
            boards: {
              ...state.boards,
              [boardId]: { ...current, ...updates },
            },
          };
        });
      },

      deleteBoard: (boardId: string) => {
        set((state) => {
          const newBoards = { ...state.boards };
          delete newBoards[boardId];
          const remainingIds = Object.keys(newBoards);
          if (remainingIds.length === 0) {
            // Keep at least one board
            const fallbackId = `board-${Date.now()}`;
            newBoards[fallbackId] = {
              id: fallbackId,
              title: "My Project",
              description: "Default project board",
              accentColor: "indigo",
              createdAt: new Date().toISOString(),
              columns: [
                { id: `col-1`, title: "To Do", cardIds: [] },
                { id: `col-2`, title: "In Progress", cardIds: [] },
                { id: `col-3`, title: "Done", cardIds: [] },
              ],
              cards: {},
            };
            setCookie("trackly_active_board", fallbackId);
            return { boards: newBoards, activeBoardId: fallbackId };
          }
          const nextActiveId =
            state.activeBoardId === boardId ? remainingIds[0] : state.activeBoardId;
          setCookie("trackly_active_board", nextActiveId);
          return { boards: newBoards, activeBoardId: nextActiveId };
        });
      },

      addColumn: (title: string) => {
        const board = get().getActiveBoard();
        if (!board) return;
        const newColumn: KanbanColumnItem = {
          id: `col-${Date.now()}`,
          title: title.trim() || "New Column",
          cardIds: [],
        };

        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard) return state;
          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                columns: [...currentBoard.columns, newColumn],
              },
            },
          };
        });
      },

      updateColumnTitle: (columnId: string, title: string) => {
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard) return state;
          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                columns: currentBoard.columns.map((col) =>
                  col.id === columnId ? { ...col, title: title.trim() || col.title } : col
                ),
              },
            },
          };
        });
      },

      deleteColumn: (columnId: string) => {
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard) return state;
          const targetCol = currentBoard.columns.find((c) => c.id === columnId);
          const cardIdsToDelete = new Set(targetCol ? targetCol.cardIds : []);

          const newCards = { ...currentBoard.cards };
          cardIdsToDelete.forEach((id) => delete newCards[id]);

          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                columns: currentBoard.columns.filter((c) => c.id !== columnId),
                cards: newCards,
              },
            },
          };
        });
      },

      reorderColumns: (activeId: string, overId: string) => {
        if (activeId === overId) return;
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard) return state;
          const oldIndex = currentBoard.columns.findIndex((c) => c.id === activeId);
          const newIndex = currentBoard.columns.findIndex((c) => c.id === overId);
          if (oldIndex === -1 || newIndex === -1) return state;

          const reordered = [...currentBoard.columns];
          const [moved] = reordered.splice(oldIndex, 1);
          reordered.splice(newIndex, 0, moved);

          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                columns: reordered,
              },
            },
          };
        });
      },

      addCard: (columnId: string, title: string) => {
        const board = get().getActiveBoard();
        if (!board) return;
        const cardId = `card-${Date.now()}`;
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const defaultDueDate = `${year}-${month}-${day}T18:00`;

        const newCard: KanbanCardItem = {
          id: cardId,
          columnId,
          title: title.trim() || "New Task",
          description: "Task description and notes for this card...",
          priority: "medium",
          tags: [
            { id: `tag-${Date.now()}`, label: "General", color: "#6366f1" },
          ],
          checklist: [],
          dueDate: defaultDueDate,
          createdAt: now.toISOString(),
          comments: [],
          history: [
            {
              id: `hist-${Date.now()}`,
              action: "Created this card",
              timestamp: now.toISOString(),
            },
          ],
        };

        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard) return state;
          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                cards: { ...currentBoard.cards, [cardId]: newCard },
                columns: currentBoard.columns.map((col) =>
                  col.id === columnId
                    ? { ...col, cardIds: [...col.cardIds, cardId] }
                    : col
                ),
              },
            },
          };
        });
      },

      updateCard: (cardId: string, updates: Partial<KanbanCardItem>) => {
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard || !currentBoard.cards[cardId]) return state;
          const currentCard = currentBoard.cards[cardId];

          const historyEntries = [...(currentCard.history || [])];
          const nowStr = new Date().toISOString();

          if (updates.priority && updates.priority !== currentCard.priority) {
            historyEntries.push({
              id: `hist-${Date.now()}-p`,
              action: `Changed priority to ${updates.priority.toUpperCase()}`,
              timestamp: nowStr,
            });
          }

          if ("dueDate" in updates && updates.dueDate !== currentCard.dueDate) {
            historyEntries.push({
              id: `hist-${Date.now()}-d`,
              action: updates.dueDate
                ? `Set due date to ${updates.dueDate.replace("T", " ")}`
                : "Cleared due date",
              timestamp: nowStr,
            });
          }

          if (updates.title && updates.title !== currentCard.title) {
            historyEntries.push({
              id: `hist-${Date.now()}-t`,
              action: `Renamed card to "${updates.title.slice(0, 30)}${updates.title.length > 30 ? "..." : ""}"`,
              timestamp: nowStr,
            });
          }

          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                cards: {
                  ...currentBoard.cards,
                  [cardId]: {
                    ...currentCard,
                    ...updates,
                    history: historyEntries,
                  },
                },
              },
            },
          };
        });
      },

      deleteCard: (cardId: string) => {
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard) return state;
          const targetCard = currentBoard.cards[cardId];
          if (!targetCard) return state;

          const newCards = { ...currentBoard.cards };
          delete newCards[cardId];

          return {
            editingCardId: state.editingCardId === cardId ? null : state.editingCardId,
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                cards: newCards,
                columns: currentBoard.columns.map((col) =>
                  col.id === targetCard.columnId
                    ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) }
                    : col
                ),
              },
            },
          };
        });
      },

      moveCard: (activeId: string, overId: string) => {
        if (activeId === overId) return;

        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard) return state;

          const activeCard = currentBoard.cards[activeId];
          if (!activeCard) return state;

          const sourceCol = currentBoard.columns.find((c) =>
            c.cardIds.includes(activeId)
          );
          if (!sourceCol) return state;

          // Determine destination column
          let targetCol = currentBoard.columns.find((c) => c.id === overId);
          let targetCardId: string | null = null;

          if (!targetCol) {
            // overId is another card
            targetCol = currentBoard.columns.find((c) => c.cardIds.includes(overId));
            targetCardId = overId;
          }

          if (!targetCol) return state;

          const isSameColumn = sourceCol.id === targetCol.id;

          if (isSameColumn) {
            const oldIndex = sourceCol.cardIds.indexOf(activeId);
            const newIndex = targetCardId
              ? sourceCol.cardIds.indexOf(targetCardId)
              : sourceCol.cardIds.length - 1;

            if (oldIndex === newIndex || oldIndex === -1 || newIndex === -1) return state;

            const newCardIds = [...sourceCol.cardIds];
            const [moved] = newCardIds.splice(oldIndex, 1);
            newCardIds.splice(newIndex, 0, moved);

            return {
              boards: {
                ...state.boards,
                [state.activeBoardId]: {
                  ...currentBoard,
                  columns: currentBoard.columns.map((col) =>
                    col.id === sourceCol.id ? { ...col, cardIds: newCardIds } : col
                  ),
                },
              },
            };
          } else {
            // Cross-column move
            const sourceCardIds = sourceCol.cardIds.filter((id) => id !== activeId);
            const targetCardIds = [...targetCol.cardIds];

            let insertIndex = targetCardIds.length;
            if (targetCardId) {
              const idx = targetCardIds.indexOf(targetCardId);
              if (idx !== -1) insertIndex = idx;
            }
            targetCardIds.splice(insertIndex, 0, activeId);

            return {
              boards: {
                ...state.boards,
                [state.activeBoardId]: {
                  ...currentBoard,
                  cards: {
                    ...currentBoard.cards,
                    [activeId]: { ...activeCard, columnId: targetCol.id },
                  },
                  columns: currentBoard.columns.map((col) => {
                    if (col.id === sourceCol.id) {
                      return { ...col, cardIds: sourceCardIds };
                    }
                    if (col.id === targetCol.id) {
                      return { ...col, cardIds: targetCardIds };
                    }
                    return col;
                  }),
                },
              },
            };
          }
        });
      },

      toggleChecklistItem: (cardId: string, itemId: string) => {
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard || !currentBoard.cards[cardId]) return state;
          const card = currentBoard.cards[cardId];

          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                cards: {
                  ...currentBoard.cards,
                  [cardId]: {
                    ...card,
                    checklist: card.checklist.map((item) =>
                      item.id === itemId ? { ...item, completed: !item.completed } : item
                    ),
                  },
                },
              },
            },
          };
        });
      },

      addChecklistItem: (cardId: string, text: string) => {
        if (!text.trim()) return;
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard || !currentBoard.cards[cardId]) return state;
          const card = currentBoard.cards[cardId];
          const newItem = {
            id: `chk-${Date.now()}`,
            text: text.trim(),
            completed: false,
          };

          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                cards: {
                  ...currentBoard.cards,
                  [cardId]: {
                    ...card,
                    checklist: [...card.checklist, newItem],
                  },
                },
              },
            },
          };
        });
      },

      deleteChecklistItem: (cardId: string, itemId: string) => {
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard || !currentBoard.cards[cardId]) return state;
          const card = currentBoard.cards[cardId];

          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                cards: {
                  ...currentBoard.cards,
                  [cardId]: {
                    ...card,
                    checklist: card.checklist.filter((item) => item.id !== itemId),
                  },
                },
              },
            },
          };
        });
      },

      addTagToCard: (cardId: string, tag: CardTag) => {
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard || !currentBoard.cards[cardId]) return state;
          const card = currentBoard.cards[cardId];
          if (card.tags.some((t) => t.id === tag.id || t.label.toLowerCase() === tag.label.toLowerCase())) {
            return state;
          }

          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                cards: {
                  ...currentBoard.cards,
                  [cardId]: {
                    ...card,
                    tags: [...card.tags, tag],
                  },
                },
              },
            },
          };
        });
      },

      removeTagFromCard: (cardId: string, tagId: string) => {
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard || !currentBoard.cards[cardId]) return state;
          const card = currentBoard.cards[cardId];
          const tagToRemove = card.tags.find((t) => t.id === tagId);

          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                cards: {
                  ...currentBoard.cards,
                  [cardId]: {
                    ...card,
                    tags: card.tags.filter((t) => t.id !== tagId),
                    history: [
                      ...(card.history || []),
                      {
                        id: `hist-${Date.now()}`,
                        action: `Removed label: "${tagToRemove?.label || 'tag'}"`,
                        timestamp: new Date().toISOString(),
                      },
                    ],
                  },
                },
              },
            },
          };
        });
      },

      addCardComment: (cardId: string, text: string, author = "You") => {
        if (!text.trim()) return;
        const now = new Date().toISOString();
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard || !currentBoard.cards[cardId]) return state;
          const card = currentBoard.cards[cardId];

          const newComment = {
            id: `cmt-${Date.now()}`,
            author: author.trim() || "You",
            text: text.trim(),
            createdAt: now,
          };

          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                cards: {
                  ...currentBoard.cards,
                  [cardId]: {
                    ...card,
                    comments: [...(card.comments || []), newComment],
                    history: [
                      ...(card.history || []),
                      {
                        id: `hist-${Date.now()}`,
                        action: `Left a comment`,
                        timestamp: now,
                      },
                    ],
                  },
                },
              },
            },
          };
        });
      },

      deleteCardComment: (cardId: string, commentId: string) => {
        set((state) => {
          const currentBoard = state.boards[state.activeBoardId];
          if (!currentBoard || !currentBoard.cards[cardId]) return state;
          const card = currentBoard.cards[cardId];

          return {
            boards: {
              ...state.boards,
              [state.activeBoardId]: {
                ...currentBoard,
                cards: {
                  ...currentBoard.cards,
                  [cardId]: {
                    ...card,
                    comments: (card.comments || []).filter((c) => c.id !== commentId),
                  },
                },
              },
            },
          };
        });
      },

      setEditingCardId: (id: string | null) => set({ editingCardId: id }),
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setSelectedPriority: (priority: PriorityLevel | "all") => set({ selectedPriority: priority }),
      setSelectedTag: (tag: string | "all") => set({ selectedTag: tag }),
      setActiveDraggingCardId: (id: string | null) => set({ activeDraggingCardId: id }),
      setActiveDraggingColumnId: (id: string | null) => set({ activeDraggingColumnId: id }),

      importWorkspace: (workspace: KanbanWorkspace) => {
        set({
          boards: workspace.boards,
          activeBoardId: workspace.activeBoardId || Object.keys(workspace.boards)[0],
        });
        setCookie("trackly_active_board", workspace.activeBoardId || Object.keys(workspace.boards)[0]);
      },

      resetToSampleData: () => {
        set({
          boards: initialWorkspace.boards,
          activeBoardId: initialWorkspace.activeBoardId,
          searchQuery: "",
          selectedPriority: "all",
          selectedTag: "all",
        });
        setCookie("trackly_active_board", initialWorkspace.activeBoardId);
      },
    }),
    {
      name: "trackly_kanban_workspace",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const cookieBoard = getCookie("trackly_active_board");
          if (cookieBoard && state.boards[cookieBoard]) {
            state.activeBoardId = cookieBoard;
          }
        }
      },
    }
  )
);
