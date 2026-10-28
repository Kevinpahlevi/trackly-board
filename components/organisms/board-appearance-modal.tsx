"use client";

import * as React from "react";
import {
  Palette,
  Sparkles,
  Image as ImageIcon,
  Sliders,
  RotateCcw,
  Check,
  Link as LinkIcon,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useKanbanStore } from "@/store/use-kanban-store";
import { backgroundPresets, getBoardBackgroundStyle } from "@/lib/board-themes";
import { useIsDark } from "@/hooks/use-is-dark";
import { BoardAppearance } from "@/types/kanban";
import { cn } from "@/lib/utils";

interface BoardAppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const blurPresets = [
  { label: "None", value: 0 },
  { label: "Subtle", value: 4 },
  { label: "Medium", value: 8 },
  { label: "Frosted", value: 12 },
  { label: "Deep Frost", value: 18 },
];

const solidColorPresets = [
  "#0f172a", // Slate 900
  "#1e1b4b", // Indigo 950
  "#022c22", // Emerald 950
  "#3b0764", // Purple 950
  "#450a0a", // Red 950
  "#18181b", // Zinc 900
  "#f8fafc", // Slate 50
  "#eff6ff", // Blue 50
  "#f0fdf4", // Emerald 50
  "#fdf4ff", // Fuchsia 50
];

