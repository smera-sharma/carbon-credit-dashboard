import Papa from "papaparse"
import type { SoilRecord } from "@/lib/soil-data"

export type ParseResult =
  | { ok: true; records: SoilRecord[]; warnings: string[] }
  | { ok: false; error: string }

const normalize = (s: string) =>
  s.toLowerCase().replace(/[\s_\-\.]+/g, "")

const COLUMN_MAP: Record<keyof Omit<SoilRecord, "id">, string[]> = {
  field: ["field", "fieldname", "name", "plot", "plotname", "sample", "samplename"],
  region: ["region", "area", "zone", "location", "district", "county"],
  organicCarbon: ["organiccarbon", "orgcarbon", "oc", "carbon", "soilcarbon", "soc"],
  nitrogen: ["nitrogen", "n", "totalnitrogen", "tn", "nitrogencontentppm"],
  phosphorus: ["phosphorus", "p", "totalphosphorus", "tp", "phosphorousppm"],
  potassium: ["potassium", "k", "totalpotassium", "tk", "potassiumppm"],
  ph: ["ph", "soilph", "phvalue", "acidlevel"],
  moisture: ["moisture", "watercontent", "soilmoisture", "moisturecontent", "humidity"],
}

function findColumn(headers: string[], field: keyof typeof COLUMN_MAP): string | null {
  const candidates = COLUMN_MAP[field]
  for (const h of headers) {
    if (candidates.includes(normalize(h))) return h
  }
  return null
}

function num(val: unknown, fallback = 0): number {
  const n = Number(val)
  return isFinite(n) ? n : fallback
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

        const colMap = {} as Record<keyof Omit<SoilRecord, "id">, string | null>
        const missing: string[] = []

        for (const key of Object.keys(COLUMN_MAP) as Array<keyof typeof COLUMN_MAP>) {
          const col = findColumn(rawHeaders, key)
          colMap[key] = col
          if (!col && key !== "field" && key !== "region") missing.push(key)
        }

        if (missing.length > 0) {
          return resolve({
            ok: false,
            error: `Could not find required columns: ${missing.join(", ")}. Please check that your CSV includes headers for organic carbon, nitrogen, phosphorus, potassium, pH, and moisture.`,
          })
        }

        const warnings: string[] = []
        if (!colMap.field) warnings.push("No 'Field' column found — rows will be numbered.")
        if (!colMap.region) warnings.push("No 'Region' column found — defaulting to 'Unknown'.")

        const records: SoilRecord[] = (results.data as Record<string, unknown>[]).map(
          (row, i) => ({
            id: i + 1,
            field: colMap.field ? String(row[colMap.field!] ?? `Sample ${i + 1}`) : `Sample ${i + 1}`,
            region: colMap.region ? String(row[colMap.region!] ?? "Unknown") : "Unknown",
            organicCarbon: num(row[colMap.organicCarbon!]),
            nitrogen: num(row[colMap.nitrogen!]),
            phosphorus: num(row[colMap.phosphorus!]),
            potassium: num(row[colMap.potassium!]),
            ph: num(row[colMap.ph!]),
            moisture: num(row[colMap.moisture!]),
          })
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
