"use client";

import { ChevronLeft, ChevronRight, Star, User } from "lucide-react";
import { useEffect, useState } from "react";
import { reviews } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ReviewsSection() {
    const [currentReview, setCurrentReview] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 767px)").matches);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentReview((prev) => {
                const maxIndex = isMobile ? 4 : 2;
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [isMobile]);

    return (
        <section className="py-8 px-6 w-full bg-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <SectionHeading subTitle="Testimonials" title="What Our Patients Say" />

                <div className="relative group px-4 md:px-12">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => {
                            const maxIndex = 5 - (isMobile ? 1 : 3);
                            setCurrentReview((prev) => (prev <= 0 ? maxIndex : prev - 1));
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all shadow-sm hidden md:flex hover:bg-primary hover:text-white hover:border-primary active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => {
                            const maxIndex = 5 - (isMobile ? 1 : 3);
                            setCurrentReview((prev) => (prev >= maxIndex ? 0 : prev + 1));
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all shadow-sm hidden md:flex hover:bg-primary hover:text-white hover:border-primary active:scale-95 cursor-pointer"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${Math.min(currentReview, 5 - (isMobile ? 1 : 3)) * (isMobile ? 100 : 33.333)}%)` }}
                        >
                            {reviews.map((review, i) => (
                                <div key={i} className="min-w-full md:min-w-[33.333%] px-3">
                                    <div className="bg-white border border-slate-100 p-6 rounded-2xl h-full flex flex-col justify-between hover:border-slate-300 transition-colors">
                                        <div>
                                            <div className="flex gap-0.5 mb-4">
                                                {[...Array(review.rating)].map((_, r) => (
                                                    <Star key={r} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                                ))}
                                            </div>
                                            <p className="text-slate-600 mb-6 italic text-sm leading-relaxed">"{review.text}"</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                <User className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{review.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-1.5 mt-8">
                        {[...Array(isMobile ? 5 : 3)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentReview(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${Math.min(currentReview, 5 - (isMobile ? 1 : 3)) === idx ? 'w-6 bg-primary' : 'w-1.5 bg-slate-200 hover:bg-slate-300'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
