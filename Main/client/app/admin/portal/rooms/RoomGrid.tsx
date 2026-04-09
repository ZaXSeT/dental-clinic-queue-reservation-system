'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

type Props = {
  patients: { id: string; name: string; phone?: string | null }[];
  doctors: { id: string; name: string }[];
  rooms: { id: string; name: string }[];
};

type Booking = {
  patientId: string;
  doctorId: string;
  roomId: string;
  time: string;
};

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let h = 7; h <= 22; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
};

export default function RoomGrid({ patients, doctors, rooms }: Props) {
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const [showForm, setShowForm] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [formData, setFormData] = useState({
    doctor: '',
    patient: '',
    room: '',
    time: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const displayedRooms = rooms.length
    ? rooms
    : [
        { id: '1', name: 'Room 1' },
        { id: '2', name: 'Room 2' },
        { id: '3', name: 'Room 3' },
      ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const isTimeBooked = (roomId: string, time: string) => {
    return bookings.some(b => b.roomId === roomId && b.time === time);
  };

  const isPatientBookedAtTime = (patientId: string, time: string) => {
    return bookings.some(b => b.patientId === patientId && b.time === time);
  };

  const isDoctorBookedAtTime = (doctorId: string, time: string) => {
    return bookings.some(b => b.doctorId === doctorId && b.time === time);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!formData.doctor) newErrors.doctor = 'Select a doctor';
    if (!formData.patient) newErrors.patient = 'Select a patient';
    if (!formData.room) newErrors.room = 'Select a room';
    if (!formData.time) newErrors.time = 'Select a time';

    if (formData.room && formData.time && isTimeBooked(formData.room, formData.time)) {
      newErrors.time = 'This time slot is already booked for the selected room';
    }

    if (formData.patient && formData.time && isPatientBookedAtTime(formData.patient, formData.time)) {
      newErrors.patient = 'This patient already has a booking at this time';
    }

    if (formData.doctor && formData.time && isDoctorBookedAtTime(formData.doctor, formData.time)) {
      newErrors.doctor = 'This doctor is already booked at this time';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setBookings(prev => [
        ...prev,
        {
          patientId: formData.patient,
          doctorId: formData.doctor,
          roomId: formData.room,
          time: formData.time,
        },
      ]);

      setLoading(false);
      setShowForm(false);
      setFormData({ doctor: '', patient: '', room: '', time: '' });
    }, 500);
  };

  const getBookingText = (roomId: string, time: string) => {
    const booking = bookings.find(b => b.roomId === roomId && b.time === time);
    if (!booking) return '';
    const patient = patients.find(p => p.id === booking.patientId);
    const doctor = doctors.find(d => d.id === booking.doctorId);
    return `${patient?.name || ''} (${doctor?.name || ''})`;
  };

  return (
    <div className="flex w-full flex-col">
      {/* Add Booking Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 flex items-center gap-2 px-5 h-[48px] bg-primary text-white rounded-xl"
      >
        <Plus className="w-4 h-4" />
        Add Booking
      </button>

      {/* Booking Form */}
      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-2xl border shadow-sm">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="patient" value={formData.patient} onChange={handleChange}>
              <option value="">Choose Patient</option>
              {patients.map(p => (
                <option
                  key={p.id}
                  value={p.id}
                  disabled={formData.time ? isPatientBookedAtTime(p.id, formData.time) : false}
                >
                  {p.name}{formData.time && isPatientBookedAtTime(p.id, formData.time) ? ' (Busy)' : ''}
                </option>
              ))}
            </select>
            {errors.patient && <p className="text-red-500 text-xs">{errors.patient}</p>}

            <select name="doctor" value={formData.doctor} onChange={handleChange}>
              <option value="">Choose Doctor</option>
              {doctors.map(d => (
                <option
                  key={d.id}
                  value={d.id}
                  disabled={formData.time ? isDoctorBookedAtTime(d.id, formData.time) : false}
                >
                  {d.name}{formData.time && isDoctorBookedAtTime(d.id, formData.time) ? ' (Busy)' : ''}
                </option>
              ))}
            </select>
            {errors.doctor && <p className="text-red-500 text-xs">{errors.doctor}</p>}

            <select name="room" value={formData.room} onChange={handleChange}>
              <option value="">Choose Room</option>
              {displayedRooms.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {errors.room && <p className="text-red-500 text-xs">{errors.room}</p>}

            <select name="time" value={formData.time} onChange={handleChange}>
              <option value="">Choose Time</option>
              {timeSlots.map(t => (
                <option
                  key={t}
                  value={t}
                  disabled={formData.room ? isTimeBooked(formData.room, t) : false}
                >
                  {t} {formData.room && isTimeBooked(formData.room, t) ? '(Booked)' : ''}
                </option>
              ))}
            </select>
            {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}

            <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      )}

      {/* Schedule Grid */}
      <div className="flex w-full">
        {/* Time column */}
        <div className="flex-shrink-0 w-16">
          <div className="h-12" />
          {timeSlots.map(time => (
            <div
              key={time}
              className="h-12 flex items-end justify-end pr-2 text-xs text-slate-400"
              style={{ paddingBottom: '4px' }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Rooms scrollable */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[540px]">
            {/* Room headers */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              {displayedRooms.map(room => (
                <div
                  key={room.id}
                  className="h-12 flex items-center justify-center font-bold bg-slate-100 rounded-lg"
                >
                  {room.name}
                </div>
              ))}
            </div>

            {/* Room slots */}
            <div className="grid grid-cols-3 gap-2">
              {displayedRooms.map(room => (
                <div key={room.id} className="flex flex-col">
                  {timeSlots.map(time => (
                    <div
                      key={time}
                      className={`h-12 border rounded-lg flex items-center justify-center text-xs ${
                        bookings.find(b => b.roomId === room.id && b.time === time)
                          ? 'bg-red-100 text-red-700'
                          : 'bg-white hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      {getBookingText(room.id, time)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}