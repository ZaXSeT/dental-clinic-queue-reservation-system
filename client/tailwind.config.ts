import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0ea5e9", 
                secondary: "#14b8a6", 
                accent: "#f43f5e", 
                background: "#ffffff", 
                surface: "#f8fafc", 
                dark: "#0f172a", 
                muted: "#64748b", 
            },
            fontFamily: {
                sans: ['var(--font-jakarta)'],
            }
        },
    },
    plugins: [],
};
export default config;
