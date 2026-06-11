import { LineChart, BarChart3, PieChart } from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CarbonTrendChart,
  NutrientBarChart,
  SustainabilityPieChart,
} from "@/components/analytics-charts"
import { sampleSoilData, getStats } from "@/lib/soil-data"

function buildNutrientByRegion() {
  const map = new Map<string, { n: number; p: number; k: number; count: number }>()
  for (const r of sampleSoilData) {
    const e = map.get(r.region) ?? { n: 0, p: 0, k: 0, count: 0 }
    e.n += r.nitrogen
    e.p += r.phosphorus
    e.k += r.potassium
    e.count += 1
    map.set(r.region, e)
  }
  return Array.from(map.entries()).map(([region, e]) => ({
    region,
    nitrogen: Math.round(e.n / e.count),
    phosphorus: Math.round(e.p / e.count),
    potassium: Math.round(e.k / e.count),
  }))
}

function buildScoreDistribution() {
  // Per-field sustainability score using each record as a single-field dataset.
  const buckets = { excellent: 0, good: 0, fair: 0, poor: 0 }
  for (const r of sampleSoilData) {
    const { sustainabilityScore } = getStats([r], 1)
    if (sustainabilityScore >= 80) buckets.excellent += 1
    else if (sustainabilityScore >= 60) buckets.good += 1
    else if (sustainabilityScore >= 40) buckets.fair += 1
    else buckets.poor += 1
  }
  return [
    { key: "excellent", label: "Excellent (80+)", count: buckets.excellent },
    { key: "good", label: "Good (60-79)", count: buckets.good },
    { key: "fair", label: "Fair (40-59)", count: buckets.fair },
    { key: "poor", label: "Needs Work (<40)", count: buckets.poor },
  ].filter((b) => b.count > 0)
}

export default function AnalyticsPage() {
  const nutrientData = buildNutrientByRegion()
  const scoreData = buildScoreDistribution()

  return (
    <PageShell>
      <PageHeading
        eyebrow="Analytics"
        title="Soil & Sustainability Analytics"
        description="Visualize organic carbon trends, nutrient balances by region, and the distribution of sustainability scores across your fields."
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LineChart className="size-5 text-primary" />
              Organic Carbon Trend
            </CardTitle>
            <CardDescription>Monthly average soil organic carbon (%) over the year.</CardDescription>
          </CardHeader>
          <CardContent>
            <CarbonTrendChart />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="size-5 text-primary" />
                Nutrient Levels by Region
              </CardTitle>
              <CardDescription>Average Nitrogen, Phosphorus, and Potassium (ppm).</CardDescription>
            </CardHeader>
            <CardContent>
              <NutrientBarChart data={nutrientData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="size-5 text-primary" />
                Sustainability Score Distribution
              </CardTitle>
              <CardDescription>How fields are distributed across score bands.</CardDescription>
            </CardHeader>
            <CardContent>
              <SustainabilityPieChart data={scoreData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
