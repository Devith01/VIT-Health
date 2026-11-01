import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  fetchRoadRoute,
  calculateBearing,
  RouteResult,
  CLINIC_COORDS,
  BOYS_HOSTEL_1_COORDS,
  GIRLS_HOSTEL_1_COORDS,
  formatDurationText,
} from '../services/routingService';
import { Truck, Navigation, Bug, CheckCircle2 } from 'lucide-react';

// Fix default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Ambulance Marker with dynamic heading rotation
const createRotatedAmbulanceIcon = (headingAngle: number) => {
  return L.divIcon({
    className: 'custom-rotated-ambulance-marker',
    html: `
      <div style="
        transform: rotate(${headingAngle}deg);
        transition: transform 0.3s ease-in-out;
        background-color: #fb4903;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 2px solid #000000;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 16px;
      ">
        🚑
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

const createCustomIcon = (bgColor: string, text: string, iconEmoji: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        min-width: 38px;
        height: 38px;
        padding: 0 8px;
        border-radius: 19px;
        border: 2px solid #000000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        color: #000000;
        font-weight: 800;
        font-size: 11px;
        font-family: sans-serif;
        white-space: nowrap;
      ">
        <span>${iconEmoji}</span>
        <span>${text}</span>
      </div>
    `,
    iconSize: [44, 38],
    iconAnchor: [22, 19],
  });
};

const clinicMarkerIcon = createCustomIcon('#e9ccff', 'Clinic', '🏥');
const boysHostelMarkerIcon = createCustomIcon('#ffd731', 'BH-1', '🏠');
const girlsHostelMarkerIcon = createCustomIcon('#ffc0cb', 'GH-1', '🏠');

// Helper to keep the map centered on the ambulance
const MapRecenter: React.FC<{ center: [number, number]; enabled: boolean }> = ({ center, enabled }) => {
  const map = useMap();
  useEffect(() => {
    if (enabled) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, enabled, map]);
  return null;
};

