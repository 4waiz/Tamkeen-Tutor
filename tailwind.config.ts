import type { Config } from "tailwindcss";

/**
 * SkillCompass UAE — neobrutalism design tokens.
 * Source of truth: SKILL.md (typeui.sh neobrutalism).
 * Use semantic token names everywhere; avoid raw hex in components.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 (extends defaults, does not replace)
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16D67A", // EDGE signature green — primary action surface
          fg: "#0A1F2C", // text on primary
        },
        secondary: {
          DEFAULT: "#0B2E4F", // EDGE deep navy accent
          fg: "#FBFBF9",
        },
        success: { DEFAULT: "#16A34A", fg: "#FBFBF9" },
        warning: { DEFAULT: "#D97706", fg: "#FBFBF9" },
        danger: { DEFAULT: "#DC2626", fg: "#FBFBF9" },
        surface: {
          DEFAULT: "#FBFBF9", // warm off-white background
          raised: "#FFFFFF",
          sunken: "#F2F1EC",
        },
        ink: {
          DEFAULT: "#1C293C", // primary text
          soft: "#3A4A63", // still AA on surface — never lighter than this for body text
        },
        border: {
          DEFAULT: "#1C293C", // thick dark borders
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Typographic scale: 13 / 15 / 17 / 21 / 27 / 35
        xs: ["0.8125rem", { lineHeight: "1.25rem" }], // 13
        sm: ["0.9375rem", { lineHeight: "1.4rem" }], // 15
        base: ["1.0625rem", { lineHeight: "1.6rem" }], // 17
        lg: ["1.3125rem", { lineHeight: "1.75rem" }], // 21
        xl: ["1.6875rem", { lineHeight: "2rem" }], // 27
        "2xl": ["2.1875rem", { lineHeight: "2.4rem" }], // 35
      },
      borderWidth: {
        3: "3px",
        5: "5px",
      },
      borderRadius: {
        neo: "12px",
        "neo-sm": "8px",
      },
      boxShadow: {
        // Offset hard shadows — the neobrutalism signature
        neo: "4px 4px 0 0 #1C293C",
        "neo-lg": "6px 6px 0 0 #1C293C",
        "neo-sm": "2px 2px 0 0 #1C293C",
        "neo-secondary": "4px 4px 0 0 #0B2E4F",
        "neo-inset": "inset 2px 2px 0 0 #1C293C",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
