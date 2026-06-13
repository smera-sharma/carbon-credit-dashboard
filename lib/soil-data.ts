export type SoilRecord = {
  id: number
  field: string
  region: string
  organicCarbon: number | null // SOC_target (%)
  ph: number | null            // pH_target
  clay: number | null          // Clay_target (%)
  altitude: number | null      // Altitude (m)
  slope: number | null         // Slope (degrees)
  // Legacy nutrient fields — null for SOC datasets, populated from compatible CSVs
  nitrogen: number | null      // ppm
  phosphorus: number | null    // ppm
  potassium: number | null     // ppm
  moisture: number | null      // %
}

// ─── Default Sample: LimeSoDa SOC Dataset (227 real field samples) ─────────
// Sources: BB.51 (Coastal Valley) · BB.72 (Coastal Plains) · G.104 (Highland Ridge)
// Fields retained: SOC_target → organicCarbon, pH_target → ph,
//                  Clay_target → clay, Altitude → altitude, Slope → slope
// Reference: Schmidinger et al. (2025), LimeSoDa, CC BY-SA 4.0
export const sampleSoilData: SoilRecord[] = [
  { id:   1, field: "Site 001", region: "Coastal Valley",  organicCarbon: 2.88,  ph: 7.1,  clay: 10.0, altitude:  57.4, slope: 0.065,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:   2, field: "Site 002", region: "Coastal Valley",  organicCarbon: 0.74,  ph: 5.8,  clay:  5.0, altitude:  62.5, slope: 0.125,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:   3, field: "Site 003", region: "Coastal Valley",  organicCarbon: 0.69,  ph: 5.9,  clay:  5.0, altitude:  62.4, slope: 0.1788, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:   4, field: "Site 004", region: "Coastal Valley",  organicCarbon: 3.23,  ph: 7.3,  clay: 20.0, altitude:  57.4, slope: 0.0475, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:   5, field: "Site 005", region: "Coastal Valley",  organicCarbon: 0.9,   ph: 6.5,  clay:  8.0, altitude:  63.9, slope: 0.1187, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:   6, field: "Site 006", region: "Coastal Valley",  organicCarbon: 0.8,   ph: 7.1,  clay:  2.0, altitude:  67.8, slope: 0.2162, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:   7, field: "Site 007", region: "Coastal Valley",  organicCarbon: 0.58,  ph: 6.5,  clay:  3.0, altitude:  67.6, slope: 0.215,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:   8, field: "Site 008", region: "Coastal Valley",  organicCarbon: 0.75,  ph: 6.3,  clay:  3.0, altitude:  63.8, slope: 0.1112, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:   9, field: "Site 009", region: "Coastal Valley",  organicCarbon: 0.59,  ph: 6.8,  clay:  9.0, altitude:  69.9, slope: 0.2013, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  10, field: "Site 010", region: "Coastal Valley",  organicCarbon: 1.9,   ph: 6.9,  clay: 11.0, altitude:  58.3, slope: 0.0925, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  11, field: "Site 011", region: "Coastal Valley",  organicCarbon: 0.83,  ph: 5.3,  clay:  3.0, altitude:  64.4, slope: 0.1387, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  12, field: "Site 012", region: "Coastal Valley",  organicCarbon: 1.0,   ph: 6.2,  clay:  8.0, altitude:  60.1, slope: 0.0563, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  13, field: "Site 013", region: "Coastal Valley",  organicCarbon: 0.79,  ph: 6.3,  clay:  6.0, altitude:  60.4, slope: 0.06,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  14, field: "Site 014", region: "Coastal Valley",  organicCarbon: 1.05,  ph: 5.9,  clay:  8.0, altitude:  58.8, slope: 0.0662, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  15, field: "Site 015", region: "Coastal Valley",  organicCarbon: 2.41,  ph: 7.3,  clay: 14.0, altitude:  57.6, slope: 0.0138, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  16, field: "Site 016", region: "Coastal Valley",  organicCarbon: 1.13,  ph: 6.7,  clay:  8.0, altitude:  60.0, slope: 0.085,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  17, field: "Site 017", region: "Coastal Valley",  organicCarbon: 0.7,   ph: 6.4,  clay: 11.0, altitude:  59.7, slope: 0.0662, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  18, field: "Site 018", region: "Coastal Valley",  organicCarbon: 0.7,   ph: 6.8,  clay:  2.0, altitude:  67.9, slope: 0.23,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  19, field: "Site 019", region: "Coastal Valley",  organicCarbon: 0.72,  ph: 6.8,  clay:  4.0, altitude:  66.4, slope: 0.1638, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  20, field: "Site 020", region: "Coastal Valley",  organicCarbon: 0.86,  ph: 6.7,  clay:  4.0, altitude:  60.1, slope: 0.1562, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  21, field: "Site 021", region: "Coastal Valley",  organicCarbon: 0.79,  ph: 5.9,  clay:  7.0, altitude:  60.0, slope: 0.0425, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  22, field: "Site 022", region: "Coastal Valley",  organicCarbon: 1.99,  ph: 7.1,  clay: 17.0, altitude:  58.3, slope: 0.0512, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  23, field: "Site 023", region: "Coastal Valley",  organicCarbon: 0.81,  ph: 6.8,  clay:  5.0, altitude:  59.6, slope: 0.0713, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  24, field: "Site 024", region: "Coastal Valley",  organicCarbon: 0.81,  ph: 7.0,  clay:  7.0, altitude:  60.2, slope: 0.0625, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  25, field: "Site 025", region: "Coastal Valley",  organicCarbon: 1.65,  ph: 7.1,  clay: 10.0, altitude:  58.7, slope: 0.085,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  26, field: "Site 026", region: "Coastal Valley",  organicCarbon: 1.75,  ph: 6.9,  clay: 10.0, altitude:  58.9, slope: 0.0637, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  27, field: "Site 027", region: "Coastal Valley",  organicCarbon: 1.49,  ph: 6.6,  clay:  9.0, altitude:  59.6, slope: 0.085,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  28, field: "Site 028", region: "Coastal Valley",  organicCarbon: 1.9,   ph: 7.2,  clay: 18.0, altitude:  59.0, slope: 0.0413, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  29, field: "Site 029", region: "Coastal Valley",  organicCarbon: 1.23,  ph: 6.8,  clay:  6.0, altitude:  59.3, slope: 0.055,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  30, field: "Site 030", region: "Coastal Valley",  organicCarbon: 1.91,  ph: 7.1,  clay:  8.0, altitude:  59.3, slope: 0.0425, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  31, field: "Site 031", region: "Coastal Valley",  organicCarbon: 0.87,  ph: 6.8,  clay:  5.0, altitude:  59.8, slope: 0.0225, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  32, field: "Site 032", region: "Coastal Valley",  organicCarbon: 0.68,  ph: 5.8,  clay:  4.0, altitude:  67.9, slope: 0.2188, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  33, field: "Site 033", region: "Coastal Valley",  organicCarbon: 1.68,  ph: 6.4,  clay: 10.0, altitude:  60.1, slope: 0.0875, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  34, field: "Site 034", region: "Coastal Valley",  organicCarbon: 0.71,  ph: 4.7,  clay:  3.0, altitude:  65.4, slope: 0.2,    nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  35, field: "Site 035", region: "Coastal Valley",  organicCarbon: 0.98,  ph: 6.4,  clay:  7.0, altitude:  72.2, slope: 0.1087, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  36, field: "Site 036", region: "Coastal Valley",  organicCarbon: 0.67,  ph: 4.7,  clay:  3.0, altitude:  65.6, slope: 0.2137, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  37, field: "Site 037", region: "Coastal Valley",  organicCarbon: 0.77,  ph: 6.8,  clay:  5.0, altitude:  70.1, slope: 0.2062, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  38, field: "Site 038", region: "Coastal Valley",  organicCarbon: 1.29,  ph: 6.3,  clay:  6.0, altitude:  60.7, slope: 0.1,    nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  39, field: "Site 039", region: "Coastal Valley",  organicCarbon: 1.8,   ph: 6.5,  clay:  8.0, altitude:  61.0, slope: 0.0788, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  40, field: "Site 040", region: "Coastal Valley",  organicCarbon: 0.65,  ph: 6.3,  clay:  5.0, altitude:  62.0, slope: 0.175,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  41, field: "Site 041", region: "Coastal Valley",  organicCarbon: 1.05,  ph: 6.5,  clay:  7.0, altitude:  62.1, slope: 0.0963, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  42, field: "Site 042", region: "Coastal Valley",  organicCarbon: 1.1,   ph: 4.4,  clay:  6.0, altitude:  62.4, slope: 0.0637, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  43, field: "Site 043", region: "Coastal Valley",  organicCarbon: 0.83,  ph: 6.4,  clay:  5.0, altitude:  62.3, slope: 0.0825, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  44, field: "Site 044", region: "Coastal Valley",  organicCarbon: 0.92,  ph: 5.3,  clay:  7.0, altitude:  65.7, slope: 0.1887, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  45, field: "Site 045", region: "Coastal Valley",  organicCarbon: 0.8,   ph: 4.7,  clay:  8.0, altitude:  72.8, slope: 0.1287, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  46, field: "Site 046", region: "Coastal Valley",  organicCarbon: 1.1,   ph: 6.6,  clay:  6.0, altitude:  63.2, slope: 0.1113, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  47, field: "Site 047", region: "Coastal Valley",  organicCarbon: 1.21,  ph: 5.9,  clay:  7.0, altitude:  62.4, slope: 0.0575, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  48, field: "Site 048", region: "Coastal Valley",  organicCarbon: 1.02,  ph: 6.0,  clay:  6.0, altitude:  62.8, slope: 0.0425, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  49, field: "Site 049", region: "Coastal Valley",  organicCarbon: 1.02,  ph: 6.1,  clay:  7.0, altitude:  62.0, slope: 0.0425, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  50, field: "Site 050", region: "Coastal Valley",  organicCarbon: 1.03,  ph: 4.8,  clay:  7.0, altitude:  62.0, slope: 0.0563, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  51, field: "Site 051", region: "Coastal Valley",  organicCarbon: 0.96,  ph: 6.7,  clay: 11.0, altitude:  73.9, slope: 0.1025, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  52, field: "Site 052", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 6.6,  clay:  9.0, altitude:  62.9, slope: 0.0813, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  53, field: "Site 053", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 7.2,  clay: 10.0, altitude:  63.1, slope: 0.0675, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  54, field: "Site 054", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 7.0,  clay: 12.0, altitude:  61.9, slope: 0.19,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  55, field: "Site 055", region: "Coastal Plains",  organicCarbon: 1.6,   ph: 6.1,  clay: 15.0, altitude:  61.9, slope: 0.205,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  56, field: "Site 056", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 6.6,  clay: 11.0, altitude:  62.8, slope: 0.0112, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  57, field: "Site 057", region: "Coastal Plains",  organicCarbon: 1.4,   ph: 5.8,  clay: 13.0, altitude:  62.5, slope: 0.05,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  58, field: "Site 058", region: "Coastal Plains",  organicCarbon: 0.7,   ph: 5.4,  clay:  9.0, altitude:  62.8, slope: 0.1013, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  59, field: "Site 059", region: "Coastal Plains",  organicCarbon: 0.8,   ph: 5.3,  clay:  6.0, altitude:  63.3, slope: 0.0375, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  60, field: "Site 060", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 6.9,  clay: 12.0, altitude:  62.8, slope: 0.095,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  61, field: "Site 061", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 7.3,  clay: 14.0, altitude:  62.7, slope: 0.1087, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  62, field: "Site 062", region: "Coastal Plains",  organicCarbon: 2.2,   ph: 6.5,  clay: 17.0, altitude:  61.8, slope: 0.1438, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  63, field: "Site 063", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 7.0,  clay: 18.0, altitude:  62.7, slope: 0.1,    nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  64, field: "Site 064", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 6.1,  clay: 11.0, altitude:  62.7, slope: 0.0825, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  65, field: "Site 065", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 6.3,  clay: 11.0, altitude:  62.8, slope: 0.14,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  66, field: "Site 066", region: "Coastal Plains",  organicCarbon: 0.8,   ph: 5.3,  clay:  9.0, altitude:  63.3, slope: 0.1262, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  67, field: "Site 067", region: "Coastal Plains",  organicCarbon: 0.9,   ph: 5.8,  clay:  9.0, altitude:  63.3, slope: 0.0788, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  68, field: "Site 068", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 5.6,  clay: 12.0, altitude:  62.5, slope: 0.0775, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  69, field: "Site 069", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 6.9,  clay: 12.0, altitude:  62.8, slope: 0.0512, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  70, field: "Site 070", region: "Coastal Plains",  organicCarbon: 1.7,   ph: 5.9,  clay: 12.0, altitude:  62.5, slope: 0.1575, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  71, field: "Site 071", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 6.6,  clay: 15.0, altitude:  62.6, slope: 0.1375, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  72, field: "Site 072", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 6.5,  clay: 17.0, altitude:  62.9, slope: 0.065,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  73, field: "Site 073", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 6.0,  clay: 14.0, altitude:  63.0, slope: 0.11,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  74, field: "Site 074", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 5.6,  clay:  9.0, altitude:  63.6, slope: 0.1687, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  75, field: "Site 075", region: "Coastal Plains",  organicCarbon: 0.7,   ph: 5.2,  clay:  8.0, altitude:  63.7, slope: 0.12,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  76, field: "Site 076", region: "Coastal Plains",  organicCarbon: 1.6,   ph: 5.6,  clay: 12.0, altitude:  62.5, slope: 0.0538, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  77, field: "Site 077", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 5.8,  clay: 13.0, altitude:  62.8, slope: 0.0575, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  78, field: "Site 078", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 6.5,  clay: 15.0, altitude:  62.8, slope: 0.0763, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  79, field: "Site 079", region: "Coastal Plains",  organicCarbon: 1.0,   ph: 5.8,  clay: 12.0, altitude:  63.0, slope: 0.04,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  80, field: "Site 080", region: "Coastal Plains",  organicCarbon: 0.9,   ph: 5.6,  clay: 11.0, altitude:  63.2, slope: 0.095,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  81, field: "Site 081", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 6.4,  clay: 14.0, altitude:  62.7, slope: 0.0875, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  82, field: "Site 082", region: "Coastal Plains",  organicCarbon: 1.4,   ph: 5.8,  clay: 12.0, altitude:  62.6, slope: 0.11,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  83, field: "Site 083", region: "Coastal Plains",  organicCarbon: 1.0,   ph: 5.7,  clay:  8.0, altitude:  63.0, slope: 0.1162, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  84, field: "Site 084", region: "Coastal Plains",  organicCarbon: 1.4,   ph: 5.9,  clay: 11.0, altitude:  62.7, slope: 0.1062, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  85, field: "Site 085", region: "Coastal Plains",  organicCarbon: 1.4,   ph: 5.5,  clay: 10.0, altitude:  63.0, slope: 0.1437, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  86, field: "Site 086", region: "Coastal Plains",  organicCarbon: 0.0,   ph: 5.9,  clay:  9.0, altitude:  63.3, slope: 0.0738, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  87, field: "Site 087", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 6.1,  clay: 14.0, altitude:  62.9, slope: 0.085,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  88, field: "Site 088", region: "Coastal Plains",  organicCarbon: 1.0,   ph: 5.8,  clay: 10.0, altitude:  63.3, slope: 0.1675, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  89, field: "Site 089", region: "Coastal Plains",  organicCarbon: 1.4,   ph: 6.1,  clay: 11.0, altitude:  62.8, slope: 0.0938, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  90, field: "Site 090", region: "Coastal Plains",  organicCarbon: 1.0,   ph: 6.0,  clay: 11.0, altitude:  63.4, slope: 0.1162, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  91, field: "Site 091", region: "Coastal Plains",  organicCarbon: 0.9,   ph: 5.7,  clay: 10.0, altitude:  63.3, slope: 0.1462, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  92, field: "Site 092", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 6.3,  clay: 12.0, altitude:  63.0, slope: 0.1125, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  93, field: "Site 093", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 6.7,  clay: 15.0, altitude:  62.9, slope: 0.1,    nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  94, field: "Site 094", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 5.5,  clay: 10.0, altitude:  63.3, slope: 0.175,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  95, field: "Site 095", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 6.0,  clay: 10.0, altitude:  63.4, slope: 0.15,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  96, field: "Site 096", region: "Coastal Plains",  organicCarbon: 0.9,   ph: 6.2,  clay:  8.0, altitude:  63.5, slope: 0.1812, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  97, field: "Site 097", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 6.5,  clay: 14.0, altitude:  62.7, slope: 0.0838, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  98, field: "Site 098", region: "Coastal Plains",  organicCarbon: 1.0,   ph: 5.3,  clay: 10.0, altitude:  63.4, slope: 0.1625, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id:  99, field: "Site 099", region: "Coastal Plains",  organicCarbon: 0.9,   ph: 5.8,  clay: 10.0, altitude:  63.5, slope: 0.1475, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 100, field: "Site 100", region: "Coastal Plains",  organicCarbon: 1.0,   ph: 6.3,  clay: 11.0, altitude:  63.0, slope: 0.1162, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 101, field: "Site 101", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 6.6,  clay: 13.0, altitude:  62.8, slope: 0.0838, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 102, field: "Site 102", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 6.5,  clay: 12.0, altitude:  62.9, slope: 0.0975, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 103, field: "Site 103", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 7.0,  clay: 14.0, altitude:  62.8, slope: 0.0913, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 104, field: "Site 104", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 7.1,  clay: 12.0, altitude:  63.1, slope: 0.0637, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 105, field: "Site 105", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 7.2,  clay: 12.0, altitude:  63.0, slope: 0.0838, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 106, field: "Site 106", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 7.2,  clay: 12.0, altitude:  63.0, slope: 0.0888, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 107, field: "Site 107", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 5.9,  clay: 13.0, altitude:  63.2, slope: 0.1125, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 108, field: "Site 108", region: "Coastal Plains",  organicCarbon: 1.0,   ph: 5.4,  clay: 10.0, altitude:  63.4, slope: 0.1475, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 109, field: "Site 109", region: "Coastal Plains",  organicCarbon: 1.0,   ph: 5.6,  clay: 10.0, altitude:  63.3, slope: 0.155,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 110, field: "Site 110", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 6.2,  clay: 13.0, altitude:  62.9, slope: 0.1062, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 111, field: "Site 111", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 6.8,  clay: 15.0, altitude:  62.7, slope: 0.0713, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 112, field: "Site 112", region: "Coastal Plains",  organicCarbon: 1.5,   ph: 5.9,  clay: 12.0, altitude:  62.7, slope: 0.1,    nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 113, field: "Site 113", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 5.8,  clay: 11.0, altitude:  63.3, slope: 0.145,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 114, field: "Site 114", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 6.3,  clay: 12.0, altitude:  63.0, slope: 0.0875, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 115, field: "Site 115", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 6.0,  clay: 11.0, altitude:  63.4, slope: 0.1387, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 116, field: "Site 116", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 6.9,  clay: 13.0, altitude:  63.0, slope: 0.075,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 117, field: "Site 117", region: "Coastal Plains",  organicCarbon: 0.9,   ph: 6.1,  clay: 10.0, altitude:  63.2, slope: 0.1475, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 118, field: "Site 118", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 6.0,  clay: 12.0, altitude:  63.1, slope: 0.095,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 119, field: "Site 119", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 6.7,  clay: 14.0, altitude:  62.9, slope: 0.0813, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 120, field: "Site 120", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 6.8,  clay: 15.0, altitude:  62.7, slope: 0.075,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 121, field: "Site 121", region: "Coastal Plains",  organicCarbon: 1.3,   ph: 7.1,  clay: 15.0, altitude:  62.8, slope: 0.075,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 122, field: "Site 122", region: "Coastal Plains",  organicCarbon: 1.1,   ph: 5.9,  clay: 11.0, altitude:  63.0, slope: 0.1312, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 123, field: "Site 123", region: "Coastal Plains",  organicCarbon: 1.2,   ph: 6.4,  clay: 14.0, altitude:  62.8, slope: 0.1,    nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 124, field: "Site 124", region: "Coastal Plains",  organicCarbon: 0.9,   ph: 5.6,  clay:  9.0, altitude:  63.4, slope: 0.1362, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 125, field: "Site 125", region: "Highland Ridge",  organicCarbon: 0.87,  ph: 5.82, clay: 21.7, altitude: 794.1, slope: 0.5406, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 126, field: "Site 126", region: "Highland Ridge",  organicCarbon: 1.221, ph: 5.99, clay: 26.5, altitude: 794.2, slope: 0.4939, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 127, field: "Site 127", region: "Highland Ridge",  organicCarbon: 1.343, ph: 6.22, clay: 26.0, altitude: 795.0, slope: 0.7553, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 128, field: "Site 128", region: "Highland Ridge",  organicCarbon: 1.645, ph: 6.2,  clay: 27.2, altitude: 795.6, slope: 0.5481, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 129, field: "Site 129", region: "Highland Ridge",  organicCarbon: 1.47,  ph: 6.22, clay: 30.2, altitude: 795.3, slope: 0.6064, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 130, field: "Site 130", region: "Highland Ridge",  organicCarbon: 1.192, ph: 6.44, clay: 24.2, altitude: 797.0, slope: 0.5658, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 131, field: "Site 131", region: "Highland Ridge",  organicCarbon: 1.378, ph: 6.36, clay: 29.0, altitude: 797.5, slope: 0.3927, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 132, field: "Site 132", region: "Highland Ridge",  organicCarbon: 1.261, ph: 6.49, clay: 29.9, altitude: 798.8, slope: 0.3813, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 133, field: "Site 133", region: "Highland Ridge",  organicCarbon: 1.215, ph: 6.48, clay: 27.4, altitude: 800.1, slope: 0.4395, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 134, field: "Site 134", region: "Highland Ridge",  organicCarbon: 1.47,  ph: 6.28, clay: 32.1, altitude: 800.7, slope: 0.4474, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 135, field: "Site 135", region: "Highland Ridge",  organicCarbon: 1.645, ph: 6.5,  clay: 33.0, altitude: 800.8, slope: 0.6081, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 136, field: "Site 136", region: "Highland Ridge",  organicCarbon: 1.64,  ph: 6.28, clay: 30.1, altitude: 801.2, slope: 0.5569, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 137, field: "Site 137", region: "Highland Ridge",  organicCarbon: 1.314, ph: 6.32, clay: 28.3, altitude: 801.5, slope: 0.6057, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 138, field: "Site 138", region: "Highland Ridge",  organicCarbon: 1.645, ph: 6.51, clay: 33.8, altitude: 801.9, slope: 0.5547, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 139, field: "Site 139", region: "Highland Ridge",  organicCarbon: 1.343, ph: 6.37, clay: 28.3, altitude: 802.0, slope: 0.5832, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 140, field: "Site 140", region: "Highland Ridge",  organicCarbon: 1.395, ph: 6.37, clay: 32.6, altitude: 802.3, slope: 0.3713, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 141, field: "Site 141", region: "Highland Ridge",  organicCarbon: 1.779, ph: 6.22, clay: 40.2, altitude: 801.6, slope: 0.5524, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 142, field: "Site 142", region: "Highland Ridge",  organicCarbon: 1.576, ph: 6.37, clay: 37.3, altitude: 801.0, slope: 0.5557, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 143, field: "Site 143", region: "Highland Ridge",  organicCarbon: 1.401, ph: 6.49, clay: 33.6, altitude: 800.8, slope: 0.4916, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 144, field: "Site 144", region: "Highland Ridge",  organicCarbon: 1.401, ph: 6.35, clay: 33.8, altitude: 800.8, slope: 0.461,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 145, field: "Site 145", region: "Highland Ridge",  organicCarbon: 1.488, ph: 6.24, clay: 34.8, altitude: 800.4, slope: 0.5892, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 146, field: "Site 146", region: "Highland Ridge",  organicCarbon: 1.41,  ph: 6.54, clay: 35.0, altitude: 801.3, slope: 0.5073, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 147, field: "Site 147", region: "Highland Ridge",  organicCarbon: 1.453, ph: 6.31, clay: 37.4, altitude: 802.8, slope: 0.4705, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 148, field: "Site 148", region: "Highland Ridge",  organicCarbon: 1.691, ph: 6.42, clay: 39.6, altitude: 804.6, slope: 0.612,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 149, field: "Site 149", region: "Highland Ridge",  organicCarbon: 1.488, ph: 6.29, clay: 35.8, altitude: 807.4, slope: 0.6835, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 150, field: "Site 150", region: "Highland Ridge",  organicCarbon: 1.75,  ph: 6.33, clay: 34.2, altitude: 807.6, slope: 0.6476, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 151, field: "Site 151", region: "Highland Ridge",  organicCarbon: 1.459, ph: 6.18, clay: 40.0, altitude: 810.2, slope: 0.59,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 152, field: "Site 152", region: "Highland Ridge",  organicCarbon: 1.988, ph: 6.32, clay: 43.7, altitude: 811.3, slope: 0.4963, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 153, field: "Site 153", region: "Highland Ridge",  organicCarbon: 1.953, ph: 6.21, clay: 53.1, altitude: 813.3, slope: 0.2898, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 154, field: "Site 154", region: "Highland Ridge",  organicCarbon: 2.209, ph: 6.32, clay: 40.4, altitude: 812.3, slope: 0.62,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 155, field: "Site 155", region: "Highland Ridge",  organicCarbon: 2.064, ph: 6.28, clay: 37.0, altitude: 810.1, slope: 0.5571, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 156, field: "Site 156", region: "Highland Ridge",  organicCarbon: 1.634, ph: 6.34, clay: 43.2, altitude: 806.9, slope: 0.6708, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 157, field: "Site 157", region: "Highland Ridge",  organicCarbon: 1.523, ph: 6.51, clay: 26.0, altitude: 806.6, slope: 0.5392, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 158, field: "Site 158", region: "Highland Ridge",  organicCarbon: 1.599, ph: 6.25, clay: 34.8, altitude: 804.8, slope: 0.5679, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 159, field: "Site 159", region: "Highland Ridge",  organicCarbon: 1.378, ph: 6.2,  clay: 28.6, altitude: 803.6, slope: 0.644,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 160, field: "Site 160", region: "Highland Ridge",  organicCarbon: 1.523, ph: 6.28, clay: 35.9, altitude: 804.8, slope: 0.6973, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 161, field: "Site 161", region: "Highland Ridge",  organicCarbon: 1.797, ph: 6.35, clay: 45.6, altitude: 804.8, slope: 0.7013, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 162, field: "Site 162", region: "Highland Ridge",  organicCarbon: 1.634, ph: 6.48, clay: 36.1, altitude: 805.0, slope: 0.6062, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 163, field: "Site 163", region: "Highland Ridge",  organicCarbon: 1.727, ph: 6.38, clay: 36.3, altitude: 806.1, slope: 0.7207, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 164, field: "Site 164", region: "Highland Ridge",  organicCarbon: 1.814, ph: 6.15, clay: 38.5, altitude: 808.8, slope: 0.8565, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 165, field: "Site 165", region: "Highland Ridge",  organicCarbon: 1.762, ph: 6.1,  clay: 43.3, altitude: 805.0, slope: 0.7616, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 166, field: "Site 166", region: "Highland Ridge",  organicCarbon: 1.547, ph: 6.15, clay: 36.2, altitude: 803.3, slope: 0.5076, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 167, field: "Site 167", region: "Highland Ridge",  organicCarbon: 1.622, ph: 6.28, clay: 36.0, altitude: 802.3, slope: 0.5905, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 168, field: "Site 168", region: "Highland Ridge",  organicCarbon: 1.855, ph: 6.45, clay: 40.6, altitude: 802.4, slope: 0.6149, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 169, field: "Site 169", region: "Highland Ridge",  organicCarbon: 1.709, ph: 6.2,  clay: 39.1, altitude: 801.4, slope: 0.5202, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 170, field: "Site 170", region: "Highland Ridge",  organicCarbon: 1.227, ph: 6.37, clay: 30.5, altitude: 802.8, slope: 0.5319, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 171, field: "Site 171", region: "Highland Ridge",  organicCarbon: 1.349, ph: 6.29, clay: 35.0, altitude: 803.2, slope: 0.469,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 172, field: "Site 172", region: "Highland Ridge",  organicCarbon: 1.727, ph: 6.3,  clay: 42.3, altitude: 805.0, slope: 0.5321, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 173, field: "Site 173", region: "Highland Ridge",  organicCarbon: 1.733, ph: 6.2,  clay: 43.9, altitude: 806.5, slope: 0.3855, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 174, field: "Site 174", region: "Highland Ridge",  organicCarbon: 1.424, ph: 6.54, clay: 36.7, altitude: 809.3, slope: 1.0133, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 175, field: "Site 175", region: "Highland Ridge",  organicCarbon: 1.448, ph: 6.34, clay: 34.6, altitude: 812.1, slope: 0.5222, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 176, field: "Site 176", region: "Highland Ridge",  organicCarbon: 1.5,   ph: 6.34, clay: 25.3, altitude: 811.9, slope: 0.5765, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 177, field: "Site 177", region: "Highland Ridge",  organicCarbon: 1.302, ph: 6.6,  clay: 20.6, altitude: 808.4, slope: 0.6696, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 178, field: "Site 178", region: "Highland Ridge",  organicCarbon: 1.314, ph: 6.43, clay: 28.6, altitude: 806.2, slope: 0.4931, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 179, field: "Site 179", region: "Highland Ridge",  organicCarbon: 1.395, ph: 6.18, clay: 31.0, altitude: 803.9, slope: 0.6788, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 180, field: "Site 180", region: "Highland Ridge",  organicCarbon: 1.587, ph: 6.53, clay: 37.2, altitude: 801.8, slope: 0.2274, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 181, field: "Site 181", region: "Highland Ridge",  organicCarbon: 1.488, ph: 6.48, clay: 33.2, altitude: 800.8, slope: 0.3533, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 182, field: "Site 182", region: "Highland Ridge",  organicCarbon: 1.86,  ph: 6.83, clay: 38.3, altitude: 799.7, slope: 0.5099, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 183, field: "Site 183", region: "Highland Ridge",  organicCarbon: 2.86,  ph: 6.34, clay: 55.7, altitude: 800.3, slope: 0.5232, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 184, field: "Site 184", region: "Highland Ridge",  organicCarbon: 1.424, ph: 6.37, clay: 33.4, altitude: 800.7, slope: 0.3085, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 185, field: "Site 185", region: "Highland Ridge",  organicCarbon: 1.779, ph: 6.39, clay: 40.6, altitude: 801.6, slope: 0.6351, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 186, field: "Site 186", region: "Highland Ridge",  organicCarbon: 1.924, ph: 6.48, clay: 42.2, altitude: 803.9, slope: 0.7378, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 187, field: "Site 187", region: "Highland Ridge",  organicCarbon: 1.395, ph: 5.96, clay: 34.3, altitude: 801.1, slope: 0.6923, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 188, field: "Site 188", region: "Highland Ridge",  organicCarbon: 1.779, ph: 6.15, clay: 37.6, altitude: 800.0, slope: 0.6889, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 189, field: "Site 189", region: "Highland Ridge",  organicCarbon: 1.453, ph: 6.28, clay: 36.9, altitude: 798.4, slope: 0.536,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 190, field: "Site 190", region: "Highland Ridge",  organicCarbon: 1.576, ph: 6.33, clay: 36.7, altitude: 798.5, slope: 0.3022, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 191, field: "Site 191", region: "Highland Ridge",  organicCarbon: 1.773, ph: 6.3,  clay: 42.5, altitude: 798.6, slope: 0.1657, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 192, field: "Site 192", region: "Highland Ridge",  organicCarbon: 1.547, ph: 6.39, clay: 37.9, altitude: 799.8, slope: 0.3664, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 193, field: "Site 193", region: "Highland Ridge",  organicCarbon: 1.523, ph: 6.41, clay: 42.1, altitude: 801.3, slope: 0.5469, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 194, field: "Site 194", region: "Highland Ridge",  organicCarbon: 1.68,  ph: 6.6,  clay: 39.9, altitude: 803.6, slope: 0.748,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 195, field: "Site 195", region: "Highland Ridge",  organicCarbon: 1.221, ph: 6.71, clay: 26.7, altitude: 806.1, slope: 0.6965, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 196, field: "Site 196", region: "Highland Ridge",  organicCarbon: 1.436, ph: 6.68, clay: 22.1, altitude: 809.2, slope: 0.7656, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 197, field: "Site 197", region: "Highland Ridge",  organicCarbon: 1.227, ph: 6.23, clay: 23.9, altitude: 811.6, slope: 0.6927, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 198, field: "Site 198", region: "Highland Ridge",  organicCarbon: 1.157, ph: 6.62, clay: 23.4, altitude: 813.5, slope: 0.4743, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 199, field: "Site 199", region: "Highland Ridge",  organicCarbon: 1.314, ph: 6.47, clay: 21.3, altitude: 810.3, slope: 0.8833, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 200, field: "Site 200", region: "Highland Ridge",  organicCarbon: 1.401, ph: 6.5,  clay: 36.1, altitude: 806.9, slope: 0.7547, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 201, field: "Site 201", region: "Highland Ridge",  organicCarbon: 1.11,  ph: 6.57, clay: 36.9, altitude: 803.6, slope: 0.4599, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 202, field: "Site 202", region: "Highland Ridge",  organicCarbon: 1.384, ph: 6.56, clay: 36.7, altitude: 801.8, slope: 0.47,   nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 203, field: "Site 203", region: "Highland Ridge",  organicCarbon: 1.924, ph: 6.27, clay: 47.9, altitude: 800.1, slope: 0.3416, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 204, field: "Site 204", region: "Highland Ridge",  organicCarbon: 1.64,  ph: 6.44, clay: 39.9, altitude: 797.9, slope: 0.507,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 205, field: "Site 205", region: "Highland Ridge",  organicCarbon: 1.483, ph: 6.17, clay: 41.4, altitude: 797.0, slope: 0.3622, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 206, field: "Site 206", region: "Highland Ridge",  organicCarbon: 1.145, ph: 6.46, clay: 31.0, altitude: 796.4, slope: 0.5206, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 207, field: "Site 207", region: "Highland Ridge",  organicCarbon: 0.919, ph: 6.91, clay: 22.8, altitude: 797.4, slope: 0.6607, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 208, field: "Site 208", region: "Highland Ridge",  organicCarbon: 0.884, ph: 6.76, clay: 19.0, altitude: 795.3, slope: 0.4709, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 209, field: "Site 209", region: "Highland Ridge",  organicCarbon: 1.547, ph: 6.51, clay: 30.0, altitude: 795.2, slope: 0.3391, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 210, field: "Site 210", region: "Highland Ridge",  organicCarbon: 1.18,  ph: 6.46, clay: 33.6, altitude: 797.1, slope: 0.574,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 211, field: "Site 211", region: "Highland Ridge",  organicCarbon: 1.517, ph: 6.38, clay: 46.7, altitude: 799.1, slope: 0.2995, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 212, field: "Site 212", region: "Highland Ridge",  organicCarbon: 1.64,  ph: 6.49, clay: 51.8, altitude: 800.5, slope: 0.4213, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 213, field: "Site 213", region: "Highland Ridge",  organicCarbon: 1.279, ph: 6.16, clay: 42.3, altitude: 802.5, slope: 0.5067, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 214, field: "Site 214", region: "Highland Ridge",  organicCarbon: 1.174, ph: 6.47, clay: 36.6, altitude: 804.6, slope: 0.502,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 215, field: "Site 215", region: "Highland Ridge",  organicCarbon: 1.244, ph: 6.53, clay: 29.4, altitude: 807.5, slope: 0.9015, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 216, field: "Site 216", region: "Highland Ridge",  organicCarbon: 0.872, ph: 6.6,  clay: 22.3, altitude: 810.9, slope: 0.6301, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 217, field: "Site 217", region: "Highland Ridge",  organicCarbon: 1.006, ph: 6.7,  clay: 22.2, altitude: 812.0, slope: 0.413,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 218, field: "Site 218", region: "Highland Ridge",  organicCarbon: 1.343, ph: 6.72, clay: 29.3, altitude: 811.2, slope: 0.4226, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 219, field: "Site 219", region: "Highland Ridge",  organicCarbon: 1.267, ph: 6.53, clay: 30.6, altitude: 810.0, slope: 0.6827, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 220, field: "Site 220", region: "Highland Ridge",  organicCarbon: 1.523, ph: 6.51, clay: 36.2, altitude: 808.3, slope: 0.4135, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 221, field: "Site 221", region: "Highland Ridge",  organicCarbon: 1.256, ph: 6.56, clay: 36.5, altitude: 805.5, slope: 0.7742, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 222, field: "Site 222", region: "Highland Ridge",  organicCarbon: 1.285, ph: 6.6,  clay: 41.5, altitude: 802.7, slope: 0.6735, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 223, field: "Site 223", region: "Highland Ridge",  organicCarbon: 1.39,  ph: 6.4,  clay: 45.0, altitude: 800.9, slope: 0.3553, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 224, field: "Site 224", region: "Highland Ridge",  organicCarbon: 1.39,  ph: 6.06, clay: 46.6, altitude: 799.3, slope: 0.435,  nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 225, field: "Site 225", region: "Highland Ridge",  organicCarbon: 1.343, ph: 6.19, clay: 37.0, altitude: 796.8, slope: 0.9088, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 226, field: "Site 226", region: "Highland Ridge",  organicCarbon: 1.186, ph: 6.73, clay: 23.0, altitude: 794.3, slope: 0.7027, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
  { id: 227, field: "Site 227", region: "Highland Ridge",  organicCarbon: 1.523, ph: 6.56, clay: 39.4, altitude: 794.8, slope: 0.6407, nitrogen: null, phosphorus: null, potassium: null, moisture: null },
]

const round = (n: number, d = 1) => Number(n.toFixed(d))

function nullableAvg(data: SoilRecord[], key: keyof SoilRecord): number | null {
  const vals = data
    .map((r) => r[key] as number | null)
    .filter((v): v is number => v !== null && isFinite(v))
  return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : null
}

// ─── Soil Analysis Stats (no carbon credit calculations) ───────────────────────
export function getStats(data: SoilRecord[]) {
  const totalRecords = data.length

  const avgOrganicCarbon = nullableAvg(data, "organicCarbon")
  const avgPh            = nullableAvg(data, "ph")
  const avgClay          = nullableAvg(data, "clay")
  const avgAltitude      = nullableAvg(data, "altitude")
  const avgSlope         = nullableAvg(data, "slope")
  const avgNitrogen      = nullableAvg(data, "nitrogen")
  const avgPhosphorus    = nullableAvg(data, "phosphorus")
  const avgPotassium     = nullableAvg(data, "potassium")
  const avgMoisture      = nullableAvg(data, "moisture")

  // Soil Quality Score: dynamically weighted across available indicators
  const indicators = [
    { weight: 40, value: avgOrganicCarbon !== null ? Math.min(avgOrganicCarbon / 3, 1) : null },
    { weight: 25, value: avgPh !== null ? 1 - Math.min(Math.abs(avgPh - 6.5) / 2.5, 1) : null },
    { weight: 20, value: avgClay !== null
        ? avgClay < 20 ? avgClay / 20 : avgClay <= 45 ? 1 : Math.max(0, 1 - (avgClay - 45) / 20)
        : null },
    { weight: 10, value: avgSlope   !== null ? Math.max(0, 1 - avgSlope / 1.5)  : null },
    { weight: 5,  value: avgNitrogen!== null ? Math.min(avgNitrogen / 70, 1)    : null },
  ]
  const available   = indicators.filter((i) => i.value !== null)
  const totalWeight = available.reduce((s, i) => s + i.weight, 0)
  const soilQualityScore =
    totalWeight > 0
      ? Math.round((available.reduce((s, i) => s + i.value! * i.weight, 0) / totalWeight) * 100)
      : 0

  return {
    totalRecords,
    avgOrganicCarbon: avgOrganicCarbon !== null ? round(avgOrganicCarbon, 2) : null,
    avgPh:            avgPh            !== null ? round(avgPh, 2)            : null,
    avgClay:          avgClay          !== null ? round(avgClay, 1)          : null,
    avgAltitude:      avgAltitude      !== null ? round(avgAltitude, 1)      : null,
    avgSlope:         avgSlope         !== null ? round(avgSlope, 4)         : null,
    avgNitrogen:      avgNitrogen      !== null ? round(avgNitrogen)         : null,
    avgPhosphorus:    avgPhosphorus    !== null ? round(avgPhosphorus)       : null,
    avgPotassium:     avgPotassium     !== null ? round(avgPotassium)        : null,
    avgMoisture:      avgMoisture      !== null ? round(avgMoisture)         : null,
    soilQualityScore,
  }
}

// ─── Carbon Credit Simulator Stats ────────────────────────────────────────────
// Formula: Carbon Stock (tC) = avgSOC% × farmArea × (soilDepth / 30)
//          Carbon Credits (tCO₂e) = Carbon Stock × 3.67
export function getSimulatorStats(data: SoilRecord[], farmArea: number, soilDepth: number) {
  const avgSOC = nullableAvg(data, "organicCarbon") ?? 0
  const carbonStock   = round(avgSOC * farmArea * (soilDepth / 30), 2)
  const carbonCredits = round(carbonStock * 3.67, 2)
  const co2Equivalent = carbonCredits
  return {
    avgSOC:       round(avgSOC, 2),
    carbonStock,
    carbonCredits,
    co2Equivalent,
  }
}

export type Recommendation = {
  title: string
  description: string
  impact: "Low" | "Medium" | "High"
}

export function getRecommendations(stats: ReturnType<typeof getStats>): Recommendation[] {
  const recs: Recommendation[] = []
  const soc = stats.avgOrganicCarbon

  // SOC level classification (High ≥ 2.5%, Moderate 1.0–2.5%, Low < 1.0%)
  if (soc === null || soc < 1.0) {
    recs.push({
      title: "Apply organic amendments",
      description:
        "Low SOC (< 1%) signals limited carbon storage. Apply compost, manure, or biochar to rapidly increase organic matter and unlock sequestration potential.",
      impact: "High",
    })
    recs.push({
      title: "Switch to reduced or no-till",
      description:
        "Tillage destroys soil aggregates and releases stored carbon. No-till or strip-till preserves SOC and improves long-term credit potential.",
      impact: "High",
    })
  } else if (soc < 2.5) {
    recs.push({
      title: "Adopt composting practices",
      description:
        "Moderate SOC (1–2.5%). Regularly adding quality compost feeds soil microbes and steadily builds organic carbon over multiple seasons.",
      impact: "Medium",
    })
    recs.push({
      title: "Establish cover crops",
      description:
        "Cover crops protect bare soil between seasons, fix nitrogen, and continuously donate biomass that microbes convert to stable humus.",
      impact: "Medium",
    })
  } else {
    recs.push({
      title: "Maintain current management practices",
      description:
        "High SOC (≥ 2.5%) — your soil is storing carbon effectively. Continue current practices and document them to support carbon credit verification.",
      impact: "Low",
    })
  }

  // pH
  if (stats.avgPh !== null && stats.avgPh < 5.5) {
    recs.push({
      title: "Apply lime to correct soil acidity",
      description:
        `Average pH ${stats.avgPh} is below 5.5. Lime application improves nutrient availability and supports the microbial activity essential for carbon cycling.`,
      impact: "High",
    })
  }

  // Clay
  if (stats.avgClay !== null && stats.avgClay < 15) {
    recs.push({
      title: "Improve soil structure with organic inputs",
      description:
        "Low clay content limits water retention and carbon stabilisation. Incorporating compost and green manures builds aggregation over time.",
      impact: "Medium",
    })
  } else if (stats.avgClay !== null && stats.avgClay > 50) {
    recs.push({
      title: "Address drainage in high-clay soils",
      description:
        "Very high clay content causes waterlogging that impedes root growth and SOC decomposition. Subsoil drainage and gypsum applications will improve conditions.",
      impact: "Medium",
    })
  }

  // Slope
  if (stats.avgSlope !== null && stats.avgSlope > 0.4) {
    recs.push({
      title: "Implement erosion control on sloped areas",
      description:
        "Elevated slope increases erosion risk and SOC losses. Contour ploughing, grass buffer strips, and cover crops protect carbon and reduce runoff.",
      impact: stats.avgSlope > 0.7 ? "High" : "Medium",
    })
  }

  return recs
}
