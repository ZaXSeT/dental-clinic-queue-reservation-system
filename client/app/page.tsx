import Link from "next/link";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-between text-white selection:bg-primary selection:text-white">
            {/* Navigation */}
            <nav className="w-full flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    AntriGigi
                </div>
                <div className="flex gap-6">
                    <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                    <Link href="/dentists" className="hover:text-primary transition-colors">Dentists</Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                </div>
                <div className="flex gap-4">
                    <Link href="/login" className="px-4 py-2 rounded-full border border-gray-600 hover:border-primary transition-colors">
                        Login
                    </Link>
                    <Link href="/book" className="px-4 py-2 rounded-full bg-primary hover:bg-sky-600 text-white font-medium transition-colors shadow-lg shadow-primary/20">
                        Book Appointment
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex-1 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto mt-20 mb-32">
                <h1 className="text-6xl font-extrabold tracking-tight mb-6">
                    Modern Dental Care <br />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Simplified.
                    </span>
                </h1>
                <p className="text-lg text-gray-400 mb-10 max-w-2xl">
                    Experience the future of dentistry with our real-time queueing system, simplified booking, and world-class specialists.
                </p>

                <div className="flex gap-4">
                    <Link href="/book" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-primary px-8 font-medium text-neutral-50 duration-300 hover:bg-sky-600 hover:w-56 w-48 transition-all">
                        <span className="mr-2">Get Started</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <button className="px-8 py-3 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors">
                        View Live Queue
                    </button>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl px-6 w-full mb-20">
                {[
                    { icon: Calendar, title: "Smart Booking", desc: "Real-time slot locking to prevent conflict." },
                    { icon: Clock, title: "Live Queue", desc: "Track your position from anywhere." },
                    { icon: User, title: "Top Specialists", desc: "Detailed profiles and ratings." },
                ].map((item, i) => (
                    <div key={i} className="bg-surface p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-colors group">
                        <item.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-400">{item.desc}</p>
                    </div>
                ))}
            </section>

            <footer className="w-full text-center py-8 text-gray-600 border-t border-gray-800">
                © 2026 AntriReservasi Klinik Gigi. All rights reserved.
            </footer>
        </main>
    );
}
