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

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

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

              {/* Made By Badge & Link */}
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
          {/* About App Description */}
          <div className="space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              <strong>Trackly</strong> adalah aplikasi papan Kanban modern bergaya Trello yang dirancang untuk produktivitas instan tanpa hambatan pendaftaran akun (*zero-login*). Seluruh data proyek, daftar tugas, komentar, riwayat aktivitas, dan preferensi tampilan tersimpan langsung di browser Anda secara lokal (*Local Persistence*).
            </p>
          </div>

          {/* Key Feature Highlights */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>Fitur Utama</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>100% Privacy & Local</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Tanpa database luar atau login. Data sepenuhnya milik Anda di `localStorage`.
                </p>
              </div>

              <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Multi-Project Workspace</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Kelola banyak proyek terpisah dengan perpindahan proyek instan.
                </p>
              </div>

              <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Palette className="h-3.5 w-3.5 text-amber-500" />
                  <span>Tema & Blur Slider</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Pola developer grid, gradien atmosfer, wallpaper HD, dan efek frosted blur.
                </p>
              </div>

              <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Download className="h-3.5 w-3.5 text-purple-500" />
                  <span>Backup JSON Terstruktur</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Export dan import single project maupun full workspace dengan aman.
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

          {/* Tech Stack */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>Built with Next.js 16, React 19, Tailwind CSS, & Zustand</span>
            <a
              href="https://github.com/Kevinpahlevi/trackly-board"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>Source Code</span>
            </a>
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
