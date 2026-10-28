import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trackly — Zero-Login Kanban Board",
  description:
    "A lightning-fast, zero-login Trello-like kanban board with multi-project support, drag-and-drop, and local persistence.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

const themeInitScript = `
(function() {
  try {
    var match = document.cookie.match(/(^| )trackly_theme=([^;]+)/);
    var cookieTheme = match ? decodeURIComponent(match[2]) : null;
    var localTheme = localStorage.getItem('trackly_theme_storage');
    var theme = cookieTheme;
    if (!theme && localTheme) {
      try { theme = JSON.parse(localTheme).state.theme; } catch(e) {}
    }
    var isDark = theme === 'dark' || (!theme || theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
