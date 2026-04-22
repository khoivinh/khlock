import { getAllCities, type TimezoneOption } from "@/lib/city-lookup";

const CACHE_KEY = "world-happyhour-local-city";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CachedLocalCity {
  key: string;
  timezone: string;
  savedAt: number;
}

function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findClosestCityByCoords(lat: number, lng: number): TimezoneOption | undefined {
  const cities = getAllCities();
  if (cities.length === 0) return undefined;
  let closest: TimezoneOption | undefined;
  let minDistance = Infinity;
  for (const city of cities) {
    const d = haversineDistanceKm(lat, lng, city.lat, city.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = city;
    }
  }
  return closest;
}

function readCache(): CachedLocalCity | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedLocalCity;
    if (!parsed.key || !parsed.savedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(entry: CachedLocalCity): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Ignore quota / privacy-mode errors — caching is best-effort.
  }
}

function detectLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
}

export interface LocalCityResult {
  key: string;
  /** True when the user explicitly denied geolocation permission (PositionError.PERMISSION_DENIED).
   *  Used to render the "Allow location for a closer match." hint next to the hero city name. */
  geoDenied: boolean;
}

/** Try to resolve the user's closest city via browser geolocation.
 *  Falls back to the passed `timezoneFallback` key on permission denial, timeout,
 *  or any other failure. Caches successful results for CACHE_TTL_MS. */
export function resolveLocalCity(timezoneFallback: string): Promise<LocalCityResult> {
  const tz = detectLocalTimezone();

  const cached = readCache();
  if (cached && cached.timezone === tz && Date.now() - cached.savedAt < CACHE_TTL_MS) {
    return Promise.resolve({ key: cached.key, geoDenied: false });
  }

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve({ key: timezoneFallback, geoDenied: false });
  }

  return new Promise<LocalCityResult>((resolve) => {
    const finalize = (key: string, cache: boolean, geoDenied: boolean) => {
      if (cache) writeCache({ key, timezone: tz, savedAt: Date.now() });
      resolve({ key, geoDenied });
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const match = findClosestCityByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
        finalize(match?.key ?? timezoneFallback, Boolean(match), false);
      },
      (err) => {
        // PositionError.PERMISSION_DENIED === 1 per W3C Geolocation spec.
        finalize(timezoneFallback, false, err.code === 1);
      },
      { enableHighAccuracy: false, maximumAge: 10 * 60 * 1000, timeout: 8000 }
    );
  });
}
