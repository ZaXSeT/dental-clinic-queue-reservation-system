'use client';

import { useMemo, useState } from 'react';

const ROOMS = [1, 2, 3];

const generateTimeSlots = () => {
  const slots: string[] = [];

  for (let h = 7; h <= 22; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
};

export default function RoomGrid() {
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const [showForm, setShowForm] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ room: number; time: string } | null>(null);
  const [schedules, setSchedules] = useState<{ [key: string]: string }>({}); // key: `${room}-${time}`, value: schedule name
  const [scheduleName, setScheduleName] = useState('');

  const handleAddClick = (room: number, time: string) => {
    setSelectedCell({ room, time });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCell && scheduleName.trim()) {
      const key = `${selectedCell.room}-${selectedCell.time}`;
      setSchedules(prev => ({ ...prev, [key]: scheduleName.trim() }));
      setScheduleName('');
      setShowForm(false);
      setSelectedCell(null);
    }
  };

  return (
    <div className="flex w-full">
      
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

      
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[540px]">
          
          <div className="grid grid-cols-3 gap-2 mb-2">
            {ROOMS.map(room => (
              <div
                key={room}
                className="h-12 flex items-center justify-center font-bold bg-slate-100 rounded-lg"
              >
                Room {room}
              </div>
            ))}
          </div>

          
          <div className="grid grid-cols-3 gap-2">
            {ROOMS.map(room => (
              <div key={room} className="flex flex-col">
                {timeSlots.map(time => {
                  const key = `${room}-${time}`;
                  return (
                    <button
                      key={time}
                      className="h-12 border rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-xs text-slate-500 relative"
                      type="button"
                      onClick={() => handleAddClick(room, time)}
                    >
                      {schedules[key] && (
                        <span className="absolute top-1 left-1 text-[10px] font-semibold text-blue-600">
                          {schedules[key]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      
      {showForm && selectedCell && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-64">
            <h2 className="text-sm font-bold mb-2">
              Add Schedule for Room {selectedCell.room} at {selectedCell.time}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Schedule name"
                value={scheduleName}
                onChange={e => setScheduleName(e.target.value)}
                className="border rounded p-1 text-sm"
                required
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-2 py-1 text-sm border rounded hover:bg-slate-100"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedCell(null);
                    setScheduleName('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
