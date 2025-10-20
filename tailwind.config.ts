import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        "light-blue": "#c9d6ff",
        "gradient-start": "#e2e2e2",
        "gradient-end": "#c9d6ff",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        cyan: "#00949c",
        "theme-gold": {
          primary: "#ECC98D",
          secondary: "#f5e6d3",
          foreground: "rgba(236, 201, 141, 0.54)"
        },
        "theme-blue": {
          primary: "#A7C6F5",
          secondary: "#e6f0ff",
          foreground: "rgba(167, 198, 245, 0.54)"
        },
        "theme-pink": {
          primary: "#ea69ae",
          secondary: "#fce4f3",
          foreground: "rgba(246, 72, 165, 0.54)"
        },
        "theme-red": {
          primary: "#E25762",
          secondary: "#ffe6e8",
          foreground: "rgba(226, 87, 98, 0.54)"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" }
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" }
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        slideLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        slideRight: "slideRight 1s ease-out forwards",
        slideLeft: "slideLeft 1s ease-out forwards"
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        poppins: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"]
      },
      boxShadow: {
        "course-inset": "inset 0 -4px 0 rgba(1, 84, 136, 0.1)"
      },
      backgroundImage: {
        "player-texture": "url('/src/assets/player_background.png')",
        "menu-texture": "url('/menu-icon/pattern.png')"
      },
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
        "xs": "480px",
        "landscape": { "raw": "(orientation: landscape)" }
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)'
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography")
  ]
} satisfies Config;

export default config;
