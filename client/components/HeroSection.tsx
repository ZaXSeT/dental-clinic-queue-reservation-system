"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export default function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        }
    }, []);

    return (
        <section id="home" className="relative w-full min-h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden bg-slate-900">
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                onCanPlay={() => videoRef.current?.play()}
                onEnded={() => videoRef.current?.play()}
                key="dental-bg-main"
            >
                <source src="/resources/bg.mp4" type="video/mp4" />
            </video>

            <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10 pointer-events-none"></div>

            <div className="relative z-20 px-6 md:px-12 max-w-7xl mx-auto w-full pt-20 flex flex-col items-center">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl flex flex-col items-center">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 text-white leading-[1.05]">
                        Where Every Smile <br />
                        Matters
                    </h1>
                    <p className="text-xl md:text-2xl text-white mb-10 font-medium leading-relaxed max-w-3xl mx-auto tracking-tight drop-shadow-md">
                        Personalized dental services using advanced techniques to keep your smile bright and healthy.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
                        <Link href="/booking" className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-primary px-10 font-bold text-white duration-300 hover:bg-sky-600 transition-all shadow-xl hover:shadow-primary/40 hover:-translate-y-1">
                            <span className="mr-3 text-xl">Get Started</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="/queue" className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-white/10 backdrop-blur-md border border-white/30 px-10 font-bold text-white duration-300 hover:bg-white/20 transition-all shadow-lg hover:shadow-white/10 hover:-translate-y-1">
                            <Clock className="mr-3 h-5 w-5" />
                            <span className="text-xl">Live Queue</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
