export type SoilRecord = {
  id: number
  field: string
  region: string
  organicCarbon: number // %
  nitrogen: number // ppm
  phosphorus: number // ppm
  potassium: number // ppm
  ph: number
  moisture: number // %
}

// Realistic sample soil dataset used until CSV upload is connected.
export const sampleSoilData: SoilRecord[] = [
  { id: 1, field: "North Meadow", region: "Midwest", organicCarbon: 2.4, nitrogen: 42, phosphorus: 28, potassium: 180, ph: 6.5, moisture: 24 },
  { id: 2, field: "Riverside Plot", region: "Midwest", organicCarbon: 3.1, nitrogen: 55, phosphorus: 33, potassium: 210, ph: 6.8, moisture: 29 },
  { id: 3, field: "Hilltop Acre", region: "Plains", organicCarbon: 1.8, nitrogen: 31, phosphorus: 19, potassium: 150, ph: 6.1, moisture: 18 },
  { id: 4, field: "South Bend", region: "Plains", organicCarbon: 2.9, nitrogen: 48, phosphorus: 30, potassium: 195, ph: 6.7, moisture: 26 },
  { id: 5, field: "Willow Creek", region: "Valley", organicCarbon: 3.6, nitrogen: 62, phosphorus: 38, potassium: 240, ph: 7.0, moisture: 33 },
  { id: 6, field: "Cedar Flats", region: "Valley", organicCarbon: 2.2, nitrogen: 39, phosphorus: 24, potassium: 168, ph: 6.4, moisture: 22 },
  { id: 7, field: "Eastfield", region: "Coastal", organicCarbon: 2.7, nitrogen: 45, phosphorus: 29, potassium: 188, ph: 6.6, moisture: 27 },
  { id: 8, field: "Maple Ridge", region: "Coastal", organicCarbon: 3.3, nitrogen: 58, phosphorus: 35, potassium: 222, ph: 6.9, moisture: 31 },
  { id: 9, field: "Dry Gulch", region: "Plains", organicCarbon: 1.5, nitrogen: 26, phosphorus: 16, potassium: 132, ph: 5.9, moisture: 14 },
  { id: 10, field: "Golden Acres", region: "Midwest", organicCarbon: 2.8, nitrogen: 50, phosphorus: 31, potassium: 200, ph: 6.7, moisture: 28 },
  { id: 11, field: "Birch Hollow", region: "Valley", organicCarbon: 3.9, nitrogen: 66, phosphorus: 41, potassium: 255, ph: 7.1, moisture: 35 },
  { id: 12, field: "Sunset Field", region: "Coastal", organicCarbon: 2.5, nitrogen: 43, phosphorus: 27, potassium: 178, ph: 6.5, moisture: 25 },
  { id: 13, field: "Pine Barren", region: "Plains", organicCarbon: 1.7, nitrogen: 29, phosphorus: 18, potassium: 145, ph: 6.0, moisture: 16 },
  { id: 14, field: "Clover Patch", region: "Midwest", organicCarbon: 3.0, nitrogen: 53, phosphorus: 32, potassium: 205, ph: 6.8, moisture: 30 },
  { id: 15, field: "Lakeview", region: "Valley", organicCarbon: 3.4, nitrogen: 60, phosphorus: 37, potassium: 230, ph: 7.0, moisture: 32 },
  { id: 16, field: "Stony Brook", region: "Coastal", organicCarbon: 2.1, nitrogen: 37, phosphorus: 23, potassium: 162, ph: 6.3, moisture: 21 },
  { id: 17, field: "High Plains", region: "Plains", organicCarbon: 1.9, nitrogen: 33, phosphorus: 20, potassium: 154, ph: 6.2, moisture: 19 },
  { id: 18, field: "Green Valley", region: "Valley", organicCarbon: 3.7, nitrogen: 64, phosphorus: 39, potassium: 248, ph: 7.1, moisture: 34 },
  { id: 19, field: "Oak Ridge", region: "Midwest", organicCarbon: 2.6, nitrogen: 46, phosphorus: 28, potassium: 184, ph: 6.6, moisture: 26 },
  { id: 20, field: "Harbor Farm", region: "Coastal", organicCarbon: 2.9, nitrogen: 51, phosphorus: 33, potassium: 208, ph: 6.8, moisture: 29 },
]

