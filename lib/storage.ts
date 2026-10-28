import { KanbanBoard, KanbanWorkspace } from "@/types/kanban";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function exportToJson(data: unknown, filename: string) {
  if (typeof window === "undefined") return;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Generates a clean, readable, standardized export filename for a project board.
 * Format: trackly-[slug]-[YYYY-MM-DD].json
 * Examples:
 * - "Trackly Board" -> "trackly-board-2026-10-28.json"
 * - "Website Redesign" -> "trackly-website-redesign-2026-10-28.json"
 * - "Sprint #1 (Q4)" -> "trackly-sprint-1-q4-2026-10-28.json"
 */
export function generateBoardExportFileName(title: string): string {
  let slug = (title || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accent marks
    .replace(/[^a-z0-9]+/g, "-") // collapse non-alphanumeric into a single dash
    .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens

  if (!slug) {
    slug = "project";
  }

  // Prevent duplicate prefixes like "trackly-trackly-..."
  if (slug.startsWith("trackly-")) {
    slug = slug.replace(/^trackly-/, "");
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  return `trackly-${slug || "board"}-${dateStr}.json`;
}

/**
 * Generates a clean, readable export filename for a full workspace backup.
 * Format: trackly-workspace-backup-[YYYY-MM-DD].json
 */
export function generateWorkspaceExportFileName(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;
  return `trackly-workspace-backup-${dateStr}.json`;
}

export function validateWorkspace(data: unknown): KanbanWorkspace | null {
  if (!data || typeof data !== "object") return null;
  const candidate = data as Partial<KanbanWorkspace>;
  if (
    typeof candidate.activeBoardId === "string" &&
    candidate.boards &&
    typeof candidate.boards === "object"
  ) {
    return candidate as KanbanWorkspace;
  }
  return null;
}

export function validateBoard(data: unknown): KanbanBoard | null {
  if (!data || typeof data !== "object") return null;
  const candidate = data as Partial<KanbanBoard>;
  if (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    Array.isArray(candidate.columns) &&
    candidate.cards &&
    typeof candidate.cards === "object"
  ) {
    return candidate as KanbanBoard;
  }
  return null;
}
