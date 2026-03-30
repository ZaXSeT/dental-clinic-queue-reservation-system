'use client';

import { useState } from 'react';
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { officeInfo } from "@/lib/data";
import { createContactMessage } from '@/actions/contact'; 

export default function ContactSection() {
const allowedDomains = ["gmail.com", "yahoo.com", "yahoo.co.id", "outlook.com"];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- validation functions ---
  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        if (!value) return "Name is required";
        if (!/^[A-Za-z\s'-]{2,16}$/.test(value))
          return "Name must be 2-16 letters and only contain letters";
        return "";
      case "message":
        if (!value) return "Message is required";
        if (value.length < 10) return "Message must be at least 10 characters";
        if (value.length > 300) return "Message must be less than 300 characters";
        return "";
      default:
        return "";
    }
  };

  const validateEmail = (value: string) => {
  if (!value) return "Email is required";
  if (!value.includes("@")) return "Email must contain @";

  const [local, domain] = value.split("@");
  if (!local || !domain) return "Invalid email format";

  if (local.length > 20) return "Local part too long";
  if (!allowedDomains.includes(domain)) return "Email domain not allowed (only gmail.com, yahoo.com, yahoo.co.id, outlook.com)";

  return "";
};

  // --- handle input change with live validation ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name: field, value } = e.target;

    if (field === "name") {
      if (value.length <= 16) setName(value); // hard max
    }
    else if (field === "email") {
  const atIndex = value.indexOf("@");

  if (atIndex === -1) {
    // No @ yet → only local part
    setEmail(value.slice(0, 20));
  } else {
    // Local part
    const local = value.slice(0, atIndex).slice(0, 20);

    // After @
    let afterAt = value.slice(atIndex + 1);
    const lastDot = afterAt.lastIndexOf(".");
    let domain = afterAt;
    let tld = "";

    if (lastDot !== -1) {
      domain = afterAt.slice(0, lastDot).slice(0, 20); // max 20 chars
      tld = afterAt.slice(lastDot + 1).slice(0, 6);   // max 6 chars
    } else {
      domain = afterAt.slice(0, 20);
    }

    const newValue = lastDot === -1 ? `${local}@${domain}` : `${local}@${domain}.${tld}`;
    setEmail(newValue);
  }
}
    else if (field === "message") {
      if (value.length <= 300) setMessage(value); // hard max
    }

    // Validate
    let errorMsg = "";
    if (field === "email") errorMsg = validateEmail(value);
    else errorMsg = validateField(field, value);

    setErrors(prev => ({ ...prev, [field]: errorMsg }));
  };
const handleEmailChange = (value: string) => {
  const atIndex = value.indexOf("@");
  
  if (atIndex === -1) {
    // Before @ → limit to 20 chars
    setEmail(value.slice(0, 20));
  } else {
    // Local part
    const local = value.slice(0, atIndex).slice(0, 20);

    // Domain → only allow typing if it starts with a valid domain
    const typedDomain = value.slice(atIndex + 1);
    const matchingDomain = allowedDomains.find(d => d.startsWith(typedDomain));
    
    if (matchingDomain) {
      setEmail(`${local}@${typedDomain}`);
    } else {
      // block further typing if domain is invalid
      setEmail(`${local}@${typedDomain.slice(0, typedDomain.length - 1)}`);
    }
  }
};
  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {
      name: validateField("name", name),
      email: validateEmail(email),
      message: validateField("message", message),
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(err => err)) return;

    setLoading(true);
    try {
      await createContactMessage({ name, email, message });
      await new Promise(resolve => setTimeout(resolve, 1000));
      setName('');
      setEmail('');
      setMessage('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 w-full bg-white scroll-mt-28">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Form */}
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Get in Touch</h2>
          <p className="text-slate-500 mb-8">Have questions? Send us a message and we'll reply as soon as possible.</p>

          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            {/* Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={name}
                onChange={handleChange}
                autoComplete="new-name"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${errors.name ? "border-red-500" : "border-slate-200"}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="text"
                name="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={handleChange}
                autoComplete="new-email"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${errors.email ? "border-red-500" : "border-slate-200"}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Message */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                name="message"
                placeholder="How can we help you?"
                value={message}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none resize-none h-32 ${errors.message ? "border-red-500" : "border-slate-200"}`}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-sky-600 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : 'Send Message'} <ArrowRight className="h-5 w-5" />
            </button>

            {success && <p className="text-green-600 mt-2 font-medium">Message sent successfully!</p>}
          </form>
        </div>

        {/* Right Contact Info */}
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
                <p className="text-slate-500">{officeInfo.hours[0]}<br />{officeInfo.hours[1]}</p>
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