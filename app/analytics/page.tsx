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
        description="Visualize SOC trends, soil properties by region, and the distribution of sustainability scores across sampled sites."
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
              Charts powered by your <strong>uploaded CSV</strong> — {soilData.length} records,
              avg SOC {stats.avgOrganicCarbon ?? "—"}%, sustainability score{" "}
              {stats.sustainabilityScore}/100.
            </span>
          ) : (
            <span>
              Showing <strong>sample SOC dataset</strong> (LimeSoDa, {soilData.length} sites).
              Upload a CSV on the Dashboard for charts based on your own data.
            </span>
          )}
        </div>

        {/* 1. SOC Line Chart — full width */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LineChart className="size-5 text-primary" />
              Soil Organic Carbon by Site
            </CardTitle>
            <CardDescription>
              SOC (%) for each sampled site. Higher values indicate greater carbon sequestration
              potential and more tradeable credits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CarbonLineChart data={soilData} />
          </CardContent>
        </Card>

        {/* 2. Soil Properties Bar + 3. Pie — side by side */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="size-5 text-primary" />
                Soil Properties by Region
              </CardTitle>
              <CardDescription>
                Average SOC (%), Clay (%), and pH grouped by region — reveals how soil character
                varies across the landscape.
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
                How sites are distributed across Excellent, Good, Fair, and Poor score bands based
                on SOC, pH, clay, and slope.
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
            { label: "Avg SOC",      value: stats.avgOrganicCarbon !== null ? `${stats.avgOrganicCarbon}%` : "—" },
            { label: "Avg pH",       value: stats.avgPh             !== null ? String(stats.avgPh)          : "—" },
            { label: "Avg Clay",     value: stats.avgClay           !== null ? `${stats.avgClay}%`          : "—" },
            { label: "Avg Altitude", value: stats.avgAltitude       !== null ? `${stats.avgAltitude} m`     : "—" },
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
