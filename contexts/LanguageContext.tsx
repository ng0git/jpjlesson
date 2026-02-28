import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ms';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    official_app: 'Official App',
    next_session: 'Next Session',
    training_modules: 'Training Modules',
    instruction: 'Instruction',
    next_step: 'Next Step',
    kmh: 'km/h',
    brake: 'BRAKE',
    gas: 'GAS',
    onboarding_title: 'Ready to Drive?',
    onboarding_desc: 'Switch to D gear to start moving.',
    request_reschedule: 'Request Reschedule',
    open_calendar: 'Open Calendar',
    booking_confirmed: 'Booking Confirmed',
    theory_test: 'Theory Test',
    completed: 'Completed',
    select_time_slot: 'Select Time Slot',
    success: 'Success',
    reschedule_success_msg: 'Your request has been sent. If reschedule is confirmed, please arrive 15 mins early for reschedule payment (RM10) before training session.',
    close: 'Close',
    confirm_booking: 'Confirm Booking',
    close_timetable: 'Close Timetable',
    mode_trainer: 'Mode: Trainer',
    mode_student: 'Mode: Student',
    next: 'Next',
    away: 'away',
    license_path: 'License Path',
    status_overview: 'Status Overview',
    current: 'Current',
    track_progress: 'Track Progress',
    continue: 'Continue',
    training_progress: 'Training Progress',
    practical_session_logs: 'Practical Session Logs',
    remark: 'Remark',
    trainer: 'Trainer',
    processing_reschedule: 'Processing Reschedule',
    profile_transport: 'Profile & Transport',
    active_student: 'Active Student',
    overall_progress: 'Overall Progress',
    license_renewal: 'License Renewal',
    license_renewal_msg: "Your 'L' License renewal is due in 5 days. Visit the counter!",
    my_drivers: 'My Drivers',
    transport_pool: 'Transport Pool',
    schedule: 'Schedule',
    available_slots: 'Available Slots',
    messages: 'Messages',
    support_learning: 'Support & Learning',
    ai_tutor: 'AI Tutor',
    ai_tutor_desc: 'Ask me anything about road rules or JPJ test requirements.',
    driver_support: 'Driver Support',
    assigned_transport_driver: 'Assigned Transport Driver',
    offline: 'Offline',
    ai_active: 'AI Active',
    online: 'Online',
    ask_ai_tutor: 'ASK AI TUTOR...',
    type_message: 'TYPE A MESSAGE...',
    instant: 'Instant',
    encouragement_1: "Great job! You're making excellent progress.",
    encouragement_2: "Keep it up! You're handling the vehicle like a pro.",
    encouragement_3: "Well done! Stay focused on the next instruction.",
    checkpoint_reached: 'Checkpoint Reached!',
    progress: 'Progress',
  },
  ms: {
    official_app: 'Aplikasi Rasmi',
    next_session: 'Sesi Seterusnya',
    training_modules: 'Modul Latihan',
    instruction: 'Arahan',
    next_step: 'Langkah Seterusnya',
    kmh: 'km/j',
    brake: 'BREK',
    gas: 'MINYAK',
    onboarding_title: 'Sedia untuk Memandu?',
    onboarding_desc: 'Putar ke Mendatar untuk pengalaman terbaik. Tukar ke gear D untuk mula bergerak.',
    request_reschedule: 'Mohon Penjadualan Semula',
    open_calendar: 'Buka Kalendar',
    booking_confirmed: 'Tempahan Disahkan',
    theory_test: 'Ujian Teori',
    completed: 'Selesai',
    select_time_slot: 'Pilih Slot Masa',
    success: 'Berjaya',
    reschedule_success_msg: 'Permintaan anda telah dihantar. Jika penjadualan semula disahkan, sila tiba 15 minit awal untuk bayaran penjadualan semula (RM10) sebelum sesi latihan.',
    close: 'Tutup',
    confirm_booking: 'Sahkan Tempahan',
    close_timetable: 'Tutup Jadual Waktu',
    mode_trainer: 'Mod: Pengajar',
    mode_student: 'Mod: Pelajar',
    next: 'Seterusnya',
    away: 'jauh',
    license_path: 'Laluan Lesen',
    status_overview: 'Gambaran Keseluruhan Status',
    current: 'Semasa',
    track_progress: 'Jejak Kemajuan',
    continue: 'Teruskan',
    training_progress: 'Kemajuan Latihan',
    practical_session_logs: 'Log Sesi Praktikal',
    remark: 'Catatan',
    trainer: 'Pengajar',
    processing_reschedule: 'Memproses Penjadualan Semula',
    profile_transport: 'Profil & Pengangkutan',
    active_student: 'Pelajar Aktif',
    overall_progress: 'Kemajuan Keseluruhan',
    license_renewal: 'Pembaharuan Lesen',
    license_renewal_msg: "Pembaharuan lesen 'L' anda perlu dilakukan dalam masa 5 hari. Sila ke kaunter!",
    my_drivers: 'Pemandu Saya',
    transport_pool: 'Kumpulan Pengangkutan',
    schedule: 'Jadual',
    available_slots: 'Slot Tersedia',
    messages: 'Mesej',
    support_learning: 'Sokongan & Pembelajaran',
    ai_tutor: 'Tutor AI',
    ai_tutor_desc: 'Tanya saya apa-apa tentang peraturan jalan raya atau keperluan ujian JPJ.',
    driver_support: 'Sokongan Pemandu',
    assigned_transport_driver: 'Pemandu Pengangkutan Ditugaskan',
    offline: 'Luar Talian',
    ai_active: 'AI Aktif',
    online: 'Dalam Talian',
    ask_ai_tutor: 'TANYA TUTOR AI...',
    type_message: 'TAIP MESEJ...',
    instant: 'Segera',
    encouragement_1: "Syabas! Anda menunjukkan kemajuan yang cemerlang.",
    encouragement_2: "Teruskan usaha! Anda mengendalikan kenderaan seperti pakar.",
    encouragement_3: "Bagus! Kekal fokus pada arahan seterusnya.",
    checkpoint_reached: 'Titik Semak Dicapai!',
    progress: 'Kemajuan',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
