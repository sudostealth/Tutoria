import React, { useEffect, useRef, useState } from 'react';
import { LocationCoords } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface LocationPickerMapProps {
  value?: LocationCoords;
  onChange?: (coords: LocationCoords) => void;
  readOnly?: boolean;
  height?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  value = { lat: 23.8103, lng: 90.4125 }, // Default Dhaka
  onChange,
  readOnly = false,
  height = '220px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Ensure Leaflet JS script is loaded
  useEffect(() => {
    const checkLeaflet = () => {
      if ((window as any).L) {
        setMapLoaded(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    };

    if ((window as any).L) {
      setMapLoaded(true);
    } else {
      checkLeaflet();
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Initialize map instance if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [value.lat, value.lng],
        zoom: 14,
        zoomControl: true
      });

      // Primary: Google Maps Road Map Tile Layer
      const googleTiles = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
      });

      // Fallback: OpenStreetMap Tile Layer
      const osmTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      });

      googleTiles.addTo(map);

      // Handle tile error fallback
      googleTiles.on('tileerror', () => {
        if (map.hasLayer(googleTiles)) {
          map.removeLayer(googleTiles);
          osmTiles.addTo(map);
        }
      });

      // Red pin Google Maps style marker
      const customIcon = L.divIcon({
        className: 'google-map-pin',
        html: `<div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                 <div style="width: 24px; height: 24px; background-color: #ea4335; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #ffffff; box-shadow: 0 3px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
                   <div style="width: 8px; height: 8px; background-color: #ffffff; border-radius: 50%;"></div>
                 </div>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 30]
      });

      const marker = L.marker([value.lat, value.lng], {
        icon: customIcon,
        draggable: !readOnly
      }).addTo(map);

      if (!readOnly && onChange) {
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          onChange({ lat, lng });
        });

        marker.on('dragend', () => {
          const latLng = marker.getLatLng();
          onChange({ lat: latLng.lat, lng: latLng.lng });
        });
      }

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Ensure proper tile rendering inside modals
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 500);
    } else {
      // Update marker position if value prop changes
      if (markerRef.current) {
        markerRef.current.setLatLng([value.lat, value.lng]);
        mapInstanceRef.current.setView([value.lat, value.lng], mapInstanceRef.current.getZoom(), { animate: true });
        mapInstanceRef.current.invalidateSize();
      }
    }

  }, [mapLoaded, value.lat, value.lng, readOnly]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation && onChange && mapInstanceRef.current && markerRef.current) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          markerRef.current.setLatLng([lat, lng]);
          mapInstanceRef.current.setView([lat, lng], 15);
          onChange({ lat, lng });
        },
        err => {
          console.warn('Geolocation error:', err);
        }
      );
    }
  };

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />
      
      {!readOnly && (
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-medium shadow-md flex items-center gap-1.5 border border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>স্থান পরিবর্তন করতে ম্যাপে ট্যাপ বা ড্র্যাগ করুন ({value.lat.toFixed(4)}, {value.lng.toFixed(4)})</span>
          </div>
          
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            className="pointer-events-auto p-2 bg-white text-slate-800 hover:bg-slate-50 font-bold rounded-xl shadow-md border border-slate-200 transition-colors flex items-center gap-1 text-xs"
            title="আমার বর্তমান লোকেশন"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline text-[11px]">মাই লোকেশন</span>
          </button>
        </div>
      )}
    </div>
  );
};
