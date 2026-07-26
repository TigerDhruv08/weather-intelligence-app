import { ForecastResponse, LocationData } from '../types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<LocationData[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  try {
    const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(
      trimmed
    )}&count=10&language=en&format=json`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding server error: HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      country_code: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone,
      population: item.population,
      elevation: item.elevation,
    }));
  } catch (err: any) {
    console.error('Error in city geocoding search:', err);
    throw new Error(
      err.message || 'Failed to locate city. Please check your internet connection and try again.'
    );
  }
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number
): Promise<ForecastResponse> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'dew_point_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'surface_pressure',
        'cloud_cover',
        'visibility',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_sum',
        'rain_sum',
        'showers_sum',
        'snowfall_sum',
        'precipitation_hours',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant',
      ].join(','),
      timezone: 'auto',
    });

    const url = `${FORECAST_BASE_URL}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather service error: HTTP ${response.status}`);
    }

    const data: ForecastResponse = await response.json();
    if (!data || !data.current || !data.daily || !data.hourly) {
      throw new Error('Incomplete weather forecast payload returned from provider.');
    }

    return data;
  } catch (err: any) {
    console.error('Error fetching weather forecast:', err);
    throw new Error(
      err.message || 'Unable to load weather forecast. Please check coordinates or try again.'
    );
  }
}

// Popular preset cities for quick access
export const POPULAR_CITIES: LocationData[] = [
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.71427,
    longitude: -74.00597,
    country: 'United States',
    country_code: 'US',
    admin1: 'New York',
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.50853,
    longitude: -0.12574,
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.69171,
    country: 'Japan',
    country_code: 'JP',
    admin1: 'Tokyo',
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.85341,
    longitude: 2.3488,
    country: 'France',
    country_code: 'FR',
    admin1: 'Île-de-France',
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.86785,
    longitude: 151.20732,
    country: 'Australia',
    country_code: 'AU',
    admin1: 'New South Wales',
  },
  {
    id: 292223,
    name: 'Dubai',
    latitude: 25.0657,
    longitude: 55.17128,
    country: 'United Arab Emirates',
    country_code: 'AE',
    admin1: 'Dubai',
  },
  {
    id: 5391959,
    name: 'San Francisco',
    latitude: 37.77493,
    longitude: -122.41942,
    country: 'United States',
    country_code: 'US',
    admin1: 'California',
  },
];
