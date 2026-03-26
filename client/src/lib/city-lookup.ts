import cityData from "@/data/cities.json";

export interface CityData {
  city: string;
  country: string;
  timezone: string;
  province?: string;
  lat: number;
  lng: number;
  population?: number;
}

interface RawCity {
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  pop: number;
  country: string;
  iso2: string;
  province: string;
  state_ansi: string;
  timezone: string;
}

// Compact format with interned strings: { c: countries, t: timezones, p: provinces, d: rows }
// Row values that are numbers are indices into the corresponding string table
const raw = cityData as { c: string[]; t: string[]; p: string[]; d: unknown[][] };
function deref(val: unknown, table: string[]): string {
  return typeof val === "number" ? table[val] : (val as string);
}
const cityMapping: RawCity[] = raw.d.map((r) => ({
  city: r[0] as string,
  city_ascii: r[1] as string,
  lat: r[2] as number,
  lng: r[3] as number,
  pop: r[4] as number,
  country: deref(r[5], raw.c),
  iso2: r[6] as string,
  province: deref(r[7], raw.p),
  state_ansi: r[8] as string,
  timezone: deref(r[9], raw.t),
}));

function getGmtOffset(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find((p) => p.type === "timeZoneName");
    if (offsetPart?.value) {
      const match = offsetPart.value.match(/GMT([+-]?)(\d+)?(?::(\d+))?/);
      if (match) {
        const sign = match[1] === "-" ? -1 : 1;
        const hours = parseInt(match[2] || "0", 10);
        const minutes = parseInt(match[3] || "0", 10);
        return sign * (hours + minutes / 60);
      }
    }
    return 0;
  } catch {
    return 0;
  }
}

function formatGmtLabel(offset: number): string {
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);
  if (minutes === 0) {
    return `GMT${sign}${hours}`;
  }
  return `GMT${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
}

export interface TimezoneOption {
  key: string;
  name: string;
  gmtLabel: string;
  offset: number;
  timezone: string;
  country: string;
  iso2: string;
  province?: string;
  lat: number;
  lng: number;
}

function normalizeForKey(ascii: string): string {
  const baseName = ascii.replace(/[^a-zA-Z0-9]/g, "");
  return baseName.charAt(0).toLowerCase() + baseName.slice(1);
}

// Generate unique keys: highest-pop city gets the base key (e.g., "oxford_US"),
// others get province/state appended (e.g., "oxford_US_OH") for disambiguation.
// Data is already sorted by population descending, so first occurrence = highest pop.
const usedKeys = new Set<string>();
const timezoneOptions: TimezoneOption[] = cityMapping.map((city) => {
  const baseKey = `${normalizeForKey(city.city_ascii)}_${city.iso2}`;
  let key = baseKey;
  if (usedKeys.has(key) && (city.state_ansi || city.province)) {
    const suffix = normalizeForKey(city.state_ansi || city.province);
    key = `${baseKey}_${suffix}`;
  }
  // Final fallback: append timezone fragment for truly ambiguous cases
  if (usedKeys.has(key)) {
    const tzSuffix = city.timezone.split("/").pop()!.replace(/[^a-zA-Z]/g, "");
    key = `${baseKey}_${tzSuffix}`;
  }
  usedKeys.add(key);

  const offset = getGmtOffset(city.timezone);
  return {
    key,
    name: city.city,
    gmtLabel: formatGmtLabel(offset),
    offset,
    timezone: city.timezone,
    country: city.country,
    iso2: city.iso2,
    province: city.province,
    lat: city.lat,
    lng: city.lng,
  };
});

export const ALL_CITIES: TimezoneOption[] = timezoneOptions.sort(
  (a, b) => b.offset - a.offset
);

const cityByKey = new Map<string, TimezoneOption>();
ALL_CITIES.forEach((city) => cityByKey.set(city.key, city));

export function getCityByKey(key: string): TimezoneOption | undefined {
  return cityByKey.get(key);
}

export function searchCities(query: string, limit = 50): TimezoneOption[] {
  const q = query.toLowerCase().trim();
  if (!q) {
    return ALL_CITIES.slice(0, limit);
  }

  return ALL_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(q) ||
      city.country.toLowerCase().includes(q) ||
      city.gmtLabel.toLowerCase().includes(q) ||
      (city.province && city.province.toLowerCase().includes(q))
  ).slice(0, limit);
}

export function getTimeInCityZone(baseTime: Date, offset: number): Date {
  // Convert baseTime to a Date that displays the target timezone's time
  // when using getHours()/getMinutes() in the local environment
  const utcMs = baseTime.getTime();
  const targetMs = utcMs + (offset * 3600000) + (baseTime.getTimezoneOffset() * 60000);
  return new Date(targetMs);
}
