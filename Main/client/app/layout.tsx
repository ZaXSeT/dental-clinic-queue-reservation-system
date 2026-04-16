// Deploy at: 2026-04-17 01:36
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "AtriReservasi - Dental Clinic",
    description: "Advanced Dental Appointment & Queue System",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${jakarta.className} antialiased`}>
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            </body>
        </html>
    );
}
