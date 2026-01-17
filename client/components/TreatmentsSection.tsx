export default function TreatmentsSection() {
    return (
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
    );
}
