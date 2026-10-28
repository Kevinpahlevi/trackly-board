export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CardTag {
  id: string;
  label: string;
  color: string; // e.g. 'blue', 'emerald', 'amber', 'rose', 'purple', 'indigo' or hex '#10b981'
}

export interface CardComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface CardActivityLog {
  id: string;
  action: string;
  timestamp: string;
}

export interface KanbanCardItem {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  priority: PriorityLevel;
  tags: CardTag[];
  checklist: ChecklistItem[];
  dueDate?: string;
  createdAt: string;
  comments?: CardComment[];
  history?: CardActivityLog[];
}

export interface KanbanColumnItem {
  id: string;
  title: string;
  cardIds: string[];
}

export interface KanbanBoard {
  id: string;
  title: string;
  description?: string;
  accentColor?: string; // 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple'
  createdAt: string;
  columns: KanbanColumnItem[];
  cards: Record<string, KanbanCardItem>;
}

export interface KanbanWorkspace {
  activeBoardId: string;
  boards: Record<string, KanbanBoard>;
}

export interface FilterState {
  searchQuery: string;
  priority: PriorityLevel | 'all';
  tag: string | 'all';
}
