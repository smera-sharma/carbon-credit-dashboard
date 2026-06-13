"use client"

import { useMemo } from "react"
import {
  Lightbulb,
  Sprout,
  Recycle,
  Tractor,
  FlaskConical,
  Mountain,
  Database,
  Download,
  AlertTriangle,
  CheckCircle2,
  Leaf,
} from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getStats, getSimulatorStats, getRecommendations, type Recommendation } from "@/lib/soil-data"
import { useSoil } from "@/lib/soil-context"
import { cn } from "@/lib/utils"

const icons = [Recycle, Sprout, Tractor, FlaskConical, Mountain, Lightbulb]

const impactStyles: Record<Recommendation["impact"], string> = {
  High:   "bg-primary text-primary-foreground",
  Medium: "bg-accent text-accent-foreground",
  Low:    "bg-secondary text-secondary-foreground",
}

const impactOrder: Record<Recommendation["impact"], number> = {
  High: 0, Medium: 1, Low: 2,
}

function downloadReport(
  stats: ReturnType<typeof getStats>,
  sim: ReturnType<typeof getSimulatorStats>,
  recommendations: Recommendation[],
  farmArea: number,
  soilDepth: number,
  sampleCount: number,
  isUploadedData: boolean,
) {
  const date = new Date().toISOString().slice(0, 10)
  const lines = [
    `Carbon Credit Estimator — Report (${date})`,
    `Dataset: ${isUploadedData ? "Uploaded CSV" : "Sample SOC Dataset"} · ${sampleCount} samples`,
    "",
    "== SOIL ANALYSIS SUMMARY ==",
    `Average SOC,${stats.avgOrganicCarbon ?? "—"}%`,
    `Average pH,${stats.avgPh ?? "—"}`,
    `Average Clay,${stats.avgClay ?? "—"}%`,
    `Average Altitude,${stats.avgAltitude ?? "—"} m`,
    `Average Slope,${stats.avgSlope ?? "—"}`,
    `Soil Quality Score,${stats.soilQualityScore}/100`,
    "",
    "== CARBON CREDIT ESTIMATE ==",
    `Farm Area,${farmArea} ha`,
    `Soil Depth,${soilDepth} cm`,
    `Avg SOC Used,${sim.avgSOC}%`,
    `Carbon Stock,${sim.carbonStock} tC`,
    `Carbon Credits,${sim.carbonCredits} tCO₂e`,
    `CO₂ Equivalent,${sim.co2Equivalent} tCO₂e`,
    "",
    "== RECOMMENDATIONS ==",
    ...recommendations.map((r) => `[${r.impact}] ${r.title}: ${r.description}`),
    "",
    "DISCLAIMER: Carbon credit estimates are intended for educational and analytical purposes only",
    "and should not be used for official carbon certification or financial decisions.",
  ]

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `carbon-report-${date}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export default function RecommendationsPage() {
  const { soilData, isUploadedData, farmArea, soilDepth } = useSoil()
  const stats = useMemo(() => getStats(soilData), [soilData])
  const sim   = useMemo(() => getSimulatorStats(soilData, farmArea, soilDepth), [soilData, farmArea, soilDepth])
  const recommendations = useMemo(
    () => getRecommendations(stats).sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]),
    [stats],
  )

  const socLevel =
    stats.avgOrganicCarbon === null ? "Unknown"
    : stats.avgOrganicCarbon >= 2.5  ? "High"
    : stats.avgOrganicCarbon >= 1.0  ? "Moderate"
    : "Low"

  const socColor =
    socLevel === "High"     ? "bg-green-500/10 text-green-700 dark:text-green-400"
    : socLevel === "Moderate" ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
    : "bg-red-500/10 text-red-700 dark:text-red-400"

  return (
    <PageShell>
      <PageHeading
        eyebrow="Recommendations & Report"
        title="Sustainability Recommendations"
        description="Actionable guidance generated from current soil conditions, plus a summary report you can download."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">

        {/* ── Active dataset banner ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium",
              isUploadedData
                ? "border-green-500/40 bg-green-500/8 text-green-700 dark:text-green-400"
                : "border-primary/20 bg-primary/5 text-primary",
            )}
          >
            <Database className="size-4 shrink-0" />
            {isUploadedData ? "Using Uploaded Dataset" : "Using Sample SOC Dataset"}
            <span className="ml-1 font-normal text-muted-foreground">
              — {soilData.length} samples, avg SOC {stats.avgOrganicCarbon ?? "—"}%
            </span>
          </div>
          <Button
            variant="outline"
            className="gap-2 shrink-0"
            onClick={() => downloadReport(stats, sim, recommendations, farmArea, soilDepth, soilData.length, isUploadedData)}
          >
            <Download className="size-4" />
            Download Report
          </Button>
        </div>

        {/* ── Recommendation cards ─────────────────────────────────────────── */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-base font-semibold">
              Recommendations for{" "}
              <span className={cn("rounded-md px-2 py-0.5 text-sm font-semibold", socColor)}>
                {socLevel} SOC
              </span>
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {recommendations.map((rec, i) => {
              const Icon = icons[i % icons.length]
              return (
                <Card key={rec.title} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <Badge className={cn("rounded-full", impactStyles[rec.impact])}>
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{rec.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {rec.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* ── Summary section ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Leaf className="size-5 text-primary" />
              Key Findings &amp; Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">

            {/* Dataset observations */}
            <div>
              <p className="mb-3 font-semibold text-foreground">Major Soil Observations</p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  `${soilData.length} soil samples analysed across ${[...new Set(soilData.map((r) => r.region))].length} region(s).`,
                  `Average SOC of ${stats.avgOrganicCarbon ?? "—"}% — classified as ${socLevel}.`,
                  stats.avgPh !== null
                    ? `Average pH ${stats.avgPh} — ${stats.avgPh < 5.5 ? "acidic, lime application recommended" : stats.avgPh > 7.5 ? "alkaline, monitor nutrient availability" : "within optimal range (5.5–7.5)"}.`
                    : null,
                  stats.avgClay !== null
                    ? `Average clay content ${stats.avgClay}% — ${stats.avgClay < 15 ? "low, limited water retention" : stats.avgClay > 45 ? "high, drainage may be needed" : "suitable for carbon stabilisation"}.`
                    : null,
                  `Soil Quality Score: ${stats.soilQualityScore}/100 — ${stats.soilQualityScore >= 70 ? "above-average" : stats.soilQualityScore >= 50 ? "moderate" : "needs improvement"}.`,
                ]
                  .filter(Boolean)
                  .map((obs) => (
                    <li key={obs as string} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{obs}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <Separator />

            {/* Carbon credit potential */}
            <div>
              <p className="mb-3 font-semibold text-foreground">Estimated Carbon Credit Potential</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Carbon Stock",    value: `${sim.carbonStock} tC`,      sub: `at ${farmArea} ha · ${soilDepth} cm` },
                  { label: "Carbon Credits",  value: `${sim.carbonCredits} tCO₂e`, sub: "Carbon Stock × 3.67"                },
                  { label: "CO₂ Equivalent",  value: `${sim.co2Equivalent} tCO₂e`, sub: "atmospheric offset equivalent"     },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="rounded-xl border bg-secondary/30 px-4 py-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-xl font-semibold text-primary">{value}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Adjust farm area and soil depth in the Simulator to explore different scenarios.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Disclaimer ───────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/5 px-5 py-4 text-sm text-yellow-700 dark:text-yellow-400">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p>
            <strong>Disclaimer:</strong>{" "}
            Carbon credit estimates are intended for educational and analytical purposes only and
            should not be used for official carbon certification or financial decisions. Always
            consult a certified carbon auditor for verification and compliance purposes.
          </p>
        </div>

      </div>
    </PageShell>
  )
}
