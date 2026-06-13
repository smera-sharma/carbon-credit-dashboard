"use client"

import { Lightbulb, Sprout, Recycle, Tractor, FlaskConical, Mountain, Database } from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStats, getRecommendations, type Recommendation } from "@/lib/soil-data"
import { useSoil } from "@/lib/soil-context"
import { cn } from "@/lib/utils"

const icons = [Recycle, Sprout, Tractor, FlaskConical, Mountain, Lightbulb]

const impactStyles: Record<Recommendation["impact"], string> = {
  High: "bg-primary text-primary-foreground",
  Medium: "bg-accent text-accent-foreground",
  Low: "bg-secondary text-secondary-foreground",
}

const impactOrder: Record<Recommendation["impact"], number> = {
  High: 0,
  Medium: 1,
  Low: 2,
}

export default function RecommendationsPage() {
  const { soilData, isUploadedData, farmArea } = useSoil()
  const stats = getStats(soilData, farmArea)
  const recommendations = getRecommendations(stats).sort(
    (a, b) => impactOrder[a.impact] - impactOrder[b.impact],
  )

  return (
    <PageShell>
      <PageHeading
        eyebrow="Recommendations"
        title="Sustainability Recommendations"
        description="Generated from current soil conditions. Prioritize high-impact actions to improve soil health and grow your carbon credit potential."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
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
              Recommendations are based on your <strong>uploaded CSV</strong> ({soilData.length}{" "}
              records, avg organic carbon {stats.avgOrganicCarbon}%).
            </span>
          ) : (
            <span>
              Showing recommendations for the <strong>sample dataset</strong>. Upload a CSV on the
              Dashboard to see personalised suggestions.
            </span>
          )}
        </div>

        {/* Recommendation cards sorted by impact */}
        <div className="grid gap-6 md:grid-cols-2">
          {recommendations.map((rec, i) => {
            const Icon = icons[i % icons.length]
            return (
              <Card key={rec.title} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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

        {/* Summary card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Lightbulb className="mt-0.5 size-6 shrink-0 text-primary" />
              <div className="space-y-3">
                <h3 className="text-base font-semibold">Why these recommendations?</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  With an average organic carbon of{" "}
                  <strong className="text-foreground">{stats.avgOrganicCarbon}%</strong> and a
                  sustainability score of{" "}
                  <strong className="text-foreground">{stats.sustainabilityScore}/100</strong>, the
                  actions above target the soil indicators with the most room for improvement.
                  Implementing the high-impact items first can meaningfully increase sequestered
                  carbon over time.
                </p>
                <div className="grid gap-3 pt-1 sm:grid-cols-3">
                  {[
                    { label: "Avg Nitrogen", value: `${stats.avgNitrogen} ppm` },
                    { label: "Avg pH", value: String(stats.avgPh) },
                    { label: "Avg Moisture", value: `${stats.avgMoisture}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-background/60 px-3 py-2">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="mt-0.5 text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
