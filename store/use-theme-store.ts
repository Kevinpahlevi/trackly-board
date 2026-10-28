import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeMode } from "@/types/kanban";
import { getCookie, setCookie } from "@/lib/storage";

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      setTheme: (theme: ThemeMode) => {
        set({ theme });
        setCookie("trackly_theme", theme);
        get().applyTheme();
      },
      applyTheme: () => {
        if (typeof window === "undefined") return;
        const currentTheme = get().theme;
        const root = document.documentElement;

        const isDark =
          currentTheme === "dark" ||
          (currentTheme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

        if (isDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      },
    }),
    {
      name: "trackly_theme_storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Fallback to cookie if present
          const cookieTheme = getCookie("trackly_theme") as ThemeMode | null;
          if (cookieTheme && ["light", "dark", "system"].includes(cookieTheme)) {
            state.theme = cookieTheme;
          }
          state.applyTheme();
        }
      },
    }
  )
);
