import { services } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

export default function TreatmentsSection() {
    return (
        <section id="treatments" className="py-12 px-6 w-full bg-white text-slate-900 scroll-mt-28">
            <div className="max-w-7xl mx-auto">
                <SectionHeading subTitle="Our Services" title="Comprehensive Care" />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {services.map((item, i) => (
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
