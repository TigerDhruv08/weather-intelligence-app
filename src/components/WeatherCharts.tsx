import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ForecastResponse, UnitsSystem } from '../types';
import { cToF } from '../utils/weatherCalculations';
import { LineChart as ChartIcon, Thermometer, Droplets, Wind, Calendar } from 'lucide-react';

interface WeatherChartsProps {
  forecast: ForecastResponse;
  units: UnitsSystem;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ forecast, units }) => {
  const [activeTab, setActiveTab] = useState<'hourly' | 'precip' | '7day' | 'windUv'>('hourly');

  const hourly = forecast.hourly;
  const daily = forecast.daily;

  if (!hourly || !hourly.time) return null;

  // Prepare 24-hour data
  const hourlyData = hourly.time.slice(0, 24).map((timeStr, idx) => {
    const date = new Date(timeStr);
    const hourLabel =
      idx === 0
        ? 'Now'
        : date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
            timeZone: forecast.timezone || undefined,
          });

    const tempC = hourly.temperature_2m[idx];
    const feelsC = hourly.apparent_temperature[idx];
    const pop = hourly.precipitation_probability[idx] || 0;
    const precipMm = hourly.precipitation[idx] || 0;
    const windKmh = hourly.wind_speed_10m[idx] || 0;
    const uv = hourly.uv_index[idx] || 0;

    return {
      time: hourLabel,
      temp: units === 'imperial' ? cToF(tempC) : Math.round(tempC * 10) / 10,
      feelsLike: units === 'imperial' ? cToF(feelsC) : Math.round(feelsC * 10) / 10,
      pop,
      precip: units === 'imperial' ? +(precipMm * 0.0393701).toFixed(2) : +(precipMm.toFixed(1)),
      wind: units === 'imperial' ? Math.round(windKmh * 0.621371) : Math.round(windKmh),
      uv: +(uv.toFixed(1)),
    };
  });

  // Prepare 7-day data
  const dailyData = daily.time.map((timeStr, idx) => {
    const date = new Date(timeStr);
    const dayLabel =
      idx === 0
        ? 'Today'
        : date.toLocaleDateString('en-US', {
            weekday: 'short',
            timeZone: forecast.timezone || undefined,
          });

    const minC = daily.temperature_2m_min[idx];
    const maxC = daily.temperature_2m_max[idx];

    return {
      day: dayLabel,
      minTemp: units === 'imperial' ? cToF(minC) : Math.round(minC * 10) / 10,
      maxTemp: units === 'imperial' ? cToF(maxC) : Math.round(maxC * 10) / 10,
      popMax: daily.precipitation_probability_max?.[idx] || 0,
      precipSum:
        units === 'imperial'
          ? +((daily.precipitation_sum?.[idx] || 0) * 0.0393701).toFixed(2)
          : +((daily.precipitation_sum?.[idx] || 0).toFixed(1)),
    };
  });

  const tempUnitLabel = units === 'imperial' ? '°F' : '°C';
  const windUnitLabel = units === 'imperial' ? 'mph' : 'km/h';
  const precipUnitLabel = units === 'imperial' ? 'in' : 'mm';

  return (
    <div className="p-5 md:p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-50 text-[#F58E1D] border border-orange-200">
            <ChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#0D0D0D]">
              Visual Weather Intelligence
            </h3>
            <p className="text-xs text-neutral-500 font-medium">Interactive trends & data analytics</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-neutral-100 p-1 rounded-xl border border-neutral-200">
          <button
            type="button"
            onClick={() => setActiveTab('hourly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'hourly'
                ? 'bg-[#F58E1D] text-white shadow-sm'
                : 'text-neutral-600 hover:text-[#0D0D0D]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            24h Temp
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('precip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'precip'
                ? 'bg-[#F58E1D] text-white shadow-sm'
                : 'text-neutral-600 hover:text-[#0D0D0D]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            Rain & Chance
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('7day')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === '7day'
                ? 'bg-[#F58E1D] text-white shadow-sm'
                : 'text-neutral-600 hover:text-[#0D0D0D]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            7-Day Trend
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('windUv')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'windUv'
                ? 'bg-[#F58E1D] text-white shadow-sm'
                : 'text-neutral-600 hover:text-[#0D0D0D]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Wind & UV
          </button>
        </div>
      </div>

      {/* Chart Display Area */}
      <div className="h-72 md:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'hourly' ? (
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F58E1D" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F58E1D" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorFeels" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D0D0D" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0D0D0D" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.8} />
              <XAxis dataKey="time" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} unit={tempUnitLabel} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D0D0D',
                  borderColor: '#262626',
                  borderRadius: '0.75rem',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', fontWeight: 'bold' }} />
              <Area
                type="monotone"
                dataKey="temp"
                name={`Temperature (${tempUnitLabel})`}
                stroke="#F58E1D"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
              />
              <Area
                type="monotone"
                dataKey="feelsLike"
                name={`Feels Like (${tempUnitLabel})`}
                stroke="#0D0D0D"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorFeels)"
              />
            </AreaChart>
          ) : activeTab === 'precip' ? (
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.8} />
              <XAxis dataKey="time" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis
                yAxisId="left"
                stroke="#F58E1D"
                fontSize={11}
                tickLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#0D0D0D"
                fontSize={11}
                tickLine={false}
                unit={precipUnitLabel}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D0D0D',
                  borderColor: '#262626',
                  borderRadius: '0.75rem',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', fontWeight: 'bold' }} />
              <Bar
                yAxisId="left"
                dataKey="pop"
                name="Rain Chance (%)"
                fill="#F58E1D"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="precip"
                name={`Precipitation (${precipUnitLabel})`}
                fill="#0D0D0D"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : activeTab === '7day' ? (
            <LineChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.8} />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} unit={tempUnitLabel} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D0D0D',
                  borderColor: '#262626',
                  borderRadius: '0.75rem',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', fontWeight: 'bold' }} />
              <Line
                type="monotone"
                dataKey="maxTemp"
                name={`High Temp (${tempUnitLabel})`}
                stroke="#F58E1D"
                strokeWidth={3}
                dot={{ r: 4, fill: '#F58E1D' }}
              />
              <Line
                type="monotone"
                dataKey="minTemp"
                name={`Low Temp (${tempUnitLabel})`}
                stroke="#0D0D0D"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0D0D0D' }}
              />
            </LineChart>
          ) : (
            <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.8} />
              <XAxis dataKey="time" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis
                yAxisId="wind"
                stroke="#F58E1D"
                fontSize={11}
                tickLine={false}
                unit={windUnitLabel}
              />
              <YAxis
                yAxisId="uv"
                orientation="right"
                stroke="#0D0D0D"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D0D0D',
                  borderColor: '#262626',
                  borderRadius: '0.75rem',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', fontWeight: 'bold' }} />
              <Line
                yAxisId="wind"
                type="monotone"
                dataKey="wind"
                name={`Wind Speed (${windUnitLabel})`}
                stroke="#F58E1D"
                strokeWidth={3}
              />
              <Line
                yAxisId="uv"
                type="monotone"
                dataKey="uv"
                name="UV Index"
                stroke="#0D0D0D"
                strokeWidth={3}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
