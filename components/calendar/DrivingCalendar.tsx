import React, { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Users, Clock, Edit2, CheckCircle2 } from 'lucide-react';
import { SlotType, TimeSlot } from '../../types/calendar';
import { getOccupancyColor, getTypeColor } from '../../utils/calendarUtils';

interface DrivingCalendarProps {
  slots: TimeSlot[];
  onSlotClick?: (slot: TimeSlot) => void;
  isTrainer?: boolean;
  onUpdateSlot?: (slot: TimeSlot) => void;
}

const DrivingCalendar: React.FC<DrivingCalendarProps> = ({ 
  slots, 
  onSlotClick, 
  isTrainer = false,
  onUpdateSlot
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const selectedDateSlots = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return slots.filter(slot => slot.date === dateStr);
  }, [slots, selectedDate]);

  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(slots.filter(s => s.bookedCount < s.capacity).map(s => s.date)));
    return dates.sort();
  }, [slots]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleUpdateSlot = (slot: TimeSlot, field: 'capacity' | 'bookedCount', value: number) => {
    if (onUpdateSlot) {
      onUpdateSlot({ ...slot, [field]: value });
    }
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-3xl border-2 border-zinc-900 overflow-hidden shadow-xl">
      {/* Calendar Header */}
      <div className="bg-zinc-900 p-4 flex justify-between items-center text-white">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-black uppercase tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 bg-zinc-100 border-b-2 border-zinc-900">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="py-2 text-center text-[10px] font-black text-zinc-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-zinc-900">
        {calendarDays.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const dateStr = format(day, 'yyyy-MM-dd');
          const daySlots = slots.filter(s => s.date === dateStr);
          const hasSlots = daySlots.length > 0;

          return (
            <button
              key={i}
              onClick={() => handleDateClick(day)}
              className={`
                relative h-14 sm:h-16 flex flex-col items-center justify-center transition-all
                ${isCurrentMonth ? 'bg-white' : 'bg-zinc-50 text-zinc-300'}
                ${isSelected ? 'ring-inset ring-4 ring-[#FF7A30] z-10' : ''}
                hover:bg-zinc-50
              `}
            >
              <span className={`text-sm font-bold ${isSelected ? 'text-[#FF7A30]' : ''}`}>
                {format(day, 'd')}
              </span>
              {hasSlots && isCurrentMonth && (
                <div className="flex gap-0.5 mt-1">
                  {(Array.from(new Set(daySlots.map(s => s.type))) as SlotType[]).slice(0, 3).map((type, idx) => (
                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${getTypeColor(type)}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Student Dropdown for available dates */}
      {!isTrainer && (
        <div className="p-4 bg-zinc-50 border-t-2 border-zinc-900">
          <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1">Available Slots</label>
          <select 
            className="w-full bg-white border-2 border-zinc-900 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF7A30]"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(parseISO(e.target.value))}
          >
            {availableDates.map(date => (
              <option key={date} value={date}>
                {format(parseISO(date), 'EEEE, d MMMM yyyy')}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Slots List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px] no-scrollbar">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
          Slots for {format(selectedDate, 'do MMMM')}
        </h3>
        
        {selectedDateSlots.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 italic text-sm">
            No slots scheduled for this day
          </div>
        ) : (
          selectedDateSlots.map(slot => (
            <div 
              key={slot.id}
              onClick={() => !isTrainer && onSlotClick?.(slot)}
              className={`
                group relative p-4 rounded-2xl border-2 border-zinc-900 bg-white transition-all
                ${!isTrainer ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] active:translate-y-0 active:shadow-none' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(slot.type)}`} />
                  <div>
                    <h4 className="font-black text-zinc-900 text-sm uppercase tracking-tight">{slot.type}</h4>
                    <div className="flex items-center gap-3 mt-1 text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold">{slot.startTime} - {slot.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span className="text-[10px] font-bold">{slot.bookedCount}/{slot.capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`px-2 py-1 rounded-lg text-[10px] font-black text-white border border-black/10 ${getOccupancyColor(slot.bookedCount, slot.capacity)}`}>
                  {slot.bookedCount >= slot.capacity ? 'FULL' : `${slot.capacity - slot.bookedCount} LEFT`}
                </div>
              </div>

              {isTrainer && (
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-zinc-400 uppercase">Capacity</span>
                      <input 
                        type="number" 
                        value={slot.capacity}
                        onChange={(e) => handleUpdateSlot(slot, 'capacity', parseInt(e.target.value))}
                        className="w-16 bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-xs font-bold"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-zinc-400 uppercase">Booked</span>
                      <input 
                        type="number" 
                        value={slot.bookedCount}
                        onChange={(e) => handleUpdateSlot(slot, 'bookedCount', parseInt(e.target.value))}
                        className="w-16 bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-xs font-bold"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => onSlotClick?.(slot)}
                    className="p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DrivingCalendar;
