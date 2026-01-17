import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-slate-50 text-slate-600 py-16 px-6 border-t border-slate-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <div className="h-8 w-8 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                    Dental
                </div>
                <p>© 2026 Dental. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                    <Link href="/admin/login" className="hover:text-primary transition-colors">Admin</Link>
                </div>
            </div>
        </footer>
    );
}
