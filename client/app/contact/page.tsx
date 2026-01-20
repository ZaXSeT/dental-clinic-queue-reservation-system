import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white text-slate-800 p-6 md:p-12 flex items-center justify-center">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
                <div className="p-10 bg-slate-50 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold mb-6 text-slate-900">Get in Touch</h1>
                    <p className="text-slate-500 mb-10">Have questions about our services or insurance? Our team is here to help you 24/7.</p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Visit Us</h3>
                                <p className="text-slate-500">123 Dental Street, Tebet, Jakarta Selatan, 12820</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Call Us</h3>
                                <p className="text-slate-500">+62 21 5555 0123</p>
                                <p className="text-slate-400 text-sm">Mon-Fri from 8am to 5pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Email Us</h3>
                                <p className="text-slate-500">support@antrigigi.id</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative h-full min-h-[400px] bg-white">
                    <form className="p-10 flex flex-col gap-6 h-full justify-center">
                        <h3 className="text-xl font-bold text-slate-900">Send us a message</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="First Name" className="bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-primary outline-none text-slate-900" />
                            <input type="text" placeholder="Last Name" className="bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-primary outline-none text-slate-900" />
                        </div>
                        <input type="email" placeholder="Email Address" className="bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-primary outline-none text-slate-900" />
                        <textarea placeholder="How can we help?" rows={4} className="bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-primary outline-none resize-none text-slate-900"></textarea>
                        <button className="bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">Send Message</button>
                    </form>
                </div>
            </div>
        </main>
    );
}

