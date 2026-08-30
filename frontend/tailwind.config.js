/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "#0C2340",
        "text-muted": "#475569",
        "text-light": "#64748B",
        accent: "#525CEB",
        "accent-purple": "#7342E2",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-soft": "#F1F5F9",
        success: "#00B386",
        warning: "#F59E0B",
        danger: "#EF4444",
        "razor-blue": "#0C8CE9",
        "razor-dark": "#0C2340",
        "razor-indigo": "#525CEB",
        "razor-purple": "#7342E2",
        "razor-green": "#00B386",
        "razor-green-soft": "#E6F9F4",
        "razor-amber": "#F59E0B",
        "razor-amber-soft": "#FEF3C7",
        "razor-red": "#EF4444",
        "razor-red-soft": "#FEE2E2",
        "razor-slate": "#F8FAFC",
        "razor-card": "#FFFFFF",
        "razor-border": "#E2E8F0",
      },
      fontFamily: {
        heading: ["'Helvetica Now Display Bold'", "'Inter'", "-apple-system", "sans-serif"],
        sans: ["'Inter'", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
