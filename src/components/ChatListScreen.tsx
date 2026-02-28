import React from 'react';
import { MessageSquare, Bot, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatListScreenProps {
  onChatOpen: (name: string, isAi?: boolean) => void;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ onChatOpen }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full bg-zinc-50 relative overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-50 p-8 pb-6 shadow-sm sticky top-0 z-10 border-b-2 border-zinc-200">
        <h1 className="text-2xl font-black text-[#465C88] uppercase">{t('messages')}</h1>
      </div>

      {/* Main Content Layer */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pb-40">
        <div className="p-6 space-y-8">
          {/* AI Tutor Card */}
          <button 
            onClick={() => onChatOpen('AI Driving Tutor', true)}
            className="w-full bg-white p-6 rounded-[2rem] border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(255,122,48,0.3)] flex items-center space-x-5 text-left group transition-all hover:-translate-y-1 active:translate-y-0"
          >
            <div className="w-16 h-16 bg-[#FF7A30] rounded-2xl flex items-center justify-center text-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
              <Bot size={32} strokeWidth={2.5} />
              <Sparkles size={16} className="absolute -top-2 -right-2 text-white fill-white animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-black text-zinc-900 uppercase">{t('ai_tutor')}</h2>
                <span className="text-[10px] font-black text-[#FF7A30] bg-orange-50 px-2 py-0.5 rounded border border-[#FF7A30]/30 uppercase">{t('instant')}</span>
              </div>
              <p className="text-zinc-500 text-sm font-bold">{t('ai_tutor_desc')}</p>
            </div>
          </button>

          {/* Driver List Section */}
          <div>
            <h3 className="text-[#465C88] font-black text-lg mb-4 px-2 uppercase tracking-tight">{t('driver_support')}</h3>
            <div className="space-y-4">
              <button 
                onClick={() => onChatOpen('En. Ali')}
                className="w-full bg-white p-5 rounded-[1.5rem] border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(70,92,136,0.1)] flex items-center justify-between group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-[#465C88] border-2 border-zinc-200">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 text-base uppercase">En. Ali</h4>
                    <p className="text-xs text-zinc-400 font-bold uppercase">{t('assigned_transport_driver')}</p>
                  </div>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-[#465C88] transition-colors" size={24} />
              </button>

              <button 
                onClick={() => onChatOpen('Ms. May')}
                className="w-full bg-white p-5 rounded-[1.5rem] border-2 border-zinc-200 flex items-center justify-between group opacity-60 grayscale hover:grayscale-0 hover:border-zinc-900 transition-all shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 border-2 border-zinc-200">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-400 text-base uppercase">Ms. May</h4>
                    <p className="text-xs text-zinc-300 font-bold uppercase">{t('offline')}</p>
                  </div>
                </div>
                <ChevronRight className="text-zinc-200" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListScreen;