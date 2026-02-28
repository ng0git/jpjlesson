export enum SlotType {
  KPP2_D_DA = 'KPP2 D/DA',
  KPP2_B_B2 = 'KPP2 B/B2',
  KPP1 = 'KPP1',
  UJIAN_KOMPUTER = 'Ujian Komputer',
  UJIAN_JPJ = 'Ujian JPJ',
  PSV_GDL = 'PSV/GDL'
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: SlotType;
  capacity: number;
  bookedCount: number;
  date: string; // ISO string YYYY-MM-DD
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  slots: TimeSlot[];
}
