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
