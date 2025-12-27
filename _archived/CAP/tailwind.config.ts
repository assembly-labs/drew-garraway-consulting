import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Gold palette - Primary Brand Color
        gold: {
          50: '#FFFDF0',
          400: '#FFE44D',
          500: '#FFD700',
          600: '#E5C100',
          700: '#B8991A',
        },
        // Navy palette - Primary Text & Anchors
        navy: {
          100: '#E8EDF5',
          500: '#3D5A80',
          700: '#1E3A5F',
          800: '#0F2D5C',
          900: '#0A1F44',
        },
        // Electric Blue accent
        'electric-blue': {
          500: '#0066FF',
          600: '#0052CC',
        },
        // Fire Red accent
        'fire-red': {
          500: '#DC143C',
          600: '#B8102E',
        },
        // Legacy mappings for compatibility
        'cap-gold': '#FFD700',
        'cap-secondary': '#0A1F44',
        'cap-accent': '#DC143C',
        'cap-success': '#059669',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FFD700",
          foreground: "#0A1F44",
        },
        secondary: {
          DEFAULT: "#0A1F44",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#DC143C",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        'display': ['Bebas Neue', 'Arial Narrow', 'sans-serif'],
        'body': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['Roboto Mono', 'Courier New', 'monospace'],
        'accent': ['Graduate', 'Georgia', 'Times New Roman', 'serif'],
        // Legacy mappings
        'ui': ['Inter', 'system-ui', 'sans-serif'],
        'card': ['Graduate', 'serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config