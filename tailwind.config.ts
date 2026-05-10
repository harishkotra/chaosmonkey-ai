import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        primary: "hsl(var(--primary))",
        accent: "hsl(var(--accent))",
        danger: "hsl(var(--danger))"
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.25rem"
      },
      backgroundImage: {
        "radial-mesh": "radial-gradient(circle at 10% 20%, rgba(0,229,255,0.16), transparent 35%), radial-gradient(circle at 85% 30%, rgba(255,82,142,0.12), transparent 32%), radial-gradient(circle at 50% 80%, rgba(126,87,255,0.12), transparent 36%)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(141, 196, 255, 0.22), 0 0 34px rgba(24, 188, 255, 0.16)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.08), 0 25px 70px rgba(0,0,0,0.4)"
      },
      animation: {
        pulseSlow: "pulse 4s ease-in-out infinite",
        scan: "scan 9s linear infinite"
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-200%)" },
          "100%": { transform: "translateY(200%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
