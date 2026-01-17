"use client";

import Link from "next/link";
import { ArrowRight, Calendar, User, Clock, CheckCircle2, ShieldCheck, Mail, MapPin, Phone, Users, Trophy, Star, Zap, Sparkles, Monitor, Anchor, RefreshCw, Gamepad2, Heart, Fingerprint, ClipboardList, Stethoscope, MinusCircle, Smile, Component, Activity, Crown, Sun, Gem, Syringe, Scan, Layers } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Dentist {
    id: string;
    name: string;
    specialization: string;
    rating: number;
    experience: string;
    image: string;
    schedule: string[];
}

export default function Home() {
    const [dentists, setDentists] = useState<Dentist[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();


    useEffect(() => {
        // Handle scroll from other pages
        const section = searchParams.get('scrollTo');
        if (section === 'dentists') {
            const element = document.getElementById('dentists');
            if (element) {
                // Use a slight timeout to ensure DOM is ready and layout is stable
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                    // Clean URL
                    router.replace('/', { scroll: false });
                }, 100);
            }
        }

        // Force play video
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        }

        // Set Dentists Data
        setDentists([
            { id: '1', name: 'Dr. Alexander Buygin', specialization: 'Orthodontist', rating: 4.9, experience: '15 Years', image: '/sarah_wilson.jpg', schedule: [] },
            { id: '2', name: 'Dr. Dan Kirky', specialization: 'Cosmetic', rating: 4.8, experience: '12 Years', image: '/michael_chen.png', schedule: [] },
            { id: '3', name: 'Dr. F. Khani', specialization: 'Pediatric', rating: 5.0, experience: '8 Years', image: '/emily_parker.jpg', schedule: [] },
        ]);
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center justify-between text-slate-800 selection:bg-primary selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center w-full px-6 md:px-12 py-5">
                    <Link href="#home" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary">
                        <div className="h-10 w-10 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                        <span>Dental</span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex gap-8 font-medium text-slate-600">
                            <Link href="#about" className="hover:text-primary transition-colors">About</Link>
                            <Link href="#dentists" className="hover:text-primary transition-colors">Dentists</Link>
                            <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/booking" className="px-5 py-2.5 rounded-full bg-primary hover:bg-sky-600 text-white font-bold transition-all shadow-lg hover:shadow-primary/40">
                                Book Now
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative w-full min-h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden bg-slate-900">
                {/* Video Background */}
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

                {/* Overlay - Dark overlay for white text contrast */}
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

            {/* About Section */}
            <section id="about" className="py-12 px-6 w-full bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-primary font-bold uppercase tracking-widest mb-2">Our Workflow</h2>
                        <h3 className="text-4xl font-bold text-slate-900">Redefining Your Experience</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {[
                            { icon: Calendar, title: "Smart Booking", desc: "Real-time slot locking to prevent conflict." },
                            { icon: Clock, title: "Live Queue", desc: "Track your position from anywhere." },
                            { icon: User, title: "Top Specialists", desc: "Detailed profiles and ratings." },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 hover:border-primary/20 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 group">
                                <div className="bg-white w-20 h-20 rounded-2xl shadow-sm flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                    <item.icon className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Mission Content */}
                    <div className="bg-sky-50 rounded-[3rem] px-8 py-20 md:p-20 text-slate-900 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/60 to-transparent pointer-events-none"></div>
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h3 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-slate-900">We value your time as much as your smile.</h3>
                                <p className="text-slate-600 text-lg mb-10 leading-relaxed border-l-4 border-primary pl-6">
                                    No more waiting in crowded lobbies. Our system creates a seamless flow from your home to the dental chair.
                                </p>

                                <div className="grid grid-cols-2 gap-y-4">
                                    {["State-of-the-Art Facility", "Certified Specialists", "Painless Treatments", "Digital X-Ray Labs"].map((txt, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="text-primary h-5 w-5" />
                                            <span className="font-medium text-slate-700">{txt}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center">
                                {[
                                    { icon: Users, label: "Patients", val: "10k+" },
                                    { icon: ShieldCheck, label: "Experience", val: "15y" },
                                    { icon: Trophy, label: "Awards", val: "24" },
                                    { icon: CheckCircle2, label: "Satisfaction", val: "99%" },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all">
                                        <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                                        <div className="text-3xl font-bold mb-1 text-slate-900">{stat.val}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Treatments Section */}
            <section id="treatments" className="py-12 px-6 w-full bg-white text-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-primary font-bold uppercase tracking-widest mb-2">Our Services</h2>
                        <h3 className="text-4xl font-bold text-slate-900">Comprehensive Care</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Dental Check Up", image: "/dental_checkup.png", desc: "Ensure your dental health with regular dental check-ups. Schedule now for a beautiful and problem-free smile." },
                            { title: "Teeth Scaling", image: "/teeth_scaling.png", desc: "Optimize your dental health with regular scaling. Remove plaque and tartar for a shining smile." },
                            { title: "Dental Fillings", image: "/dental_fillings.png", desc: "Dental fillings help repair damage and maintain tooth strength. Get treatment immediately for a healthy charm." },
                            { title: "Tooth Extraction", image: "/tooth_extraction.png", desc: "Afraid of extraction? Don't worry! This procedure can help overcome pain, and the process is painless." },
                            { title: "Dental Braces", image: "/dental_braces.png", desc: "Dental braces help straighten teeth and boost confidence. Discover modern solutions for a perfect smile." },
                            { title: "Dentures", image: "/dentures.png", desc: "Dentures provide a practical solution to replace missing teeth, restoring your smile and comfort." },
                            { title: "Root Canal", image: "/root_canal.png", desc: "Disturbed tooth nerves can be very painful. Root canal treatment helps relieve pain and improve health." },
                            { title: "Dental Crowns", image: "/dental_crowns.png", desc: "Dental crowns are strong and aesthetic tooth protectors. Get durable restoration with high-quality crowns." },
                            { title: "Teeth Whitening", image: "/teeth_whitening.png", desc: "Teeth whitening is an effective way to whiten teeth. Get a bright smile and higher self-confidence." },
                            { title: "Dental Veneers", image: "/dental_veneers.png", desc: "Improve your teeth's appearance with stunning dental veneers. Get a perfect smile and high self-confidence." },
                            { title: "Dental Implants", image: "/dental_implants.png", desc: "Dental implants are a permanent solution for missing teeth. Don't let tooth loss hinder your quality of life." },
                            { title: "Tooth Diamond", image: "/tooth_diamond.png", desc: "Tooth diamonds highlight your smile with the sparkle of a diamond. Find your unique style." },
                            { title: "Wisdom Surgery", image: "/wisdom_surgery.png", desc: "Wisdom teeth surgery is an important surgical procedure to address abnormally growing wisdom teeth." },
                            { title: "Dental X-Ray", image: "/dental_xray.png", desc: "Early detection of problems, visualizing tooth structure, roots, and bone condition for accurate diagnosis." },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1 group">
                                <div className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform">
                                    <div
                                        className="w-full h-full bg-primary"
                                        style={{
                                            maskImage: `url(${item.image})`,
                                            WebkitMaskImage: `url(${item.image})`,
                                            maskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            maskPosition: 'center'
                                        }}
                                    />
                                </div>
                                <h4 className="text-lg font-bold mb-2 text-slate-900">{item.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dentists Section */}
            <section id="dentists" className="py-24 bg-slate-50 w-full px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-primary font-bold uppercase tracking-widest mb-2">Our Team</h2>
                            <h3 className="text-4xl font-bold text-slate-900">Meet The Specialists</h3>
                        </div>
                        <Link href="/dentists" className="hidden md:flex items-center gap-2 font-bold text-slate-600 hover:text-primary transition-colors group">
                            View All Dentists <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {dentists.map((dentist) => (
                            <div key={dentist.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all border border-slate-100 group">
                                <div className="h-72 overflow-hidden relative bg-slate-200">
                                    <img
                                        src={dentist.image}
                                        alt={dentist.name}
                                        className={`w-full h-full object-cover transform transition-transform duration-700 ${dentist.id === '1' ? 'object-[50%_100%] scale-125 group-hover:scale-[1.4]' : 'object-top group-hover:scale-110'}`}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-sm">
                                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-slate-900">{dentist.rating}</span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold mb-1 text-slate-900">{dentist.name}</h3>
                                        <p className="text-primary font-bold text-sm uppercase tracking-wider">{dentist.specialization}</p>
                                    </div>

                                    <Link
                                        href="/booking"
                                        className="block w-full text-center py-4 bg-slate-50 text-slate-900 font-bold rounded-xl border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                                    >
                                        Book Appointment
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



            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 w-full bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Contact Form */}
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 h-full flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Get in Touch</h2>
                        <p className="text-slate-500 mb-8">Have questions? Send us a message and we'll reply as soon as possible.</p>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-primary focus:outline-none bg-white" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-primary focus:outline-none bg-white" placeholder="(021) 555-0123" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-primary focus:outline-none bg-white h-32 resize-none" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="button" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-sky-600 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                Send Message <ArrowRight className="h-5 w-5" />
                            </button>
                        </form>
                    </div>

                    {/* Right: Info & Map */}
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Contact Information</h2>

                        <div className="space-y-6 mb-10">
                            <div className="flex gap-4">
                                <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Our Location</h4>
                                    <p className="text-slate-500">
                                        Jl. Bantaran Sungai, Hutan, Kec. Percut Sei Tuan,<br />
                                        Kabupaten Deli Serdang, Sumatera Utara 20371
                                    </p>
                                    <a href="https://www.google.com/maps/search/?api=1&query=Go+Dental+Clinic+(Part+Of+Medan+Dental+Center)" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-primary font-bold hover:underline text-sm">Get Directions</a>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Opening Hours</h4>
                                    <p className="text-slate-500">
                                        Monday - Saturday: 09:00 - 21:00<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Phone</h4>
                                    <p className="text-slate-500 font-medium">(021) 555-0123</p>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="w-full h-[300px] bg-slate-200 rounded-3xl overflow-hidden shadow-inner border border-slate-300 relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d995.4896822145192!2d98.74468189569045!3d3.596933230626246!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131d0d6826859%3A0xd4b27636dae03e17!2sGo%20Dental%20Clinic%20(Part%20Of%20Medan%20Dental%20Center)!5e0!3m2!1sen!2sid!4v1768415380457!5m2!1sen!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full bg-slate-50 text-slate-600 py-16 px-6 border-t border-slate-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                        <div className="h-8 w-8 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                        Dental
                    </div>
                    <p>© 2026 AntriReservasi Klinik Gigi. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                        <Link href="/admin/login" className="hover:text-primary transition-colors">Admin</Link>
                    </div>
                </div>
            </footer>
        </main >
    );
}
