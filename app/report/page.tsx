import { Download, Database, Sprout, Coins, Gauge, Cloud, FileText, CheckCircle2 } from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { StatGrid } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { sampleSoilData, getStats, getRecommendations } from "@/lib/soil-data"

const FARM_AREA = 120

export default function ReportPage() {
  const stats = getStats(sampleSoilData, FARM_AREA)
  const recommendations = getRecommendations(stats)

  const statItems = [
    { label: "Records Analyzed", value: String(stats.totalRecords), hint: "soil samples", icon: Database },
    { label: "Avg Organic Carbon", value: `${stats.avgOrganicCarbon}%`, hint: "across fields", icon: Sprout },
    { label: "Carbon Credits", value: `${stats.carbonCredits} t`, hint: `${FARM_AREA} ha`, icon: Coins },
    { label: "CO\u2082 Offset", value: `${stats.co2Offset} t`, hint: "equivalent", icon: Cloud },
  ]

  return (
    <PageShell>
      <PageHeading
        eyebrow="Report"
        title="Executive Report Summary"
        description="A consolidated overview of soil analysis, carbon credit estimates, and key sustainability findings."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="size-4 text-primary" />
            Generated from sample soil dataset {"\u2022"} Farm area: {FARM_AREA} ha
          </div>
          <Button>
            <Download className="size-4" />
            Download Report
          </Button>
        </div>

        <StatGrid items={statItems} />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Executive summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Analysis of {stats.totalRecords} soil samples shows an average organic carbon
                content of <span className="font-medium text-foreground">{stats.avgOrganicCarbon}%</span>{" "}
                and an overall sustainability score of{" "}
                <span className="font-medium text-foreground">{stats.sustainabilityScore}/100</span>.
                Based on the {FARM_AREA}-hectare farm area, the land has an estimated potential of{" "}
                <span className="font-medium text-foreground">{stats.carbonCredits} carbon credits</span>,
                equivalent to offsetting <span className="font-medium text-foreground">{stats.co2Offset} tonnes</span>{" "}
                of CO{"\u2082"}.
              </p>
              <p>
                Nutrient levels average {stats.avgNitrogen} ppm nitrogen, {stats.avgPhosphorus} ppm
                phosphorus, and {stats.avgPotassium} ppm potassium, with a mean soil pH of{" "}
                {stats.avgPh}. These indicators suggest healthy but improvable soils, with the
                greatest opportunity in raising organic matter to lift both yield resilience and
                carbon sequestration.
              </p>
              <Separator />
              <div>
                <p className="font-medium text-foreground">Key insights</p>
                <ul className="mt-2 space-y-2">
                  {[
                    `Organic carbon of ${stats.avgOrganicCarbon}% drives the bulk of credit potential.`,
                    `Sustainability score of ${stats.sustainabilityScore}/100 indicates a solid baseline.`,
                    `${recommendations.length} prioritized recommendations identified for improvement.`,
                    `Estimated ${stats.carbonCredits} t of tradeable credits at current conditions.`,
                  ].map((insight) => (
                    <li key={insight} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Sustainability score + recap */}
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
              <CardContent className="space-y-2">
                <p className="text-3xl font-semibold">{stats.carbonCredits} t</p>
                <p className="text-sm text-primary-foreground/80">
                  {stats.avgOrganicCarbon}% {"\u00D7"} {FARM_AREA} ha {"\u00D7"} 0.8 factor
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
