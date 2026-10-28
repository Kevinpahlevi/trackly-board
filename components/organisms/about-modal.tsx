"use client";

import * as React from "react";
import Image from "next/image";
import {
  ExternalLink,
  Heart,
  Sparkles,
  ShieldCheck,
  Layers,
  Palette,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px] w-[95vw] p-0 overflow-hidden rounded-[10px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Banner with Ambient Glow & Logo */}
        <div className="relative p-6 pb-5 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-[12px] overflow-hidden shadow-md ring-1 ring-slate-200/80 dark:ring-slate-800 bg-white dark:bg-slate-800 shrink-0">
              <Image
                src="/icon.png"
                alt="Trackly Logo"
                width={56}
                height={56}
                className="h-full w-full object-cover rounded-[12px]"
                priority
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Trackly
                </DialogTitle>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[6px] bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Modern Zero-Login Kanban Board & Workflow Planner
              </p>

              {/* Creator Attribution */}
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                <span>by</span>
                <a
                  href="https://kplevi.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-2 transition-colors"
                >
                  <span>kplevi.dev</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-5 text-xs max-h-[60vh] overflow-y-auto">
          {/* About App Description in English */}
          <div className="space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              <strong>Trackly</strong> is an ultra-fast, zero-login Kanban board designed for effortless workflow and personal productivity. Built with local-first persistence, all your project boards, checklists, labels, activity history, and custom themes remain strictly private and stored directly in your browser.
            </p>
          </div>

          {/* Key Feature Highlights */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>Key Features</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>100% Private & Local</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  No signup or external database. All workspace data stays securely in your browser&apos;s local storage.
                </p>
              </div>

              <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Multi-Project Workspace</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Organize multiple distinct boards with instant project switching and unique settings.
                </p>
              </div>

              <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Palette className="h-3.5 w-3.5 text-amber-500" />
                  <span>Theme & Blur Slider</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Developer grid patterns, atmospheric gradients, HD wallpapers, and frosted glass blur.
                </p>
              </div>

              <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Download className="h-3.5 w-3.5 text-purple-500" />
                  <span>Structured JSON Backups</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Easily export and import individual projects or complete workspace backups safely.
                </p>
              </div>
            </div>
          </div>

          {/* Author Portfolio Card */}
          <div className="p-3.5 rounded-[10px] border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/60 via-purple-50/30 to-slate-50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Created & Designed by kplevi.dev
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Full-stack developer & UI craftsman.
              </p>
            </div>
            <a
              href="https://kplevi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Visit Portfolio</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Tech Stack Info */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 text-center">
            <span>Built with Next.js 16, React 19, Tailwind CSS, & Zustand</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-end">
          <Button
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold px-4 rounded-[10px] bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
