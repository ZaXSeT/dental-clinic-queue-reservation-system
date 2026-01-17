"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyTermsPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12">
            <Link
                href="/"
                scroll={false}
                className="inline-flex items-center text-slate-500 hover:text-primary mb-8 transition-colors font-medium"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>

            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 border-b border-slate-100 pb-6">Privacy Policy & Terms</h1>

                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-600 mb-6">
                        Last updated: {new Date().getFullYear()}
                    </p>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Privacy Policy</h2>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h3>
                            <p className="text-slate-600 mb-3">We may collect the following types of information:</p>
                            <ul className="list-disc pl-5 text-slate-600 space-y-2">
                                <li><strong>Personal Information:</strong> Name, phone number, email address when booking.</li>
                                <li><strong>Health Information:</strong> Dental history necessary for treatment.</li>
                                <li><strong>Technical Data:</strong> IP address and cookie usage.</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Use of Information</h3>
                            <p className="text-slate-600">
                                We use your data to schedule appointments, provide care, and improve our services. We do not sell your personal information.
                            </p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Terms & Conditions</h2>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Appointments</h3>
                            <p className="text-slate-600">
                                Please provide 24 hours notice for cancellations. Missed appointments may incur fees.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Payment</h3>
                            <p className="text-slate-600">
                                Payment is due at the time of service. We accept credit cards, cash, and insurance.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Liability</h3>
                            <p className="text-slate-600">
                                You are responsible for providing accurate medical history.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
