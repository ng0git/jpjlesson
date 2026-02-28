import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, getDay, addDays } from 'date-fns';
import { SlotType, TimeSlot } from '../types/calendar';

export const generateSlotsForMonth = (year: number, month: number): TimeSlot[] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);
  const days = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  const slots: TimeSlot[] = [];

  days.forEach(day => {
    const dayOfWeek = getDay(day); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dateStr = format(day, 'yyyy-MM-dd');

    // KPP2 (D/DA & B/B2): Saturday (6) to Tuesday (2)
    // Rules: Saturday, Sunday, Monday, Tuesday
    if ([6, 0, 1, 2].includes(dayOfWeek)) {
      const kpp2Times = [
        { start: '08:30', end: '10:30' },
        { start: '10:30', end: '12:30' },
        { start: '13:30', end: '15:30' },
        { start: '15:30', end: '17:30' },
      ];

      kpp2Times.forEach((time, index) => {
        // D/DA
        slots.push({
          id: `kpp2-d-${dateStr}-${index}`,
          date: dateStr,
          startTime: time.start,
          endTime: time.end,
          type: SlotType.KPP2_D_DA,
          capacity: 15,
          bookedCount: Math.floor(Math.random() * 16),
        });
        // B/B2
        slots.push({
          id: `kpp2-b-${dateStr}-${index}`,
          date: dateStr,
          startTime: time.start,
          endTime: time.end,
          type: SlotType.KPP2_B_B2,
          capacity: 15,
          bookedCount: Math.floor(Math.random() * 16),
        });
      });
    }

    // KPP1: Tuesday (2), Thursday (4), Saturday (6)
    if ([2, 4, 6].includes(dayOfWeek)) {
      slots.push({
        id: `kpp1-${dateStr}`,
        date: dateStr,
        startTime: '08:30',
        endTime: '15:30',
        type: SlotType.KPP1,
        capacity: 15,
        bookedCount: Math.floor(Math.random() * 16),
      });
    }

    // PSV/GDL: Monday (1), Wednesday (3), Friday (5)
    if ([1, 3, 5].includes(dayOfWeek)) {
      slots.push({
        id: `psv-${dateStr}`,
        date: dateStr,
        startTime: '08:30',
        endTime: '16:00',
        type: SlotType.PSV_GDL,
        capacity: 15,
        bookedCount: Math.floor(Math.random() * 16),
      });
    }

    // Ujian Komputer: Monday (1)
    if (dayOfWeek === 1) {
      slots.push({
        id: `comp-1-${dateStr}`,
        date: dateStr,
        startTime: '08:00',
        endTime: '12:00',
        type: SlotType.UJIAN_KOMPUTER,
        capacity: 15,
        bookedCount: Math.floor(Math.random() * 16),
      });
      slots.push({
        id: `comp-2-${dateStr}`,
        date: dateStr,
        startTime: '13:30',
        endTime: '15:00',
        type: SlotType.UJIAN_KOMPUTER,
        capacity: 15,
        bookedCount: Math.floor(Math.random() * 16),
      });
    }

    // Ujian JPJ: Thursday (4)
    if (dayOfWeek === 4) {
      slots.push({
        id: `jpj-${dateStr}`,
        date: dateStr,
        startTime: '08:00',
        endTime: '12:00', // Assuming a reasonable end time
        type: SlotType.UJIAN_JPJ,
        capacity: 15,
        bookedCount: Math.floor(Math.random() * 16),
      });
    }
  });

  return slots;
};

export const getOccupancyColor = (booked: number, capacity: number) => {
  if (booked >= capacity) return 'bg-red-500';
  if (booked >= 8) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const getTypeColor = (type: SlotType) => {
  switch (type) {
    case SlotType.KPP2_D_DA: return 'bg-orange-500';
    case SlotType.KPP2_B_B2: return 'bg-blue-500';
    case SlotType.KPP1: return 'bg-green-300';
    case SlotType.UJIAN_KOMPUTER: return 'bg-green-700';
    case SlotType.UJIAN_JPJ: return 'bg-red-600';
    case SlotType.PSV_GDL: return 'bg-purple-500';
    default: return 'bg-zinc-400';
  }
};
