"use client"

import { useMemo, useState, useEffect } from "react"
import { Coins, Cloud, Sprout, Ruler, TreePine, Car, Database } from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getStats, CARBON_CREDIT_FACTOR } from "@/lib/soil-data"
import { useSoil } from "@/lib/soil-context"
import { cn } from "@/lib/utils"

export default function EstimationPage() {
  const { soilData, isUploadedData, farmArea: contextFarmArea, setFarmArea: setContextFarmArea } = useSoil()

  const baseStats = useMemo(() => getStats(soilData, 1), [soilData])
  const [organicCarbon, setOrganicCarbon] = useState<number>(baseStats.avgOrganicCarbon ?? 2.0)
  const [farmArea, setFarmArea] = useState(contextFarmArea)

  useEffect(() => {
    setOrganicCarbon(baseStats.avgOrganicCarbon ?? 2.0)
  }, [baseStats.avgOrganicCarbon])

  function handleFarmAreaChange(val: number) {
    setFarmArea(val)
    setContextFarmArea(val)
  }

  const credits = Number((organicCarbon * farmArea * CARBON_CREDIT_FACTOR).toFixed(1))
  const co2Offset = credits
  const treesEquivalent = Math.round((co2Offset * 1000) / 21)
  const carsEquivalent = Math.round(co2Offset / 4.6)

  return (
    <PageShell>
      <PageHeading
        eyebrow="Carbon Estimation"
        title="Estimate Your Carbon Credits"
        description="Carbon credits are calculated from average soil organic carbon and farm area. Adjust the inputs to see how potential credits and CO₂ offsets change."
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
              Seeded from your <strong>uploaded CSV</strong> — avg organic carbon{" "}
              <strong>{baseStats.avgOrganicCarbon}%</strong> across {soilData.length} records. You
              can still adjust the inputs below.
            </span>
          ) : (
            <span>
              Using <strong>sample dataset</strong> averages. Upload a CSV on the Dashboard to
              pre-fill with your own soil data.
            </span>
          )}
        </div>

        {/* Formula */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">Formula</p>
            <p className="mt-3 text-balance text-xl font-semibold sm:text-2xl">
              Carbon Credits = Organic Carbon × Farm Area × 0.8
            </p>
            <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              Average soil organic carbon (%) is multiplied by the total farm area (hectares) and a
              0.8 sequestration factor to estimate tradeable carbon credits in tonnes of CO₂
              equivalent.
            </p>
          </CardContent>
        </Card>

        {/* Calculator */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Interactive Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label
                  htmlFor="oc"
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Sprout className="size-4 text-primary" /> Organic Carbon (%)
                </label>
                <Input
                  id="oc"
                  type="number"
                  step="0.1"
                  min={0}
                  value={organicCarbon}
                  onChange={(e) => setOrganicCarbon(Math.max(0, Number(e.target.value)))}
                  className="mt-2"
                />
                {isUploadedData && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pre-filled from CSV avg ({baseStats.avgOrganicCarbon}%)
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="area"
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Ruler className="size-4 text-primary" /> Farm Area (hectares)
                </label>
                <Input
                  id="area"
                  type="number"
                  min={0}
                  value={farmArea}
                  onChange={(e) => handleFarmAreaChange(Math.max(0, Number(e.target.value)))}
                  className="mt-2"
                />
              </div>
              <div className="rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
                {organicCarbon} × {farmArea} × 0.8 ={" "}
                <span className="font-semibold text-foreground">{credits} t</span>
              </div>
            </CardContent>
          </Card>

          {/* Result metric cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            <Card className="flex flex-col justify-center border-primary/30 bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/15">
                  <Coins className="size-5" />
                </span>
                <p className="mt-4 text-sm text-primary-foreground/80">Estimated Carbon Credits</p>
                <p className="mt-1 text-3xl font-semibold">{credits} t</p>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-center">
              <CardContent className="p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Cloud className="size-5" />
                </span>
                <p className="mt-4 text-sm text-muted-foreground">CO₂ Offset Equivalent</p>
                <p className="mt-1 text-3xl font-semibold">{co2Offset} t</p>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-center">
              <CardContent className="p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TreePine className="size-5" />
                </span>
                <p className="mt-4 text-sm text-muted-foreground">Equivalent Trees / Year</p>
                <p className="mt-1 text-3xl font-semibold">{treesEquivalent.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-center">
              <CardContent className="p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Car className="size-5" />
                </span>
                <p className="mt-4 text-sm text-muted-foreground">Cars Off the Road / Year</p>
                <p className="mt-1 text-3xl font-semibold">{carsEquivalent.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
