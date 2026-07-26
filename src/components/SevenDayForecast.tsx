import React, { useState } from 'react';
import { ForecastResponse, UnitsSystem } from '../types';
import {
  formatTemp,
  formatWindSpeed,
  formatPrecip,
  getUvRating,
} from '../utils/weatherCalculations';
import { getWmoInfo } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';
import {
  CalendarDays,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  Droplets,
  Wind,
} from 'lucide-react';

interface SevenDayForecastProps {
  forecast: ForecastResponse;
  units: UnitsSystem;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({ forecast, units }) => {
  const daily = forecast.daily;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  if (!daily || !daily.time || daily.time.length === 0) return null;

  const minTempGlobal = Math.min(...daily.temperature_2m_min);
  const maxTempGlobal = Math.max(...daily.temperature_2m_max);
  const tempSpan = Math.max(1, maxTempGlobal - minTempGlobal);

  const daysData = daily.time.map((timeStr, idx) => {
    const date = new Date(timeStr);
    const dayName =
      idx === 0
        ? 'Today'
        : idx === 1
        ? 'Tomorrow'
        : date.toLocaleDateString('en-US', {
            weekday: 'short',
            timeZone: forecast.timezone || undefined,
          });

    const fullDateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: forecast.timezone || undefined,
    });

    const wmo = getWmoInfo(daily.weather_code[idx]);
    const min = daily.temperature_2m_min[idx];
    const max = daily.temperature_2m_max[idx];
    const pop = daily.precipitation_probability_max?.[idx] || 0;
    const precipSum = daily.precipitation_sum?.[idx] || 0;
    const windMax = daily.wind_speed_10m_max?.[idx] || 0;
    const uvMax = daily.uv_index_max?.[idx] || 0;

    const leftPercent = Math.max(0, Math.min(100, ((min - minTempGlobal) / tempSpan) * 100));
    const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((max - min) / tempSpan) * 100));

    const sunrise = daily.sunrise?.[idx]
      ? new Date(daily.sunrise[idx]).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: forecast.timezone || undefined,
        })
      : '--';

    const sunset = daily.sunset?.[idx]
      ? new Date(daily.sunset[idx]).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: forecast.timezone || undefined,
        })
      : '--';

    return {
      index: idx,
      dayName,
      fullDateStr,
      wmo,
      code: daily.weather_code[idx],
      min,
      max,
      pop,
      precipSum,
      windMax,
      uvMax,
      leftPercent,
      widthPercent,
      sunrise,
      sunset,
    };
  });

  const toggleExpand = (idx: number) => {
    setExpandedDay(expandedDay === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {/* Section Header with View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0D0D0D] flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#F58E1D]" />
          7-Day Weather Outlook
        </h3>

        <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              viewMode === 'grid'
                ? 'bg-[#F58E1D] text-white shadow-sm'
                : 'text-neutral-600 hover:text-[#0D0D0D]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              viewMode === 'list'
                ? 'bg-[#F58E1D] text-white shadow-sm'
                : 'text-neutral-600 hover:text-[#0D0D0D]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Grid Mode Layout */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {daysData.map((day) => (
            <div
              key={`grid-day-${day.index}`}
              onClick={() => toggleExpand(day.index)}
              className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 hover:border-neutral-300 shadow-sm flex flex-col justify-between gap-3 ${
                day.index === 0
                  ? 'bg-orange-50/70 border-[#F58E1D]'
                  : 'bg-white border-neutral-200'
              }`}
            >
              {/* Day & Date */}
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className={`block text-sm font-extrabold ${
                      day.index === 0 ? 'text-[#F58E1D]' : 'text-[#0D0D0D]'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {day.fullDateStr}
                  </span>
                </div>
                <WeatherIcon code={day.code} className="w-8 h-8 text-[#F58E1D]" />
              </div>

              {/* Condition Label */}
              <div className="text-xs font-bold text-neutral-700 truncate">
                {day.wmo.label}
              </div>

              {/* Temp Min & Max Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-neutral-600">{formatTemp(day.min, units)}</span>
                  <span className="text-[#F58E1D]">{formatTemp(day.max, units)}</span>
                </div>
                <div className="relative w-full h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-[#F58E1D]"
                    style={{
                      left: `${day.leftPercent}%`,
                      width: `${day.widthPercent}%`,
                    }}
                  />
                </div>
              </div>

              {/* Key Indicators */}
              <div className="grid grid-cols-2 gap-1 text-[10px] text-neutral-500 border-t border-neutral-100 pt-2 mt-1 font-medium">
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-[#F58E1D]" />
                  <span>{day.pop}%</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <Wind className="w-3 h-3 text-neutral-400" />
                  <span>{formatWindSpeed(day.windMax, units)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode Layout */
        <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 overflow-hidden shadow-sm">
          {daysData.map((day) => {
            const isExpanded = expandedDay === day.index;
            return (
              <div key={`list-day-${day.index}`} className="transition">
                <div
                  onClick={() => toggleExpand(day.index)}
                  className="p-4 hover:bg-neutral-50 cursor-pointer flex items-center justify-between gap-4 transition"
                >
                  {/* Left: Day & Icon */}
                  <div className="flex items-center gap-4 w-44 shrink-0">
                    <WeatherIcon code={day.code} className="w-7 h-7 text-[#F58E1D]" />
                    <div>
                      <span
                        className={`block text-sm font-extrabold ${
                          day.index === 0 ? 'text-[#F58E1D]' : 'text-[#0D0D0D]'
                        }`}
                      >
                        {day.dayName}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">{day.fullDateStr}</span>
                    </div>
                  </div>

                  {/* Condition label */}
                  <div className="hidden md:block flex-1 text-sm font-bold text-neutral-700 truncate">
                    {day.wmo.label}
                  </div>

                  {/* Rain & Wind */}
                  <div className="hidden sm:flex items-center gap-4 text-xs text-neutral-600 font-medium w-36 shrink-0">
                    <span className="flex items-center gap-1 text-[#F58E1D] font-bold">
                      <Droplets className="w-3.5 h-3.5" />
                      {day.pop}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5" />
                      {formatWindSpeed(day.windMax, units)}
                    </span>
                  </div>

                  {/* Temperature Bar */}
                  <div className="flex items-center gap-3 w-48 sm:w-64 shrink-0">
                    <span className="text-xs font-bold text-neutral-600 w-10 text-right">
                      {formatTemp(day.min, units)}
                    </span>
                    <div className="relative flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                      <div
                        className="absolute top-0 bottom-0 rounded-full bg-[#F58E1D]"
                        style={{
                          left: `${day.leftPercent}%`,
                          width: `${day.widthPercent}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#F58E1D] w-10">
                      {formatTemp(day.max, units)}
                    </span>
                  </div>

                  <button type="button" className="text-neutral-400 hover:text-[#0D0D0D]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Drawer Details */}
                {isExpanded && (
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 block text-[11px] font-bold uppercase tracking-wider mb-1">
                        Precipitation Volume
                      </span>
                      <span className="text-sm font-extrabold text-[#F58E1D]">
                        {formatPrecip(day.precipSum, units)} ({day.pop}% chance)
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block text-[11px] font-bold uppercase tracking-wider mb-1">
                        Max Wind Speed
                      </span>
                      <span className="text-sm font-bold text-[#0D0D0D]">
                        {formatWindSpeed(day.windMax, units)}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block text-[11px] font-bold uppercase tracking-wider mb-1">
                        Max UV Exposure
                      </span>
                      <span className="text-sm font-bold text-[#F58E1D]">
                        {day.uvMax.toFixed(1)} ({getUvRating(day.uvMax).label})
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block text-[11px] font-bold uppercase tracking-wider mb-1">
                        Sun Schedule
                      </span>
                      <span className="text-xs text-[#0D0D0D] font-bold">
                        Rise: {day.sunrise} | Set: {day.sunset}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
