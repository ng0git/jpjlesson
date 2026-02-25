import React, { useState, useEffect } from 'react';
import { MOCK_DATA } from '../mockData';
import { Calendar, BookOpen, User, CheckCircle, X, ChevronRight, MapPin, Info, Languages } from 'lucide-react';
import DrivingCalendar from './calendar/DrivingCalendar';
import { generateSlotsForMonth } from '../utils/calendarUtils';
import { TimeSlot } from '../types/calendar';
import { useLanguage } from '../contexts/LanguageContext';

const DashboardScreen: React.FC = () => {
  const { trainee } = MOCK_DATA;
  const { language, setLanguage, t } = useLanguage();
  
  const [isRescheduleOpen, setRescheduleOpen] = useState(false);
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [isSuccessOpen, setSuccessOpen] = useState(false);
  const [isRescheduleProcessing, setIsRescheduleProcessing] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isTrainer, setIsTrainer] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedBookingSlot, setSelectedBookingSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    const now = new Date();
    const generated = generateSlotsForMonth(now.getFullYear(), now.getMonth());
    setSlots(generated);
  }, []);

  const handleUpdateSlot = (updatedSlot: TimeSlot) => {
    setSlots(prev => prev.map(s => s.id === updatedSlot.id ? updatedSlot : s));
  };

  const handleSlotSelection = (slot: TimeSlot) => {
    if (!isTrainer) {
      if (isRescheduleOpen) setSelectedSlot(slot);
      if (isBookingOpen) setSelectedBookingSlot(slot);
    }
  };

  const handleRequestReschedule = () => {
    if (!selectedSlot) {
      alert("Please select a time slot first.");
      return;
    }
    setRescheduleOpen(false);
    setSuccessOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedBookingSlot) {
      alert("Please select a time slot first.");
      return;
    }
    setSelectedDate(selectedBookingSlot.date);
    setSelectedTime(selectedBookingSlot.startTime);
    setIsBooked(true);
    setBookingOpen(false);
  };

  const nextSession = {
     ...trainee.schedule[0],
     type: language === 'en' ? "KPP02 Circuit Practical" : "KPP02 Praktikal Litar",
     description: language === 'en' ? "RPK, RSM, Hill Start" : "RPK, RSM, Mendaki Bukit"
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto pb-32 no-scrollbar relative">
      {/* Header - Corporate Blue */}
      <div className="bg-[#465C88] p-8 pt-10 pb-12 rounded-b-[2.5rem] shadow-lg relative overflow-hidden shrink-0 border-b-4 border-zinc-900">
        {/* Abstract Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-tr-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
             <div className="bg-[#FF7A30] text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
                {t('official_app')}
             </div>
             <button 
                onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl border border-white/30 transition-all flex items-center space-x-2"
             >
                <Languages size={16} />
                <span className="text-[10px] font-black uppercase">{language === 'en' ? 'Malay' : 'English'}</span>
             </button>
          </div>
          <h2 className="text-white text-3xl font-bold tracking-tight mb-1">{trainee.name}</h2>
          <div className="flex items-center space-x-3 text-blue-100 text-sm font-medium">
             <span>ID: {trainee.id}</span>
             <span className="w-1.5 h-1.5 bg-[#FF7A30] rounded-full"></span>
             <span className="text-white font-bold">{trainee.currentStage}</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-8 space-y-6 pb-8">

        {/* Next Session Card */}
        <div className="bg-white p-6 rounded-[2rem] border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(70,92,136,0.2)] relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2.5 h-2.5 bg-[#FF7A30] rounded-full animate-pulse"></span>
                    <p className="text-[#465C88] font-black text-xs uppercase tracking-wide">{t('next_session')}</p>
                </div>
                <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-black text-zinc-900 tracking-tighter">{nextSession.time}</p>
                    <p className="text-zinc-500 font-bold">{nextSession.date}</p>
                </div>
              </div>
              <div className="bg-[#E6EBF5] p-3 rounded-2xl border-2 border-[#465C88] text-[#465C88]">
                 <Calendar size={24} strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="mt-5 bg-zinc-50 p-4 rounded-xl border-l-4 border-l-[#465C88] border-y border-r border-zinc-200">
                <p className="text-zinc-900 font-bold text-lg leading-tight">{nextSession.type}</p>
                <p className="text-zinc-500 text-sm mt-1 font-medium">{nextSession.description}</p>
            </div>

            <div className="mt-5 flex flex-col gap-3">
               <div className="flex items-center space-x-2 text-zinc-500 text-xs font-bold uppercase">
                   <MapPin size={14} className="text-[#FF7A30]" />
                   <span>{nextSession.location}</span>
               </div>
               
               <button 
                  onClick={() => !isRescheduleProcessing && setRescheduleOpen(true)}
                  disabled={isRescheduleProcessing}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-y-0.5 active:shadow-none border-2 border-zinc-900 ${
                    isRescheduleProcessing 
                      ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed shadow-none active:translate-y-0' 
                      : 'bg-white text-zinc-900 hover:bg-zinc-50'
                  }`}
               >
                  {isRescheduleProcessing ? t('processing_reschedule') : t('request_reschedule')}
               </button>
            </div>
        </div>

        {/* Modules Section */}
        <div>
          <h3 className="text-[#465C88] font-black text-lg mb-4 px-2 uppercase tracking-wide">
            {t('training_modules')}
          </h3>
          <div className="space-y-4">
            {trainee.upcomingModules.map((module) => {
                if (module.id === 1) {
                    return (
                        <div key={module.id} className="bg-white p-6 rounded-[2rem] border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.1)]">
                             <div className="flex justify-between items-start mb-4">
                                 <div>
                                     <h4 className="font-bold text-zinc-900 text-lg">{language === 'en' ? 'Circuit Practical [3/8]' : 'Praktikal Litar [3/8]'}</h4>
                                     <p className="text-sm font-medium text-zinc-500 mt-1">{language === 'en' ? 'S & Z (Crank) Course' : 'Kursus S & Z (Engkol)'}</p>
                                 </div>
                                 <div className={`h-4 w-4 rounded-full border-2 border-zinc-900 ${isBooked ? 'bg-green-500' : 'bg-zinc-200'}`}></div>
                             </div>
                             
                             {!isBooked ? (
                                 <div className="mt-4 bg-[#E6EBF5]/50 p-5 rounded-2xl border border-[#465C88]/20">
                                     <p className="text-xs font-bold text-[#465C88] uppercase mb-3 tracking-wider">{t('select_time_slot')}</p>
                                     <button 
                                        onClick={() => setBookingOpen(true)}
                                        className="w-full bg-[#FF7A30] text-white py-4 rounded-xl text-sm font-bold shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] hover:brightness-110 transition-all active:translate-y-0.5 active:shadow-none border-2 border-zinc-900"
                                     >
                                         {t('open_calendar')}
                                     </button>
                                 </div>
                             ) : (
                                 <div className="mt-4 flex items-center justify-between bg-green-50 p-4 rounded-2xl border-2 border-green-600 border-dashed">
                                     <div className="flex items-center text-green-800 text-sm font-bold">
                                         <CheckCircle size={18} className="mr-2 fill-green-200" />
                                         <span>{t('booking_confirmed')}</span>
                                     </div>
                                     <span className="text-xs font-bold text-green-700 bg-white px-2 py-1 rounded-lg border border-green-200">{selectedDate} {selectedTime}</span>
                                 </div>
                             )}
                        </div>
                    );
                } else if (module.id === 2) {
                     return (
                        <div key={module.id} className="bg-zinc-50 p-5 rounded-3xl border-2 border-zinc-300 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 border-2 border-green-200">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-600">{t('theory_test')}</h4>
                                    <p className="text-xs text-green-600 font-bold uppercase">{t('completed')}: May 10</p>
                                </div>
                            </div>
                        </div>
                     );
                }
                return null;
            })}
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => setRescheduleOpen(false)}></div>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] border-4 border-zinc-900 shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b-2 border-zinc-100 flex justify-between items-center bg-zinc-50">
                    <div>
                        <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">{t('request_reschedule')}</h2>
                        <p className="text-xs font-bold text-zinc-500 uppercase mt-0.5">{t('select_time_slot')}</p>
                    </div>
                    <button 
                        onClick={() => {
                          setRescheduleOpen(false);
                          setSelectedSlot(null);
                        }}
                        className="p-2 bg-white border-2 border-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                    <div className="mb-4 flex justify-end">
                        <button 
                            onClick={() => setIsTrainer(!isTrainer)}
                            className="text-[10px] font-black uppercase px-3 py-1 bg-zinc-200 rounded-lg border border-zinc-300"
                        >
                            {isTrainer ? t('mode_trainer') : t('mode_student')}
                        </button>
                    </div>

                    <DrivingCalendar 
                        slots={slots}
                        isTrainer={isTrainer}
                        onSlotClick={handleSlotSelection}
                        onUpdateSlot={handleUpdateSlot}
                    />
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                        <Info size={20} className="text-blue-500 shrink-0" />
                        <p className="text-xs font-bold text-blue-700 leading-relaxed">
                            Rescheduling is subject to availability. Changes made within 24 hours of the session may incur a penalty fee.
                        </p>
                    </div>
                </div>
                
                <div className="p-6 bg-zinc-50 border-t-2 border-zinc-100 flex flex-col gap-3">
                    <button 
                        onClick={handleRequestReschedule}
                        className={`w-full font-black py-4 rounded-2xl transition-all uppercase tracking-widest shadow-lg border-2 border-zinc-900 ${
                          selectedSlot 
                            ? 'bg-[#FF7A30] text-white hover:brightness-110' 
                            : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        }`}
                    >
                        Request (RM10)
                    </button>
                    <button 
                        onClick={() => {
                          setRescheduleOpen(false);
                          setSelectedSlot(null);
                        }}
                        className="w-full bg-zinc-900 text-white font-black py-4 rounded-2xl hover:bg-zinc-800 transition-colors uppercase tracking-widest shadow-lg"
                    >
                        {t('close_timetable')}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setBookingOpen(false); setSelectedBookingSlot(null); }}></div>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] border-4 border-zinc-900 shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b-2 border-zinc-100 flex justify-between items-center bg-zinc-50">
                    <div>
                        <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">{t('select_time_slot')}</h2>
                        <p className="text-xs font-bold text-zinc-500 uppercase mt-0.5">Available Timetable</p>
                    </div>
                    <button 
                        onClick={() => {
                          setBookingOpen(false);
                          setSelectedBookingSlot(null);
                        }}
                        className="p-2 bg-white border-2 border-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                    <div className="mb-4 flex justify-end">
                        <button 
                            onClick={() => setIsTrainer(!isTrainer)}
                            className="text-[10px] font-black uppercase px-3 py-1 bg-zinc-200 rounded-lg border border-zinc-300"
                        >
                            {isTrainer ? t('mode_trainer') : t('mode_student')}
                        </button>
                    </div>

                    <DrivingCalendar 
                        slots={slots}
                        isTrainer={isTrainer}
                        onSlotClick={handleSlotSelection}
                        onUpdateSlot={handleUpdateSlot}
                    />
                </div>
                
                <div className="p-6 bg-zinc-50 border-t-2 border-zinc-100 flex flex-col gap-3">
                    <button 
                        onClick={handleConfirmBooking}
                        className={`w-full font-black py-4 rounded-2xl transition-all uppercase tracking-widest shadow-lg border-2 border-zinc-900 ${
                          selectedBookingSlot 
                            ? 'bg-[#FF7A30] text-white hover:brightness-110' 
                            : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        }`}
                    >
                        {t('confirm_booking')}
                    </button>
                    <button 
                        onClick={() => {
                          setBookingOpen(false);
                          setSelectedBookingSlot(null);
                        }}
                        className="w-full bg-zinc-900 text-white font-black py-4 rounded-2xl hover:bg-zinc-800 transition-colors uppercase tracking-widest shadow-lg"
                    >
                        {t('close_timetable')}
                    </button>
                </div>
            </div>
        </div>
      )}
      {isSuccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setSuccessOpen(false)}></div>
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 relative z-10 shadow-2xl border-2 border-zinc-900 animate-in fade-in zoom-in-95 duration-200 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 border-2 border-green-600">
                    <CheckCircle size={36} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-2 uppercase">{t('success')}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed mb-8 px-4 text-sm">
                    {t('reschedule_success_msg')}
                </p>
                <button 
                    onClick={() => {
                      setSuccessOpen(false);
                      setIsRescheduleProcessing(true);
                    }}
                    className="w-full bg-zinc-900 text-white border-2 border-zinc-900 font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                    {t('close')}
                </button>
            </div>
          </div>
      )}

    </div>
  );
};

export default DashboardScreen;