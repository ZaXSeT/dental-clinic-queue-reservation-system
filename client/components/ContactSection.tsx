import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { officeInfo } from "@/lib/data";

export default function ContactSection() {
    return (
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
                            <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-primary focus:outline-none bg-white" placeholder={officeInfo.phone} />
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
                                    {officeInfo.address.line1}<br />
                                    {officeInfo.address.line2}
                                </p>
                                <a href={officeInfo.address.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-primary font-bold hover:underline text-sm">Get Directions</a>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Opening Hours</h4>
                                <p className="text-slate-500">
                                    {officeInfo.hours[0]}<br />
                                    {officeInfo.hours[1]}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Phone</h4>
                                <p className="text-slate-500 font-medium">{officeInfo.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[300px] bg-slate-200 rounded-3xl overflow-hidden shadow-inner border border-slate-300 relative">
                        <iframe
                            src={officeInfo.address.mapEmbed}
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
    );
}
