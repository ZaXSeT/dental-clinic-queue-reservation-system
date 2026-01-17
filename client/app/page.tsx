"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WorkflowSection from "../components/WorkflowSection";
import TreatmentsSection from "../components/TreatmentsSection";
import DentistsSection from "../components/DentistsSection";
import ReviewsSection from "../components/ReviewsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function Home() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // Prevent default browser scroll restoration to ensure animation plays
        if (typeof window !== 'undefined' && window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Handle active section tracking
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        try {
                            sessionStorage.setItem('lastSection', entry.target.id);
                        } catch (e) {
                            // Ignore storage errors
                        }
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 50% of the section is visible
        );

        const sections = ['home', 'workflow', 'treatments', 'dentists', 'contact'];
        sections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        // ----------------------------------------------------
        // Handle Scroll Restoration / Navigation
        // ----------------------------------------------------
        const paramSection = searchParams.get('scrollTo');
        let targetSection = paramSection;

        // If no URL param, check storage
        if (!targetSection) {
            try {
                targetSection = sessionStorage.getItem('lastSection');
            } catch (e) {
                // Ignore
            }
        }

        if (targetSection) {
            const attemptScroll = (retries = 0) => {
                const element = document.getElementById(targetSection!); // targetSection is definitely string here
                if (element) {
                    element.scrollIntoView({ behavior: 'auto' });
                    // Only clean URL if it was a param
                    if (paramSection) {
                        router.replace('/', { scroll: false });
                    }
                } else if (retries < 20) {
                    // Retry every 100ms, up to 20 times (2 seconds)
                    setTimeout(() => attemptScroll(retries + 1), 100);
                }
            };

            // Initial attempt immediately
            attemptScroll();
        }

        return () => {
            observer.disconnect();
        };
    }, [searchParams, router]);


    return (
        <main className="min-h-screen flex flex-col items-center justify-between text-slate-800 selection:bg-primary selection:text-white">
            <Navbar />
            <HeroSection />
            <WorkflowSection />
            <TreatmentsSection />
            <DentistsSection />
            <ReviewsSection />
            <ContactSection />
            <Footer />
        </main>
    );
}
