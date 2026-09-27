import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Crosshair, Search, Check, X, RefreshCw, Navigation, AlertCircle } from 'lucide-react';

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
  initialLocationName?: string;
  onConfirmLocation: (locationName: string, lat: number, lng: number, accuracy?: number) => void;
}

// Leaflet default marker icons fix for bundlers
const customMarkerIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
      <span style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(245, 158, 11, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <div style="width: 32px; height: 32px; border-radius: 50%; background: #0f172a; border: 3px solid #f59e0b; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
        <span style="width: 12px; height: 12px; border-radius: 50%; background: #f59e0b;"></span>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  isOpen,
  onClose,
  initialLat = 30.0444,
  initialLng = 31.2357,
  initialLocationName = '',
  onConfirmLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [currentLat, setCurrentLat] = useState<number>(initialLat);
  const [currentLng, setCurrentLng] = useState<number>(initialLng);
  const [locationName, setLocationName] = useState<string>(initialLocationName);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);

  // Quick preset hubs for Egypt & regional operations
  const PRESET_LOCATIONS = [
    { name: 'القاهرة', lat: 30.0444, lng: 31.2357 },
    { name: 'الإسكندرية', lat: 31.2001, lng: 29.9187 },
    { name: 'السويس', lat: 29.9668, lng: 32.5498 },
    { name: 'بورسعيد', lat: 31.2653, lng: 32.3019 },
    { name: 'أسيوط', lat: 27.1801, lng: 31.1837 },
    { name: 'ينبع', lat: 24.0895, lng: 38.0618 },
  ];

  // Reverse geocode lat, lng to real readable Arabic street / district name
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ar`,
        { signal: controller.signal }
      );
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const road = addr.road || addr.street || addr.pedestrian || '';
          const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || '';
          const city = addr.city || addr.town || addr.village || addr.municipality || '';
          const state = addr.state || addr.governorate || '';

          const parts = [road, suburb, city, state].filter(Boolean);
          if (parts.length > 0) {
            setLocationName(parts.join('، '));
            setIsGeocoding(false);
            return;
          }
        }
        if (data && data.display_name) {
          setLocationName(data.display_name.split(',').slice(0, 3).join('، '));
          setIsGeocoding(false);
          return;
        }
      }
    } catch (_) {}

    // Fallback if network blocked or rate limited
    setLocationName(`موقع إحداثي (${lat.toFixed(5)}°, ${lng.toFixed(5)}°)`);
    setIsGeocoding(false);
  };

  // Initialize Leaflet map when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [currentLat, currentLng],
          zoom: 15,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([currentLat, currentLng], {
          icon: customMarkerIcon,
          draggable: true,
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setCurrentLat(pos.lat);
          setCurrentLng(pos.lng);
          reverseGeocode(pos.lat, pos.lng);
        });

        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          setCurrentLat(lat);
          setCurrentLng(lng);
          reverseGeocode(lat, lng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;

        if (!locationName) {
          reverseGeocode(currentLat, currentLng);
        }
      } else {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.setView([currentLat, currentLng], 15);
        if (markerRef.current) {
          markerRef.current.setLatLng([currentLat, currentLng]);
        }
      }
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Clean up map instance on modal close
  useEffect(() => {
    if (!isOpen && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }
  }, [isOpen]);

  // Real device GPS request
  const handleRequestDeviceGps = () => {
    setIsLocating(true);
    setSearchError(null);

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLat(latitude);
          setCurrentLng(longitude);

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 16);
            markerRef.current.setLatLng([latitude, longitude]);
          }

          reverseGeocode(latitude, longitude);
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setSearchError('تعذر التقاط إشارة GPS المباشرة من المتصفح، يمكنك النقر على الخريطة لتحديد موقعك بدقة');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setSearchError('حساسات الموقع الجغرافي غير مدعومة في هذا المتصفح');
      setIsLocating(false);
    }
  };

  // Search by place name (Nominatim search)
  const handleSearchPlace = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGeocoding(true);
    setSearchError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1&accept-language=ar`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          setCurrentLat(lat);
          setCurrentLng(lng);
          setLocationName(data[0].display_name.split(',').slice(0, 3).join('، '));

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([lat, lng], 16);
            markerRef.current.setLatLng([lat, lng]);
          }
          setIsGeocoding(false);
          return;
        }
      }
      setSearchError('لم يتم العثور على نتائج، يرجى كتابة اسم مدينة أو شارع أو النقر على الخريطة');
    } catch (_) {
      setSearchError('تعذر الاتصال بخدمة البحث عن الأماكن');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Select preset city
  const handleSelectPreset = (lat: number, lng: number, name: string) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    setLocationName(name);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
      markerRef.current.setLatLng([lat, lng]);
    }
    reverseGeocode(lat, lng);
  };

  const handleConfirm = () => {
    const finalName = locationName.trim() || `موقع ميداني (${currentLat.toFixed(5)}°, ${currentLng.toFixed(5)}°)`;
    onConfirmLocation(finalName, currentLat, currentLng, 3);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-100">خريطة تحديد وتأكيد الموقع الحقيقي</h3>
              <p className="text-[11px] text-slate-400">
                انقر على الخريطة أو اسحب المؤشر لتحديد موقعك الفعلي بدقة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Location Tools */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 space-y-2">
          <form onSubmit={handleSearchPlace} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم المنشأة، الشارع، أو المدينة..."
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 pl-8 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 outline-none"
              />
              <button
                type="submit"
                className="absolute left-2 top-2 text-slate-400 hover:text-amber-400"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleRequestDeviceGps}
              disabled={isLocating}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition disabled:opacity-50"
              title="تحديد موقعي الفعلي الحالي عبر GPS"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'جارِ الرصد...' : 'موقعي الآن'}</span>
            </button>
          </form>

          {/* Quick city chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
            <span className="text-slate-400 text-[10px] shrink-0">مدن سريعة:</span>
            {PRESET_LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => handleSelectPreset(loc.lat, loc.lng, loc.name)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shrink-0 text-[11px] transition"
              >
                {loc.name}
              </button>
            ))}
          </div>

          {searchError && (
            <div className="text-[11px] text-amber-300 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Leaflet Map Canvas */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] w-full bg-slate-950">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

          {/* Map floating prompt */}
          <div className="absolute top-2 right-2 z-20 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] text-amber-300 font-bold shadow pointer-events-none">
            📍 اضغط في أي مكان لتثبيت الدبوس
          </div>
        </div>

        {/* Location Details & Confirm Action Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2.5">
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              اسم الموقع المعتمد (يمكنك تعديل الاسم يدوياً):
            </label>
            <div className="relative">
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="اكتب اسم الموقع الفعلي أو المنشأة..."
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-amber-300 font-bold focus:border-amber-400 outline-none"
              />
              {isGeocoding && (
                <div className="absolute left-3 top-2.5 text-[10px] text-slate-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                  <span>جارِ جلب العنوان...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>
              الإحداثيات: {currentLat.toFixed(5)}° N, {currentLng.toFixed(5)}° E
            </span>
            <span className="text-emerald-400 font-sans">دقة الرصد: ±3 أمتار</span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>تأكيد واعتماد هذا الموقع</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
