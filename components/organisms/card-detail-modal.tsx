"use client";

import * as React from "react";
import {
  CheckSquare,
  Clock,
  Flame,
  Plus,
  Tag,
  Trash2,
  Columns,
  MessageSquare,
  History,
  LayoutList,
  FileText,
  Send,
  Pipette,
  Palette,
  Calendar,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Checkbox } from "@/components/atoms/checkbox";
import { CardTagBadge } from "@/components/molecules/card-tag-badge";
import { CardPriorityBadge } from "@/components/molecules/card-priority-badge";
import { useKanbanStore } from "@/store/use-kanban-store";
import { KanbanCardItem, KanbanBoard, PriorityLevel } from "@/types/kanban";

const presetTagColors = [
  { name: "Indigo", hex: "#6366f1" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Green", hex: "#22c55e" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Orange", hex: "#f97316" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Red", hex: "#ef4444" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Slate", hex: "#64748b" },
];

interface CardDetailContentProps {
  card: KanbanCardItem;
  board: KanbanBoard;
}

function CardDetailContent({ card, board }: CardDetailContentProps) {
  const {
    setEditingCardId,
    updateCard,
    deleteCard,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    addTagToCard,
    removeTagFromCard,
    moveCard,
    addCardComment,
    deleteCardComment,
  } = useKanbanStore();

  const [activeTab, setActiveTab] = React.useState<"details" | "comments" | "history">("details");
  const [title, setTitle] = React.useState(card.title);
  const [description, setDescription] = React.useState(card.description || "");
  const [newSubtaskText, setNewSubtaskText] = React.useState("");

  // Tag creation state
  const [newTagLabel, setNewTagLabel] = React.useState("");
  const [newTagColor, setNewTagColor] = React.useState("#6366f1");
  const [showTagInput, setShowTagInput] = React.useState(false);

  // Comment state
  const [commentText, setCommentText] = React.useState("");
  const [commentAuthor, setCommentAuthor] = React.useState("You");

  // Due date state with explicit confirmation
  const [isEditingDueDate, setIsEditingDueDate] = React.useState(false);
  const [tempDate, setTempDate] = React.useState(
    card.dueDate ? card.dueDate.split("T")[0] : new Date().toISOString().split("T")[0]
  );
  const [tempTime, setTempTime] = React.useState(
    card.dueDate && card.dueDate.includes("T")
      ? card.dueDate.split("T")[1].slice(0, 5)
      : "18:00"
  );

  const handleTitleBlur = () => {
    if (title.trim() && title !== card.title) {
      updateCard(card.id, { title: title.trim() });
    } else {
      setTitle(card.title);
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== (card.description || "")) {
      updateCard(card.id, { description });
    }
  };

  const handlePriorityChange = (priority: PriorityLevel) => {
    updateCard(card.id, { priority });
  };

  const handleConfirmDueDate = () => {
    if (!tempDate) {
      alert("Please select a date.");
      return;
    }
    const combined = `${tempDate}T${tempTime || "18:00"}`;
    updateCard(card.id, { dueDate: combined });
    setIsEditingDueDate(false);
  };

  const handleRemoveDueDate = () => {
    if (confirm("Remove due date from this card?")) {
      updateCard(card.id, { dueDate: undefined });
      setIsEditingDueDate(false);
    }
  };

  const formatDisplayDueDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const dateFormatted = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const hasTime = dateStr.includes("T");
    const timeFormatted = hasTime
      ? d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      : "";
    return hasTime ? `${dateFormatted} • ${timeFormatted}` : dateFormatted;
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    addChecklistItem(card.id, newSubtaskText.trim());
    setNewSubtaskText("");
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagLabel.trim()) return;
    addTagToCard(card.id, {
      id: `tag-${Date.now()}`,
      label: newTagLabel.trim(),
      color: newTagColor,
    });
    setNewTagLabel("");
    setShowTagInput(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCardComment(card.id, commentText.trim(), commentAuthor);
    setCommentText("");
  };

  const handleDeleteCard = () => {
    if (confirm("Are you sure you want to permanently delete this card?")) {
      deleteCard(card.id);
      setEditingCardId(null);
    }
  };

  const totalSubtasks = card.checklist.length;
  const completedSubtasks = card.checklist.filter((i) => i.completed).length;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const comments = card.comments || [];
  const history = card.history || [];

  return (
    <>
      {/* Redesigned Header: Breadcrumb, Status, and Prominent Title */}
      <DialogHeader className="space-y-3 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {board.title}
            </span>
            <span>/</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
              <Columns className="h-3 w-3" />
              <select
                value={card.columnId}
                onChange={(e) => moveCard(card.id, e.target.value)}
                className="bg-transparent font-medium outline-none cursor-pointer text-indigo-600 dark:text-indigo-400"
              >
                {board.columns.map((col) => (
                  <option
                    key={col.id}
                    value={col.id}
                    className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
                  >
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <CardPriorityBadge priority={card.priority} />
        </div>

        {/* Big Card Title with Icon */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 border border-indigo-200 dark:border-indigo-800/60 shadow-xs">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle asChild>
              <Textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="text-lg font-bold min-h-[42px] py-1.5 px-2.5 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 rounded-[10px] resize-none leading-snug shadow-none bg-transparent"
                placeholder="Card Title..."
              />
            </DialogTitle>
          </div>
        </div>
      </DialogHeader>

      {/* Tabs Header Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 -mt-2">
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "details"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <LayoutList className="h-3.5 w-3.5" />
          <span>Details & Tasks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("comments")}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "comments"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Comments</span>
          {comments.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-[10px] bg-slate-200 dark:bg-slate-800 text-[10px]">
              {comments.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "history"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>History Log</span>
          {history.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-[10px] bg-slate-200 dark:bg-slate-800 text-[10px]">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Details & Tasks */}
      {activeTab === "details" && (
        <div className="space-y-5">
          {/* Quick Meta Controls: Priority & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-[10px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>Priority Level</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(["low", "medium", "high", "urgent"] as PriorityLevel[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePriorityChange(p)}
                    className={`cursor-pointer transition-all ${
                      card.priority === p
                        ? "ring-2 ring-indigo-500 rounded-[10px]"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <CardPriorityBadge priority={p} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Due Date & Time</span>
                </label>
              </div>

              {!isEditingDueDate ? (
                <div className="flex flex-wrap items-center gap-2">
                  {card.dueDate ? (
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-xs">
                        <Clock className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate max-w-[190px]">
                          {formatDisplayDueDate(card.dueDate)}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-2.5 rounded-[10px]"
                        onClick={() => {
                          setTempDate(
                            card.dueDate
                              ? card.dueDate.split("T")[0]
                              : new Date().toISOString().split("T")[0]
                          );
                          setTempTime(
                            card.dueDate && card.dueDate.includes("T")
                              ? card.dueDate.split("T")[1].slice(0, 5)
                              : "18:00"
                          );
                          setIsEditingDueDate(true);
                        }}
                      >
                        Change
                      </Button>
                      <button
                        type="button"
                        onClick={handleRemoveDueDate}
                        className="text-xs text-slate-400 hover:text-red-500 px-1 cursor-pointer transition-colors"
                        title="Remove due date"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs h-8 px-3 rounded-[10px]"
                      onClick={() => {
                        setTempDate(new Date().toISOString().split("T")[0]);
                        setTempTime("18:00");
                        setIsEditingDueDate(true);
                      }}
                    >
                      <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                      <span>+ Set Due Date & Time</span>
                    </Button>
                  )}
                </div>
              ) : (
                /* Compact Picker Form with Confirmation */
                <div className="p-3 rounded-[10px] bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        className="h-7 text-xs rounded-[10px]"
                      />
                    </div>
                    <div className="w-24 shrink-0">
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                        Time
                      </label>
                      <Input
                        type="time"
                        value={tempTime}
                        onChange={(e) => setTempTime(e.target.value)}
                        className="h-7 text-xs rounded-[10px]"
                      />
                    </div>
                  </div>

                  {/* Quick Shortcuts */}
                  <div className="flex items-center gap-1.5 text-[11px] pt-0.5">
                    <span className="text-slate-400 text-[10px]">Preset:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTempDate(new Date().toISOString().split("T")[0]);
                        setTempTime("18:00");
                      }}
                      className="px-1.5 py-0.5 rounded-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer text-[10px]"
                    >
                      Today 18:00
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const tmr = new Date(Date.now() + 86400000);
                        setTempDate(tmr.toISOString().split("T")[0]);
                        setTempTime("12:00");
                      }}
                      className="px-1.5 py-0.5 rounded-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer text-[10px]"
                    >
                      Tomorrow 12:00
                    </button>
                  </div>

                  {/* Explicit Confirmation Action Bar */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2.5 rounded-[10px]"
                      onClick={() => setIsEditingDueDate(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 text-xs px-3 rounded-[10px] gap-1 font-semibold"
                      onClick={handleConfirmDueDate}
                    >
                      <Check className="h-3 w-3" />
                      <span>Confirm & Save</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Card Cover Color Selector */}
            <div className="sm:col-span-2 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Card Color & Accent</span>
                </label>
                {card.color && (
                  <button
                    type="button"
                    onClick={() => updateCard(card.id, { color: undefined })}
                    className="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    Remove Color
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateCard(card.id, { color: undefined })}
                  className={`h-6 px-2 text-[11px] font-medium rounded-[10px] border transition-all cursor-pointer ${
                    !card.color
                      ? "border-indigo-500 bg-white dark:bg-slate-900 text-indigo-600 font-bold ring-2 ring-indigo-500/20"
                      : "border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Default
                </button>

                {presetTagColors.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => updateCard(card.id, { color: color.hex })}
                    title={color.name}
                    className={`h-6 w-6 rounded-[10px] transition-all cursor-pointer ${
                      card.color === color.hex
                        ? "ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110"
                        : "opacity-85 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}

                <label
                  title="Pick custom card color"
                  className="h-6 px-2 flex items-center gap-1 rounded-[10px] border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Pipette className="h-3 w-3" />
                  <span>Custom</span>
                  <input
                    type="color"
                    value={card.color || "#6366f1"}
                    onChange={(e) => updateCard(card.id, { color: e.target.value })}
                    className="opacity-0 w-0 h-0 absolute pointer-events-none"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Tags Section with Preset Colors & Color Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-indigo-500" />
                <span>Labels / Tags</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTagInput(!showTagInput)}
                className="h-6 text-xs text-indigo-600 dark:text-indigo-400 gap-1 px-2"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add tag</span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 min-h-[30px]">
              {card.tags.map((tag) => (
                <CardTagBadge
                  key={tag.id}
                  tag={tag}
                  onRemove={() => removeTagFromCard(card.id, tag.id)}
                />
              ))}
              {card.tags.length === 0 && !showTagInput && (
                <span className="text-xs text-slate-400 italic">No labels added</span>
              )}
            </div>

            {/* Tag Creation Form with Preset Palette & Custom Color Picker */}
            {showTagInput && (
              <form
                onSubmit={handleAddTag}
                className="mt-3 p-3 rounded-[10px] border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tag label (e.g. Bug, Feature, Urgent)..."
                    value={newTagLabel}
                    onChange={(e) => setNewTagLabel(e.target.value)}
                    className="h-8 text-xs flex-1 rounded-[10px]"
                    autoFocus
                  />
                  {/* Live Preview Badge */}
                  {newTagLabel && (
                    <CardTagBadge
                      tag={{
                        id: "preview",
                        label: newTagLabel,
                        color: newTagColor,
                      }}
                    />
                  )}
                </div>

                {/* Color Choices: Preset Palette + Custom Picker */}
                <div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
                    Choose Color:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {presetTagColors.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setNewTagColor(color.hex)}
                        title={color.name}
                        className={`h-5 w-5 rounded-[10px] transition-all cursor-pointer ${
                          newTagColor === color.hex
                            ? "ring-2 ring-offset-1 ring-slate-900 dark:ring-white scale-110"
                            : "opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}

                    {/* Native Color Picker Tool */}
                    <label
                      title="Custom color picker"
                      className="h-5 px-1.5 flex items-center gap-1 rounded-[10px] border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[10px] font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Pipette className="h-3 w-3" />
                      <span>Custom</span>
                      <input
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="opacity-0 w-0 h-0 absolute pointer-events-none"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTagInput(false)}
                    className="h-7 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="h-7 text-xs">
                    Save Label
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Description / Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
              Description / Notes
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              placeholder="Add detailed notes, acceptance criteria, or links..."
              className="min-h-[100px] text-xs leading-relaxed rounded-[10px]"
            />
          </div>

          {/* Checklist / Subtasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Subtasks Checklist
                </span>
                <span className="text-xs text-slate-400">
                  ({completedSubtasks}/{totalSubtasks})
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {progressPercent}%
              </span>
            </div>

            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-[10px] overflow-hidden mb-3">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-[10px]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-2 mb-3">
              {card.checklist.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-2 rounded-[10px] bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem(card.id, item.id)}
                    />
                    <span
                      className={`text-xs select-none break-words ${
                        item.completed
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteChecklistItem(card.id, item.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 transition-opacity cursor-pointer"
                    title="Delete subtask"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
              <Input
                placeholder="Add an item..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                className="h-8 text-xs flex-1 rounded-[10px]"
              />
              <Button type="submit" size="sm" className="h-8 text-xs shrink-0">
                Add item
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Comments */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          {/* Add Comment Input Form */}
          <form onSubmit={handleAddComment} className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Your Name (e.g. Levi, Product Lead)..."
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="h-8 text-xs max-w-[180px] rounded-[10px]"
              />
            </div>
            <Textarea
              placeholder="Write a comment or discussion note..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[80px] text-xs rounded-[10px]"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="h-8 text-xs gap-1.5">
                <Send className="h-3.5 w-3.5" />
                <span>Post Comment</span>
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3 pt-2">
            {comments.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No comments yet. Start the conversation!
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {comment.author}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        • {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteCardComment(card.id, comment.id)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Delete comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 pl-8 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: History Log */}
      {activeTab === "history" && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400">
            Activity and change timeline for this card:
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No activity recorded yet.
              </div>
            ) : (
              [...history].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-2.5 rounded-[10px] bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 text-xs"
                >
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {entry.action}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Footer Actions: Delete card */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Created {new Date(card.createdAt).toLocaleDateString()}</span>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleDeleteCard}
          className="gap-1.5 h-8 text-xs rounded-[10px]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Card</span>
        </Button>
      </div>
    </>
  );
}

export function CardDetailModal() {
  const { editingCardId, setEditingCardId, boards, activeBoardId } =
    useKanbanStore();

  const board = boards[activeBoardId];
  const card = editingCardId && board ? board.cards[editingCardId] : null;

  return (
    <Dialog
      open={Boolean(editingCardId)}
      onOpenChange={(open) => !open && setEditingCardId(null)}
    >
      <DialogContent className="max-w-2xl sm:p-7 gap-5">
        {card && board && <CardDetailContent key={card.id} card={card} board={board} />}
      </DialogContent>
    </Dialog>
  );
}
