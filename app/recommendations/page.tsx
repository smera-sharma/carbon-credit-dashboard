import { Lightbulb, Sprout, Recycle, Tractor, FlaskConical, Mountain } from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sampleSoilData, getStats, getRecommendations, type Recommendation } from "@/lib/soil-data"
import { cn } from "@/lib/utils"

const icons = [Recycle, Sprout, Tractor, FlaskConical, Mountain, Lightbulb]

const impactStyles: Record<Recommendation["impact"], string> = {
  High: "bg-primary text-primary-foreground",
  Medium: "bg-accent text-accent-foreground",
  Low: "bg-secondary text-secondary-foreground",
}

export default function RecommendationsPage() {
  const stats = getStats(sampleSoilData, 120)
  const recommendations = getRecommendations(stats)

  return (
    <PageShell>
      <PageHeading
        eyebrow="Recommendations"
        title="Sustainability Recommendations"
        description="Generated from current soil conditions. Prioritize high-impact actions to improve soil health and grow your carbon credit potential."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
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

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-4 p-6">
            <Lightbulb className="size-6 shrink-0 text-primary" />
            <div>
              <h3 className="text-base font-semibold">Why these recommendations?</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                With an average organic carbon of {stats.avgOrganicCarbon}% and a sustainability
                score of {stats.sustainabilityScore}/100, the actions above target the soil
                indicators with the most room for improvement. Implementing the high-impact items
                first can meaningfully increase sequestered carbon over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
