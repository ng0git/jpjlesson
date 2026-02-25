import React, { useState, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  useMapsLibrary,
  useApiIsLoaded
} from '@vis.gl/react-google-maps';
import { Gauge, ArrowLeft, ChevronLeft, ChevronRight, Navigation, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SimulationScreenProps {
  onBack?: () => void;
}

type Gear = 'P' | 'R' | 'N' | 'D' | 'DA';

const START_COORDS = { lat: 5.350188, lng: 100.303562 };

const SimulatorContent: React.FC<SimulationScreenProps> = ({ onBack }) => {
  const isApiLoaded = useApiIsLoaded();
  const streetViewLibrary = useMapsLibrary('streetView');
  const geometryLibrary = useMapsLibrary('geometry');
  const routesLibrary = useMapsLibrary('routes');
  const { t } = useLanguage();
  
  const [speed, setSpeed] = useState(0);
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [steeringAngle, setSteeringAngle] = useState(0);
  const [baseHeading, setBaseHeading] = useState(0);
  const [gear, setGear] = useState<Gear>('P');
  const [signals, setSignals] = useState({ left: false, right: false });
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isBraking, setIsBraking] = useState(false);
  
  const [routeSteps, setRouteSteps] = useState<google.maps.DirectionsStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [distanceToNext, setDistanceToNext] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementMsg, setEncouragementMsg] = useState('');
  
  // Interactive Steering State
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startAngle = useRef(0);

  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Movement Logic
  const lastStepTime = useRef<number>(0);

  // Onboarding Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowOnboarding(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Encouragement Logic
  const triggerEncouragement = () => {
    const msgs = [t('encouragement_1'), t('encouragement_2'), t('encouragement_3')];
    setEncouragementMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    setShowEncouragement(true);
    setTimeout(() => setShowEncouragement(false), 3000);
  };

  // Initialize Panorama
  useEffect(() => {
    if (!isApiLoaded || !streetViewLibrary || !containerRef.current) return;

    const panorama = new streetViewLibrary.StreetViewPanorama(containerRef.current!, {
      position: START_COORDS,
      pov: { heading: 0, pitch: 0 },
      visible: true,
      disableDefaultUI: true,
      clickToGo: false,
      scrollwheel: false,
      linksControl: false,
      panControl: false,
    });
    panoramaRef.current = panorama;
  }, [isApiLoaded, streetViewLibrary]);

  // Fetch Route
  useEffect(() => {
    if (!isApiLoaded || !routesLibrary) return;

    const directionsService = new routesLibrary.DirectionsService();
    directionsService.route({
      origin: START_COORDS,
      destination: START_COORDS,
      waypoints: [
        { location: { lat: 5.349562, lng: 100.298312 }, stopover: true },
        { location: { lat: 5.334312, lng: 100.296063 }, stopover: true }
      ],
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === 'OK' && result) {
        const allSteps = result.routes[0].legs.flatMap(leg => leg.steps);
        setRouteSteps(allSteps);
      }
    });
  }, [isApiLoaded, routesLibrary]);

  // Dampened Speedometer
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplaySpeed(prev => {
        const diff = speed - prev;
        return prev + diff * 0.1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [speed]);

  const autoCenterWheel = () => {
    const start = steeringAngle;
    const duration = 500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      setSteeringAngle(start * (1 - easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  // Movement & Gas Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Speed Physics: 5 km/h per second = 0.5 per 100ms
      if (isBraking) {
        setSpeed(prev => Math.max(0, prev - 10));
      } else if (isAccelerating && (gear === 'D' || gear === 'R' || gear === 'DA')) {
        const maxSpeed = gear === 'DA' ? 30 : 120;
        setSpeed(prev => Math.min(maxSpeed, prev + 0.5));
      } else {
        setSpeed(prev => Math.max(0, prev - 1));
      }

      // Movement Logic (every 1 second if moving)
      const isMoving = (gear === 'D' || gear === 'DA' || gear === 'R') && isAccelerating;
      if (isMoving && speed > 0 && panoramaRef.current && now - lastStepTime.current >= 1000) {
        const links = panoramaRef.current.getLinks();
        if (links && links.length > 0) {
          const currentPov = panoramaRef.current.getPov();
          const moveHeading = gear === 'R' ? (currentPov.heading + 180) % 360 : currentPov.heading;
          
          let bestLink = links[0];
          let minDiff = 360;
          
          links.forEach(link => {
            const diff = Math.abs((link.heading || 0) - moveHeading);
            const normalizedDiff = Math.min(diff, 360 - diff);
            if (normalizedDiff < minDiff) {
              minDiff = normalizedDiff;
              bestLink = link;
            }
          });

          if (bestLink.pano) {
            panoramaRef.current.setPano(bestLink.pano);
            if (bestLink.heading !== undefined) {
              setBaseHeading(bestLink.heading);
            }
            lastStepTime.current = now;
            autoCenterWheel();
          }
        }
      }

      // Navigation & Signal Logic
      if (panoramaRef.current && geometryLibrary && routeSteps.length > 0) {
        const currentPos = panoramaRef.current.getPosition();
        if (currentPos) {
          const currentStep = routeSteps[currentStepIndex];
          if (currentStep) {
            const endPos = currentStep.end_location;
            const dist = geometryLibrary.spherical.computeDistanceBetween(currentPos, endPos);
            
            setDistanceToNext(Math.round(dist));

            // Auto-advance step if within 15m
            if (dist < 15 && currentStepIndex < routeSteps.length - 1) {
              setCurrentStepIndex(prev => prev + 1);
              triggerEncouragement();
            }

            // Signal Trigger (50m before reaching turn)
            const instr = currentStep.instructions.toLowerCase();
            const isTurn = instr.includes('turn') || instr.includes('left') || instr.includes('right');
            
            let leftSignal = false;
            let rightSignal = false;

            if (dist < 50 && isTurn) {
              if (instr.includes('left')) leftSignal = true;
              if (instr.includes('right')) rightSignal = true;
            }
            setSignals({ left: leftSignal, right: rightSignal });
          }
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isAccelerating, isBraking, gear, speed, geometryLibrary, routeSteps, currentStepIndex, t]);

  // Steering Mapping (2.5:1 ratio - Direct Mapping)
  useEffect(() => {
    if (panoramaRef.current) {
      const headingOffset = steeringAngle / 2.5; 
      panoramaRef.current.setPov({
        heading: (baseHeading + headingOffset) % 360,
        pitch: 0
      });
    }
  }, [steeringAngle, baseHeading]);

  // Auto-Correction Spring Back
  useEffect(() => {
      if (!isDragging) {
          if (steeringAngle > -90 && steeringAngle < 90 && steeringAngle !== 0) {
              const interval = setInterval(() => {
                  setSteeringAngle(prev => {
                      const next = prev * 0.8;
                      if (Math.abs(next) < 1) {
                          clearInterval(interval);
                          return 0;
                      }
                      return next;
                  });
              }, 16);
              return () => clearInterval(interval);
          }
      }
  }, [isDragging, steeringAngle]);

  const handleStart = (clientX: number) => {
      setIsDragging(true);
      startX.current = clientX;
      startAngle.current = steeringAngle;
  };

  const handleMove = (clientX: number) => {
      if (!isDragging) return;
      const deltaX = clientX - startX.current;
      let newAngle = startAngle.current + deltaX * 2; 
      newAngle = Math.max(-900, Math.min(900, newAngle));
      setSteeringAngle(newAngle);
  };

  const handleEnd = () => {
      setIsDragging(false);
  };

  const currentStep = routeSteps[currentStepIndex];
  const progressPercent = routeSteps.length > 0 ? Math.round(((currentStepIndex + 1) / routeSteps.length) * 100) : 0;

  return (
    <div 
        className="flex flex-col h-full bg-black relative overflow-hidden select-none"
        onMouseUp={handleEnd}
        onTouchEnd={handleEnd}
        onMouseMove={(e) => handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* 3D Viewport Area - Full Screen */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Onboarding Pop-up */}
      {showOnboarding && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-500">
          <div className="bg-black/80 p-8 rounded-3xl border-2 border-white/20 text-center max-w-sm mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <Navigation className="text-blue-400" size={32} />
            </div>
            <h3 className="text-white font-black text-xl mb-2 uppercase tracking-tight">{t('onboarding_title')}</h3>
            <p className="text-zinc-300 text-sm font-bold leading-relaxed">
              {t('onboarding_desc')}
            </p>
          </div>
        </div>
      )}

      {/* Encouragement Pop-up - Overlaying Instructions */}
      {showEncouragement && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[220px] px-2 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-[#FF7A30] p-1.5 rounded-xl border border-white/20 text-white flex items-center space-x-2 shadow-2xl">
            <div className="bg-white/20 p-1 rounded-lg shrink-0">
              <Sparkles size={12} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black truncate leading-tight uppercase">{t('checkpoint_reached')}</p>
              <p className="text-[7px] font-bold text-white/90">{encouragementMsg}</p>
            </div>
            <div className="text-[9px] font-black bg-black/20 px-1.5 py-0.5 rounded-lg">
              {progressPercent}%
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 left-4 bg-black/40 backdrop-blur-md text-white p-3 rounded-2xl border-2 border-white/20 hover:bg-black/60 transition-all z-40 shadow-xl"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
      )}

      {/* Direction Guide - Top Center - EVEN SMALLER */}
      {currentStep && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-[220px] px-2">
            <div className="bg-black/60 backdrop-blur-xl p-1.5 rounded-xl border border-white/10 text-white flex items-center space-x-2 shadow-2xl">
                <div className="bg-blue-500 p-1 rounded-lg shrink-0">
                    <Navigation size={12} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <div 
                      className="text-[9px] font-black truncate leading-tight"
                      dangerouslySetInnerHTML={{ __html: currentStep.instructions }}
                    />
                    <p className="text-[7px] font-bold text-blue-400">{distanceToNext}m {t('away')}</p>
                </div>
            </div>
        </div>
      )}

      {/* Speedometer - Top Right */}
      <div className="absolute top-6 right-4 z-40 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 text-white flex items-center space-x-2 shadow-2xl scale-75 origin-top-right">
              <Gauge size={16} className="text-blue-400" />
              <div className="flex flex-col items-center">
                  <p className="text-2xl font-black leading-none font-mono tracking-tighter">{Math.round(displaySpeed)}</p>
                  <p className="text-[7px] font-bold text-zinc-400 uppercase tracking-widest">{t('kmh')}</p>
              </div>
          </div>
      </div>

      {/* Steering Wheel Area - Bottom Center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-30">
          <div 
              className="w-48 h-48 relative flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing scale-75"
              onMouseDown={(e) => handleStart(e.clientX)}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          >
              <div 
                className="w-full h-full rounded-full border-[16px] border-zinc-800 bg-zinc-900/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative flex items-center justify-center"
                style={{ transform: `rotate(${steeringAngle}deg)` }}
              >
                  <div className="absolute w-full h-8 bg-zinc-800"></div>
                  <div className="absolute h-full w-8 bg-zinc-800 top-1/2"></div>
                  <div className="w-16 h-16 bg-zinc-900 rounded-full border-4 border-zinc-700 flex items-center justify-center shadow-inner z-10">
                      <div className="text-zinc-500 font-black text-[7px] tracking-[0.2em] uppercase">JPJ</div>
                  </div>
                  <div className="absolute top-0 w-2.5 h-5 bg-red-500 rounded-b-lg -mt-1"></div>
              </div>
          </div>
      </div>

      {/* Signals - Top Corners */}
      <div className="absolute top-24 left-10 z-30 pointer-events-none">
        <div className={`transition-opacity duration-300 ${signals.left ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
            <ChevronLeft size={80} className="text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" strokeWidth={4} />
        </div>
      </div>
      <div className="absolute top-24 right-10 z-30 pointer-events-none">
        <div className={`transition-opacity duration-300 ${signals.right ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
            <ChevronRight size={80} className="text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" strokeWidth={4} />
        </div>
      </div>

      {/* Gear Selector - Bottom Left (Vertical) */}
      <div className="absolute bottom-6 left-6 z-40 flex flex-col gap-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 scale-90 origin-bottom-left">
        {(['P', 'R', 'N', 'D', 'DA'] as Gear[]).map(g => (
          <button
            key={g}
            onClick={() => { setGear(g); if(g !== 'D' && g !== 'R' && g !== 'DA') setSpeed(0); }}
            className={`w-9 h-9 rounded-xl border-2 font-black text-[10px] transition-all ${gear === g ? 'bg-white border-white text-black scale-105 shadow-lg' : 'bg-black/20 border-white/10 text-white/40 hover:bg-white/10'}`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Pedals - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-40 flex gap-4 items-end scale-75 origin-bottom-right">
        {/* Brake Pedal */}
        <button 
            onMouseDown={() => setIsBraking(true)}
            onMouseUp={() => setIsBraking(false)}
            onTouchStart={() => setIsBraking(true)}
            onTouchEnd={() => setIsBraking(false)}
            className={`w-16 h-20 bg-red-600/80 backdrop-blur-md rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.5)] border-2 border-white/20 transition-all flex items-center justify-center ${isBraking ? 'translate-y-1 shadow-none bg-red-700' : 'hover:brightness-110'}`}
        >
            <span className="text-white font-black text-[10px] tracking-widest uppercase">{t('brake')}</span>
        </button>
        {/* Gas Pedal */}
        <button 
            onMouseDown={() => setIsAccelerating(true)}
            onMouseUp={() => setIsAccelerating(false)}
            onTouchStart={() => setIsAccelerating(true)}
            onTouchEnd={() => setIsAccelerating(false)}
            className={`w-12 h-28 bg-zinc-800/80 backdrop-blur-md rounded-t-2xl rounded-b-3xl shadow-[0_6px_0_rgba(0,0,0,0.5)] border-2 border-white/20 transition-all flex flex-col items-center justify-end pb-4 group ${isAccelerating ? 'translate-y-1.5 shadow-none bg-zinc-900' : 'hover:brightness-110'}`}
        >
            <div className="w-1.5 h-12 bg-zinc-700 rounded-full mb-2 group-active:bg-zinc-600 transition-colors"></div>
            <span className="text-zinc-400 font-black text-[8px] tracking-widest uppercase rotate-180 [writing-mode:vertical-rl]">{t('gas')}</span>
        </button>
      </div>
    </div>
  );
};

const SimulationScreen: React.FC<SimulationScreenProps> = (props) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  return (
    <APIProvider apiKey={apiKey} libraries={['streetView', 'geometry', 'routes']}>
      <SimulatorContent {...props} />
    </APIProvider>
  );
};

export default SimulationScreen;
