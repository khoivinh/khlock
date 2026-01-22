import type { Express } from "express";
import { createServer, type Server } from "http";
import cityTimezones from "city-timezones";

// Get city mapping from city-timezones library
const cityMapping = (cityTimezones as any).cityMapping as Array<{
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  pop?: number;
  country: string;
  iso2: string;
  iso3: string;
  province: string;
  state_ansi?: string;
  timezone: string;
}>;

// Generate unique key matching client: cityName_countryISO2 (e.g., "paris_FR", "austin_US")
function generateCityKey(city: (typeof cityMapping)[0]): string {
  const baseName = city.city_ascii.replace(/[^a-zA-Z0-9]/g, "");
  const normalized = baseName.charAt(0).toLowerCase() + baseName.slice(1);
  return `${normalized}_${city.iso2}`;
}

// Build a lookup map by unique city key
const cityLookup = new Map<string, { lat: number; lng: number }>();
cityMapping.forEach((city) => {
  const key = generateCityKey(city);
  if (!cityLookup.has(key)) {
    cityLookup.set(key, { lat: city.lat, lng: city.lng });
  }
});

// Simple in-memory cache for weather data (10 minute TTL)
const weatherCache = new Map<string, { data: { celsius: number; fahrenheit: number }; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Weather API endpoint
  app.get("/api/weather", async (req, res) => {
    const city = req.query.city as string;
    
    if (!city) {
      return res.status(400).json({ error: "City parameter required" });
    }

    const coords = cityLookup.get(city);
    if (!coords) {
      return res.status(400).json({ error: "City not found" });
    }

    // Check cache first
    const cached = weatherCache.get(city);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    try {
      // Using Open-Meteo API (free, no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m`
      );

      if (!response.ok) {
        throw new Error("Weather API error");
      }

      const data = await response.json();
      const tempCelsius = Math.round(data.current.temperature_2m);
      const tempFahrenheit = Math.round((tempCelsius * 9) / 5 + 32);

      const weatherData = {
        celsius: tempCelsius,
        fahrenheit: tempFahrenheit,
      };

      // Cache the result
      weatherCache.set(city, { data: weatherData, timestamp: Date.now() });

      return res.json(weatherData);
    } catch (error) {
      console.error("Weather fetch error:", error);
      return res.status(500).json({ error: "Failed to fetch weather" });
    }
  });

  return httpServer;
}
