import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Compass, Bookmark, BookmarkCheck, X, Loader2, Thermometer } from 'lucide-react';
import { LocationData, UnitsSystem } from '../types';
import { searchCities, POPULAR_CITIES } from '../services/openMeteo';

interface HeaderProps {
  selectedLocation: LocationData | null;
  onSelectLocation: (loc: LocationData) => void;
  units: UnitsSystem;
  onToggleUnits: () => void;
  favorites: LocationData[];
  onToggleFavorite: (loc: LocationData) => void;
  onGeolocate: () => void;
  isLocating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLocation,
  onSelectLocation,
  units,
  onToggleUnits,
  favorites,
  onToggleFavorite,
  onGeolocate,
  isLocating,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(query);
        setResults(data);
        setIsDropdownOpen(true);
        if (data.length === 0) {
          setSearchError(`No cities found matching "${query}". Try another search.`);
        }
      } catch (err: any) {
        setSearchError(err.message || 'Failed to search cities.');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc: LocationData) => {
    onSelectLocation(loc);
    setIsDropdownOpen(false);
    setQuery('');
  };

  const isCurrentFavorite =
    selectedLocation && favorites.some((f) => f.id === selectedLocation.id);

  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0D] border-b border-neutral-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F58E1D] flex items-center justify-center text-white shadow-md shadow-[#F58E1D]/30">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Weather Intelligence
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#F58E1D]/20 text-[#F58E1D] border border-[#F58E1D]/30">
                    Open-Meteo
                  </span>
                </h1>
                <p className="text-xs text-neutral-400">
                  Global forecasts, insights & activity analytics
                </p>
              </div>
            </div>

            {/* Mobile Controls Right */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={onToggleUnits}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 flex items-center gap-1 hover:bg-neutral-700 transition"
              >
                <Thermometer className="w-3.5 h-3.5 text-[#F58E1D]" />
                {units === 'metric' ? '°C, km/h' : '°F, mph'}
              </button>
            </div>
          </div>

          {/* Search Box & Controls */}
          <div className="flex items-center gap-2 flex-1 max-w-2xl">
            <div ref={searchContainerRef} className="relative flex-1">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (results.length > 0) setIsDropdownOpen(true);
                  }}
                  placeholder="Search city (e.g. Tokyo, London, San Francisco)..."
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F58E1D] focus:border-[#F58E1D] transition shadow-inner"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                      setIsDropdownOpen(false);
                    }}
                    className="absolute right-3 text-neutral-400 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : isSearching ? (
                  <Loader2 className="w-4 h-4 absolute right-3 text-[#F58E1D] animate-spin" />
                ) : null}
              </div>

              {/* Autocomplete Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0D0D0D] border border-neutral-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-neutral-800 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#F58E1D]" />
                      Searching cities...
                    </div>
                  ) : searchError ? (
                    <div className="p-3 text-xs text-rose-400 bg-rose-950/20 text-center">
                      {searchError}
                    </div>
                  ) : results.length > 0 ? (
                    results.map((city) => (
                      <button
                        key={`${city.id}-${city.latitude}-${city.longitude}`}
                        type="button"
                        onClick={() => handleSelect(city)}
                        className="w-full px-4 py-2.5 text-left hover:bg-neutral-800 flex items-center justify-between group transition"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-[#F58E1D] transition">
                            {city.name}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {[city.admin1, city.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                        </span>
                      </button>
                    ))
                  ) : null}
                </div>
              )}
            </div>

            {/* Current Location Button */}
            <button
              type="button"
              onClick={onGeolocate}
              disabled={isLocating}
              title="Use Current Device Location"
              className="p-2.5 rounded-xl bg-[#F58E1D] hover:bg-[#e07d12] text-white disabled:opacity-50 transition shadow-sm flex items-center justify-center"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </button>

            {/* Favorite Pin Button */}
            {selectedLocation && (
              <button
                type="button"
                onClick={() => onToggleFavorite(selectedLocation)}
                title={isCurrentFavorite ? 'Remove from favorites' : 'Save to favorite cities'}
                className={`p-2.5 rounded-xl border transition shadow-sm flex items-center justify-center ${
                  isCurrentFavorite
                    ? 'bg-[#F58E1D]/20 border-[#F58E1D] text-[#F58E1D] hover:bg-[#F58E1D]/30'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-[#F58E1D] hover:bg-neutral-700'
                }`}
              >
                {isCurrentFavorite ? (
                  <BookmarkCheck className="w-4 h-4 fill-[#F58E1D]" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Desktop Unit Switcher */}
            <button
              type="button"
              onClick={onToggleUnits}
              className="hidden md:flex px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 items-center gap-1.5 transition shadow-sm"
            >
              <Thermometer className="w-4 h-4 text-[#F58E1D]" />
              <span>{units === 'metric' ? 'Metric (°C, km/h)' : 'Imperial (°F, mph)'}</span>
            </button>
          </div>
        </div>

        {/* Popular Cities & Favorites Bar */}
        <div className="mt-3 pt-2.5 border-t border-neutral-800 flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 text-xs text-neutral-400">
          <span className="font-bold text-neutral-400 shrink-0 text-[11px] uppercase tracking-wider">
            Popular:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {POPULAR_CITIES.map((city) => {
              const isSelected = selectedLocation?.name === city.name;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => onSelectLocation(city)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                    isSelected
                      ? 'bg-[#F58E1D] text-white border-[#F58E1D]'
                      : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>

          {favorites.length > 0 && (
            <>
              <div className="h-4 w-px bg-neutral-800 shrink-0 mx-1" />
              <span className="font-bold text-[#F58E1D] shrink-0 text-[11px] uppercase tracking-wider flex items-center gap-1">
                Saved:
              </span>
              <div className="flex items-center gap-1.5 flex-nowrap">
                {favorites.map((fav) => (
                  <button
                    key={`fav-${fav.id}`}
                    type="button"
                    onClick={() => onSelectLocation(fav)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap bg-[#F58E1D]/20 text-[#F58E1D] border border-[#F58E1D]/40 hover:bg-[#F58E1D]/30 transition flex items-center gap-1"
                  >
                    <span>{fav.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
