"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Calendar, Clock } from "lucide-react";

interface Dentist {
    id: string;
    name: string;
    specialization: string;
    image: string;
    rating: number;
    experience: string;
    schedule: string[];
    about?: string;
}

const DentistCard = ({ dentist }: { dentist: Dentist }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group flex flex-col">
            <div className="h-64 overflow-hidden relative bg-slate-100 shrink-0">
                <img
                    src={dentist.image}
                    alt={dentist.name}
                    className={`w-full h-full object-cover transform transition-transform duration-500 ${dentist.id === '1' ? 'object-[50%_100%] scale-125 group-hover:scale-[1.4]' : 'object-top group-hover:scale-110'}`}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow-sm">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-slate-800">{dentist.rating}</span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4 flex-grow">
                    <h3 className="text-xl font-bold mb-1 text-slate-900">{dentist.name}</h3>
                    <p className="text-primary text-sm font-medium uppercase tracking-wider mb-3">{dentist.specialization}</p>
                    <div className="relative">
                        <p className={`text-slate-500 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                            {dentist.about}
                        </p>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-xs font-bold text-primary mt-1 hover:underline focus:outline-none"
                        >
                            {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-secondary" />
                        {dentist.experience} Exp.
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-secondary" />
                        {dentist.schedule.length} Days/Wk
                    </div>
                </div>

                <Link
                    href="/booking"
                    className="block w-full text-center py-3 bg-slate-50 text-slate-900 font-bold rounded-lg border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-colors mt-auto"
                >
                    Book Appointment
                </Link>
            </div>
        </div>
    );
};

export default function DentistsPage() {
    const router = useRouter();
    const dentists = [
        {
            id: '1',
            name: 'Dr. Alexander Buygin',
            specialization: 'Orthodontist',
            image: '/sarah_wilson.jpg',
            rating: 4.9,
            experience: '15 Years',
            schedule: ['Mon', 'Wed', 'Fri'],
            about: 'Dr. Alexander is a renowned orthodontist with over 15 years of experience in creating beautiful smiles. He specializes in traditional braces, clear aligners, and complex jaw corrections. He is committed to staying updated with the latest advancements in orthodontics to provide the best care for his patients.'
        },
        {
            id: '2',
            name: 'Dr. Dan Kirky',
            specialization: 'Cosmetic Dentist',
            image: '/michael_chen.png',
            rating: 4.8,
            experience: '12 Years',
            schedule: ['Tue', 'Thu', 'Sat'],
            about: 'Dedicated to aesthetic perfection, Dr. Dan Kirky transforms smiles with veneers, bonding, and whitening. He believes every patient deserves a smile they are proud to show off. His artistic eye and precision ensure natural-looking results that enhance facial aesthetics.'
        },
        {
            id: '3',
            name: 'Dr. F. Khani',
            specialization: 'Pediatric Dentist',
            image: '/emily_parker.jpg',
            rating: 5.0,
            experience: '8 Years',
            schedule: ['Mon', 'Tue', 'Thu'],
            about: 'Dr. F. Khani creates a fun and safe environment for children. Her gentle approach and patience make dental visits a positive experience for kids of all ages. She focuses on preventive care and education to help children establish healthy oral hygiene habits for life.'
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12">
            <Link
                href="/?scrollTo=dentists"
                className="inline-flex items-center text-slate-500 hover:text-primary mb-8 transition-colors font-medium"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>

            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-slate-900">Our Specialists</h1>
                    <p className="text-slate-500 max-w-2xl">
                        Choose from our team of expert dentists. View their schedule and book an appointment instantly.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {dentists.map((dentist) => (
                        <DentistCard key={dentist.id} dentist={dentist} />
                    ))}
                </div>
            </div>
        </main>
    );
}
