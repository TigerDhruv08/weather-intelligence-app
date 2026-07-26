import React from 'react';
import {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudSunRain,
  HelpCircle,
} from 'lucide-react';
import { getWmoInfo } from '../utils/wmoCodes';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = 1,
  className = 'w-6 h-6',
}) => {
  const info = getWmoInfo(code);

  switch (info.icon) {
    case 'Sun':
      return <Sun className={`${className} text-amber-400 animate-spin-slow`} />;
    case 'SunDim':
      return <SunDim className={`${className} text-amber-300`} />;
    case 'CloudSun':
      return <CloudSun className={`${className} text-amber-400`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-teal-300`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${className} text-sky-300`} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`${className} text-blue-500`} />;
    case 'CloudHail':
      return <CloudHail className={`${className} text-indigo-300`} />;
    case 'CloudSnow':
      return <CloudSnow className={`${className} text-sky-200`} />;
    case 'Snowflake':
      return <Snowflake className={`${className} text-sky-100`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-purple-400 animate-bounce`} />;
    case 'CloudSunRain':
      return <CloudSunRain className={`${className} text-sky-300`} />;
    default:
      return <Cloud className={`${className} text-slate-300`} />;
  }
};
