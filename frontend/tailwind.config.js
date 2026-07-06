/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066cc",
        secondary: "#667eea",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        dark: "#1f2937",
        light: "#f3f4f6",
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "28px"],
      },
    },
  },
  plugins: [],
};
