import React from 'react';
import {
  ForecastResponse,
  LocationData,
  UnitsSystem,
} from '../types';
import {
  formatTemp,
  formatWindSpeed,
  formatPrecip,
  getUvRating,
  getWindDirection,
} from '../utils/weatherCalculations';
import { getWmoInfo } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';
import { MapPin, Wind, Droplets, Sun, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

interface CurrentWeatherCardProps {
  location: LocationData;
  forecast: ForecastResponse;
  units: UnitsSystem;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  forecast,
  units,
}) => {
  const current = forecast.current;
  const daily = forecast.daily;
  const wmo = getWmoInfo(current.weather_code);

  const todayMaxTemp = daily.temperature_2m_max[0];
  const todayMinTemp = daily.temperature_2m_min[0];
  const todayUv = daily.uv_index_max[0] || 0;
  const uvRating = getUvRating(todayUv);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: forecast.timezone || undefined,
  });

  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: forecast.timezone || undefined,
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-neutral-200 shadow-md p-6 md:p-8 text-[#0D0D0D] transition-all duration-300">
      {/* Decorative subtle accent strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F58E1D]" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Main Temperature & Location Info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F58E1D] shrink-0" />
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0D0D0D]">
                  {location.name}
                </h2>
                {location.country_code && (
                  <span className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-300 text-xs font-semibold text-neutral-700">
                    {location.country_code}
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-600 mt-1 flex items-center gap-2">
                <span>{[location.admin1, location.country].filter(Boolean).join(', ')}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-400" />
                <span className="flex items-center gap-1 text-neutral-500 font-mono text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate} • {formattedTime}
                </span>
              </p>
            </div>

            {/* WMO Weather Code Label */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 shadow-sm">
              <WeatherIcon code={current.weather_code} isDay={current.is_day} className="w-8 h-8 text-[#F58E1D]" />
              <div>
                <span className="block text-sm font-bold text-[#0D0D0D]">{wmo.label}</span>
                <span className="block text-[11px] text-neutral-500 font-medium capitalize">
                  {current.is_day ? 'Daytime' : 'Nighttime'} Weather
                </span>
              </div>
            </div>
          </div>

          {/* Temperature Display Section */}
          <div className="flex items-baseline gap-6 pt-2">
            <div className="flex items-start">
              <span className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#0D0D0D]">
                {formatTemp(current.temperature_2m, units).replace(/°[CF]/, '')}
              </span>
              <span className="text-2xl md:text-3xl font-bold text-[#F58E1D] mt-2">
                {units === 'metric' ? '°C' : '°F'}
              </span>
            </div>

            <div className="space-y-2 border-l border-neutral-200 pl-6">
              <div className="text-sm font-medium text-neutral-600">
                Feels like{' '}
                <span className="font-bold text-[#0D0D0D]">
                  {formatTemp(current.apparent_temperature, units)}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className="flex items-center gap-1 text-[#0D0D0D] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 text-[#F58E1D]">
                  <ArrowUp className="w-3.5 h-3.5 text-[#F58E1D]" />
                  High: <strong className="text-[#0D0D0D]">{formatTemp(todayMaxTemp, units)}</strong>
                </span>
                <span className="flex items-center gap-1 text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200">
                  <ArrowDown className="w-3.5 h-3.5 text-neutral-500" />
                  Low: <strong className="text-[#0D0D0D]">{formatTemp(todayMinTemp, units)}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Column */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 lg:w-80 shrink-0">
          {/* Wind */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Wind
              </span>
              <span className="text-sm font-extrabold text-[#0D0D0D]">
                {formatWindSpeed(current.wind_speed_10m, units)}
              </span>
              <span className="block text-[10px] text-neutral-500 font-medium">
                {getWindDirection(current.wind_direction_10m)}
              </span>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Humidity
              </span>
              <span className="text-sm font-extrabold text-[#0D0D0D]">{current.relative_humidity_2m}%</span>
              <span className="block text-[10px] text-neutral-500 font-medium">
                Dew: {formatTemp(forecast.hourly.dew_point_2m[0], units)}
              </span>
            </div>
          </div>

          {/* Precipitation */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Rainfall
              </span>
              <span className="text-sm font-extrabold text-[#0D0D0D]">
                {formatPrecip(current.precipitation, units)}
              </span>
              <span className="block text-[10px] text-neutral-500 font-medium">
                Prob: {forecast.hourly.precipitation_probability[0] || 0}%
              </span>
            </div>
          </div>

          {/* UV Index */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                UV Index
              </span>
              <span className="text-sm font-extrabold text-[#0D0D0D]">{todayUv.toFixed(1)}</span>
              <span className="block text-[10px] font-bold text-[#F58E1D]">
                {uvRating.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
