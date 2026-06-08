import type { Config } from "tailwindcss";

/**
 * SkillCompass UAE - neobrutalism design tokens.
 * Source of truth: SKILL.md (typeui.sh neobrutalism).
 * Use semantic token names everywhere; avoid raw hex in components.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    // Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 (extends defaults, does not replace)
    extend: {
      // Colors resolve from CSS variables (RGB channels) so light/dark
      // themes swap automatically. See globals.css :root and .dark.
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          fg: "rgb(var(--color-primary-fg) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          fg: "rgb(var(--color-secondary-fg) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          fg: "rgb(var(--color-success-fg) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          fg: "rgb(var(--color-warning-fg) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--color-danger) / <alpha-value>)",
          fg: "rgb(var(--color-danger-fg) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          raised: "rgb(var(--color-surface-raised) / <alpha-value>)",
          sunken: "rgb(var(--color-surface-sunken) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          soft: "rgb(var(--color-ink-soft) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
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
        // Offset hard shadows - the neobrutalism signature. The shadow color
        // is a CSS variable so it flips for dark mode.
        neo: "4px 4px 0 0 rgb(var(--color-shadow))",
        "neo-lg": "6px 6px 0 0 rgb(var(--color-shadow))",
        "neo-sm": "2px 2px 0 0 rgb(var(--color-shadow))",
        "neo-secondary": "4px 4px 0 0 rgb(var(--color-secondary))",
        "neo-inset": "inset 2px 2px 0 0 rgb(var(--color-shadow))",
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
