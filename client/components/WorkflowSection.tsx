import { Calendar, Clock, User, CheckCircle2, Users, ShieldCheck, Trophy } from "lucide-react";

export default function WorkflowSection() {
    return (
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
    );
}