export function BoardAppearanceModal({ isOpen, onClose }: BoardAppearanceModalProps) {
  const { boards, activeBoardId, updateBoardAppearance } = useKanbanStore();
  const currentBoard = boards[activeBoardId] || Object.values(boards)[0];
  const isDark = useIsDark();

  const [activeTab, setActiveTab] = React.useState<"pattern" | "gradient" | "image" | "solid">("pattern");
  const [customImageUrl, setCustomImageUrl] = React.useState("");

  const appearance: BoardAppearance = currentBoard?.appearance || {
    backgroundType: "pattern",
    backgroundValue: "grid",
    blurIntensity: 10,
  };

  const handleSelectPreset = (type: BoardAppearance["backgroundType"], value: string) => {
    if (!currentBoard) return;
    updateBoardAppearance(currentBoard.id, {
      backgroundType: type,
      backgroundValue: value,
    });
  };

  const handleBlurChange = (value: number) => {
    if (!currentBoard) return;
    updateBoardAppearance(currentBoard.id, {
      blurIntensity: value,
    });
  };

  const handleApplyCustomUrl = () => {
    if (!customImageUrl.trim() || !currentBoard) return;
    updateBoardAppearance(currentBoard.id, {
      backgroundType: "image",
      backgroundValue: customImageUrl.trim(),
    });
  };

  const handleResetToDefault = () => {
    if (!currentBoard) return;
    updateBoardAppearance(currentBoard.id, {
      backgroundType: "pattern",
      backgroundValue: "grid",
      blurIntensity: 10,
    });
    setCustomImageUrl("");
  };

  const patternPresets = backgroundPresets.filter((p) => p.type === "pattern");
  const gradientPresets = backgroundPresets.filter((p) => p.type === "gradient");
  const imagePresets = backgroundPresets.filter((p) => p.type === "image");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[620px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-[10px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <Palette className="h-4 w-4" />
              <span>Board Appearance</span>
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              Customize Board Theme
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personalize background wallpaper, patterns, and frosted glass blur for{" "}
              <strong className="text-slate-700 dark:text-slate-200">{currentBoard?.title}</strong>.
              All changes are saved locally.
            </DialogDescription>
          </DialogHeader>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-4 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-[10px] overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab("pattern")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-medium transition-all shrink-0",
                activeTab === "pattern"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Patterns</span>
            </button>
            <button
              onClick={() => setActiveTab("gradient")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-medium transition-all shrink-0",
                activeTab === "gradient"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Gradients</span>
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-medium transition-all shrink-0",
                activeTab === "image"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Wallpapers</span>
            </button>
            <button
              onClick={() => setActiveTab("solid")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-medium transition-all shrink-0",
                activeTab === "solid"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <div className="h-3 w-3 rounded-full border border-slate-400 bg-linear-to-tr from-indigo-500 to-rose-500" />
              <span>Solid & Color</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0 text-sm">
          {/* TAB 1: PATTERNS */}
          {activeTab === "pattern" && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Workspace Patterns
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {patternPresets.map((preset) => {
                  const isSelected =
                    appearance.backgroundType === "pattern" &&
                    appearance.backgroundValue === preset.value;

                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset("pattern", preset.value)}
                      className={cn(
                        "group relative flex flex-col p-3 rounded-[10px] border text-left transition-all",
                        isSelected
                          ? "border-indigo-600 ring-2 ring-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40"
                      )}
                    >
                      <div
                        className="h-16 w-full rounded-[8px] border border-slate-200 dark:border-slate-700/60 mb-2 relative overflow-hidden"
                        style={{ background: preset.preview }}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                        {preset.name}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {preset.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GRADIENTS */}
          {activeTab === "gradient" && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Atmospheric Gradients
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gradientPresets.map((preset) => {
                  const isSelected =
                    appearance.backgroundType === "gradient" &&
                    appearance.backgroundValue === preset.value;

                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset("gradient", preset.value)}
                      className={cn(
                        "group relative flex flex-col p-2.5 rounded-[10px] border text-left transition-all",
                        isSelected
                          ? "border-indigo-600 ring-2 ring-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40"
                      )}
                    >
                      <div
                        className="h-14 w-full rounded-[8px] mb-2 relative overflow-hidden shadow-xs border border-white/10"
                        style={{ background: preset.preview }}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: WALLPAPERS */}
          {activeTab === "image" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  Curated HD Wallpapers
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {imagePresets.map((preset) => {
                    const isSelected =
                      appearance.backgroundType === "image" &&
                      appearance.backgroundValue === preset.value;

                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset("image", preset.value)}
                        className={cn(
                          "group relative flex flex-col p-2.5 rounded-[10px] border text-left transition-all",
                          isSelected
                            ? "border-indigo-600 ring-2 ring-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40"
                        )}
                      >
                        <div
                          className="h-20 w-full rounded-[8px] mb-2 relative overflow-hidden bg-cover bg-center border border-slate-200 dark:border-slate-700"
                          style={{ backgroundImage: preset.preview }}
                        >
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image URL */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>Custom Wallpaper Image URL</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="h-9 text-xs flex-1 rounded-[10px]"
                  />
                  <Button
                    size="sm"
                    onClick={handleApplyCustomUrl}
                    disabled={!customImageUrl.trim()}
                    className="h-9 rounded-[10px] text-xs font-medium"
                  >
                    Apply URL
                  </Button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Paste any valid image URL (Unsplash, Imgur, direct HTTPS link).
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SOLID & CUSTOM COLOR */}
          {activeTab === "solid" && (
            <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Solid Color Palette
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {solidColorPresets.map((hex) => {
                  const isSelected =
                    appearance.backgroundType === "solid" &&
                    appearance.backgroundValue === hex;

                  return (
                    <button
                      key={hex}
                      onClick={() => handleSelectPreset("solid", hex)}
                      className={cn(
                        "h-9 w-full rounded-[8px] border flex items-center justify-center transition-transform hover:scale-105 relative",
                        isSelected
                          ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 border-indigo-600 scale-105"
                          : "border-slate-200 dark:border-slate-700"
                      )}
                      style={{ backgroundColor: hex }}
                      title={hex}
                    >
                      {isSelected && (
                        <Check
                          className={cn(
                            "h-4 w-4",
                            hex === "#f8fafc" || hex === "#eff6ff" || hex === "#f0fdf4" || hex === "#fdf4ff"
                              ? "text-slate-900"
                              : "text-white"
                          )}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Pipette Color Picker */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <label className="relative flex items-center justify-center h-9 px-3 rounded-[10px] border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors gap-2">
                  <Palette className="h-4 w-4 text-indigo-500" />
                  <span>Pick Custom Color</span>
                  <input
                    type="color"
                    value={
                      appearance.backgroundType === "solid" && appearance.backgroundValue.startsWith("#")
                        ? appearance.backgroundValue
                        : "#6366f1"
                    }
                    onChange={(e) => handleSelectPreset("solid", e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
                {appearance.backgroundType === "solid" && (
                  <span className="text-xs font-mono text-slate-500">
                    Selected: {appearance.backgroundValue}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* BACKDROP BLUR INTENSITY SLIDER */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Card & Column Backdrop Blur
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-[6px] border border-indigo-200/60 dark:border-indigo-800/60">
                {appearance.blurIntensity ?? 10}px
              </span>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={appearance.blurIntensity ?? 10}
                onChange={(e) => handleBlurChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
              />
            </div>

            {/* Quick Blur Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {blurPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleBlurChange(preset.value)}
                  className={cn(
                    "text-[11px] px-2.5 py-1 rounded-[8px] font-medium border transition-colors",
                    (appearance.blurIntensity ?? 10) === preset.value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  {preset.label} ({preset.value}px)
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Adjusts the glassmorphism frosted effect on columns and header over the background.
            </p>
          </div>

          {/* LIVE MINI PREVIEW */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              Live Preview
            </span>
            <div
              className="h-28 w-full rounded-[10px] p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden transition-all relative"
              style={getBoardBackgroundStyle(appearance, isDark)}
            >
              {/* Mini frosted column preview */}
              <div
                className="w-48 p-2.5 rounded-[10px] border border-slate-200/80 dark:border-slate-700/80 bg-white/75 dark:bg-slate-900/75 shadow-lg transition-all flex flex-col gap-1.5"
                style={{
                  backdropFilter: `blur(${appearance.blurIntensity ?? 10}px)`,
                  WebkitBackdropFilter: `blur(${appearance.blurIntensity ?? 10}px)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-16 bg-slate-300 dark:bg-slate-600 rounded-sm" />
                  <div className="h-2.5 w-4 bg-indigo-500 rounded-full" />
                </div>
                <div className="p-2 rounded-[6px] bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-[10px] font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
                  Sample Kanban Card
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetToDefault}
            className="text-xs gap-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default</span>
          </Button>

          <Button
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold px-4 rounded-[10px] bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
