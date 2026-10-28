import { BoardAppearance } from "@/types/kanban";

export interface BackgroundPreset {
  id: string;
  name: string;
  type: "pattern" | "gradient" | "image" | "solid";
  value: string;
  preview: string; // CSS style preview or hex
  description: string;
}

export const backgroundPresets: BackgroundPreset[] = [
  // Patterns
  {
    id: "pattern-grid",
    name: "Architectural Grid",
    type: "pattern",
    value: "grid",
    preview: "radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.2) 0px, transparent 65%), linear-gradient(to right, rgba(148, 163, 184, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.3) 1px, transparent 1px)",
    description: "Crisp 28px developer workspace grid",
  },
  {
    id: "pattern-dots",
    name: "Dot Matrix",
    type: "pattern",
    value: "dots",
    preview: "radial-gradient(circle, rgba(99, 102, 241, 0.35) 1.5px, transparent 1.5px)",
    description: "Modern tactile polka dot matrix",
  },
  {
    id: "pattern-minimal",
    name: "Minimal Solid",
    type: "pattern",
    value: "minimal",
    preview: "linear-gradient(to bottom right, #f8fafc, #f1f5f9)",
    description: "Clean, distraction-free neutral canvas",
  },

  // Gradients
  {
    id: "grad-aurora",
    name: "Aurora Indigo",
    type: "gradient",
    value: "aurora",
    preview: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #0f172a 100%)",
    description: "Deep cosmic purple and indigo aurora",
  },
  {
    id: "grad-sunset",
    name: "Warm Sunset",
    type: "gradient",
    value: "sunset",
    preview: "linear-gradient(135deg, #701a75 0%, #451a03 50%, #1e1b4b 100%)",
    description: "Vibrant twilight rose and amber glow",
  },
  {
    id: "grad-ocean",
    name: "Oceanic Waves",
    type: "gradient",
    value: "ocean",
    preview: "linear-gradient(135deg, #042f2e 0%, #0c4a6e 50%, #0f172a 100%)",
    description: "Deep turquoise and nautical teal depths",
  },
  {
    id: "grad-emerald",
    name: "Forest Emerald",
    type: "gradient",
    value: "emerald",
    preview: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)",
    description: "Organic pine and sage botanical gradient",
  },
  {
    id: "grad-midnight",
    name: "Dark Carbon",
    type: "gradient",
    value: "midnight",
    preview: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
    description: "Understated matte carbon zinc",
  },

  // Wallpapers
  {
    id: "img-mountains",
    name: "Alpine Peaks",
    type: "image",
    value: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80",
    preview: "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=70)",
    description: "Crisp mountain ranges and emerald lake",
  },
  {
    id: "img-nightsky",
    name: "Starry Night",
    type: "image",
    value: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80",
    preview: "url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&q=70)",
    description: "Snowy peak beneath starlight galaxy",
  },
  {
    id: "img-architectural",
    name: "Modern Concrete",
    type: "image",
    value: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
    preview: "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=70)",
    description: "Clean geometric architectural lines",
  },
];

export function getBoardBackgroundStyle(
  appearance?: BoardAppearance,
  isDark = false
): React.CSSProperties {
  const type = appearance?.backgroundType || "pattern";
  const val = appearance?.backgroundValue || "grid";

  if (type === "pattern") {
    if (val === "grid") {
      return {
        backgroundColor: isDark ? "#080c14" : "#f1f5f9",
        backgroundImage: isDark
          ? "radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.18) 0px, transparent 65%), linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)"
          : "radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 65%), linear-gradient(to right, rgba(148, 163, 184, 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.18) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 28px 28px, 28px 28px",
      };
    }
    if (val === "dots") {
      return {
        backgroundColor: isDark ? "#080c14" : "#f1f5f9",
        backgroundImage: isDark
          ? "radial-gradient(circle, rgba(148, 163, 184, 0.15) 1.5px, transparent 1.5px)"
          : "radial-gradient(circle, rgba(99, 102, 241, 0.25) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      };
    }
    return {
      backgroundColor: isDark ? "#090d16" : "#f8fafc",
    };
  }

  if (type === "gradient") {
    switch (val) {
      case "aurora":
        return {
          background: isDark
            ? "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #0f172a 100%)"
            : "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 50%, #f3e8ff 100%)",
        };
      case "sunset":
        return {
          background: isDark
            ? "linear-gradient(135deg, #701a75 0%, #451a03 50%, #1e1b4b 100%)"
            : "linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #e0e7ff 100%)",
        };
      case "ocean":
        return {
          background: isDark
            ? "linear-gradient(135deg, #042f2e 0%, #0c4a6e 50%, #0f172a 100%)"
            : "linear-gradient(135deg, #ccfbf1 0%, #e0f2fe 50%, #ede9fe 100%)",
        };
      case "emerald":
        return {
          background: isDark
            ? "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)"
            : "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 50%, #f0fdf4 100%)",
        };
      case "midnight":
        return {
          background: isDark
            ? "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)"
            : "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #f1f5f9 100%)",
        };
      default:
        return {
          background: val,
        };
    }
  }

  if (type === "image") {
    return {
      backgroundImage: `url(${val})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    };
  }

  if (type === "solid") {
    return {
      backgroundColor: val,
    };
  }

  return {};
}
