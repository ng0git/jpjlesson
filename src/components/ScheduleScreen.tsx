import React, { useState } from 'react';
import { Check, Lock, MapPin, X, Info, Clock, DollarSign, FileText, Star, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FlowStep {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
  description: string;
  details: {
    duration?: string;
    cost?: string;
    notes: string[];
  };
}

const ScheduleScreen: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedStep, setSelectedStep] = useState<FlowStep | null>(null);
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  const FLOW_STEPS: FlowStep[] = [
    {
      id: '1',
      title: language === 'en' ? 'Registration' : 'Pendaftaran',
      status: 'completed',
      description: language === 'en' ? 'Initial Signup' : 'Pendaftaran Awal',
      details: {
        cost: language === 'en' ? '1st Payment' : 'Bayaran Pertama',
        notes: language === 'en' ? ['Submit documents', 'Biometric registration'] : ['Hantar dokumen', 'Pendaftaran biometrik']
      }
    },
    {
      id: '2',
      title: language === 'en' ? 'Theory Course' : 'Kursus Teori',
      status: 'completed',
      description: language === 'en' ? 'KPP01 (6 Hours)' : 'KPP01 (6 Jam)',
      details: {
        duration: language === 'en' ? '6 Hours' : '6 Jam',
        notes: language === 'en' ? ['Attendance Validation Required'] : ['Pengesahan Kehadiran Diperlukan']
      }
    },
    {
      id: '3',
      title: language === 'en' ? 'Theory Test' : 'Ujian Teori',
      status: 'completed',
      description: language === 'en' ? 'Computer Test' : 'Ujian Komputer',
      details: {
        cost: language === 'en' ? 'Repeat: RM 39.16' : 'Ulangan: RM 39.16',
        notes: language === 'en' ? ['Score 42/50 to pass'] : ['Skor 42/50 untuk lulus']
      }
    },
    {
      id: '4',
      title: language === 'en' ? 'L License' : 'Lesen L',
      status: 'completed',
      description: language === 'en' ? 'Learner Badge' : 'Lencana Pelajar',
      details: {
        cost: language === 'en' ? '2nd Payment' : 'Bayaran Kedua',
        notes: language === 'en' ? ['Valid for 3 to 6 months'] : ['Sah selama 3 hingga 6 bulan']
      }
    },
    {
      id: '5',
      title: language === 'en' ? 'Practical Training' : 'Latihan Praktikal',
      status: 'current',
      description: language === 'en' ? 'KPP 02 & 03' : 'KPP 02 & 03',
      details: {
        duration: language === 'en' ? '15.5 Hours' : '15.5 Jam',
        cost: language === 'en' ? 'Late penalty applies' : 'Penalti lewat dikenakan',
        notes: language === 'en' ? ['Circuit Training', 'On-the-road'] : ['Latihan Litar', 'Di jalan raya']
      }
    },
    {
      id: '6',
      title: language === 'en' ? 'Pre-Test (QTI)' : 'Pra-Ujian (QTI)',
      status: 'locked',
      description: language === 'en' ? 'Internal Exam' : 'Peperiksaan Dalaman',
      details: {
        cost: language === 'en' ? '3rd Payment' : 'Bayaran Ketiga',
        notes: language === 'en' ? ['Must pass to proceed'] : ['Mesti lulus untuk meneruskan']
      }
    },
    {
      id: '7',
      title: language === 'en' ? 'JPJ Test' : 'Ujian JPJ',
      status: 'locked',
      description: language === 'en' ? 'Final Exam' : 'Peperiksaan Akhir',
      details: {
        notes: language === 'en' ? ['Bring ID & Valid L License'] : ['Bawa ID & Lesen L yang Sah']
      }
    },
    {
      id: '8',
      title: language === 'en' ? 'P License' : 'Lesen P',
      status: 'locked',
      description: language === 'en' ? 'Probationary' : 'Percubaan',
      details: {
        notes: language === 'en' ? ['2 Years Probation'] : ['2 Tahun Percubaan']
      }
    }
  ];

  const progressData = [
    {
      id: 1,
      title: language === 'en' ? 'CLASS 1' : 'KELAS 1',
      stars: 3,
      trainer: 'En. Raj',
      remark: language === 'en' ? 'internal circuit[\n- forget to turn on signal before turning\n- need to improve control of acceleration at bukit\n]' : 'litar dalaman[\n- lupa hidupkan isyarat sebelum membelok\n- perlu tingkatkan kawalan pecutan di bukit\n]',
      completed: true
    },
    {
      id: 2,
      title: language === 'en' ? 'CLASS 2' : 'KELAS 2',
      stars: 4,
      trainer: 'En. Raj',
      remark: language === 'en' ? 'internal circuit[\n- need to improve side parking\n]' : 'litar dalaman[\n- perlu tingkatkan parkir sisi\n]',
      completed: true
    },
    ...Array.from({ length: 6 }, (_, i) => ({
      id: i + 3,
      title: language === 'en' ? `CLASS ${i + 3}` : `KELAS ${i + 3}`,
      stars: 0,
      trainer: '',
      remark: '',
      completed: false
    }))
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-50 relative">
      {/* Header */}
      <div className="bg-zinc-50 p-8 pb-4 sticky top-0 z-20 border-b-2 border-zinc-200 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-[#465C88] uppercase tracking-tight">{t('license_path')}</h1>
          <p className="text-zinc-500 text-sm font-bold mt-1">{t('status_overview')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative p-6 pb-40">
        
        {/* Path Line */}
        <div className="absolute left-1/2 top-10 bottom-0 w-2 bg-zinc-200 -translate-x-1/2 z-0 rounded-full"></div>

        <div className="space-y-12 relative z-10 pt-4">
          {FLOW_STEPS.map((step, index) => {
            const isLeft = index % 2 === 0;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isLocked = step.status === 'locked';

            return (
              <div key={step.id} className={`flex items-center w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                
                {/* Content Bubble */}
                <div className={`w-[42%] ${isLeft ? 'text-right pr-6' : 'text-left pl-6'}`}>
                  <button 
                    onClick={() => setSelectedStep(step)}
                    className={`p-4 rounded-2xl transition-all duration-300 w-full relative border-2 
                      ${isCompleted ? 'bg-white border-green-200 text-zinc-500' : ''}
                      ${isCurrent ? 'bg-[#FFF5F0] border-[#FF7A30] text-[#E65000] shadow-[4px_4px_0px_0px_rgba(255,122,48,0.2)] scale-105' : ''}
                      ${isLocked ? 'bg-transparent border-transparent text-zinc-300' : ''}
                    `}
                  >
                    <h3 className={`font-bold text-sm uppercase leading-tight ${isCurrent ? 'text-[#FF7A30]' : isCompleted ? 'text-green-700' : ''}`}>{step.title}</h3>
                    <p className="text-xs font-medium mt-1 opacity-80">{step.description}</p>
                    
                    {isCurrent && (
                       <span className="absolute -top-3 -right-3 bg-[#FF7A30] text-white text-[10px] font-black px-2 py-1 rounded-lg border-2 border-white shadow-sm">
                         {t('current')}
                       </span>
                    )}
                  </button>
                </div>

                {/* Central Node */}
                <div className="relative flex items-center justify-center w-[16%]">
                   <div 
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl z-10 transition-all duration-500 border-2
                        ${isCompleted ? 'bg-green-100 border-green-500 text-green-600' : ''}
                        ${isCurrent ? 'bg-[#FF7A30] border-zinc-900 text-white shadow-lg scale-110' : ''}
                        ${isLocked ? 'bg-zinc-50 border-zinc-200 text-zinc-200' : ''}
                      `}
                   >
                      {isCompleted && <Check size={20} strokeWidth={3} />}
                      {isCurrent && <MapPin size={20} strokeWidth={2.5} />}
                      {isLocked && <Lock size={16} />}
                   </div>
                </div>

                {/* Spacer */}
                <div className="w-[42%]"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
          <div 
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm pointer-events-auto transition-opacity"
            onClick={() => setSelectedStep(null)}
          ></div>
          
          <div className="bg-white w-full max-w-sm m-4 rounded-[2rem] p-8 border-2 border-zinc-900 shadow-2xl transform transition-transform pointer-events-auto animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 relative overflow-hidden">
             
             <div className="flex justify-between items-start mb-6">
                <div>
                   <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg mb-3 inline-block border
                      ${selectedStep.status === 'completed' ? 'bg-green-100 border-green-200 text-green-700' : ''}
                      ${selectedStep.status === 'current' ? 'bg-[#FF7A30] border-[#FF7A30] text-white' : ''}
                      ${selectedStep.status === 'locked' ? 'bg-white border-zinc-200 text-zinc-300' : ''}
                   `}>
                      {selectedStep.status === 'completed' ? t('completed') : selectedStep.status === 'current' ? t('current') : selectedStep.status}
                   </span>
                   <h2 className="text-2xl font-black text-zinc-900 uppercase">{selectedStep.title}</h2>
                </div>
                <button onClick={() => setSelectedStep(null)} className="bg-zinc-100 p-2 rounded-full border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-200">
                   <X size={20} />
                </button>
             </div>

             <div className="space-y-6">
                <p className="text-zinc-600 text-sm font-bold leading-relaxed border-l-4 border-[#465C88] pl-4">
                   {selectedStep.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                   {selectedStep.details.duration && (
                      <div className="bg-zinc-50 p-4 rounded-2xl border-2 border-zinc-100">
                         <div className="flex items-center text-zinc-500 mb-2">
                            <Clock size={16} className="mr-2" />
                            <span className="text-xs font-bold uppercase">{language === 'en' ? 'Time' : 'Masa'}</span>
                         </div>
                         <span className="font-bold text-[#465C88] text-sm">{selectedStep.details.duration}</span>
                      </div>
                   )}
                   
                   {selectedStep.details.cost && (
                      <div className="bg-zinc-50 p-4 rounded-2xl border-2 border-zinc-100">
                         <div className="flex items-center text-zinc-500 mb-2">
                            <DollarSign size={16} className="mr-2" />
                            <span className="text-xs font-bold uppercase">{language === 'en' ? 'Cost' : 'Kos'}</span>
                         </div>
                         <span className="font-bold text-[#FF7A30] text-sm">{selectedStep.details.cost}</span>
                      </div>
                   )}
                </div>

                <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                    <ul className="space-y-3">
                       {selectedStep.details.notes.map((note, i) => (
                          <li key={i} className="flex items-start text-sm text-zinc-700 font-bold">
                             <div className="w-1.5 h-1.5 bg-[#465C88] rounded-full mt-1.5 mr-3 shrink-0"></div>
                             {note}
                          </li>
                       ))}
                    </ul>
                </div>
             </div>
             
             {selectedStep.status === 'current' && (
                <div className="flex flex-col gap-3 mt-8">
                  <button 
                    onClick={() => setIsProgressOpen(true)}
                    className="w-full bg-white text-[#465C88] font-bold py-4 rounded-xl border-2 border-[#465C88] hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText size={18} />
                    {t('track_progress')}
                  </button>
                  <button 
                    onClick={() => setSelectedStep(null)}
                    className="w-full bg-[#FF7A30] text-white font-bold py-4 rounded-xl border-2 border-zinc-900 hover:brightness-110 transition-colors shadow-lg active:translate-y-0.5"
                  >
                    {t('continue')}
                  </button>
                </div>
             )}
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {isProgressOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md"
            onClick={() => setIsProgressOpen(false)}
          ></div>
          
          <div className="bg-white w-full max-w-md rounded-[2.5rem] border-4 border-zinc-900 shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b-2 border-zinc-100 flex justify-between items-center bg-zinc-50">
              <div>
                <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">{t('training_progress')}</h2>
                <p className="text-xs font-bold text-zinc-500 uppercase mt-0.5">{t('practical_session_logs')}</p>
              </div>
              <button 
                onClick={() => setIsProgressOpen(false)}
                className="p-2 bg-white border-2 border-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-4">
              {progressData.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-5 rounded-3xl border-2 transition-all ${item.completed ? 'bg-white border-zinc-900 shadow-[4px_4px_0_0_rgba(24,24,27,0.1)]' : 'bg-zinc-100 border-zinc-200 opacity-60'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className={`font-black text-lg ${item.completed ? 'text-zinc-900' : 'text-zinc-400'}`}>{item.title}</h3>
                      {item.completed && (
                        <p className="text-xs font-bold text-[#465C88] uppercase">[{t('trainer')}: {item.trainer}]</p>
                      )}
                    </div>
                    {item.completed && (
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < item.stars ? 'fill-[#FF7A30] text-[#FF7A30]' : 'text-zinc-300'} 
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {item.completed && (
                    <div className="mt-4 pt-4 border-t border-zinc-100">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{t('remark')}:</p>
                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                        <pre className="text-xs font-medium text-zinc-600 whitespace-pre-wrap font-sans leading-relaxed">
                          {item.remark}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 bg-zinc-50 border-t-2 border-zinc-100">
              <button 
                onClick={() => setIsProgressOpen(false)}
                className="w-full bg-zinc-900 text-white font-black py-4 rounded-2xl hover:bg-zinc-800 transition-colors uppercase tracking-widest shadow-lg"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleScreen;