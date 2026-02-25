import React, { useState, useEffect } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMapsLibrary, 
  useMap,
  MapControl,
  ControlPosition
} from '@vis.gl/react-google-maps';
import { MOCK_DATA } from '../mockData';
import { MapPin, Navigation, Play, AlertTriangle, Info } from 'lucide-react';
import { TestRoute, RouteTip } from '../types';

interface MapScreenProps {
  onStartDrive: () => void;
}

const DRIVING_CENTRE = { lat: 5.350188, lng: 100.303562 };

const Directions = ({ route }: { route: TestRoute }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const geometryLibrary = useMapsLibrary('geometry');
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (!routesLibrary || !map) return;
    const renderer = new routesLibrary.DirectionsRenderer({ 
        map,
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#FF7A30',
            strokeWeight: 6,
            strokeOpacity: 0.8
        }
    });
    setDirectionsRenderer(renderer);

    return () => {
      renderer.setMap(null);
    };
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!map) return;
    return () => {
      if (polyline) polyline.setMap(null);
    };
  }, [map, polyline]);

  useEffect(() => {
    if (!route.tips.length || !map) return;

    const fetchDirections = async () => {
      const origin = DRIVING_CENTRE;
      const destination = DRIVING_CENTRE;
      const waypoints = [
        { location: { lat: 5.349562, lng: 100.298312 }, stopover: true },
        { location: { lat: 5.334312, lng: 100.296063 }, stopover: true }
      ];

      // 1. Try Routes API (New) via fetch FIRST (as recommended by Google)
      try {
        const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-Fieldmask': 'routes.polyline.encodedPolyline'
          },
          body: JSON.stringify({
            origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
            destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
            intermediates: waypoints.map(wp => ({ location: { latLng: { latitude: wp.location.lat, longitude: wp.location.lng } } })),
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE'
          })
        });

        if (response.ok) {
          const data = await response.json();
          const encodedPolyline = data.routes?.[0]?.polyline?.encodedPolyline;
          
          if (encodedPolyline && geometryLibrary) {
            const path = geometryLibrary.encoding.decodePath(encodedPolyline);
            
            if (polyline) polyline.setMap(null);
            if (directionsRenderer) directionsRenderer.setDirections({ routes: [] } as any);

            const newPolyline = new google.maps.Polyline({
              path,
              map,
              strokeColor: '#FF7A30',
              strokeWeight: 6,
              strokeOpacity: 0.8
            });
            setPolyline(newPolyline);
            return;
          }
        } else {
            const errData = await response.json();
            console.warn("Routes API (New) returned an error:", errData);
        }
      } catch (e) {
        console.warn("Routes API (New) fetch failed, trying legacy service...", e);
      }

      // 2. Try legacy Directions Service as second option
      if (routesLibrary) {
        const directionsService = new routesLibrary.DirectionsService();
        try {
          const result = await directionsService.route({
            origin,
            destination,
            waypoints,
            travelMode: google.maps.TravelMode.DRIVING
          });
          if (directionsRenderer) {
            if (polyline) polyline.setMap(null);
            directionsRenderer.setDirections(result);
            return;
          }
        } catch (e: any) {
          console.warn("Legacy Directions Service also failed.", e);
        }
      }

      // 3. Final Fallback: Simple straight lines between points
      console.warn("Using simple polyline fallback");
      const simplePath = [
        origin,
        ...route.tips.map(t => ({ lat: t.coords.lat, lng: t.coords.lon }))
      ];
      
      if (polyline) polyline.setMap(null);
      if (directionsRenderer) directionsRenderer.setDirections({ routes: [] } as any);

      const finalPolyline = new google.maps.Polyline({
        path: simplePath,
        map,
        strokeColor: '#FF7A30',
        strokeWeight: 6,
        strokeOpacity: 0.5,
        icons: [{
          icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
          offset: '100%',
          repeat: '100px'
        }]
      });
      setPolyline(finalPolyline);
    };

    fetchDirections();
  }, [routesLibrary, geometryLibrary, directionsRenderer, route, map, apiKey]);

  return null;
};

const MapScreen: React.FC<MapScreenProps> = ({ onStartDrive }) => {
  const { testRoutes } = MOCK_DATA;
  const [selectedRouteKey, setSelectedRouteKey] = useState<string>('routeA');
  const [activeTipId, setActiveTipId] = useState<number | null>(null);
  const [featureDescription, setFeatureDescription] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  
  const selectedRoute = testRoutes[selectedRouteKey];
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="flex flex-col h-full bg-zinc-50 relative">
      {/* Map View Area */}
      <div className="relative h-1/2 w-full bg-zinc-200 overflow-hidden border-b-4 border-zinc-900">
        <APIProvider 
          apiKey={apiKey} 
          libraries={['routes', 'geometry']}
          onLoad={() => console.log('Maps API Loaded')}
        >
            <Map
                defaultCenter={DRIVING_CENTRE}
                defaultZoom={16}
                mapId="DEMO_MAP_ID" // Required for AdvancedMarker
                disableDefaultUI={true}
                className="w-full h-full"
            >
                <Directions route={selectedRoute} />
                
                {/* Driving Centre Marker */}
                <AdvancedMarker position={DRIVING_CENTRE}>
                    <Pin background={'#465C88'} glyphColor={'#FFF'} borderColor={'#000'} />
                </AdvancedMarker>

                {/* Tip Markers */}
                {selectedRoute.tips.map((tip) => (
                    <TipMarker 
                        key={tip.id} 
                        tip={tip} 
                        isActive={activeTipId === tip.id}
                        onClick={(desc) => {
                            setFeatureDescription(desc);
                            setActiveTipId(tip.id);
                        }}
                    />
                ))}
            </Map>
        </APIProvider>

        {/* API Error / Billing Warning */}
        <div className="absolute top-4 left-4 right-4 z-50">
            <div className="bg-amber-50 border-2 border-amber-500 p-3 rounded-2xl shadow-lg flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div>
                    <h5 className="text-amber-900 font-black text-[10px] uppercase tracking-wider">Demo Mode Active</h5>
                    <p className="text-amber-800 text-[9px] font-bold leading-tight">
                        Google Maps Billing is not enabled. Routes are shown as straight lines. 
                        <a href="https://console.cloud.google.com/billing" target="_blank" className="underline ml-1">Enable Billing</a>
                    </p>
                </div>
            </div>
        </div>

         {/* Floating Tip Card */}
         {activeTipId && (
             <div className="absolute bottom-6 left-6 right-6 bg-white p-5 rounded-[2rem] border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] z-30 animate-in slide-in-from-bottom-5 fade-in duration-300">
                 <div className="flex items-start space-x-4">
                     <div className="bg-orange-50 p-3 rounded-xl border border-[#FF7A30] text-[#FF7A30] shrink-0">
                         <AlertTriangle size={20} strokeWidth={2.5} />
                     </div>
                     <div className="flex-1">
                         <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-black text-zinc-900 text-sm uppercase tracking-wide">Checkpoint Tip</h4>
                            {featureDescription && (
                                <span className="bg-zinc-100 text-zinc-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-zinc-200">
                                    {featureDescription}
                                </span>
                            )}
                         </div>
                         <p className="text-zinc-600 text-sm font-bold leading-relaxed">
                             {selectedRoute.tips.find(t => t.id === activeTipId)?.text}
                         </p>
                     </div>
                     <button onClick={() => {
                         setActiveTipId(null);
                         setFeatureDescription('');
                     }} className="text-zinc-400 hover:text-zinc-900 p-2">
                         <span className="font-bold text-xl">×</span>
                     </button>
                 </div>
             </div>
         )}
      </div>

      {/* Route Selection Panel */}
      <div className="flex-1 bg-white relative z-10 flex flex-col rounded-t-[2.5rem] shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] -mt-8 pt-2">
        <div className="p-3 flex justify-center">
            <div className="w-12 h-1.5 bg-zinc-300 rounded-full"></div>
        </div>
        
        <div className="p-6 overflow-y-auto no-scrollbar pb-32">
            <h2 className="text-xl font-black text-[#465C88] mb-6 flex items-center uppercase tracking-tight">
                <Navigation className="mr-3" size={24} strokeWidth={2.5} />
                Select Route
            </h2>
            
            <div className="space-y-4">
                {(Object.keys(testRoutes) as string[]).map((key) => (
                    <div 
                      key={key} 
                      className={`w-full p-1 rounded-[1.5rem] border-2 transition-all duration-200 
                        ${selectedRouteKey === key ? 'border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]' : 'border-zinc-200'}`}
                    >
                      <div className={`p-4 rounded-[1.2rem] flex justify-between items-center ${selectedRouteKey === key ? 'bg-zinc-50' : 'bg-white'}`}>
                        <button
                            onClick={() => {
                                setSelectedRouteKey(key);
                                setActiveTipId(null);
                                setFeatureDescription('');
                            }}
                            className="flex flex-col items-start flex-1"
                        >
                            <span className={`font-black text-lg uppercase ${selectedRouteKey === key ? 'text-[#465C88]' : 'text-zinc-400'}`}>{testRoutes[key].name}</span>
                            <span className="text-[10px] font-black mt-1 uppercase text-zinc-400">{testRoutes[key].tips.length} CHECKPOINTS</span>
                        </button>
                        
                        {selectedRouteKey === key && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartDrive();
                            }}
                            className="bg-[#FF7A30] text-white flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                          >
                            <span className="text-[10px] font-black uppercase">Start Drive</span>
                            <Play size={14} fill="white" />
                          </button>
                        )}
                      </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

interface TipMarkerProps {
    tip: RouteTip;
    isActive: boolean;
    onClick: (description: string) => void;
}

const TipMarker: React.FC<TipMarkerProps> = ({ tip, isActive, onClick }) => {
    const handleClick = () => {
        // Geocoding removed to avoid API activation errors
        onClick('Checkpoint');
    };

    return (
        <AdvancedMarker 
            position={{ lat: tip.coords.lat, lng: tip.coords.lon }}
            onClick={handleClick}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform -translate-y-1/2
                ${isActive ? 'bg-[#FF7A30] text-white scale-110 z-20' : 'bg-white text-[#465C88] hover:scale-105 z-10'}
            `}>
                <MapPin size={20} strokeWidth={2.5} />
            </div>
        </AdvancedMarker>
    );
};

export default MapScreen;
