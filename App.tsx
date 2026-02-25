import React, { useState } from 'react';
import { Home, Calendar, Map, MessageSquare, User } from 'lucide-react';
import DashboardScreen from './components/DashboardScreen';
import ScheduleScreen from './components/ScheduleScreen';
import MapScreen from './components/MapScreen';
import SimulationScreen from './components/SimulationScreen';
import ProfileScreen from './components/ProfileScreen';
import ChatListScreen from './components/ChatListScreen';
import ChatScreen from './components/ChatScreen';
import { LanguageProvider } from './contexts/LanguageContext';

type Tab = 'dashboard' | 'schedule' | 'map' | 'chats' | 'profile' | 'sim' | 'chat_detail';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [chatParams, setChatParams] = useState<{ name: string; isAi: boolean }>({ name: '', isAi: false });

  const handleOpenChat = (name: string, isAi: boolean = false) => {
    setChatParams({ name, isAi });
    setActiveTab('chat_detail');
  };

  const handleStartSim = () => {
    setActiveTab('sim');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardScreen />;
      case 'schedule': return <ScheduleScreen />;
      case 'map': return <MapScreen onStartDrive={handleStartSim} />;
      case 'chats': return <ChatListScreen onChatOpen={handleOpenChat} />;
      case 'profile': return <ProfileScreen onChatOpen={(name) => handleOpenChat(name, false)} />;
      case 'sim': return <SimulationScreen onBack={() => setActiveTab('map')} />;
      case 'chat_detail': return <ChatScreen driverName={chatParams.name} isAi={chatParams.isAi} onBack={() => setActiveTab('chats')} />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <LanguageProvider>
      <div className="flex items-center justify-center h-screen bg-zinc-200 p-0 md:p-6">
        <div className="w-full h-full max-w-md bg-zinc-50 relative overflow-hidden flex flex-col 
                        md:rounded-[3rem] md:h-[92vh] md:border-4 md:border-zinc-900 md:shadow-2xl">
          
          <div className="flex-1 overflow-hidden relative bg-zinc-50">
              {renderContent()}
          </div>

          {/* Bottom Tab Navigation - Fixed */}
          {activeTab !== 'sim' && (
            <div className="absolute bottom-6 left-4 right-4 h-20 bg-white rounded-[2rem] border-2 border-zinc-900 shadow-[0px_4px_0px_0px_rgba(24,24,27,0.1)] flex justify-between items-center px-6 z-40">
                <TabButton 
                    isActive={activeTab === 'dashboard'} 
                    onClick={() => setActiveTab('dashboard')} 
                    icon={<Home size={24} strokeWidth={2.5} />} 
                />
                <TabButton 
                    isActive={activeTab === 'schedule'} 
                    onClick={() => setActiveTab('schedule')} 
                    icon={<Calendar size={24} strokeWidth={2.5} />} 
                />
                
                {/* Central FAB - Now the Map */}
                <div className="relative -top-10">
                    <button 
                        onClick={() => setActiveTab('map')}
                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 border-2 border-zinc-900 shadow-[0px_8px_0px_0px_rgba(24,24,27,1)] hover:-translate-y-1 hover:shadow-[0px_10px_0px_0px_rgba(24,24,27,1)] active:translate-y-1 active:shadow-none
                          ${activeTab === 'map' ? 'bg-[#FF7A30] text-white' : 'bg-white text-[#465C88]'}`}
                    >
                        <Map size={28} strokeWidth={2.5} />
                    </button>
                </div>

                <TabButton 
                    isActive={activeTab === 'chats' || activeTab === 'chat_detail'} 
                    onClick={() => setActiveTab('chats')} 
                    icon={<MessageSquare size={24} strokeWidth={2.5} />} 
                />
                
                <TabButton 
                    isActive={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')} 
                    icon={<User size={24} strokeWidth={2.5} />} 
                />
            </div>
          )}
        </div>
      </div>
    </LanguageProvider>
  );
};

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200
          ${isActive 
            ? 'text-[#465C88] bg-[#E6EBF5]' 
            : 'text-zinc-400 hover:text-zinc-600'}`}
    >
        {icon}
        {isActive && <div className="w-1.5 h-1.5 bg-[#465C88] rounded-full mt-1"></div>}
    </button>
);

export default App;