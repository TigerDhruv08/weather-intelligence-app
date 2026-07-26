import { CurrentWeather, DailyWeather, HourlyWeather, UnitsSystem, WeatherInsights, ActivityScore, ClothingRecommendation } from '../types';
import { getWmoInfo } from './wmoCodes';

export function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function formatTemp(c: number | undefined | null, unit: UnitsSystem): string {
  if (c === undefined || c === null || Number.isNaN(c)) return '--';
  return unit === 'imperial' ? `${cToF(c)}°F` : `${Math.round(c)}°C`;
}

export function formatWindSpeed(kmh: number | undefined | null, unit: UnitsSystem): string {
  if (kmh === undefined || kmh === null || Number.isNaN(kmh)) return '--';
  if (unit === 'imperial') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecip(mm: number | undefined | null, unit: UnitsSystem): string {
  if (mm === undefined || mm === null || Number.isNaN(mm)) return '--';
  if (unit === 'imperial') {
    return `${(mm * 0.0393701).toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function getWindDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
  return directions[index];
}

export function getUvRating(uv: number): { label: string; color: string; badge: string } {
  if (uv <= 2) return { label: 'Low', color: 'text-emerald-500 dark:text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-amber-500 dark:text-amber-400', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-500 dark:text-orange-400', badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-500/30' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-500 dark:text-red-400', badge: 'bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/30' };
  return { label: 'Extreme', color: 'text-purple-500 dark:text-purple-400', badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30' };
}

export function getHumidityRating(humidity: number): string {
  if (humidity < 30) return 'Dry';
  if (humidity <= 60) return 'Comfortable';
  if (humidity <= 75) return 'Humid';
  return 'Very Humid';
}

export function getVisibilityDescription(meters: number): string {
  const km = meters / 1000;
  if (km >= 10) return 'Excellent (10+ km)';
  if (km >= 5) return 'Good (5-10 km)';
  if (km >= 2) return 'Moderate (2-5 km)';
  return 'Poor (< 2 km)';
}

export function generateWeatherInsights(
  current: CurrentWeather,
  daily: DailyWeather,
  hourly: HourlyWeather
): WeatherInsights {
  const temp = current.temperature_2m;
  const precip = current.precipitation;
  const wind = current.wind_speed_10m;
  const wmo = getWmoInfo(current.weather_code);
  const maxUv = daily.uv_index_max?.[0] || 0;
  const humidity = current.relative_humidity_2m;

  // Compute Activity Scores (0-100)
  const activities: ActivityScore[] = [];

  // 1. Running / Jogging
  let runScore = 90;
  if (temp < 5 || temp > 28) runScore -= 25;
  if (temp < 0 || temp > 34) runScore -= 30;
  if (precip > 0.5) runScore -= 35;
  if (wind > 25) runScore -= 20;
  if (wmo.category === 'thunderstorm' || wmo.category === 'snow') runScore -= 50;
  runScore = Math.max(10, Math.min(100, runScore));

  activities.push({
    name: 'Running & Outdoor Fitness',
    category: 'sports',
    score: runScore,
    rating: runScore >= 80 ? 'Excellent' : runScore >= 60 ? 'Good' : runScore >= 40 ? 'Fair' : 'Poor',
    icon: 'Activity',
    reason:
      runScore >= 80
        ? 'Great ambient temperature and minimal wind for outdoor cardio.'
        : precip > 0
        ? 'Wet ground conditions and rainfall make running slippery.'
        : temp > 28
        ? 'High temperatures — stay hydrated and avoid peak midday heat.'
        : 'Sub-optimal weather for jogging. Consider indoor exercise.',
  });

  // 2. Cycling / Biking
  let cycleScore = 88;
  if (wind > 20) cycleScore -= 25;
  if (wind > 35) cycleScore -= 35;
  if (precip > 0.2) cycleScore -= 30;
  if (temp < 8 || temp > 30) cycleScore -= 20;
  if (wmo.category === 'thunderstorm') cycleScore -= 60;
  cycleScore = Math.max(10, Math.min(100, cycleScore));

  activities.push({
    name: 'Cycling & Commuting',
    category: 'outdoor',
    score: cycleScore,
    rating: cycleScore >= 80 ? 'Excellent' : cycleScore >= 60 ? 'Good' : cycleScore >= 40 ? 'Fair' : 'Poor',
    icon: 'Bike',
    reason:
      cycleScore >= 80
        ? 'Low wind gusts and clear roads make cycling smooth and enjoyable.'
        : wind > 20
        ? `Strong crosswinds (${Math.round(wind)} km/h) could affect stability.`
        : precip > 0
        ? 'Slippery tarmac and poor visibility due to rain.'
        : 'Chilly or hot temperatures require extra riding gear.',
  });

  // 3. Outdoor Dining & Picnic
  let diningScore = 85;
  if (temp < 16 || temp > 29) diningScore -= 30;
  if (precip > 0.1) diningScore -= 45;
  if (current.cloud_cover > 80) diningScore -= 15;
  if (wind > 18) diningScore -= 20;
  diningScore = Math.max(10, Math.min(100, diningScore));

  activities.push({
    name: 'Outdoor Dining & Picnics',
    category: 'leisure',
    score: diningScore,
    rating: diningScore >= 80 ? 'Excellent' : diningScore >= 60 ? 'Good' : diningScore >= 40 ? 'Fair' : 'Poor',
    icon: 'Utensils',
    reason:
      diningScore >= 80
        ? 'Pleasant patio temperatures with mild breeze and dry skies.'
        : precip > 0
        ? 'Rain expected — seek indoor seating or covered patios.'
        : temp < 16
        ? 'A bit too cool for unheated outdoor seating.'
        : 'High heat or strong winds might impair outdoor dining comfort.',
  });

  // 4. Beach & Swimming
  let beachScore = 30;
  if (temp >= 22 && current.is_day === 1) beachScore += 35;
  if (temp >= 27) beachScore += 25;
  if (current.cloud_cover < 40) beachScore += 20;
  if (precip > 0.2) beachScore -= 50;
  if (wmo.category === 'thunderstorm') beachScore = 5;
  beachScore = Math.max(5, Math.min(100, beachScore));

  activities.push({
    name: 'Beach & Sunbathing',
    category: 'leisure',
    score: beachScore,
    rating: beachScore >= 80 ? 'Excellent' : beachScore >= 60 ? 'Good' : beachScore >= 40 ? 'Fair' : 'Poor',
    icon: 'SunMedium',
    reason:
      beachScore >= 75
        ? 'Warm sun and clear skies — ideal beach and swimming weather!'
        : temp < 22
        ? 'Temperatures are cooler than optimal for sunbathing.'
        : precip > 0
        ? 'Rain or overcast skies make beach outings unfavorable.'
        : 'Limited sunshine today.',
  });

  // 5. Hiking & Nature Walks
  let hikeScore = 85;
  if (temp < 8 || temp > 28) hikeScore -= 20;
  if (precip > 0.5) hikeScore -= 35;
  if (wmo.category === 'fog') hikeScore -= 25;
  if (wmo.category === 'thunderstorm') hikeScore -= 55;
  hikeScore = Math.max(10, Math.min(100, hikeScore));

  activities.push({
    name: 'Hiking & Trail Walking',
    category: 'outdoor',
    score: hikeScore,
    rating: hikeScore >= 80 ? 'Excellent' : hikeScore >= 60 ? 'Good' : hikeScore >= 40 ? 'Fair' : 'Poor',
    icon: 'Footprints',
    reason:
      hikeScore >= 80
        ? 'Comfortable trail conditions with good visibility and dry paths.'
        : wmo.category === 'fog'
        ? 'Low trail visibility due to fog — navigate carefully.'
        : precip > 0
        ? 'Trails may be muddy; sturdy waterproof footwear recommended.'
        : 'Extreme temperatures — pack adequate water and sun layer.',
  });

  // Clothing Recommendation
  let clothingType = 'Mild / Casual Layering';
  let clothingSuggestion = 'Light shirt with a breathable cardigan or jacket.';
  const items: string[] = [];

  if (temp < 0) {
    clothingType = 'Extreme Cold Gear';
    clothingSuggestion = 'Heavy insulated parka, thermal base layer, gloves, and beanie.';
    items.push('Heavy Winter Parka', 'Thermal Underwear', 'Insulated Gloves', 'Warm Beanie/Hat', 'Winter Boots');
  } else if (temp < 10) {
    clothingType = 'Chilly / Winter Clothing';
    clothingSuggestion = 'Warm coat or padded jacket with long trousers and wool socks.';
    items.push('Padded Coat/Jacket', 'Long Pants/Jeans', 'Warm Sweater', 'Scarf or Gloves');
  } else if (temp < 18) {
    clothingType = 'Cool / Autumn Layering';
    clothingSuggestion = 'Light jacket, hoodie, or sweater over a casual tee.';
    items.push('Light Outer Jacket', 'Long Sleeve Shirt', 'Comfortable Jeans', 'Sneakers');
  } else if (temp < 26) {
    clothingType = 'Comfortable / Spring & Summer';
    clothingSuggestion = 'Cotton t-shirt or blouse with light shorts or trousers.';
    items.push('Short-Sleeve T-shirt', 'Chinos / Shorts', 'Breathable Shoes');
  } else {
    clothingType = 'Hot Weather Gear';
    clothingSuggestion = 'Lightweight, loose linen or cotton attire with high UV protection.';
    items.push('Linen / Breathable Shirt', 'Shorts / Sundress', 'Sunglasses', 'Wide-Brim Hat');
  }

  if (precip > 0.1 || wmo.category === 'rain' || wmo.category === 'drizzle') {
    items.push('Compact Umbrella', 'Waterproof Rain Coat');
  }
  if (maxUv >= 6) {
    items.push('UV Protection Sunglasses', 'SPF 30+ Sunscreen');
  }

  const clothing: ClothingRecommendation = {
    type: clothingType,
    suggestion: clothingSuggestion,
    items,
    icon: temp < 10 ? 'Shirt' : temp > 25 ? 'Sun' : 'Umbrella',
  };

  // Health & Travel Alerts
  const healthAlerts: string[] = [];
  if (maxUv >= 8) {
    healthAlerts.push(`Extreme UV Index (${maxUv}). Limit direct sun exposure between 11 AM - 4 PM.`);
  } else if (maxUv >= 6) {
    healthAlerts.push(`High UV Index (${maxUv}). Apply SPF 30+ sunscreen if spending time outside.`);
  }

  if (temp > 32) {
    healthAlerts.push('Heat warning: High temperatures may cause heat fatigue. Drink plenty of water.');
  } else if (temp < 0) {
    healthAlerts.push('Frost alert: Sub-zero temperature increases risk of hypothermia and icy patches.');
  }

  if (humidity > 80 && temp > 25) {
    healthAlerts.push('High mugginess and humidity index — expect heavy sweating during physical activity.');
  } else if (humidity < 25) {
    healthAlerts.push('Dry air conditions — use lip balm and hydration to prevent dry skin/throat.');
  }

  // Travel Conditions
  let travelStatus: 'Optimal' | 'Caution' | 'Hazardous' = 'Optimal';
  let travelSummary = 'Roads are clear with good atmospheric visibility.';
  let drivingRisk: 'Low' | 'Moderate' | 'High' = 'Low';

  if (wmo.category === 'thunderstorm' || wmo.category === 'snow' || precip > 5 || wind > 45) {
    travelStatus = 'Hazardous';
    drivingRisk = 'High';
    travelSummary = 'Severe weather conditions (heavy precipitation or high wind gusts). Exercise caution on highways.';
  } else if (wmo.category === 'fog' || precip > 0.5 || wind > 25) {
    travelStatus = 'Caution';
    drivingRisk = 'Moderate';
    travelSummary = 'Reduced visibility or wet road surfaces. Allow extra stopping distance when driving.';
  }

  return {
    activityScores: activities,
    clothing,
    healthAlerts,
    travelConditions: {
      status: travelStatus,
      summary: travelSummary,
      drivingRisk,
    },
  };
}
