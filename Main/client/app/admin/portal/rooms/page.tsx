import RoomGrid from './RoomGrid';
import { prisma } from '@/lib/prisma';

export default async function RoomsPage() {
  const patients = await prisma.patient.findMany();
  const doctors = await prisma.doctor.findMany();
  const rooms = [{ id: '1', name: 'Room 1' }, { id: '2', name: 'Room 2' }, { id: '3', name: 'Room 3' }];

  return (
    <div className="py-6 pr-6">
      <h1 className="text-2xl font-bold mb-4">Room Availability</h1>

      <RoomGrid
        patients={patients}
        doctors={doctors}
        rooms={rooms}
      />
    </div>
  );
}