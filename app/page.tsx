import Link from "next/link"
import Image from "next/image"
import {
  Sprout,
  Calculator,
  Lightbulb,
  ArrowRight,
  Leaf,
  CheckCircle2,
  BarChart3,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/page-shell"

const features = [
  {
    icon: BarChart3,
    title: "Soil Analysis Dashboard",
    description:
      "Explore average SOC, pH, and clay content across all samples. Interactive charts reveal patterns and soil quality at a glance.",
    href: "/dashboard",
    cta: "Open Dashboard",
  },
  {
    icon: Calculator,
    title: "Carbon Credit Simulator",
    description:
      "Adjust farm area and soil depth to model carbon stock and tradeable credits using the formula: Carbon Credits = SOC × Area × (Depth/30) × 3.67.",
    href: "/simulator",
    cta: "Run Simulation",
  },
  {
    icon: Lightbulb,
    title: "Recommendations & Report",
    description:
      "Get SOC-level based guidance — from maintaining high-carbon practices to applying organic amendments — and download a summary report.",
    href: "/recommendations",
    cta: "View Recommendations",
  },
  {
    icon: Database,
    title: "Built-in Sample Dataset",
    description:
      "Ships with 227 real soil measurements from the LimeSoDa archive (CC BY-SA 4.0). Upload your own compatible CSV anytime from the Dashboard.",
    href: "/dashboard",
    cta: "Upload Dataset",
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
              <strong className="text-foreground">Carbon credits</strong> reward farmers for storing
              carbon in their soil. Soil Organic Carbon (SOC) is the key metric — higher SOC means
              more stable soil, better yields, and more credits you can generate or trade.
            </p>
            <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              This dashboard helps you analyse soil data, simulate credit potential, and find
              practical improvements — all from a built-in real-world SOC dataset or your own CSV
              upload.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button render={<Link href="/dashboard" />} nativeButton={false} size="lg">
                Explore Dashboard
                <ArrowRight className="size-4" />
              </Button>
              <Button render={<Link href="/simulator" />} nativeButton={false} size="lg" variant="outline">
                Run Simulator
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "227 real soil samples included",
                "Upload-compatible CSV support",
                "No setup required",
              ].map((item) => (
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
            <Card className="absolute -bottom-6 -left-2 hidden w-60 shadow-lg sm:block">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sprout className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Sample Dataset</p>
                  <p className="text-base font-semibold">227 SOC samples</p>
                  <p className="text-xs text-muted-foreground">LimeSoDa · CC BY-SA 4.0</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight">
              What is SOC and why does it matter?
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Soil Organic Carbon (SOC) is the carbon stored in organic matter — dead plants, roots,
              and microbes — in the top layers of soil. Increasing SOC improves water retention,
              fertiliser efficiency, and biodiversity, while actively removing CO₂ from the
              atmosphere. Carbon credit programmes pay farmers for each tonne of CO₂ equivalently
              sequestered in their soil, measured directly from SOC.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="group transition-shadow hover:shadow-md">
                <CardContent className="flex h-full flex-col p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                  <Link
                    href={feature.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {feature.cta}
                    <ArrowRight className="size-3.5" />
                  </Link>
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
                Ready to analyse your soil carbon?
              </h2>
              <p className="mt-2 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
                The built-in sample dataset is ready to explore right now. Upload your own
                compatible CSV (with a SOC column) from the Dashboard at any time.
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