export const CARBON_CREDIT_FACTOR = 0.8

const round = (n: number, d = 1) => Number(n.toFixed(d))

export function getStats(data: SoilRecord[], farmArea: number) {
  const totalRecords = data.length
  const avgOrganicCarbon = totalRecords
    ? data.reduce((s, r) => s + r.organicCarbon, 0) / totalRecords
    : 0
  const carbonCredits = avgOrganicCarbon * farmArea * CARBON_CREDIT_FACTOR
  // CO2 offset: 1 carbon credit ~= 1 tonne of CO2 equivalent.
  const co2Offset = carbonCredits

  // Sustainability score (0-100) weighted across soil health indicators.
  const avgN = data.reduce((s, r) => s + r.nitrogen, 0) / (totalRecords || 1)
  const avgMoisture = data.reduce((s, r) => s + r.moisture, 0) / (totalRecords || 1)
  const avgPh = data.reduce((s, r) => s + r.ph, 0) / (totalRecords || 1)
  const carbonScore = Math.min(avgOrganicCarbon / 4, 1) * 45
  const nutrientScore = Math.min(avgN / 70, 1) * 25
  const moistureScore = Math.min(avgMoisture / 35, 1) * 15
  const phScore = (1 - Math.min(Math.abs(avgPh - 6.8) / 2, 1)) * 15
  const sustainabilityScore = Math.round(carbonScore + nutrientScore + moistureScore + phScore)

  return {
    totalRecords,
    avgOrganicCarbon: round(avgOrganicCarbon, 2),
    carbonCredits: round(carbonCredits, 1),
    co2Offset: round(co2Offset, 1),
    sustainabilityScore,
    avgNitrogen: round(avgN),
    avgPhosphorus: round(data.reduce((s, r) => s + r.phosphorus, 0) / (totalRecords || 1)),
    avgPotassium: round(data.reduce((s, r) => s + r.potassium, 0) / (totalRecords || 1)),
    avgMoisture: round(avgMoisture),
    avgPh: round(avgPh, 1),
  }
}

export type Recommendation = {
  title: string
  description: string
  impact: "Low" | "Medium" | "High"
}

export function getRecommendations(stats: ReturnType<typeof getStats>): Recommendation[] {
  const recs: Recommendation[] = []

  if (stats.avgOrganicCarbon < 3) {
    recs.push({
      title: "Increase organic matter through composting",
      description:
        "Average organic carbon is below the 3% target. Apply compost and organic amendments to build soil carbon and boost credit potential.",
      impact: "High",
    })
  }
  recs.push({
    title: "Consider cover cropping practices",
    description:
      "Plant legumes and grasses between cash crops to fix nitrogen, protect topsoil, and sequester additional carbon year-round.",
    impact: stats.avgNitrogen < 45 ? "High" : "Medium",
  })
  recs.push({
    title: "Reduce excessive tillage",
    description:
      "Adopt no-till or reduced-till methods to preserve soil structure, retain moisture, and keep sequestered carbon locked in the ground.",
    impact: "Medium",
  })
  recs.push({
    title: "Improve nutrient management strategies",
    description:
      "Balance nitrogen, phosphorus, and potassium applications based on soil test results to optimize yield while limiting runoff.",
    impact: stats.avgPhosphorus < 25 ? "High" : "Low",
  })
  if (stats.avgPh < 6.2) {
    recs.push({
      title: "Apply lime to correct soil acidity",
      description:
        "Soil pH is trending acidic. Targeted lime application will improve nutrient availability and microbial activity.",
      impact: "Medium",
    })
  }
  return recs
}

export const carbonTrend = [
  { month: "Jan", organicCarbon: 2.1 },
  { month: "Feb", organicCarbon: 2.2 },
  { month: "Mar", organicCarbon: 2.4 },
  { month: "Apr", organicCarbon: 2.5 },
  { month: "May", organicCarbon: 2.7 },
  { month: "Jun", organicCarbon: 2.8 },
  { month: "Jul", organicCarbon: 3.0 },
  { month: "Aug", organicCarbon: 3.1 },
  { month: "Sep", organicCarbon: 3.0 },
  { month: "Oct", organicCarbon: 2.9 },
  { month: "Nov", organicCarbon: 2.8 },
  { month: "Dec", organicCarbon: 2.7 },
]
