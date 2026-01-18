"use client";

import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { dentists } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

export default function DentistsSection() {
    return (
        <section id="dentists" className="py-24 bg-slate-50 w-full px-6 scroll-mt-28">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-16">
                    <SectionHeading subTitle="Our Team" title="Meet The Specialists" center={false} />
                    <Link href="/dentists" className="hidden md:flex items-center gap-2 font-bold text-slate-600 hover:text-primary transition-colors group mb-6">
                        View All Dentists <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8">
                    {dentists.map((dentist) => (
                        <div key={dentist.id} className="bg-white rounded-xl md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all border border-slate-100 group">
                            <div className="h-32 md:h-72 overflow-hidden relative bg-slate-200">
                                <img
                                    src={dentist.image}
                                    alt={dentist.name}
                                    className={`w-full h-full object-cover transform transition-transform duration-700 ${dentist.id === '1' ? 'object-[50%_100%] scale-125 group-hover:scale-[1.4]' : 'object-top group-hover:scale-110'}`}
                                />
                                <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-full flex items-center gap-1 text-[10px] md:text-sm font-bold shadow-sm">
                                    <Star className="h-2 w-2 md:h-3 md:w-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-slate-900">{dentist.rating}</span>
                                </div>
                            </div>

                            <div className="p-3 md:p-8">
                                <div className="mb-3 md:mb-6">
                                    <h3 className="text-xs md:text-xl font-bold mb-0.5 md:mb-1 text-slate-900 truncate">{dentist.name}</h3>
                                    <p className="text-primary font-bold text-[8px] md:text-sm uppercase tracking-wider truncate">{dentist.specialization}</p>
                                </div>

                                <Link
                                    href="/booking"
                                    className="block w-full text-center py-2 md:py-4 bg-slate-50 text-slate-900 font-bold rounded-lg md:rounded-xl border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-colors text-[10px] md:text-base"
                                >
                                    <span className="md:hidden">Book</span>
                                    <span className="hidden md:inline">Book Appointment</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/dentists" className="inline-flex items-center gap-2 font-bold text-slate-600">
                        View All Dentists <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
