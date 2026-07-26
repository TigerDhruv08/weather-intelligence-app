import React from 'react';
import { ForecastResponse, UnitsSystem } from '../types';
import { formatTemp, formatWindSpeed } from '../utils/weatherCalculations';
import { WeatherIcon } from './WeatherIcon';
import { Clock, Droplets, Wind } from 'lucide-react';

interface HourlyForecastProps {
  forecast: ForecastResponse;
  units: UnitsSystem;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast, units }) => {
  const hourly = forecast.hourly;
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Take the next 24 hours starting from current time
  const nowIndex = 0;
  const next24 = hourly.time.slice(nowIndex, nowIndex + 24).map((timeStr, idx) => {
    const date = new Date(timeStr);
    const hourLabel =
      idx === 0
        ? 'Now'
        : date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
            timeZone: forecast.timezone || undefined,
          });

    return {
      time: hourLabel,
      temp: hourly.temperature_2m[idx],
      feelsLike: hourly.apparent_temperature[idx],
      pop: hourly.precipitation_probability[idx] || 0,
      precip: hourly.precipitation[idx] || 0,
      code: hourly.weather_code[idx],
      wind: hourly.wind_speed_10m[idx],
    };
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0D0D0D] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#F58E1D]" />
          24-Hour Timeline
        </h3>
        <span className="text-xs text-neutral-500 font-semibold">Hourly breakdown</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar scroll-smooth">
        {next24.map((item, idx) => (
          <div
            key={`hourly-${item.time}-${idx}`}
            className={`shrink-0 w-28 p-3.5 rounded-xl border text-center transition-all duration-200 hover:scale-105 shadow-sm flex flex-col items-center justify-between gap-2.5 ${
              idx === 0
                ? 'bg-orange-50 border-[#F58E1D] text-[#0D0D0D] ring-1 ring-[#F58E1D]/40'
                : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800'
            }`}
          >
            {/* Time Label */}
            <span
              className={`text-xs font-bold ${
                idx === 0 ? 'text-[#F58E1D]' : 'text-neutral-500'
              }`}
            >
              {item.time}
            </span>

            {/* Weather Condition Icon */}
            <WeatherIcon code={item.code} className="w-7 h-7 my-1 text-[#F58E1D]" />

            {/* Temperature */}
            <span className="text-base font-black text-[#0D0D0D]">
              {formatTemp(item.temp, units)}
            </span>

            {/* Rain Prob */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#F58E1D] h-4">
              {item.pop > 5 ? (
                <>
                  <Droplets className="w-3 h-3 text-[#F58E1D]" />
                  <span>{item.pop}%</span>
                </>
              ) : (
                <span className="text-neutral-300 font-normal">--</span>
              )}
            </div>

            {/* Wind Speed */}
            <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-medium border-t border-neutral-100 pt-1.5 w-full justify-center">
              <Wind className="w-3 h-3 text-neutral-400" />
              <span>{formatWindSpeed(item.wind, units)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
