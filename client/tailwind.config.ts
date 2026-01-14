import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0ea5e9", // Sky-500 (Clean Blue)
                secondary: "#14b8a6", // Teal-500 (Medical Green)
                accent: "#f43f5e", // Rose-500 (Gums/Alert)
                background: "#ffffff", // Pure White
                surface: "#f8fafc", // Slate-50 (Very light grey for cards)
                dark: "#0f172a", // Navy for text
                muted: "#64748b", // Slate-500 for secondary text
            },
            fontFamily: {
                sans: ['var(--font-jakarta)'],
            }
        },
    },
    plugins: [],
};
export default config;
