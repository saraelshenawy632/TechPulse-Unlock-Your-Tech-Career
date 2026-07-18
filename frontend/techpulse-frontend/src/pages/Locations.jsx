import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import { MapPin, Briefcase, Globe2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// أيقونة نبضية
const createGlowingIcon = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute animate-ping h-8 w-8 rounded-full bg-blue-500 opacity-75"></div>
             <div class="relative h-4 w-4 rounded-full bg-blue-400 border-2 border-slate-900 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 5, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function JobLocations() {
  const [locations] = useState([
    { name: "San Francisco", count: 430, percent: 14.5, coords: [37.7749, -122.4194] },
    { name: "Chennai", count: 130, percent: 4.4, coords: [13.0827, 80.2707] },
    { name: "London", count: 87, percent: 2.9, coords: [51.5074, -0.1278] },
    { name: "Cairo", count: 65, percent: 2.1, coords: [30.0444, 31.2357] }
  ]);
  const [activeCoords, setActiveCoords] = useState([30.0444, 31.2357]);

  return (
    <div className="w-full h-[600px] bg-[#030712] border border-slate-800 rounded-3xl p-2 shadow-2xl flex flex-col lg:flex-row overflow-hidden">
      
      {/* القائمة الجانبية */}
      <div className="w-full lg:w-80 p-6 flex flex-col bg-[#0f172a] rounded-2xl z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Globe2 size={24} /></div>
          <h3 className="text-white font-bold text-lg">Hiring Hubs</h3>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {locations.map((loc, i) => (
            <button key={i} onClick={() => setActiveCoords(loc.coords)} className="w-full p-4 rounded-xl bg-[#030712] border border-slate-800 hover:border-blue-500 transition-all text-left">
              <div className="text-white font-bold">{loc.name}</div>
              <div className="text-xs text-slate-400">{loc.count} Jobs ({loc.percent}%)</div>
            </button>
          ))}
        </div>
      </div>

      {/* الخريطة - حاوية واضحة الأبعاد */}
      <div className="flex-1 relative h-[300px] lg:h-full mt-4 lg:mt-0 lg:ml-2 rounded-2xl overflow-hidden border border-slate-800">
        <div className="absolute inset-0 w-full h-full">
          <MapContainer center={activeCoords} zoom={4} style={{ width: "100%", height: "100%" }} zoomControl={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <ChangeMapView center={activeCoords} />
            {locations.map((loc, i) => (
              <Marker key={i} position={loc.coords} icon={createGlowingIcon()}>
                <Tooltip className="custom-tooltip">
                  <div className="font-bold text-blue-300">{loc.name}</div>
                  <div>{loc.count} Jobs</div>
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <style>{`
        /* إجبار الخريطة على اللون الكحلي والظهور */
        .leaflet-container { width: 100% !important; height: 100% !important; background: #030712 !important; }
        .leaflet-tile { filter: grayscale(1) invert(1) hue-rotate(180deg) brightness(0.6) contrast(1.2) saturate(1.5) !important; }
        
        .custom-tooltip {
            background: #0f172a !important;
            border: 1px solid #1e3a8a !important;
            color: white !important;
            border-radius: 8px !important;
            padding: 8px !important;
        }
        .custom-tooltip::before { border-top-color: #0f172a !important; }
      `}</style>
    </div>
  );
}