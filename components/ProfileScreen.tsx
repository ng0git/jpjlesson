import React, { useState } from 'react';
import { MOCK_DATA } from '../mockData';
import { User, MessageCircle, ChevronDown, ChevronUp, MapPin, Phone, Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileScreenProps {
  onChatOpen: (name: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onChatOpen }) => {
  const { trainee } = MOCK_DATA;
  const { language, t } = useLanguage();
  const [selectedArea, setSelectedArea] = useState('Jelutong');
  const [expandedDriverId, setExpandedDriverId] = useState<number | null>(null);

  const AREAS = ["All", "Jelutong", "Sungai Ara", "Tanjung Bungah"];
  const translatedAreas = AREAS.map(area => {
    if (area === 'All') return language === 'en' ? 'All' : 'Semua';
    return area;
  });

  const EMERGENCY_DRIVERS = [
    {
      id: 1,
      name: 'Ms. May',
      plate: 'PJV 6118',
      phone: '01122234456',
      area: 'Jelutong',
      schedule: [
        { time: '0900', status: 'FULL', type: '🏠 > 🏫' },
        { time: '1100', status: '5/6', type: '🏫 > 🏠' },
        { time: '1300', status: 'FULL', type: '🏠 > 🏫' }
      ]
    },
    {
      id: 2,
      name: 'En. Ali',
      plate: 'PMT 2885',
      phone: '01133339966',
      area: 'Jelutong',
      schedule: [
        { time: '1500', status: '6/8', type: '🏫 > 🏠' },
        { time: '1600', status: 'FULL', type: '🏠 > 🏫' }
      ]
    },
    {
      id: 3,
      name: 'Mr. Tan',
      plate: 'PKA 1234',
      phone: '0123456789',
      area: 'Sungai Ara',
      schedule: [
        { time: '0800', status: '3/6', type: '🏠 > 🏫' },
        { time: '1000', status: 'FULL', type: '🏫 > 🏠' }
      ]
    }
  ];

  const MY_DRIVERS = [
    { name: 'En. Ali', route: language === 'en' ? 'Jelutong to Driving School' : 'Jelutong ke Sekolah Memandu' },
    { name: 'Mr. Lee', route: language === 'en' ? 'Driving School to Jelutong' : 'Sekolah Memandu ke Jelutong' }
  ];

  const toggleSchedule = (id: number) => {
    setExpandedDriverId(expandedDriverId === id ? null : id);
  };

  const filteredDrivers = EMERGENCY_DRIVERS.filter(d => 
    selectedArea === 'All' ? true : d.area === selectedArea
  );

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto pb-32 no-scrollbar">
      {/* Header */}
      <div className="bg-zinc-50 p-8 pb-6 shadow-sm sticky top-0 z-10 border-b-2 border-zinc-200">
        <h1 className="text-2xl font-black text-[#465C88] uppercase">{t('profile_transport')}</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* User Info Card */}
        <div className="bg-white p-6 rounded-[2rem] border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(70,92,136,0.2)] flex items-center space-x-5">
           <div className="w-16 h-16 bg-[#465C88] rounded-2xl flex items-center justify-center text-white">
             <User size={28} strokeWidth={2.5} />
           </div>
           <div>
             <h2 className="text-xl font-black text-zinc-900 uppercase">{trainee.name}</h2>
             <p className="text-zinc-500 text-sm font-bold mt-1">ID: {trainee.id}</p>
             <div className="mt-2 inline-flex items-center px-3 py-1 bg-[#E6EBF5] border border-[#465C88]/30 text-[#465C88] text-[10px] font-black uppercase tracking-wider rounded-lg">
                {t('active_student')}
             </div>
           </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white p-6 rounded-[2rem] border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(255,122,48,0.1)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-500 font-bold text-sm uppercase">{t('overall_progress')}</span>
            <span className="text-[#FF7A30] font-black text-xl">{trainee.progress}%</span>
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-4 border-2 border-zinc-900 p-0.5">
            <div 
              className="bg-[#FF7A30] h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${trainee.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Alert Card */}
        <div className="bg-[#FFF5F0] p-6 rounded-[2rem] border-2 border-[#FF7A30] flex items-start space-x-4">
          <div className="bg-[#FF7A30] p-2 rounded-xl text-white shrink-0">
             <AlertTriangle size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-black text-[#E65000] text-sm uppercase">{t('license_renewal')}</h3>
            <p className="text-[#E65000]/80 text-sm font-bold mt-1 leading-relaxed">{t('license_renewal_msg')}</p>
          </div>
        </div>

        {/* My Drivers */}
        <div>
          <h3 className="text-[#465C88] font-black text-lg mb-4 px-2 uppercase">{t('my_drivers')}</h3>
          <div className="space-y-4">
            {MY_DRIVERS.map((driver, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border-2 border-zinc-200 flex justify-between items-center hover:border-[#465C88] transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 font-black text-xs border border-zinc-200">
                        {driver.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-zinc-800 text-sm uppercase">{driver.name}</h4>
                        <p className="text-xs text-zinc-400 mt-0.5 font-medium">{driver.route}</p>
                    </div>
                </div>
                <button 
                  onClick={() => onChatOpen(driver.name)}
                  className="w-10 h-10 bg-[#465C88] text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                  <MessageCircle size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Drivers */}
        <div>
          <div className="flex justify-between items-center mb-4 px-2">
             <h3 className="text-[#465C88] font-black text-lg uppercase">{t('transport_pool')}</h3>
          </div>
          
          <div className="mb-6 relative">
             <select 
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full appearance-none bg-white text-zinc-900 font-bold py-4 px-6 pr-10 rounded-2xl border-2 border-zinc-200 focus:border-[#465C88] outline-none uppercase"
             >
                {AREAS.map((area, idx) => <option key={area} value={area}>{translatedAreas[idx]}</option>)}
             </select>
             <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
          </div>

          <div className="space-y-6">
             {filteredDrivers.map((driver) => (
               <div key={driver.id} className="bg-white rounded-[2rem] border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] overflow-hidden">
                  <div className="p-6">
                      <div className="flex justify-between items-start">
                         <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#E6EBF5] flex items-center justify-center text-[#465C88] font-black text-lg border border-[#465C88]/20">
                                {driver.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-black text-zinc-900 text-lg uppercase">{driver.name}</h4>
                                <div className="flex items-center text-xs text-zinc-500 mt-1 space-x-3 font-bold">
                                    <span className="bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">{driver.plate}</span>
                                    <div className="flex items-center">
                                      <Phone size={12} className="mr-1" />
                                      <span>{driver.phone}</span>
                                    </div>
                                </div>
                            </div>
                         </div>
                         <div className="bg-[#FF7A30] text-white px-3 py-1 rounded-lg text-[10px] font-black flex items-center uppercase tracking-wider shadow-sm">
                             <MapPin size={10} className="mr-1" />
                             {driver.area}
                         </div>
                      </div>

                      <div className="mt-6 flex space-x-3">
                         <button 
                            onClick={() => toggleSchedule(driver.id)}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center transition-all duration-300 border-2
                                ${expandedDriverId === driver.id 
                                    ? 'bg-[#E6EBF5] border-[#465C88] text-[#465C88]' 
                                    : 'bg-white border-zinc-200 text-zinc-500 hover:border-[#465C88]'}`}
                         >
                            <Clock size={16} className="mr-2 opacity-70" />
                            {t('schedule')}
                            {expandedDriverId === driver.id ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                         </button>
                         <button 
                           onClick={() => onChatOpen(driver.name)}
                           className="w-12 bg-[#465C88] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                         >
                            <MessageCircle size={20} />
                         </button>
                      </div>
                  </div>

                  {/* Accordion Schedule */}
                  {expandedDriverId === driver.id && (
                      <div className="bg-zinc-50 p-6 animate-in slide-in-from-top-2 duration-200 border-t-2 border-zinc-200">
                          <h5 className="text-[10px] font-black text-zinc-400 mb-4 uppercase tracking-widest">{t('available_slots')}</h5>
                          <div className="space-y-3">
                              {driver.schedule.map((slot, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200">
                                      <div className="flex items-center space-x-3">
                                          <span className="text-zinc-900 font-bold text-sm">{slot.time}</span>
                                          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md">{slot.type}</span>
                                      </div>
                                      <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${slot.status === 'FULL' ? 'bg-zinc-100 text-zinc-400 border-zinc-200' : 'bg-[#FF7A30] text-white border-[#FF7A30]'}`}>
                                          {slot.status}
                                      </span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;