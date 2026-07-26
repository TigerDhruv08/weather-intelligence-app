import { useState, useEffect, useCallback } from 'react';
import { LocationData, ForecastResponse, UnitsSystem } from './types';
import { fetchWeatherForecast, POPULAR_CITIES } from './services/openMeteo';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { MetricsGrid } from './components/MetricsGrid';
import { HourlyForecast } from './components/HourlyForecast';
import { SevenDayForecast } from './components/SevenDayForecast';
import { WeatherCharts } from './components/WeatherCharts';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { ErrorState } from './components/ErrorState';
import { LoadingSkeleton } from './components/LoadingSkeleton';

const FAVORITES_STORAGE_KEY = 'weather_intelligence_favorites';
const UNITS_STORAGE_KEY = 'weather_intelligence_units';

export default function App() {
  // Default to London initially
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(POPULAR_CITIES[1]);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Units system preference
  const [units, setUnits] = useState<UnitsSystem>(() => {
    const saved = localStorage.getItem(UNITS_STORAGE_KEY);
    return saved === 'imperial' ? 'imperial' : 'metric';
  });

  // Favorite locations state
  const [favorites, setFavorites] = useState<LocationData[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Save units to localStorage
  useEffect(() => {
    localStorage.setItem(UNITS_STORAGE_KEY, units);
  }, [units]);

  // Fetch forecast data whenever selectedLocation changes
  const loadForecast = useCallback(async (loc: LocationData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherForecast(loc.latitude, loc.longitude);
      setForecast(data);
    } catch (err: any) {
      console.error('Forecast load error:', err);
      setError(
        err.message ||
          'Failed to load weather forecast for this location. Please check your network or select another city.'
      );
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForecast(selectedLocation);
  }, [selectedLocation, loadForecast]);

  // Geolocation trigger
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc: LocationData = {
          id: Date.now(),
          name: 'Current Location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          country: 'Your Device',
        };
        setSelectedLocation(userLoc);
        setIsLocating(false);
      },
      (geoErr) => {
        console.warn('Geolocation error:', geoErr);
        setIsLocating(false);
        alert(
          'Location access was denied or unavailable. You can search for any city manually using the search bar.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const toggleFavorite = (loc: LocationData) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === loc.id);
      if (exists) {
        return prev.filter((f) => f.id !== loc.id);
      }
      return [...prev, loc];
    });
  };

  const toggleUnits = () => {
    setUnits((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0D0D0D] font-sans antialiased selection:bg-[#F58E1D] selection:text-white pb-12">
      {/* Header */}
      <Header
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        units={units}
        onToggleUnits={toggleUnits}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onGeolocate={handleGeolocate}
        isLocating={isLocating}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => loadForecast(selectedLocation)}
            onSearchFallback={(fallbackCity) => {
              const city = POPULAR_CITIES.find((c) => c.name === fallbackCity) || POPULAR_CITIES[0];
              setSelectedLocation(city);
            }}
          />
        ) : forecast ? (
          <>
            {/* Current Weather Hero */}
            <CurrentWeatherCard
              location={selectedLocation}
              forecast={forecast}
              units={units}
            />

            {/* 24-Hour Scrollable Timeline */}
            <HourlyForecast forecast={forecast} units={units} />

            {/* Environmental Metrics Grid */}
            <MetricsGrid forecast={forecast} units={units} />

            {/* Recharts Visual Charts */}
            <WeatherCharts forecast={forecast} units={units} />

            {/* 7-Day Forecast Grid & List */}
            <SevenDayForecast forecast={forecast} units={units} />

            {/* Weather Intelligence & Planning Recommendations */}
            <PlanningRecommendations forecast={forecast} />
          </>
        ) : null}
      </main>

      {/* Subtle Footer */}
      <footer className="mt-16 pt-8 border-t border-neutral-200 text-center text-xs text-neutral-500 max-w-7xl mx-auto px-4">
        <p>
          Powered by{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F58E1D] hover:underline font-bold"
          >
            Open-Meteo REST API
          </a>{' '}
          • Non-commercial Geocoding & Weather Forecast Services
        </p>
      </footer>
    </div>
  );
}
