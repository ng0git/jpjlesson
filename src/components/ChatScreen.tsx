import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { GoogleGenAI } from "@google/genai";

interface ChatScreenProps {
  driverName: string;
  isAi?: boolean;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ driverName, isAi, onBack }) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: isAi 
        ? (language === 'en' ? "Hello Sofia! I'm your AI Driving Tutor. Need help with KPP01 theory or some circuit tips?" : "Helo Sofia! Saya Tutor Memandu AI anda. Perlukan bantuan dengan teori KPP01 atau beberapa petua litar?")
        : (language === 'en' ? "Hi, I'm available for the 15:00 slot today." : "Hai, saya tersedia untuk slot 15:00 hari ini."), 
      sender: 'other', 
      time: '09:30' 
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini Chat
  useEffect(() => {
    if (isAi) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const systemInstruction = `
        You are a helpful AI Driving Tutor for Malaysian students preparing for their JPJ driving tests (Class D/DA).
        Your knowledge is based on the KPP (Kurikulum Pendidikan Pemandu) textbook.
        
        BAHAGIAN: LESEN MEMANDU (Driving Licenses)
        - Fundamental Law: Section 26(1) Road Transport Act 1987.
        - Types: LDL (Learner's), PDL (Probationary), CDL (Competent), Vocational.
        - KPP Gabungan: Individuals with motorcycle (B2/B) or car (D/DA) license can add the other without retaking KPP01 theory class/test (since Sept 15, 2023).
        - Deadlines: KPP01 result valid for 1 year. LDL valid for 2 years. PDL probation is 2 years. 1-year grace period to convert PDL to CDL.
        - Age: 16 for motorcycles, 17 for cars.
        - Records: Must be free from JPJ/PDRM/Court blacklists.

        KPP01: TEORI PEMANDUAN SELAMAT (Safe Driving Theory)
        - CITO: Cermin (Mirrors), Isyarat (Signals), Titik Buta (Blind spot), Olah Gerak (Maneuver).
        - Hazard: Any environmental element causing danger.
        - Traffic Signs: Warning (Bahaya - Diamond/Yellow), Prohibition (Larangan - Round/Red), Mandatory (Mandatori - Round/Blue), Information (Maklumat - Rectangular/Blue or Green).
        - 4-second rule for following distance. Check 12 seconds ahead.
        - KEJARA System: Demerit points. 10 points = PDL revocation. Driving without Road Tax (LKM) = fine up to RM2000.

        KPP02: AMALI DI LITAR (Circuit Practical)
        - RPK (Rutin Pemeriksaan Kenderaan): POWDER (Petrol, Oil, Water, Damage, Electric, Rubber). Check tires, lights, engine fluids (oil, brake, battery, washer), and boot tools (triangle, jack, jumper).
        - RSM (Rutin Sebelum Memandu): Adjust seat/mirrors, seatbelt, gear in 'P', handbrake on.
        - Automatic Gears: P (Park), R (Reverse), N (Neutral), D (Drive), 3, 2 (Engine braking).
        - Maneuvers: Ramp (Tanjakan), 3-point turn, side parking.

        KPP03: AMALI DI JALAN (On-Road Practical)
        - Urban Roads: Speed management, 4-second rule, CITO for lane changes/overtaking.
        - Rural Roads: Corner assessment (Selekoh), hill climbing/descending (correct gears), predicting hazards.

        IMPORTANT: DO NOT use markdown formatting like bold (**), italics (*), or headers (###). 
        Instead, use emojis to improve readability and structure your response. 
        Keep the tone friendly and helpful.
        Reply in ${language === 'en' ? 'English' : 'Malay'}. Keep responses concise and encouraging.
      `;

      chatRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: systemInstruction,
        },
      });
    }
  }, [isAi, language]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMsg = { 
      id: Date.now(), 
      text: inputText, 
      sender: 'me', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');

    if (isAi && chatRef.current) {
      setIsLoading(true);
      try {
        const response = await chatRef.current.sendMessage({ message: currentInput });
        const aiText = response.text;
        
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: aiText || "I'm sorry, I couldn't process that. Please try again.",
          sender: 'other',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (error) {
        console.error("Gemini Error:", error);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: language === 'en' ? "Sorry, I'm having trouble connecting. Please check your connection." : "Maaf, saya menghadapi masalah sambungan. Sila periksa sambungan anda.",
          sender: 'other',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Mock driver response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: language === 'en' ? "Okay, noted. See you later!" : "Baiklah, faham. Jumpa nanti!",
          sender: 'other',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50">
      {/* Header */}
      <div className={`p-6 pb-4 flex items-center sticky top-0 z-10 border-b-2 border-zinc-200 ${isAi ? 'bg-orange-50' : 'bg-white'}`}>
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-[#465C88] hover:bg-[#E6EBF5] rounded-xl transition-all mr-2">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] 
            ${isAi ? 'bg-[#FF7A30] text-white' : 'bg-[#E6EBF5] text-[#465C88]'}`}>
            {isAi ? <Bot size={20} /> : <span className="font-black">{driverName.charAt(0)}</span>}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-zinc-900 text-lg uppercase">{driverName}</h1>
              {isAi && <Sparkles size={14} className="text-[#FF7A30] fill-[#FF7A30]" />}
            </div>
            <p className={`text-xs font-bold flex items-center ${isAi ? 'text-[#FF7A30]' : 'text-green-600'}`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 animate-pulse ${isAi ? 'bg-[#FF7A30]' : 'bg-green-500'}`}></span>
              {isAi ? t('ai_active') : t('online')}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 text-sm font-bold rounded-2xl border-2 ${
              msg.sender === 'me' 
                ? 'bg-[#465C88] text-white border-zinc-900 rounded-tr-none shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]' 
                : isAi 
                  ? 'bg-white text-zinc-800 border-[#FF7A30] rounded-tl-none shadow-[3px_3px_0px_0px_rgba(255,122,48,0.1)]'
                  : 'bg-white text-zinc-800 border-zinc-200 rounded-tl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-[10px] mt-2 text-right opacity-60 font-mono`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border-2 border-[#FF7A30] rounded-tl-none shadow-[3px_3px_0px_0px_rgba(255,122,48,0.1)]">
              <Loader2 size={18} className="animate-spin text-[#FF7A30]" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 pb-32 border-t-2 border-zinc-100">
        <div className="flex items-center bg-zinc-50 p-2 rounded-[1.5rem] border-2 border-zinc-200 focus-within:border-[#465C88] transition-colors">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isAi ? t('ask_ai_tutor') : t('type_message')}
            className="flex-1 bg-transparent focus:outline-none text-zinc-900 placeholder:text-zinc-400 text-sm font-bold px-4 uppercase"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`p-3 rounded-xl transition-all duration-200 ${inputText.trim() && !isLoading ? 'bg-[#FF7A30] text-white shadow-md' : 'bg-zinc-200 text-zinc-400'}`}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;