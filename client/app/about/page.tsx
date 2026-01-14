import Link from "next/link";
import { CheckCircle2, ShieldCheck, Users, Trophy } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white text-slate-800">
            {/* Hero Section */}
            <section className="relative py-20 px-6 text-center bg-gradient-to-b from-sky-50 to-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Redefining Dental Care</h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    At AntriGigi, we combine advanced technology with compassionate care to create a seamless, stress-free dental experience.
                </p>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2668&auto=format&fit=crop"
                        alt="Clinic Interior"
                        className="rounded-2xl shadow-2xl border border-slate-100"
                    />
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
                    <p className="text-slate-600 leading-relaxed">
                        We believe your time is as valuable as your smile. That's why we built the world's first <span className="text-slate-900 font-semibold">Real-time Queue Integration</span> system. No more waiting in crowded lobbies. Book, track, and arrive exactly when it's your turn.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {[
                            "State-of-the-Art Facility",
                            "Certified Specialists",
                            "Painless Treatments",
                            "Digital X-Ray Labs"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="text-secondary h-5 w-5" />
                                <span className="text-sm font-medium text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-50 py-16 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { icon: Users, label: "Patients Served", val: "10k+" },
                        { icon: ShieldCheck, label: "Years Experience", val: "15+" },
                        { icon: Trophy, label: "Awards Won", val: "24" },
                        { icon: CheckCircle2, label: "Satisfaction", val: "99%" },
                    ].map((stat, i) => (
                        <div key={i} className="p-4">
                            <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                            <div className="text-3xl font-bold mb-1 text-slate-900">{stat.val}</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready for a checkup?</h2>
                <Link
                    href="/book"
                    className="inline-block px-8 py-3 bg-primary hover:bg-sky-600 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-primary/50"
                >
                    Book Appointment Now
                </Link>
            </section>
        </main>
    );
}
