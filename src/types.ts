export type UnitsSystem = 'metric' | 'imperial';

export interface LocationData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
  population?: number;
  elevation?: number;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  uv_index: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: Record<string, string>;
  current: CurrentWeather;
  hourly_units?: Record<string, string>;
  hourly: HourlyWeather;
  daily_units?: Record<string, string>;
  daily: DailyWeather;
}

export interface WMOInfo {
  code: number;
  label: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  icon: string;
  bgGradientLight: string;
  bgGradientDark: string;
  cardBg: string;
}

export interface ActivityScore {
  name: string;
  category: 'sports' | 'leisure' | 'travel' | 'outdoor';
  score: number; // 0 - 100
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  icon: string;
  reason: string;
}

export interface ClothingRecommendation {
  type: string;
  suggestion: string;
  items: string[];
  icon: string;
}

export interface WeatherInsights {
  activityScores: ActivityScore[];
  clothing: ClothingRecommendation;
  healthAlerts: string[];
  travelConditions: {
    status: 'Optimal' | 'Caution' | 'Hazardous';
    summary: string;
    drivingRisk: 'Low' | 'Moderate' | 'High';
  };
}