export interface LiveAmbulanceMapProps {
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  destinationHostel?: 'Boys Hostel 1' | 'Girls Hostel 1' | '';
  roomNumber?: string;
  destinationText?: string;
  etaMinutes?: number;
  isDispatched?: boolean;
  onStatusChange?: (status: 'IDLE' | 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED') => void;
  onRouteCalculated?: (distanceKm: string, etaText: string) => void;
}

export const LiveAmbulanceMap: React.FC<LiveAmbulanceMapProps> = ({
  vehicleNumber = 'MP-04-VT-1001',
  driverName = 'Ramesh Kumar',
  driverPhone = '+91 9988776655',
  destinationHostel = '',
  roomNumber = '',
  destinationText = '',
  isDispatched = false,
  onStatusChange,
  onRouteCalculated,
}) => {
  const [mapTileType, setMapTileType] = useState<'google_roadmap' | 'google_satellite' | 'osm'>('google_roadmap');
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(0);
  const [heading, setHeading] = useState<number>(85);
  const [speed, setSpeed] = useState<number>(0);
  const [showDebug, setShowDebug] = useState<boolean>(true);
  const [hasArrived, setHasArrived] = useState<boolean>(false);

  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  // Handle Route Fetching ONLY when isDispatched becomes true
  useEffect(() => {
    if (!isDispatched || !destinationHostel) {
      // Stationary at Clinic when not dispatched
      setRouteResult(null);
      setCurrentPointIndex(0);
      setSpeed(0);
      setHasArrived(false);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      return;
    }

    // Determine target coordinates based on chosen hostel
    const targetCoords: [number, number] =
      destinationHostel === 'Girls Hostel 1' ? GIRLS_HOSTEL_1_COORDS : BOYS_HOSTEL_1_COORDS;

    // Fetch road route from Clinic to Target Hostel
    fetchRoadRoute(CLINIC_COORDS, targetCoords).then((res) => {
      setRouteResult(res);
      setCurrentPointIndex(0);
      setHasArrived(false);
      setSpeed(35);

      const distKm = (res.distanceMeters / 1000).toFixed(2) + ' km';
      const etaStr = formatDurationText(res.durationSeconds);
      if (onRouteCalculated) {
        onRouteCalculated(distKm, etaStr);
      }
      if (onStatusChange) {
        onStatusChange('EN_ROUTE');
      }
    });
  }, [isDispatched, destinationHostel]);

  // Handle Point-by-point Animation ONLY when actively dispatched and route is ready
  useEffect(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    if (!isDispatched || !routeResult || routeResult.coordinates.length < 2 || hasArrived) {
      return;
    }

    // Animate movement point by point along the road route
    animationIntervalRef.current = setInterval(() => {
      setCurrentPointIndex((prev) => {
        const nextIndex = prev + 1;

        if (nextIndex >= routeResult.coordinates.length) {
          // Ambulance has ARRIVED at destination hostel!
          setHasArrived(true);
          setSpeed(0);
          if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
          }
          if (onStatusChange) {
            onStatusChange('ARRIVED');
          }
          return prev;
        }

        // Calculate heading bearing angle along road curve
        const currentCoord = routeResult.coordinates[prev];
        const nextCoord = routeResult.coordinates[nextIndex];
        const angle = calculateBearing(currentCoord, nextCoord);
        setHeading(angle);

        // Simulated vehicle speed (32-38 km/h)
        setSpeed(Math.floor(32 + Math.random() * 6));

        return nextIndex;
      });
    }, 850); // ~850ms per road waypoint gives smooth demo progression

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    };
  }, [isDispatched, routeResult, hasArrived]);

  // Determine current ambulance position
  const currentPos: [number, number] =
    isDispatched && routeResult && routeResult.coordinates.length > 0
      ? routeResult.coordinates[currentPointIndex] || CLINIC_COORDS
      : CLINIC_COORDS;

  // Compute remaining distance & ETA
  const totalPoints = routeResult ? routeResult.coordinates.length : 1;
  const remainingPoints = hasArrived ? 0 : Math.max(0, totalPoints - currentPointIndex - 1);
  const totalDistMeters = routeResult ? routeResult.distanceMeters : 0;
  const remainingMeters = hasArrived ? 0 : Math.round((remainingPoints / totalPoints) * totalDistMeters);
  const remainingKm = (remainingMeters / 1000).toFixed(2);

  const durationSec = routeResult ? routeResult.durationSeconds : 0;
  const remainingSec = hasArrived ? 0 : Math.round((remainingPoints / totalPoints) * durationSec);
  const remainingEtaFormatted = hasArrived ? 'Arrived on site' : formatDurationText(remainingSec);

  const targetCoords: [number, number] =
    destinationHostel === 'Girls Hostel 1' ? GIRLS_HOSTEL_1_COORDS : BOYS_HOSTEL_1_COORDS;

  const targetLabel =
    destinationHostel || destinationText || 'Destination Hostel';

  const getTileUrl = () => {
    switch (mapTileType) {
      case 'google_roadmap':
        return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      case 'google_satellite':
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case 'osm':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  return (
    <div className="space-y-4 text-black">
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-[20px] border border-black text-xs font-bold">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#fb4903]">
            <Truck className="h-4 w-4" />
            <span>Unit: {vehicleNumber}</span>
          </div>
          <span className="text-black/30">|</span>
          <span>
            Dispatch Station: <strong className="font-extrabold">Clinic (23.076039, 76.850110)</strong>
          </span>
          <span className="text-black/30 hidden sm:inline">|</span>
          <span className="hidden sm:inline">
            Speed: <strong className="font-extrabold">{isDispatched && !hasArrived ? `${speed} km/h` : '0 km/h (Stationary)'}</strong>
          </span>
          {isDispatched && (
            <>
              <span className="text-black/30 hidden sm:inline">|</span>
              <span className="hidden sm:inline">
                Estimated Arrival Time: <strong className="text-[#fb4903] font-extrabold">{remainingEtaFormatted}</strong>
              </span>
            </>
          )}
        </div>

        {/* Map Layer Switcher & Debug Toggle */}
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setShowDebug(!showDebug)}
            className="px-3 py-1 rounded-[1600px] bg-[#e9ccff] border border-black text-black hover:bg-slate-200 flex items-center gap-1 cursor-pointer transition-all"
          >
            <Bug className="h-3 w-3" />
            <span>Telemetry</span>
          </button>

          <button
            type="button"
            onClick={() => setMapTileType('google_roadmap')}
            className={`px-3 py-1 rounded-[1600px] border border-black font-bold transition-all cursor-pointer ${
              mapTileType === 'google_roadmap'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-slate-100'
            }`}
          >
            Google Map
          </button>
          <button
            type="button"
            onClick={() => setMapTileType('google_satellite')}
            className={`px-3 py-1 rounded-[1600px] border border-black font-bold transition-all cursor-pointer ${
              mapTileType === 'google_satellite'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-slate-100'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Interactive Leaflet Map Container */}
      <div className="h-96 w-full rounded-[24px] overflow-hidden border-2 border-black relative shadow-none">
        <MapContainer
          center={currentPos}
          zoom={16}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapRecenter center={currentPos} enabled={isDispatched && !hasArrived} />
          <TileLayer
            attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
            url={getTileUrl()}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />

          {/* Actual Road Geometry Polyline (Appears only after dispatch) */}
          {isDispatched && routeResult && (
            <Polyline
              positions={routeResult.coordinates}
              color="#fb4903"
              weight={6}
              opacity={0.9}
            />
          )}

          {/* 1. Clinic / Ambulance Dispatch Station Marker (23.076039, 76.850110) */}
          <Marker position={CLINIC_COORDS} icon={clinicMarkerIcon}>
            <Popup className="custom-popup">
              <div className="p-1 text-black text-xs font-bold">
                <p className="font-extrabold text-black">🏥 Clinic / Ambulance Dispatch Station</p>
                <p className="text-[10px] text-slate-700">Start: 23.076039, 76.850110</p>
                <p className="text-[10px] text-slate-600">VIT Bhopal Campus Health Centre</p>
              </div>
            </Popup>
          </Marker>

          {/* 2. Destination Hostel Marker (Shown if hostel is selected) */}
          {destinationHostel && (
            <Marker
              position={targetCoords}
              icon={destinationHostel === 'Girls Hostel 1' ? girlsHostelMarkerIcon : boysHostelMarkerIcon}
            >
              <Popup className="custom-popup">
                <div className="p-1 text-black text-xs font-bold">
                  <p className="font-extrabold text-black">🏠 DESTINATION: {destinationHostel}</p>
                  {roomNumber && <p className="text-[10px] text-[#fb4903]">Room: {roomNumber}</p>}
                  <p className="text-[10px] text-slate-600">
                    {destinationHostel === 'Girls Hostel 1' ? '23.074909, 76.853133' : '23.074891, 76.859719'}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* 3. Moving / Stationary Ambulance Marker */}
          <Marker position={currentPos} icon={createRotatedAmbulanceIcon(heading)}>
            <Popup className="custom-popup">
              <div className="p-1 text-black text-xs font-bold">
                <p className="font-extrabold text-[#fb4903]">🚑 Smart Ambulance {vehicleNumber}</p>
                <p className="text-[10px] text-slate-700">Driver: {driverName} ({driverPhone})</p>
                <p className="text-[10px] text-slate-700">
                  Status: {hasArrived ? 'ARRIVED AT DESTINATION' : isDispatched ? 'EN ROUTE' : 'READY AT CLINIC'}
                </p>
                <p className="text-[10px] text-black font-extrabold">
                  Speed: {isDispatched && !hasArrived ? `${speed} km/h` : '0 km/h'}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Live GPS Telemetry Floating Badge */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white border border-black p-3 rounded-[16px] text-xs space-y-1 shadow-sm font-bold">
          <div className="flex items-center gap-2 text-black text-[11px]">
            <Navigation className="h-3.5 w-3.5 text-[#fb4903]" />
            <span>
              {isDispatched
                ? `CLINIC → ${destinationHostel.toUpperCase() || 'HOSTEL'}`
                : 'AMBULANCE STATIONARY AT CLINIC'}
            </span>
          </div>
          <p className="text-[10px] text-slate-600">
            Lat: {currentPos[0].toFixed(6)} | Lng: {currentPos[1].toFixed(6)} | Heading: {heading.toFixed(0)}°
          </p>
          {hasArrived && (
            <div className="flex items-center gap-1 text-[#008000] text-[11px] font-extrabold pt-0.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>ARRIVED AT {destinationHostel.toUpperCase()} ROOM {roomNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Telemetry Debug Panel */}
      {showDebug && (
        <div className="p-5 rounded-[20px] bg-white border border-black text-xs font-bold space-y-2 shadow-none">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-black flex items-center gap-1.5">
              <Bug className="h-4 w-4 text-[#fb4903]" /> Live Road Routing Telemetry Panel
            </span>
            <span className="text-[10px] font-bold text-black bg-[#55db9c] px-3 py-0.5 rounded-[1600px] border border-black">
              Engine: {routeResult?.engine || 'OSRM_PUBLIC_API / ROAD_GRAPH'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] pt-1">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">AMBULANCE START:</span>
              <span className="font-bold text-black">Clinic (23.076039, 76.850110)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">CURRENT POSITION:</span>
              <span className="font-bold text-black">
                {currentPos[0].toFixed(6)}, {currentPos[1].toFixed(6)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">HEADING BEARING:</span>
              <span className="font-bold text-black bg-[#ffd731] px-2 py-0.5 rounded-[1600px] border border-black">
                {heading.toFixed(1)}°
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">ROUTE POINT STEP:</span>
              <span className="font-bold text-black">
                {isDispatched ? `Point ${currentPointIndex + 1} of ${totalPoints}` : 'Idle (0 of 0)'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">REMAINING DISTANCE:</span>
              <span className="font-bold text-[#fb4903]">
                {isDispatched ? `${remainingKm} km (${remainingMeters} m)` : '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">ESTIMATED ARRIVAL TIME:</span>
              <span className="font-bold text-[#fb4903]">
                {isDispatched ? remainingEtaFormatted : '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">VEHICLE SPEED:</span>
              <span className="font-bold text-black bg-[#55db9c] px-2 py-0.5 rounded-[1600px] border border-black">
                {isDispatched && !hasArrived ? `${speed} km/h` : '0 km/h'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">TARGET DESTINATION:</span>
              <span className="font-bold text-black">
                {destinationHostel ? `${destinationHostel} (${roomNumber || 'Room pending'})` : 'None selected'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
