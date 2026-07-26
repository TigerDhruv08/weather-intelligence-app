import React from 'react';
import { ForecastResponse, UnitsSystem } from '../types';
import {
  formatTemp,
  formatWindSpeed,
  formatPrecip,
  getWindDirection,
  getUvRating,
  getHumidityRating,
  getVisibilityDescription,
} from '../utils/weatherCalculations';
import {
  Wind,
  Droplets,
  Sun,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Cloud,
  Umbrella,
  ThermometerSnowflake,
} from 'lucide-react';

interface MetricsGridProps {
  forecast: ForecastResponse;
  units: UnitsSystem;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ forecast, units }) => {
  const current = forecast.current;
  const daily = forecast.daily;
  const hourly = forecast.hourly;

  const uvMax = daily.uv_index_max?.[0] || 0;
  const uvRating = getUvRating(uvMax);

  const sunrise = daily.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: forecast.timezone || undefined,
      })
    : '--';

  const sunset = daily.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: forecast.timezone || undefined,
      })
    : '--';

  const currentDewPoint = hourly.dew_point_2m?.[0] || 0;
  const currentVisibility = hourly.visibility?.[0] || 10000;
  const currentGusts = current.wind_gusts_10m || current.wind_speed_10m * 1.3;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0D0D0D] flex items-center gap-2">
          <Gauge className="w-5 h-5 text-[#F58E1D]" />
          Atmospheric & Environmental Metrics
        </h3>
        <span className="text-xs text-neutral-500 font-semibold">Real-time Telemetry</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wind & Gusts */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Wind & Gusts
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200 group-hover:scale-105 transition-transform">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#0D0D0D]">
              {formatWindSpeed(current.wind_speed_10m, units)}
            </div>
            <div className="text-xs text-neutral-600 flex items-center gap-2">
              <span>
                Gusts up to{' '}
                <strong className="text-[#F58E1D]">
                  {formatWindSpeed(currentGusts, units)}
                </strong>
              </span>
            </div>
            <div className="text-[11px] text-neutral-500 pt-1 font-medium">
              Direction: {current.wind_direction_10m}° ({getWindDirection(current.wind_direction_10m)})
            </div>
          </div>
        </div>

        {/* Humidity & Dew Point */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Humidity Level
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200 group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#0D0D0D]">{current.relative_humidity_2m}%</div>
            <div className="text-xs text-neutral-600">
              Status:{' '}
              <strong className="text-[#0D0D0D]">
                {getHumidityRating(current.relative_humidity_2m)}
              </strong>
            </div>
            <div className="text-[11px] text-neutral-500 pt-1 flex items-center gap-1 font-medium">
              <ThermometerSnowflake className="w-3 h-3 text-[#F58E1D]" />
              Dew Point: {formatTemp(currentDewPoint, units)}
            </div>
          </div>
        </div>

        {/* UV Index Rating */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              UV Exposure
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200 group-hover:scale-105 transition-transform">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0D0D0D]">{uvMax.toFixed(1)}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-orange-100 text-[#F58E1D] border border-orange-200">
                {uvRating.label}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 pt-2 font-medium">
              {uvMax >= 6
                ? 'Sun protection recommended during midday.'
                : 'Low risk of UV radiation damage.'}
            </p>
          </div>
        </div>

        {/* Sunrise & Sunset */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Sun Schedule
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200 group-hover:scale-105 transition-transform">
              <Sunrise className="w-4 h-4" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-0.5 bg-neutral-50 p-2 rounded-lg border border-neutral-200">
              <span className="text-[10px] text-neutral-500 font-bold flex items-center gap-1 uppercase">
                <Sunrise className="w-3 h-3 text-[#F58E1D]" />
                Sunrise
              </span>
              <span className="font-bold text-[#0D0D0D]">{sunrise}</span>
            </div>
            <div className="space-y-0.5 bg-neutral-50 p-2 rounded-lg border border-neutral-200">
              <span className="text-[10px] text-neutral-500 font-bold flex items-center gap-1 uppercase">
                <Sunset className="w-3 h-3 text-[#F58E1D]" />
                Sunset
              </span>
              <span className="font-bold text-[#0D0D0D]">{sunset}</span>
            </div>
          </div>
        </div>

        {/* Air Pressure */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Air Pressure
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200 group-hover:scale-105 transition-transform">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#0D0D0D]">
              {Math.round(current.pressure_msl)} <span className="text-xs text-neutral-500 font-medium">hPa</span>
            </div>
            <div className="text-xs text-neutral-600 font-medium">
              Surface: <strong className="text-[#0D0D0D]">{Math.round(current.surface_pressure)} hPa</strong>
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Visibility
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200 group-hover:scale-105 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#0D0D0D]">
              {(currentVisibility / 1000).toFixed(1)}{' '}
              <span className="text-xs text-neutral-500 font-medium">km</span>
            </div>
            <div className="text-xs text-neutral-600 font-medium">
              {getVisibilityDescription(currentVisibility)}
            </div>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Cloud Cover
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200 group-hover:scale-105 transition-transform">
              <Cloud className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-black text-[#0D0D0D]">{current.cloud_cover}%</div>
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden border border-neutral-200">
              <div
                className="bg-[#F58E1D] h-full rounded-full transition-all duration-500"
                style={{ width: `${current.cloud_cover}%` }}
              />
            </div>
          </div>
        </div>

        {/* Precipitation Sum */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Precipitation (24h)
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200 group-hover:scale-105 transition-transform">
              <Umbrella className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#0D0D0D]">
              {formatPrecip(daily.precipitation_sum?.[0] || 0, units)}
            </div>
            <div className="text-xs text-neutral-600 font-medium">
              Probability:{' '}
              <strong className="text-[#0D0D0D]">
                {daily.precipitation_probability_max?.[0] || 0}%
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
