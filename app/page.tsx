import Link from "next/link"
import Image from "next/image"
import {
  Sprout,
  Calculator,
  LineChart,
  BarChart3,
  ArrowRight,
  Leaf,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/page-shell"

const features = [
  {
    icon: Sprout,
    title: "Soil Health Analysis",
    description:
      "Inspect organic carbon, nutrient levels, pH, and moisture across every field in your dataset.",
  },
  {
    icon: Calculator,
    title: "Carbon Credit Estimation",
    description:
      "Estimate tradeable carbon credits from soil organic carbon and farm area with a transparent formula.",
  },
  {
    icon: LineChart,
    title: "Sustainability Insights",
    description:
      "Get a sustainability score and tailored recommendations to improve long-term soil performance.",
  },
  {
    icon: BarChart3,
    title: "Interactive Visualizations",
    description:
      "Explore trends and nutrient comparisons through responsive, easy-to-read charts.",
  },
]

export default function HomePage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-sm font-medium text-secondary-foreground">
              <Leaf className="size-4 text-primary" />
              Sustainable Agriculture Analytics
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Carbon Credit Estimator Dashboard
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Carbon credits reward farms for storing carbon in their soil. Upload a soil dataset
              to analyze soil health, estimate the carbon credits your land can generate, and
              uncover ways to farm more sustainably.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button render={<Link href="/dashboard" />} nativeButton={false} size="lg">
                Upload Dataset
                <ArrowRight className="size-4" />
              </Button>
              <Button render={<Link href="/estimation" />} nativeButton={false} size="lg" variant="outline">
                See the formula
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Transparent estimates", "Sample data included", "No setup required"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <Image
                src="/hero-farm.png"
                alt="Aerial view of green regenerative farmland with crop rows"
                width={720}
                height={560}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <Card className="absolute -bottom-6 -left-2 hidden w-56 shadow-lg sm:block">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calculator className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Est. Carbon Credits</p>
                  <p className="text-xl font-semibold">216 t</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight">
              Everything you need to quantify soil carbon
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              From raw soil samples to portfolio-ready insights, the dashboard guides you through
              the full sustainability workflow.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Card className="overflow-hidden border-primary/20 bg-primary text-primary-foreground">
          <CardContent className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight">
                Ready to estimate your carbon credits?
              </h2>
              <p className="mt-2 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
                Start with our realistic sample dataset, then connect your own soil data when
                you{"'"}re ready.
              </p>
            </div>
            <Button
              render={<Link href="/dashboard" />}
              nativeButton={false}
              size="lg"
              variant="secondary"
              className="shrink-0"
            >
              Open Dashboard
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  )
}
