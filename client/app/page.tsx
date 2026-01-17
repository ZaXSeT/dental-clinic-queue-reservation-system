"use client";

import Link from "next/link";
import { ArrowRight, Calendar, User, Clock, CheckCircle2, ShieldCheck, Mail, MapPin, Phone, Users, Trophy, Star, Zap, Sparkles, Monitor, Anchor, RefreshCw, Gamepad2, Heart, Fingerprint, ClipboardList, Stethoscope, MinusCircle, Smile, Component, Activity, Crown, Sun, Gem, Syringe, Scan, Layers, ChevronLeft, ChevronRight } from "lucide-react";
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

    useEffect(() => {
        
        const section = searchParams.get('scrollTo');
        if (section === 'dentists') {
            const element = document.getElementById('dentists');
            if (element) {
                
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                    
                    router.replace('/', { scroll: false });
                }, 100);
            }
        }

        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        }

        setDentists([
            { id: '1', name: 'Dr. Alexander Buygin', specialization: 'General Dentist', rating: 4.9, experience: '15 Years', image: '/sarah_wilson.jpg', schedule: [] },
            { id: '2', name: 'Dr. Dan Adler', specialization: 'General Dentist', rating: 4.8, experience: '12 Years', image: '/dan_adler.png', schedule: [] },
            { id: '3', name: 'Dr. F. Khani', specialization: 'General Dentist', rating: 5.0, experience: '8 Years', image: '/emily_parker.jpg', schedule: [] },
        ]);
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center justify-between text-slate-800 selection:bg-primary selection:text-white">
            
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center w-full px-6 md:px-12 py-5">
                    <Link href="#home" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary">
                        <div className="h-10 w-10 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                        <span>Dental</span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex gap-8 font-medium text-slate-600">
                            <Link href="#workflow" className="hover:text-primary transition-colors">About</Link>
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

            <section id="workflow" className="py-12 px-6 w-full bg-white scroll-mt-28">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-primary font-bold uppercase tracking-widest mb-2">Our Workflow</h2>
                        <h3 className="text-4xl font-bold text-slate-900">Redefining Your Experience</h3>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8 mb-12 md:mb-20">
                        {[
                            { icon: Calendar, title: "Smart Booking", desc: "Real-time slot locking to prevent conflict." },
                            { icon: Clock, title: "Live Queue", desc: "Track your position from anywhere." },
                            { icon: User, title: "Top Specialists", desc: "Detailed profiles and ratings." },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 p-3 md:p-10 rounded-xl md:rounded-[2rem] border border-slate-100 hover:border-primary/20 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 group flex flex-col items-center text-center">
                                <div className="bg-white w-10 h-10 md:w-20 md:h-20 rounded-lg md:rounded-2xl shadow-sm flex items-center justify-center mb-3 md:mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                    <item.icon className="h-5 w-5 md:h-10 md:w-10 text-primary" />
                                </div>
                                <h3 className="text-xs md:text-2xl font-bold mb-1 md:mb-4 text-slate-900 leading-tight">{item.title}</h3>
                                <p className="text-slate-500 leading-tight text-[9px] md:text-lg">{item.desc}</p>
                            </div>
                        ))}
                    </div>

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

            <section id="dentists" className="py-24 bg-slate-50 w-full px-6 scroll-mt-28">
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

            <section className="py-8 px-6 w-full bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Testimonials</h2>
                        <h3 className="text-3xl font-bold text-slate-900">What Our Patients Say</h3>
                    </div>

                    <div className="relative group px-4 md:px-12">
                        
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
                                {[
                                    {
                                        name: "Riri Riza",
                                        role: "Film Director",
                                        text: "Saya rutin check-up dengan Dr. Alexander Buygin. Beliau sangat teliti dan penjelasannya mudah dimengerti.",
                                        image: "/sarah_wilson.jpg",
                                        rating: 5
                                    },
                                    {
                                        name: "Tessa Kaunang",
                                        role: "Artist & Presenter",
                                        text: "Veneer porcelain dengan Dr. Dan Adler hasilnya sangat natural dan rapi. Saya jadi lebih percaya diri saat tampil di TV.",
                                        image: "/emily_parker.jpg",
                                        rating: 5
                                    },
                                    {
                                        name: "Saleha Halilintar",
                                        role: "Influencer",
                                        text: "Perawatan gigi dengan Dr. F. Khani sangat nyaman. Orangnya ramah banget, jadi ga takut sama sekali.",
                                        image: "/michael_chen.png",
                                        rating: 5
                                    },
                                    {
                                        name: "Budi Santoso",
                                        role: "Entrepreneur",
                                        text: "Dr. Dan Adler sangat profesional. Klinik ini benar-benar mengutamakan kenyamanan pasien.",
                                        image: "/sarah_wilson.jpg",
                                        rating: 5
                                    },
                                    {
                                        name: "Siti Aminah",
                                        role: "Housewife",
                                        text: "Anak saya biasanya nangis kalau ke dokter gigi, tapi dengan Dr. F. Khani dia malah senang dan mau balik lagi.",
                                        image: "/emily_parker.jpg",
                                        rating: 5
                                    }
                                ].map((review, i) => (
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

            <section id="contact" className="py-24 px-6 w-full bg-white scroll-mt-28">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
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

            <footer className="w-full bg-slate-50 text-slate-600 py-16 px-6 border-t border-slate-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                        <div className="h-8 w-8 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                        Dental
                    </div>
                    <p>© 2026 Dental. All rights reserved.</p>
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
