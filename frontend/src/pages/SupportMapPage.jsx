import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../services/api';
import { MAP_CATEGORIES } from '../services/constants';
import { MapPin, Navigation, Phone, ExternalLink, Search, List, Map as MapIcon, Clock, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

// Fix Leaflet marker icons with clean SVG pins
const createCustomPin = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function SupportMapPage() {
  const { addToast } = useNotification();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [userCoords, setUserCoords] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

  // Map center defaults to New Delhi or user location
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [mapZoom, setMapZoom] = useState(5);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedCity !== 'all') params.city = selectedCity;
      if (search) params.search = search;
      if (userCoords) {
        params.lat = userCoords.lat;
        params.lng = userCoords.lng;
      }

      const res = await api.getLocations(params);
      setLocations(res.locations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [selectedCategory, selectedCity, search, userCoords]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      addToast('Location Error', 'Geolocation is not supported by your browser.', 'error');
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserCoords(coords);
        setMapCenter([coords.lat, coords.lng]);
        setMapZoom(12);
        setLocLoading(false);
        addToast('Location Enabled', 'Nearest verified support centers sorted by distance.', 'success');
      },
      (err) => {
        setLocLoading(false);
        addToast('Permission Denied', 'Location access was not allowed. Select a city filter instead.', 'error');
      }
    );
  };

  const getPinColor = (cat) => {
    const found = MAP_CATEGORIES.find((c) => c.id === cat);
    return found ? found.color : '#0d9488';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Saksham Support Map
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verified local community organizations, safe Garima Greh shelters, healthcare clinics, and legal aid across India.
          </p>
        </div>

        {/* Location permission & View Mode buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGetLocation}
            disabled={locLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow transition-colors"
          >
            <Navigation className={`w-3.5 h-3.5 ${locLoading ? 'animate-spin' : ''}`} />
            <span>{locLoading ? 'Locating...' : userCoords ? 'GPS Location Active' : 'Find Near Me (Optional)'}</span>
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Interactive Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Directory List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search center name, address, or service..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* City Dropdown */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs flex-1 md:flex-initial"
            >
              <option value="all">All Major Indian Cities</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
        </div>

        {/* Category Legend & Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
          {MAP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              ></span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' ? (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeMapView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map((loc) => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={createCustomPin(getPinColor(loc.category))}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 space-y-1.5 max-w-xs text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getPinColor(loc.category) }}
                      ></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {loc.category.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm leading-tight text-slate-900">
                      {loc.name}
                    </h4>

                    <p className="text-xs text-slate-600">
                      {loc.address}, {loc.city}, {loc.state} {loc.pincode}
                    </p>

                    {loc.distance_km && (
                      <span className="text-[11px] font-bold text-brand-600 block">
                        📍 {loc.distance_km} km away from your location
                      </span>
                    )}

                    {loc.operating_hours && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{loc.operating_hours}</span>
                      </div>
                    )}

                    {loc.phone && (
                      <div className="pt-1">
                        <a
                          href={`tel:${loc.phone.replace(/[^0-9+]/g, '')}`}
                          className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{loc.phone}</span>
                        </a>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 mt-2 flex items-center justify-between">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                      >
                        <span>Get Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        /* Directory List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-card flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white"
                    style={{ backgroundColor: getPinColor(loc.category) }}
                  >
                    {loc.category.replace('_', ' ')}
                  </span>
                  {loc.distance_km && (
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                      {loc.distance_km} km away
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  {loc.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                  {loc.address}, {loc.city}, {loc.state}
                </p>

                {loc.services_offered && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {loc.services_offered.map((s, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                {loc.phone && (
                  <a href={`tel:${loc.phone}`} className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Center</span>
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
