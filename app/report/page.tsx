"use client"

import { useMemo } from "react"
import {
  Download,
  Database,
  Sprout,
  Coins,
  Gauge,
  Cloud,
  FileText,
  CheckCircle2,
} from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { StatGrid } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { getStats, getRecommendations, type SoilRecord } from "@/lib/soil-data"
import { useSoil } from "@/lib/soil-context"

function downloadCSV(soilData: SoilRecord[], stats: ReturnType<typeof getStats>, farmArea: number) {
  const header = "Field,Region,Organic Carbon (%),Nitrogen (ppm),Phosphorus (ppm),Potassium (ppm),pH,Moisture (%),Est. Credits (t)"
  const rows = soilData.map((r) => {
    const credits = Number((r.organicCarbon * farmArea * 0.8).toFixed(2))
    return [r.field, r.region, r.organicCarbon, r.nitrogen, r.phosphorus, r.potassium, r.ph, r.moisture, credits].join(",")
  })
  const summary = [
    "",
    "REPORT SUMMARY",
    `Total Records,${stats.totalRecords}`,
    `Avg Organic Carbon (%),${stats.avgOrganicCarbon}`,
    `Avg Nitrogen (ppm),${stats.avgNitrogen}`,
    `Avg Phosphorus (ppm),${stats.avgPhosphorus}`,
    `Avg Potassium (ppm),${stats.avgPotassium}`,
    `Avg pH,${stats.avgPh}`,
    `Avg Moisture (%),${stats.avgMoisture}`,
    `Farm Area (ha),${farmArea}`,
    `Total Carbon Credits (t),${stats.carbonCredits}`,
    `CO2 Offset (t),${stats.co2Offset}`,
    `Sustainability Score,${stats.sustainabilityScore}/100`,
  ]
  const csv = [header, ...rows, ...summary].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `carbon-report-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReportPage() {
  const { soilData, isUploadedData, farmArea } = useSoil()
  const stats = useMemo(() => getStats(soilData, farmArea), [soilData, farmArea])
  const recommendations = useMemo(() => getRecommendations(stats), [stats])

  const statItems = [
    {
      label: "Records Analyzed",
      value: String(stats.totalRecords),
      hint: isUploadedData ? "from uploaded CSV" : "soil samples",
      icon: Database,
    },
    {
      label: "Avg Organic Carbon",
      value: `${stats.avgOrganicCarbon}%`,
      hint: "across all fields",
      icon: Sprout,
    },
    {
      label: "Carbon Credits",
      value: `${stats.carbonCredits} t`,
      hint: `${farmArea} ha · OC × area × 0.8`,
      icon: Coins,
    },
    {
      label: "CO₂ Offset",
      value: `${stats.co2Offset} t`,
      hint: "equivalent",
      icon: Cloud,
    },
  ]

  return (
    <PageShell>
      <PageHeading
        eyebrow="Report"
        title="Executive Report Summary"
        description="A consolidated overview of soil analysis, carbon credit estimates, and key sustainability findings."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="size-4 text-primary" />
            {isUploadedData
              ? `${soilData.length} records from uploaded CSV · Farm area: ${farmArea} ha`
              : `Sample dataset · Farm area: ${farmArea} ha`}
          </div>
          <Button onClick={() => downloadCSV(soilData, stats, farmArea)}>
            <Download className="size-4" />
            Download CSV Report
          </Button>
        </div>

        {/* Stat cards */}
        <StatGrid items={statItems} />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Executive summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Analysis of{" "}
                <span className="font-medium text-foreground">{stats.totalRecords} soil samples</span>{" "}
                shows an average organic carbon content of{" "}
                <span className="font-medium text-foreground">{stats.avgOrganicCarbon}%</span> and
                an overall sustainability score of{" "}
                <span className="font-medium text-foreground">{stats.sustainabilityScore}/100</span>.
                Based on the {farmArea}-hectare farm area, the land has an estimated potential of{" "}
                <span className="font-medium text-foreground">{stats.carbonCredits} carbon credits</span>,
                equivalent to offsetting{" "}
                <span className="font-medium text-foreground">{stats.co2Offset} tonnes</span> of CO₂.
              </p>
              <p>
                Nutrient levels average {stats.avgNitrogen} ppm nitrogen, {stats.avgPhosphorus} ppm
                phosphorus, and {stats.avgPotassium} ppm potassium, with a mean soil pH of{" "}
                {stats.avgPh}. These indicators suggest{" "}
                {stats.sustainabilityScore >= 70
                  ? "healthy, well-managed soils"
                  : "soils with meaningful room for improvement"}
                , with the greatest opportunity in raising organic matter to lift both yield
                resilience and carbon sequestration.
              </p>

              <Separator />

              <div>
                <p className="font-medium text-foreground">Key Insights</p>
                <ul className="mt-2 space-y-2">
                  {[
                    `Organic carbon of ${stats.avgOrganicCarbon}% drives the bulk of credit potential.`,
                    `Sustainability score of ${stats.sustainabilityScore}/100 — ${stats.sustainabilityScore >= 70 ? "above-average baseline" : "targeted improvements recommended"}.`,
                    `${recommendations.length} prioritised recommendations identified.`,
                    `Estimated ${stats.carbonCredits} t of tradeable credits at current conditions.`,
                  ].map((insight) => (
                    <li key={insight} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Nutrient breakdown grid */}
              <div>
                <p className="font-medium text-foreground">Soil Averages</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    { label: "Org. Carbon", value: `${stats.avgOrganicCarbon}%` },
                    { label: "Nitrogen", value: `${stats.avgNitrogen} ppm` },
                    { label: "Phosphorus", value: `${stats.avgPhosphorus} ppm` },
                    { label: "Potassium", value: `${stats.avgPotassium} ppm` },
                    { label: "pH", value: String(stats.avgPh) },
                    { label: "Moisture", value: `${stats.avgMoisture}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-secondary/50 px-3 py-2.5">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="mt-0.5 font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Gauge className="size-5 text-primary" />
                  Sustainability Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold tracking-tight">
                  {stats.sustainabilityScore}
                  <span className="text-lg text-muted-foreground">/100</span>
                </p>
                <Progress value={stats.sustainabilityScore} className="mt-4" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Weighted across organic carbon, nutrients, moisture, and pH balance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-base">Carbon Credit Recap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-3xl font-semibold">{stats.carbonCredits} t</p>
                <p className="text-sm text-primary-foreground/80">
                  {stats.avgOrganicCarbon}% × {farmArea} ha × 0.8 factor
                </p>
              </CardContent>
            </Card>

            {/* Top recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations
                  .sort((a, b) =>
                    a.impact === "High" ? -1 : b.impact === "High" ? 1 : 0,
                  )
                  .slice(0, 3)
                  .map((rec) => (
                    <div key={rec.title} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-1.5 size-2 shrink-0 rounded-full ${
                          rec.impact === "High"
                            ? "bg-primary"
                            : rec.impact === "Medium"
                              ? "bg-yellow-500"
                              : "bg-muted-foreground/40"
                        }`}
                      />
                      <span className="text-muted-foreground leading-snug">{rec.title}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
