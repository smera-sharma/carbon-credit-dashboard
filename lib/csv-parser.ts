import Papa from "papaparse"
import type { SoilRecord } from "@/lib/soil-data"

export type ParseResult =
  | { ok: true; records: SoilRecord[]; warnings: string[] }
  | { ok: false; error: string }

const normalize = (s: string) =>
  s.toLowerCase().replace(/[\s_\-\.]+/g, "")

// ─── Column mappings ──────────────────────────────────────────────────────────
// SOC is MANDATORY — must match one of these names.
const SOC_NAMES = [
  "soc_target", "soctarget",
  "soc",
  "organic_carbon", "organiccarbon", "orgcarbon",
  "soil_organic_carbon", "soilorganiccarbon",
  "oc", "carbon", "soilcarbon",
]

// All other numeric columns are optional.
const OPTIONAL_NUMERIC: Record<
  keyof Omit<SoilRecord, "id" | "field" | "region" | "organicCarbon">,
  string[]
> = {
  ph:         ["ph_target", "phtarget", "ph", "soilph", "phvalue", "acidlevel"],
  clay:       ["clay_target", "claytarget", "clay", "claycontent", "clay_pct"],
  altitude:   ["altitude", "elevation", "alt", "height"],
  slope:      ["slope", "gradient", "incline"],
  nitrogen:   ["nitrogen", "n", "totalnitrogen", "tn", "nitrogencontentppm"],
  phosphorus: ["phosphorus", "p", "totalphosphorus", "tp", "phosphorousppm"],
  potassium:  ["potassium", "k", "totalpotassium", "tk", "potassiumppm"],
  moisture:   ["moisture", "watercontent", "soilmoisture", "moisturecontent", "humidity"],
}

// String columns (both optional).
const STRING_MAP = {
  field:  ["field", "fieldname", "name", "plot", "plotname", "sample", "samplename", "site"],
  region: ["region", "area", "zone", "location", "district", "county"],
}

function findColumn(headers: string[], candidates: string[]): string | null {
  for (const h of headers) {
    if (candidates.includes(normalize(h))) return h
  }
  return null
}

function num(val: unknown): number | null {
  if (val === null || val === undefined || String(val).trim() === "") return null
  const n = Number(val)
  return isFinite(n) ? n : null
}

export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const rawHeaders: string[] = results.meta.fields ?? []
        if (rawHeaders.length === 0) {
          return resolve({ ok: false, error: "The CSV file has no headers." })
        }

        // ── SOC is mandatory ────────────────────────────────────────────────
        const socCol = findColumn(rawHeaders, SOC_NAMES)
        if (!socCol) {
          return resolve({
            ok: false,
            error:
              "This dashboard requires Soil Organic Carbon (SOC) data to estimate carbon credits. " +
              "Please upload a compatible dataset or continue using the built-in sample dataset. " +
              "(Expected column name: SOC_target, SOC, Organic_Carbon, or Soil_Organic_Carbon)",
          })
        }

        // ── String columns ──────────────────────────────────────────────────
        const fieldCol  = findColumn(rawHeaders, STRING_MAP.field)
        const regionCol = findColumn(rawHeaders, STRING_MAP.region)

        // ── Optional numeric columns ────────────────────────────────────────
        type NumKey = keyof typeof OPTIONAL_NUMERIC
        const numColMap = {} as Record<NumKey, string | null>
        const missingCols: string[] = []
        for (const key of Object.keys(OPTIONAL_NUMERIC) as NumKey[]) {
          const col = findColumn(rawHeaders, OPTIONAL_NUMERIC[key])
          numColMap[key] = col
          if (!col) missingCols.push(key)
        }

        const warnings: string[] = []
        if (!fieldCol)  warnings.push("No 'Field' column found — rows will be numbered.")
        if (!regionCol) warnings.push("No 'Region' column found — defaulting to 'Unknown'.")
        if (missingCols.length > 0) {
          warnings.push(
            `Missing optional columns (excluded from calculations): ${missingCols.join(", ")}.`,
          )
        }

        const records: SoilRecord[] = (results.data as Record<string, unknown>[]).map(
          (row, i) => ({
            id:            i + 1,
            field:         fieldCol  ? String(row[fieldCol]  ?? `Site ${String(i + 1).padStart(3, "0")}`) : `Site ${String(i + 1).padStart(3, "0")}`,
            region:        regionCol ? String(row[regionCol] ?? "Unknown") : "Unknown",
            organicCarbon: num(row[socCol]),
            ph:            numColMap.ph        ? num(row[numColMap.ph!])        : null,
            clay:          numColMap.clay      ? num(row[numColMap.clay!])      : null,
            altitude:      numColMap.altitude  ? num(row[numColMap.altitude!])  : null,
            slope:         numColMap.slope     ? num(row[numColMap.slope!])     : null,
            nitrogen:      numColMap.nitrogen  ? num(row[numColMap.nitrogen!])  : null,
            phosphorus:    numColMap.phosphorus? num(row[numColMap.phosphorus!]): null,
            potassium:     numColMap.potassium ? num(row[numColMap.potassium!]) : null,
            moisture:      numColMap.moisture  ? num(row[numColMap.moisture!])  : null,
          }),
        )

        if (records.length === 0) {
          return resolve({ ok: false, error: "The CSV file contains no data rows." })
        }

        resolve({ ok: true, records, warnings })
      },
      error(err) {
        resolve({ ok: false, error: `Failed to read file: ${err.message}` })
      },
    })
  })
}
