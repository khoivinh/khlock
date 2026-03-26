#!/usr/bin/env node
/**
 * Processes GeoNames cities15000.txt into a static JSON file for the app.
 * Downloads data from GeoNames if not already cached in /tmp/geonames/.
 *
 * Usage: node scripts/build-cities.mjs
 * Output: client/src/data/cities.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const cacheDir = "/tmp/geonames";
const outputPath = join(projectRoot, "client/src/data/cities.json");

// Download GeoNames files if not cached
function ensureDownloaded(filename, url) {
  const path = join(cacheDir, filename);
  if (!existsSync(path)) {
    console.log(`Downloading ${filename}...`);
    mkdirSync(cacheDir, { recursive: true });
    if (filename.endsWith(".zip")) {
      execSync(`curl -sL "${url}" -o "${path}" && unzip -o "${path}" -d "${cacheDir}"`, { stdio: "inherit" });
    } else {
      execSync(`curl -sL "${url}" -o "${path}"`, { stdio: "inherit" });
    }
  }
  return path;
}

ensureDownloaded("cities15000.zip", "https://download.geonames.org/export/dump/cities15000.zip");
ensureDownloaded("countryInfo.txt", "https://download.geonames.org/export/dump/countryInfo.txt");
ensureDownloaded("admin1CodesASCII.txt", "https://download.geonames.org/export/dump/admin1CodesASCII.txt");

// Parse country code -> country name
const countryMap = new Map();
for (const line of readFileSync(join(cacheDir, "countryInfo.txt"), "utf-8").split("\n")) {
  if (line.startsWith("#") || !line.trim()) continue;
  const cols = line.split("\t");
  // cols[0] = ISO2, cols[4] = country name
  if (cols[0] && cols[4]) {
    countryMap.set(cols[0], cols[4]);
  }
}

// Parse admin1 code -> name (format: "US.CA\tCalifornia\tCalifornia\t5332921")
const admin1Map = new Map();
for (const line of readFileSync(join(cacheDir, "admin1CodesASCII.txt"), "utf-8").split("\n")) {
  if (!line.trim()) continue;
  const cols = line.split("\t");
  // cols[0] = "CC.ADMIN1", cols[1] = name
  if (cols[0] && cols[1]) {
    admin1Map.set(cols[0], cols[1]);
  }
}

// US state admin1 codes -> ANSI codes (e.g., "CA", "NY")
// GeoNames uses its own admin1 codes for US states, extract the short code from the key
const usStateAnsiMap = new Map();
for (const [key, name] of admin1Map.entries()) {
  if (key.startsWith("US.")) {
    const adminCode = key.split(".")[1];
    usStateAnsiMap.set(adminCode, adminCode); // For US, admin1 code IS the state code
  }
}

// Feature codes that represent actual cities (not neighborhoods/sections)
const validFeatureCodes = new Set([
  "PPL",    // populated place
  "PPLC",   // capital of a political entity
  "PPLA",   // seat of a first-order admin division
  "PPLA2",  // seat of a second-order admin division
  "PPLA3",  // seat of a third-order admin division
  "PPLA4",  // seat of a fourth-order admin division
  "PPLG",   // seat of government
  "PPLL",   // populated locality
  "PPLF",   // farm village
]);

// Parse cities15000.txt
// Columns: geonameid, name, asciiname, alternatenames, lat, lng, feature_class, feature_code,
//          country_code, cc2, admin1_code, admin2_code, admin3_code, admin4_code,
//          population, elevation, dem, timezone, modification_date
const lines = readFileSync(join(cacheDir, "cities15000.txt"), "utf-8").split("\n");
const cities = [];

for (const line of lines) {
  if (!line.trim()) continue;
  const cols = line.split("\t");

  const featureCode = cols[7];
  if (!validFeatureCodes.has(featureCode)) continue;

  const population = parseInt(cols[14]) || 0;
  const countryCode = cols[8];
  const timezone = cols[17];
  if (!timezone) continue;

  const city = cols[1]; // display name
  const cityAscii = cols[2];
  const lat = parseFloat(cols[4]);
  const lng = parseFloat(cols[5]);
  const admin1Code = cols[10];
  const country = countryMap.get(countryCode) || countryCode;
  const province = admin1Map.get(`${countryCode}.${admin1Code}`) || "";
  const stateAnsi = countryCode === "US" ? admin1Code : undefined;

  cities.push({
    city,
    city_ascii: cityAscii,
    lat,
    lng,
    pop: population,
    country,
    iso2: countryCode,
    province,
    ...(stateAnsi ? { state_ansi: stateAnsi } : {}),
    timezone,
  });
}

// Deduplicate: keep highest-population entry per city_ascii + iso2 + timezone
const uniqueMap = new Map();
for (const c of cities) {
  const key = `${c.city_ascii.toLowerCase()}_${c.iso2}_${c.timezone}`;
  const existing = uniqueMap.get(key);
  if (!existing || c.pop > existing.pop) {
    uniqueMap.set(key, c);
  }
}

const result = Array.from(uniqueMap.values()).sort((a, b) => (b.pop || 0) - (a.pop || 0));

// Intern repeated strings to reduce JSON size
// Country names, timezones, and provinces repeat across thousands of entries
function buildStringTable(values) {
  const counts = new Map();
  values.forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
  // Only intern strings that appear more than once
  const table = [...counts.entries()].filter(([, c]) => c > 1).map(([v]) => v);
  const index = new Map(table.map((v, i) => [v, i]));
  return { table, index };
}

const allCountries = result.map(c => c.country);
const allTimezones = result.map(c => c.timezone);
const allProvinces = result.map(c => c.province);

const countries = buildStringTable(allCountries);
const timezones = buildStringTable(allTimezones);
const provinces = buildStringTable(allProvinces);

function ref(value, { index }) {
  const idx = index.get(value);
  return idx !== undefined ? idx : value;
}

// Compact format with string interning
// { c: country_table, t: timezone_table, p: province_table, d: data_rows }
// Row: [city, city_ascii, lat, lng, pop, country_ref, iso2, province_ref, state_ansi, timezone_ref]
const compact = {
  c: countries.table,
  t: timezones.table,
  p: provinces.table,
  d: result.map(c => [
    c.city, c.city_ascii,
    Math.round(c.lat * 10000) / 10000, Math.round(c.lng * 10000) / 10000,
    c.pop || 0,
    ref(c.country, countries), c.iso2,
    ref(c.province, provinces),
    c.state_ansi || "",
    ref(c.timezone, timezones),
  ]),
};

writeFileSync(outputPath, JSON.stringify(compact));

const sizeKB = Math.round(readFileSync(outputPath).length / 1024);
console.log(`Generated ${outputPath}`);
console.log(`  ${result.length} cities, ${sizeKB} KB`);
