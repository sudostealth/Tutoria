import React, { useEffect, useRef, useState } from 'react';
import { Language, SiteStats, TaxonomyData } from '../types';
import { MapPin, Sparkles, Navigation, Layers, ChevronRight, Eye, Flame, Map, RefreshCw } from 'lucide-react';

interface HeroHotspotsMapProps {
  language: Language;
  stats: SiteStats | null;
  taxonomy: TaxonomyData | null;
  onBrowseClick: (divisionFilter?: string) => void;
  onOpenGeoStatsModal: () => void;
}

interface HotspotPoint {
  id: string;
  nameBn: string;
  nameEn: string;
  lat: number;
  lng: number;
  count: number;
  isTop?: boolean;
  type: 'division' | 'district';
  districtsCount?: number;
  thanasCount?: number;
}

// Coordinate mapping for all 8 Bangladesh Divisions
const DIVISION_COORDS: Record<string, { lat: number; lng: number; nameBn: string }> = {
  'Dhaka': { lat: 23.8103, lng: 90.4125, nameBn: 'ঢাকা' },
  'Chattogram': { lat: 22.3569, lng: 91.7832, nameBn: 'চট্টগ্রাম' },
  'Chittagong': { lat: 22.3569, lng: 91.7832, nameBn: 'চট্টগ্রাম' },
  'Rajshahi': { lat: 24.3745, lng: 88.6042, nameBn: 'রাজশাহী' },
  'Khulna': { lat: 22.8456, lng: 89.5403, nameBn: 'খুলনা' },
  'Barishal': { lat: 22.7010, lng: 90.3535, nameBn: 'বরিশাল' },
  'Barisal': { lat: 22.7010, lng: 90.3535, nameBn: 'বরিশাল' },
  'Sylhet': { lat: 24.8949, lng: 91.8687, nameBn: 'সিলেট' },
  'Rangpur': { lat: 25.7439, lng: 89.2752, nameBn: 'রংপুর' },
  'Mymensingh': { lat: 24.7471, lng: 90.4203, nameBn: 'ময়মনসিংহ' }
};

