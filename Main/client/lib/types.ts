export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    image: string | null;
    availability: string | any;
}

export interface DateInfo {
    dayName: string;
    dayNumber: number;
    monthName: string;
    fullDate: string;
}

export interface BookingSelection {
    dentistId: string;
    date: string;
    time: string;
}

export type PatientType = 'new' | 'returning';
export type BookingForType = 'Myself' | 'Child or dependent' | 'Someone else';
