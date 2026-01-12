import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0ea5e9", // Sky-500
                secondary: "#6366f1", // Indigo-500
                accent: "#f43f5e", // Rose-500
                background: "#0f172a", // Slate-900 (Dark Mode default)
                surface: "#1e293b", // Slate-800
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
            }
        },
    },
    plugins: [],
};
export default config;