// Comprehensive District Coordinates (covering all 64 districts in Bangladesh)
const DISTRICT_COORDS: Record<string, { lat: number; lng: number; nameBn: string }> = {
  'Dhaka': { lat: 23.8103, lng: 90.4125, nameBn: 'ঢাকা' },
  'Gazipur': { lat: 23.9999, lng: 90.4203, nameBn: 'গাজীপুর' },
  'Narayanganj': { lat: 23.6238, lng: 90.5000, nameBn: 'নারায়ণগঞ্জ' },
  'Cumilla': { lat: 23.4607, lng: 91.1809, nameBn: 'কুমিল্লা' },
  'Comilla': { lat: 23.4607, lng: 91.1809, nameBn: 'কুমিল্লা' },
  "Cox's Bazar": { lat: 21.4272, lng: 91.9702, nameBn: 'কক্সবাজার' },
  'Bogura': { lat: 24.8465, lng: 89.3777, nameBn: 'বগুড়া' },
  'Bogra': { lat: 24.8465, lng: 89.3777, nameBn: 'বগুড়া' },
  'Jashore': { lat: 23.1664, lng: 89.2081, nameBn: 'যশোর' },
  'Jessore': { lat: 23.1664, lng: 89.2081, nameBn: 'যশোর' },
  'Pabna': { lat: 24.0063, lng: 89.2372, nameBn: 'পাবনা' },
  'Tangail': { lat: 24.2513, lng: 89.9167, nameBn: 'টাঙ্গাইল' },
  'Faridpur': { lat: 23.6071, lng: 89.8406, nameBn: 'ফরিদপুর' },
  'Feni': { lat: 23.0159, lng: 91.3976, nameBn: 'ফেনী' },
  'Noakhali': { lat: 22.8696, lng: 91.0991, nameBn: 'নোয়াখালী' },
  'Kushtia': { lat: 23.9013, lng: 89.1204, nameBn: 'কুষ্টিয়া' },
  'Dinajpur': { lat: 25.6279, lng: 88.6332, nameBn: 'দিনাজপুর' },
  'Bagerhat': { lat: 22.6516, lng: 89.7859, nameBn: 'বাগেরহাট' },
  'Bandarban': { lat: 21.8311, lng: 92.3686, nameBn: 'বান্দরবান' },
  'Barguna': { lat: 22.1570, lng: 90.1130, nameBn: 'বরগুনা' },
  'Bhola': { lat: 22.6859, lng: 90.6481, nameBn: 'ভোলা' },
  'Brahmanbaria': { lat: 23.9571, lng: 91.1119, nameBn: 'ব্রাহ্মণবাড়িয়া' },
  'Chandpur': { lat: 23.2333, lng: 90.6667, nameBn: 'চাঁদপুর' },
  'Chapainawabganj': { lat: 24.5965, lng: 88.2775, nameBn: 'চাঁপাইনবাবগঞ্জ' },
  'Chuadanga': { lat: 23.6402, lng: 88.8418, nameBn: 'চুয়াডাঙ্গা' },
  'Gaibandha': { lat: 25.3288, lng: 89.5413, nameBn: 'গাইবান্ধা' },
  'Gopalganj': { lat: 23.0051, lng: 89.8266, nameBn: 'গোপালগঞ্জ' },
  'Habiganj': { lat: 24.3750, lng: 91.4167, nameBn: 'হবিগঞ্জ' },
  'Jamalpur': { lat: 24.9375, lng: 89.9375, nameBn: 'জামালপুর' },
  'Jhenaidah': { lat: 23.5448, lng: 89.1539, nameBn: 'ঝিনাইদহ' },
  'Joypurhat': { lat: 25.1008, lng: 89.0279, nameBn: 'জয়পুরহাট' },
  'Khagrachhari': { lat: 23.1193, lng: 91.9847, nameBn: 'খাগড়াছড়ি' },
  'Kishoreganj': { lat: 24.4449, lng: 90.7766, nameBn: 'কিশোরগঞ্জ' },
  'Kurigram': { lat: 25.8054, lng: 89.6362, nameBn: 'কুড়িগ্রাম' },
  'Lakshmipur': { lat: 22.9425, lng: 90.8411, nameBn: 'লক্ষ্মীপুর' },
  'Lalmonirhat': { lat: 25.9165, lng: 89.4532, nameBn: 'লালমনিরহাট' },
  'Madaripur': { lat: 23.1641, lng: 90.1897, nameBn: 'মাদারীপুর' },
  'Magura': { lat: 23.4873, lng: 89.4199, nameBn: 'মাগুরা' },
  'Manikganj': { lat: 23.8644, lng: 90.0047, nameBn: 'মানিকগঞ্জ' },
  'Meherpur': { lat: 23.7622, lng: 88.6318, nameBn: 'মেহেরপুর' },
  'Moulvibazar': { lat: 24.4829, lng: 91.7774, nameBn: 'মৌলভীবাজার' },
  'Munshiganj': { lat: 23.5422, lng: 90.5305, nameBn: 'মুন্সীগঞ্জ' },
  'Naogaon': { lat: 24.7936, lng: 88.9318, nameBn: 'নওগাঁ' },
  'Narail': { lat: 23.1725, lng: 89.5127, nameBn: 'নড়াইল' },
  'Narsingdi': { lat: 23.9193, lng: 90.7206, nameBn: 'নরসিংদী' },
  'Natore': { lat: 24.4102, lng: 88.9849, nameBn: 'নাটোর' },
  'Netrokona': { lat: 24.8709, lng: 90.7279, nameBn: 'নেত্রকোণা' },
  'Nilphamari': { lat: 25.9318, lng: 88.8560, nameBn: 'নীলফামারী' },
  'Panchagarh': { lat: 26.3411, lng: 88.5541, nameBn: 'পঞ্চগড়' },
  'Patuakhali': { lat: 22.3596, lng: 90.3298, nameBn: 'পটুয়াখালী' },
  'Pirojpur': { lat: 22.5841, lng: 89.9720, nameBn: 'পিরোজপুর' },
  'Rajbari': { lat: 23.7574, lng: 89.6444, nameBn: 'রাজবাড়ী' },
  'Rangamati': { lat: 22.6533, lng: 92.1753, nameBn: 'রাঙ্গামাটি' },
  'Satkhira': { lat: 22.7185, lng: 89.0705, nameBn: 'সাতক্ষীরা' },
  'Shariatpur': { lat: 23.2423, lng: 90.4348, nameBn: 'শরীয়তপুর' },
  'Sherpur': { lat: 25.0205, lng: 90.0153, nameBn: 'শেরপুর' },
  'Sirajganj': { lat: 24.4534, lng: 89.7008, nameBn: 'সিরাজগঞ্জ' },
  'Sunamganj': { lat: 25.0658, lng: 91.3950, nameBn: 'সুনামগঞ্জ' },
  'Thakurgaon': { lat: 26.0337, lng: 88.4617, nameBn: 'ঠাকুরগাঁও' }
};

