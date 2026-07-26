import React from 'react';
import { ForecastResponse } from '../types';
import { generateWeatherInsights } from '../utils/weatherCalculations';
import {
  Sparkles,
  Activity,
  Bike,
  Utensils,
  SunMedium,
  Footprints,
  Shirt,
  Car,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface PlanningRecommendationsProps {
  forecast: ForecastResponse;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({ forecast }) => {
  const current = forecast.current;
  const daily = forecast.daily;
  const hourly = forecast.hourly;

  const insights = generateWeatherInsights(current, daily, hourly);

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-[#F58E1D]" />;
      case 'Bike':
        return <Bike className="w-5 h-5 text-[#F58E1D]" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-[#F58E1D]" />;
      case 'SunMedium':
        return <SunMedium className="w-5 h-5 text-[#F58E1D]" />;
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-[#F58E1D]" />;
      default:
        return <Activity className="w-5 h-5 text-[#F58E1D]" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (score >= 40) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-50 text-[#F58E1D] border border-orange-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0D0D0D]">
              Weather Intelligence & Planning Recommendations
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              Smart outdoor activity scores, clothing guide & travel advisories
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Scores Column (Span 2) */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-sm font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#F58E1D]" />
            Outdoor Activity Suitability
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.activityScores.map((act) => (
              <div
                key={act.name}
                className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-orange-50 border border-orange-200">
                      {getActivityIcon(act.icon)}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-[#0D0D0D]">{act.name}</h5>
                      <span className="text-[11px] text-neutral-500 font-medium capitalize">{act.category}</span>
                    </div>
                  </div>

                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getScoreColor(
                      act.score
                    )}`}
                  >
                    {act.score}/100 ({act.rating})
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden border border-neutral-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      act.score >= 80
                        ? 'bg-emerald-500'
                        : act.score >= 60
                        ? 'bg-amber-500'
                        : act.score >= 40
                        ? 'bg-[#F58E1D]'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed font-medium">{act.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clothing & Health / Travel Column */}
        <div className="space-y-6">
          {/* Clothing & Attire Advisor */}
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200">
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#0D0D0D]">Clothing & Gear Guide</h4>
                <span className="text-[11px] text-[#F58E1D] font-bold">
                  {insights.clothing.type}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-700 font-medium bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              {insights.clothing.suggestion}
            </p>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Recommended Pack Items:
              </span>
              <ul className="space-y-1.5">
                {insights.clothing.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs text-neutral-800 font-semibold flex items-center gap-2 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Travel & Driving Conditions */}
          <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-50 text-[#F58E1D] border border-orange-200">
                  <Car className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-[#0D0D0D]">Road & Travel Safety</h4>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  insights.travelConditions.status === 'Optimal'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : insights.travelConditions.status === 'Caution'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {insights.travelConditions.status}
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              {insights.travelConditions.summary}
            </p>
          </div>

          {/* Health Alerts if any */}
          {insights.healthAlerts.length > 0 && (
            <div className="p-5 rounded-xl bg-orange-50 border border-orange-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#F58E1D] text-xs font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Environmental Advisories</span>
              </div>
              <ul className="space-y-1.5 pt-1">
                {insights.healthAlerts.map((alert, i) => (
                  <li
                    key={`alert-${i}`}
                    className="text-xs text-neutral-800 font-medium flex items-start gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-[#F58E1D] shrink-0 mt-0.5" />
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
