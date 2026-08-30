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
        ink: "#121816",
        "ink-soft": "#4F5B56",
        paper: "#F4F1EA",
        "paper-dark": "#EAE5DA",
        surface: "#FFFCF5",
        line: "#D7D2C8",
        signal: "#E96B3D",
        "signal-dark": "#C84F27",
        safe: "#2D7A61",
        warning: "#C98B27",
        danger: "#B94343",
        "blue-ink": "#29465B",
        muted: "#8A918D",
      },
      fontFamily: {
        display: ["'DM Sans'", "-apple-system", "sans-serif"],
        heading: ["'DM Sans'", "-apple-system", "sans-serif"],
        body: ["'Manrope'", "-apple-system", "sans-serif"],
        sans: ["'Manrope'", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '4px',
        md: '8px',
        lg: '8px',
        full: '999px',
      },
    },
  },
  plugins: [],
};
