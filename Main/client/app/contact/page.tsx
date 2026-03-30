import { useState, ChangeEvent, FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        if (!value) return "First name is required";
        if (!/^[A-Za-z\s'-]{2,16}$/.test(value))
          return "First name must be 2-16 letters and only contain letters";
        return "";
      case "lastName":
        if (!value) return "Last name is required";
        if (!/^[A-Za-z\s'-]{2,16}$/.test(value))
          return "Last name must be 2-16 letters and only contain letters";
        return "";
      case "email":
        const email = value.trim();
        if (!email) return "Email is required";
        if (!email.includes("@")) return "Email must contain @";

        const parts = email.split("@");
        if (parts.length !== 2) return "Email must have only one @";

        const domain = parts[1];
        if (!domain.includes(".")) return "Email must contain a domain";

        const tld = domain.split(".").pop();
        if (!tld || tld.length < 2) return "Email domain is invalid";

        if (email.length > 50) return "Email is too long";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters long";
        return "";
      case "message":
        if (!value) return "Message is required";
        if (value.length < 10) return "Message must be at least 10 characters";
        if (value.length > 100) return "Message must be less than 100 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update form state
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validate the field live
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newErrors: { [key: string]: string } = {};
    for (let key in form) {
      const errorMsg = validateField(key, form[key as keyof typeof form]);
      if (errorMsg) newErrors[key] = errorMsg;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", form);
      // reset form or send data
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-800 p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
        {/* LEFT SIDE */}
        <div className="p-10 bg-slate-50 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-6 text-slate-900">Get in Touch</h1>
          <p className="text-slate-500 mb-10">
            Have questions about our services or insurance? Our team is here to help you 24/7.
          </p>

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

        {/* RIGHT SIDE FORM */}
        <div className="relative h-full min-h-[400px] bg-white">
          <form autoComplete="off" onSubmit={handleSubmit} noValidate className="p-10 flex flex-col gap-6 h-full justify-center">
            <h3 className="text-xl font-bold text-slate-900">Send us a message</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  maxLength={16}
                 
                  className={`bg-slate-50 border p-3 rounded-lg outline-none text-slate-900 ${
                    errors.firstName ? "border-red-500" : "border-slate-200"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  maxLength={16}
                  className={`bg-slate-50 border p-3 rounded-lg outline-none text-slate-900 ${
                    errors.lastName ? "border-red-500" : "border-slate-200"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="text"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                maxLength={50}
                className={`bg-slate-50 border p-3 rounded-lg outline-none text-slate-900 w-full ${
                  errors.email ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors.email && (
                <div className="absolute -top-7 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-md">
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`bg-slate-50 border p-3 rounded-lg outline-none text-slate-900 ${
                  errors.password ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                placeholder="How can we help?"
                rows={4}
                value={form.message}
                onChange={handleChange}
                maxLength={100}
                className={`bg-slate-50 border p-3 rounded-lg outline-none resize-none text-slate-900 ${
                  errors.message ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <button className="bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}