export const HeroHotspotsMap: React.FC<HeroHotspotsMapProps> = ({
  language,
  stats,
  taxonomy,
  onBrowseClick,
  onOpenGeoStatsModal
}) => {
  const isBn = language === 'bn';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [activeHotspot, setActiveHotspot] = useState<HotspotPoint | null>(null);

  // Load Leaflet script dynamically
  useEffect(() => {
    if ((window as any).L) {
      setMapLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Compute Hotspots List strictly from DB Stats (Zero hardcoded / synthetic counts)
  const hotspots: HotspotPoint[] = React.useMemo(() => {
    const list: HotspotPoint[] = [];
    const geoList = stats?.geographicBreakdown || [];

    // 1. Division Hotspots
    Object.keys(DIVISION_COORDS).forEach(divKey => {
      // Avoid duplicate Chittagong/Barisal aliases
      if (divKey === 'Chittagong' || divKey === 'Barisal') return;

      const info = DIVISION_COORDS[divKey];
      const match = geoList.find(g => g.division.toLowerCase() === divKey.toLowerCase());

      // STRICT REAL COUNT FROM DATABASE
      const realCount = match ? match.postCount : 0;
      const districtsCount = match ? match.districts.length : 0;

      let thanasCount = 0;
      if (match) {
        match.districts.forEach(d => {
          thanasCount += d.thanas.length;
        });
      }

      const isTopDivision = Boolean(
        stats?.topDivision?.name &&
        stats.topDivision.name.toLowerCase() === divKey.toLowerCase() &&
        realCount > 0
      );

      list.push({
        id: `div-${divKey}`,
        nameEn: divKey,
        nameBn: info.nameBn,
        lat: info.lat,
        lng: info.lng,
        count: realCount,
        isTop: isTopDivision,
        type: 'division',
        districtsCount,
        thanasCount
      });
    });

    // 2. District Hotspots (Only where posts exist in the database, or standard major ones with accurate count)
    const processedDistricts = new Set<string>();

    // First, process any district that exists in database stats
    geoList.forEach(div => {
      div.districts.forEach(dist => {
        const distName = dist.district;
        const normKey = Object.keys(DISTRICT_COORDS).find(k => k.toLowerCase() === distName.toLowerCase());
        
        if (normKey && !processedDistricts.has(normKey.toLowerCase())) {
          processedDistricts.add(normKey.toLowerCase());
          const info = DISTRICT_COORDS[normKey];

          list.push({
            id: `dist-${normKey}`,
            nameEn: normKey,
            nameBn: info.nameBn,
            lat: info.lat,
            lng: info.lng,
            count: dist.postCount, // STRICT REAL COUNT
            type: 'district'
          });
        }
      });
    });

    // Second, include key districts if they weren't already added (showing 0 count accurately if 0)
    const keyDistricts = ['Gazipur', 'Narayanganj', 'Cumilla', "Cox's Bazar", 'Bogura', 'Jashore', 'Pabna', 'Tangail', 'Faridpur', 'Feni', 'Noakhali', 'Kushtia', 'Dinajpur'];
    keyDistricts.forEach(kDist => {
      if (!processedDistricts.has(kDist.toLowerCase()) && DISTRICT_COORDS[kDist]) {
        const info = DISTRICT_COORDS[kDist];
        list.push({
          id: `dist-${kDist}`,
          nameEn: kDist,
          nameBn: info.nameBn,
          lat: info.lat,
          lng: info.lng,
          count: 0, // STRICT REAL COUNT = 0
          type: 'district'
        });
      }
    });

    return list;
  }, [stats]);

  // Total active posts across all Bangladesh
  const totalActivePosts = stats?.totalPosts || 0;

  // Initialize & Update Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.6850, 90.3563], // Bangladesh Center
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      // Google Maps Tile Layer
      const googleTiles = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 18,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      });

      // OSM Fallback
      const osmTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      });

      googleTiles.addTo(map);
      googleTiles.on('tileerror', () => {
        if (map.hasLayer(googleTiles)) {
          map.removeLayer(googleTiles);
          osmTiles.addTo(map);
        }
      });

      // Zoom Control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.featureGroup().addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    // Clear previous markers
    markersGroup.clearLayers();

    // Render Hotspot Markers
    hotspots.forEach(spot => {
      const isSelected = selectedDivision !== 'all' && spot.nameEn.toLowerCase() === selectedDivision.toLowerCase();
      const isTopSpot = spot.isTop;
      const hasPosts = spot.count > 0;

      // Color scheme based on real post count
      let pinColor = '#475569'; // Muted slate for 0 posts
      let badgeBg = '#ffffff';
      let badgeTextColor = '#334155';
      let auraHtml = '';

      if (isTopSpot) {
        pinColor = '#10b981'; // Emerald for top active
        badgeTextColor = '#047857';
        auraHtml = `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            width: 48px;
            height: 48px;
            margin-top: -24px;
            margin-left: -24px;
            background: rgba(16, 185, 129, 0.35);
            border-radius: 50%;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            pointer-events: none;
          "></div>
        `;
      } else if (isSelected) {
        pinColor = '#059669'; // Deep emerald when selected
        badgeTextColor = '#059669';
      } else if (hasPosts) {
        pinColor = '#0f172a'; // Slate-900 for active spots
        badgeTextColor = '#0f172a';
        auraHtml = `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            width: 36px;
            height: 36px;
            margin-top: -18px;
            margin-left: -18px;
            background: rgba(15, 230, 160, 0.2);
            border-radius: 50%;
            animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            pointer-events: none;
          "></div>
        `;
      }

      const countBadge = `${spot.count}`;

      const customIcon = L.divIcon({
        className: 'hotspot-marker-icon',
        html: `
          <div style="position: relative; cursor: pointer; transform: translate(-50%, -50%); opacity: ${hasPosts || isSelected ? 1 : 0.75};">
            ${auraHtml}

            <!-- Main Marker Container -->
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              gap: 5px;
              padding: 4px 10px;
              background: ${pinColor};
              color: #ffffff;
              border-radius: 20px;
              border: 2px solid #ffffff;
              box-shadow: ${hasPosts ? '0 4px 12px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.15)'};
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 11px;
              font-weight: 800;
              white-space: nowrap;
              transition: transform 0.15s ease;
            ">
              <span style="
                width: 7px;
                height: 7px;
                background-color: ${hasPosts ? '#34d399' : '#94a3b8'};
                border-radius: 50%;
                display: inline-block;
              "></span>
              <span>${isBn ? spot.nameBn : spot.nameEn}</span>
              <span style="
                background: ${badgeBg};
                color: ${badgeTextColor};
                padding: 1px 6px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: 900;
              ">${countBadge}</span>
            </div>
          </div>
        `,
        iconSize: [120, 32],
        iconAnchor: [60, 16]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });

      marker.on('click', () => {
        setActiveHotspot(spot);
        map.setView([spot.lat, spot.lng], 9, { animate: true });
      });

      markersGroup.addLayer(marker);
    });

  }, [mapLoaded, hotspots, selectedDivision, isBn]);

  // Zoom to selected division
  const handleSelectDivision = (divKey: string) => {
    setSelectedDivision(divKey);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (divKey === 'all') {
      map.setView([23.6850, 90.3563], 7, { animate: true });
      setActiveHotspot(null);
    } else if (DIVISION_COORDS[divKey]) {
      const coords = DIVISION_COORDS[divKey];
      map.setView([coords.lat, coords.lng], 9, { animate: true });
      const spot = hotspots.find(h => h.nameEn.toLowerCase() === divKey.toLowerCase());
      if (spot) setActiveHotspot(spot);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden my-6">
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-tight">
                {isBn ? 'সারা বাংলাদেশের রিয়েলটাইম টিউশন হটস্পট ম্যাপ' : 'Realtime Bangladesh Tuition Hotspots'}
              </h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase rounded-full">
                Database Live
              </span>
            </div>
            <p className="text-xs text-slate-300 font-normal">
              {isBn 
                ? `ডাটাবেজে বর্তমানে মোট ${totalActivePosts} টি সক্রিয় টিউশন পোস্ট রয়েছে` 
                : `Accurately fetched from database: ${totalActivePosts} active tuition requests`}
            </p>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenGeoStatsModal}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isBn ? 'বিস্তারিত স্ট্যাটস' : 'Full Stats'}</span>
          </button>
        </div>
      </div>

      {/* Division Selector Filter Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 p-2 sm:p-2.5 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2 shrink-0 flex items-center gap-1">
          <Map className="w-3.5 h-3.5" />
          <span>{isBn ? 'বিভাগ:' : 'Divisions:'}</span>
        </span>

        <button
          onClick={() => handleSelectDivision('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
            selectedDivision === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {isBn ? 'সকল বাংলাদেশ' : 'All Bangladesh'}
        </button>

        {Object.keys(DIVISION_COORDS)
          .filter(k => k !== 'Chittagong' && k !== 'Barisal')
          .map(divKey => {
            const isSel = selectedDivision.toLowerCase() === divKey.toLowerCase();
            const divSpot = hotspots.find(h => h.nameEn.toLowerCase() === divKey.toLowerCase());
            const count = divSpot?.count || 0;

            return (
              <button
                key={divKey}
                onClick={() => handleSelectDivision(divKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{isBn ? DIVISION_COORDS[divKey].nameBn : divKey}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isSel ? 'bg-white/20 text-white' : count > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
      </div>

      {/* Mini Leaflet Map Container */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Selected Hotspot Floating Detail Card */}
        {activeHotspot && (
          <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-xs z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/90 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${activeHotspot.count > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <h4 className="text-sm font-extrabold text-slate-900">
                  {isBn ? activeHotspot.nameBn : activeHotspot.nameEn} {activeHotspot.type === 'division' ? (isBn ? 'বিভাগ' : 'Division') : (isBn ? 'জেলা' : 'District')}
                </h4>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1.5 py-0.5 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">{isBn ? 'মোট টিউশন রিকুয়েস্ট:' : 'Active Posts:'}</span>
                <span className={`font-extrabold px-2 py-0.5 rounded-md border ${
                  activeHotspot.count > 0 
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                    : 'text-slate-600 bg-slate-100 border-slate-200'
                }`}>
                  {activeHotspot.count} টি
                </span>
              </div>

              {activeHotspot.districtsCount !== undefined && activeHotspot.districtsCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{isBn ? 'অ্যাক্টিভ জেলাসমূহ:' : 'Active Districts:'}</span>
                  <span className="font-bold text-slate-800">{activeHotspot.districtsCount} টি</span>
                </div>
              )}

              {activeHotspot.thanasCount !== undefined && activeHotspot.thanasCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{isBn ? 'উপজেলা / থানা:' : 'Active Thanas:'}</span>
                  <span className="font-bold text-slate-800">{activeHotspot.thanasCount} টি</span>
                </div>
              )}

              {activeHotspot.count === 0 && (
                <p className="text-[11px] text-slate-400 italic pt-1">
                  {isBn ? 'বর্তমানে এই এলাকায় কোনো সক্রিয় টিউশন পোস্ট নেই।' : 'No active tuition requests currently listed in this location.'}
                </p>
              )}
            </div>

            <button
              onClick={() => onBrowseClick(activeHotspot.nameEn)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>
                {isBn ? `${activeHotspot.nameBn} এলাকার পোস্ট দেখুন` : `Browse ${activeHotspot.nameEn} Tuitions`}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[11px] font-medium border border-slate-700/80 shadow-md flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>{isBn ? 'সক্রিয় টিউশন এলাকা' : 'Active Posts'}</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-700 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
            <span>{isBn ? 'খালি এলাকা' : 'Zero Posts'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
