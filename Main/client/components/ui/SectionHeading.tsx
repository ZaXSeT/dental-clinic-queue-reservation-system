
interface SectionHeadingProps {
    subTitle: string;
    title: string;
    center?: boolean;
    light?: boolean;
}

export default function SectionHeading({ subTitle, title, center = true, light = false }: SectionHeadingProps) {
    return (
        <div className={`mb-16 ${center ? 'text-center' : 'text-left'}`}>
            <h2 className={`text-primary font-bold uppercase tracking-widest mb-2 ${light ? 'text-primary' : ''}`}>{subTitle}</h2>
            <h3 className={`text-4xl font-bold ${light ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        </div>
    );
}
