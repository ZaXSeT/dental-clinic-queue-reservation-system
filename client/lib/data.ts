
import { Calendar, Clock, User, CheckCircle2, Users, ShieldCheck, Trophy } from "lucide-react";

export const services = [
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
];

export const workflowSteps = [
    { icon: Calendar, title: "Smart Booking", desc: "Real-time slot locking to prevent conflict." },
    { icon: Clock, title: "Live Queue", desc: "Track your position from anywhere." },
    { icon: User, title: "Top Specialists", desc: "Detailed profiles and ratings." },
];

export const workflowStats = [
    { icon: Users, label: "Patients", val: "10k+" },
    { icon: ShieldCheck, label: "Experience", val: "15y" },
    { icon: Trophy, label: "Awards", val: "24" },
    { icon: CheckCircle2, label: "Satisfaction", val: "99%" },
];

export const workflowFeatures = ["State-of-the-Art Facility", "Certified Specialists", "Painless Treatments", "Digital X-Ray Labs"];

export const reviews = [
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
];

export interface Dentist {
    id: string;
    name: string;
    specialization: string;
    rating: number;
    experience: string;
    image: string;
    schedule: string[];
}

export const dentists: Dentist[] = [
    { id: '1', name: 'Dr. Alexander Buygin', specialization: 'General Dentist', rating: 4.9, experience: '15 Years', image: '/sarah_wilson.jpg', schedule: [] },
    { id: '2', name: 'Dr. Dan Adler', specialization: 'General Dentist', rating: 4.8, experience: '12 Years', image: '/dan_adler.png', schedule: [] },
    { id: '3', name: 'Dr. F. Khani', specialization: 'General Dentist', rating: 5.0, experience: '8 Years', image: '/emily_parker.jpg', schedule: [] },
];

export const officeInfo = {
    address: {
        line1: "Jl. Bantaran Sungai, Hutan, Kec. Percut Sei Tuan,",
        line2: "Kabupaten Deli Serdang, Sumatera Utara 20371",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Go+Dental+Clinic+(Part+Of+Medan+Dental+Center)",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d995.4896822145192!2d98.74468189569045!3d3.596933230626246!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131d0d6826859%3A0xd4b27636dae03e17!2sGo%20Dental%20Clinic%20(Part+Of+Medan+Dental+Center)!5e0!3m2!1sen!2sid!4v1768415380457!5m2!1sen!2sid"
    },
    hours: [
        "Monday - Saturday: 09:00 - 21:00",
        "Sunday: Closed"
    ],
    phone: "(021) 555-0123"
};
