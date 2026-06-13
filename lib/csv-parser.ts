import Papa from "papaparse"
import type { SoilRecord } from "@/lib/soil-data"

export type ParseResult =
  | { ok: true; records: SoilRecord[]; warnings: string[] }
  | { ok: false; error: string }

const normalize = (s: string) =>
  s.toLowerCase().replace(/[\s_\-\.]+/g, "")

// Columns that map to numeric SoilRecord fields — all optional.
const COLUMN_MAP: Record<keyof Omit<SoilRecord, "id" | "field" | "region">, string[]> = {
  organicCarbon: ["organiccarbon", "orgcarbon", "oc", "carbon", "soilcarbon", "soc"],
  nitrogen:      ["nitrogen", "n", "totalnitrogen", "tn", "nitrogencontentppm"],
  phosphorus:    ["phosphorus", "p", "totalphosphorus", "tp", "phosphorousppm"],
  potassium:     ["potassium", "k", "totalpotassium", "tk", "potassiumppm"],
  ph:            ["ph", "soilph", "phvalue", "acidlevel"],
  moisture:      ["moisture", "watercontent", "soilmoisture", "moisturecontent", "humidity"],
}

// String columns — also optional.
const STRING_MAP = {
  field:  ["field", "fieldname", "name", "plot", "plotname", "sample", "samplename"],
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

        // Map string columns.
        const fieldCol  = findColumn(rawHeaders, STRING_MAP.field)
        const regionCol = findColumn(rawHeaders, STRING_MAP.region)

        // Map numeric columns — each may be null if not found in the file.
        type NumericKey = keyof typeof COLUMN_MAP
        const numColMap = {} as Record<NumericKey, string | null>
        const missingCols: string[] = []

        for (const key of Object.keys(COLUMN_MAP) as NumericKey[]) {
          const col = findColumn(rawHeaders, COLUMN_MAP[key])
          numColMap[key] = col
          if (!col) missingCols.push(key)
        }

        // If no recognisable columns were found at all, bail out.
        const recognisedAny =
          fieldCol || regionCol || Object.values(numColMap).some(Boolean)
        if (!recognisedAny) {
          return resolve({
            ok: false,
            error:
              "None of the expected columns were found. Please check your CSV headers match: field, region, organic_carbon, nitrogen, phosphorus, potassium, ph, moisture.",
          })
        }

        const warnings: string[] = []
        if (!fieldCol)  warnings.push("No 'Field' column found — rows will be numbered.")
        if (!regionCol) warnings.push("No 'Region' column found — defaulting to 'Unknown'.")
        if (missingCols.length > 0) {
          warnings.push(
            `Missing columns (will be excluded from calculations): ${missingCols.join(", ")}.`,
          )
        }

        const records: SoilRecord[] = (results.data as Record<string, unknown>[]).map(
          (row, i) => ({
            id: i + 1,
            field:  fieldCol  ? String(row[fieldCol]  ?? `Sample ${i + 1}`) : `Sample ${i + 1}`,
            region: regionCol ? String(row[regionCol] ?? "Unknown")          : "Unknown",
            organicCarbon: numColMap.organicCarbon ? num(row[numColMap.organicCarbon]) : null,
            nitrogen:      numColMap.nitrogen      ? num(row[numColMap.nitrogen])      : null,
            phosphorus:    numColMap.phosphorus    ? num(row[numColMap.phosphorus])    : null,
            potassium:     numColMap.potassium     ? num(row[numColMap.potassium])     : null,
            ph:            numColMap.ph            ? num(row[numColMap.ph])            : null,
            moisture:      numColMap.moisture      ? num(row[numColMap.moisture])      : null,
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
