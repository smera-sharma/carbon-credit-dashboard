"use client"

import { useMemo } from "react"
import { LineChart, BarChart3, PieChart, Database } from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CarbonLineChart,
  NutrientBarChart,
  SustainabilityPieChart,
} from "@/components/analytics-charts"
import { useSoil } from "@/lib/soil-context"
import { getStats } from "@/lib/soil-data"
import { cn } from "@/lib/utils"

export default function AnalyticsPage() {
  const { soilData, isUploadedData, farmArea } = useSoil()
  const stats = useMemo(() => getStats(soilData, farmArea), [soilData, farmArea])

  return (
    <PageShell>
      <PageHeading
        eyebrow="Analytics"
        title="Soil & Sustainability Analytics"
        description="Visualize organic carbon trends, nutrient balances by region, and the distribution of sustainability scores across your fields."
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        {/* Data source banner */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
            isUploadedData
              ? "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400"
              : "border-border bg-secondary/30 text-muted-foreground",
          )}
        >
          <Database className="size-4 shrink-0" />
          {isUploadedData ? (
            <span>
              Charts are powered by your <strong>uploaded CSV</strong> — {soilData.length} records,
              avg organic carbon {stats.avgOrganicCarbon}%, sustainability score{" "}
              {stats.sustainabilityScore}/100.
            </span>
          ) : (
            <span>
              Showing <strong>sample dataset</strong>. Upload a CSV on the Dashboard for charts
              based on your own soil data.
            </span>
          )}
        </div>

        {/* 1. Organic Carbon Line Chart — full width */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LineChart className="size-5 text-primary" />
              Organic Carbon by Field
            </CardTitle>
            <CardDescription>
              Soil organic carbon (%) for each sampled field. Higher values indicate greater carbon
              sequestration potential.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CarbonLineChart data={soilData} />
          </CardContent>
        </Card>

        {/* 2. Nutrient Bar Chart + 3. Pie Chart — side by side */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="size-5 text-primary" />
                Nutrient Levels by Region
              </CardTitle>
              <CardDescription>
                Average Nitrogen, Phosphorus, and Potassium (ppm) grouped by region.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NutrientBarChart data={soilData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="size-5 text-primary" />
                Sustainability Score Distribution
              </CardTitle>
              <CardDescription>
                How fields are distributed across Excellent, Good, Fair, and Poor score bands.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SustainabilityPieChart data={soilData} />
            </CardContent>
          </Card>
        </div>

        {/* Summary strip */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Avg Organic Carbon", value: `${stats.avgOrganicCarbon}%` },
            { label: "Avg Nitrogen", value: `${stats.avgNitrogen} ppm` },
            { label: "Avg Phosphorus", value: `${stats.avgPhosphorus} ppm` },
            { label: "Avg Potassium", value: `${stats.avgPotassium} ppm` },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-xl font-semibold text-primary">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
