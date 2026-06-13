"use client"

import { useMemo } from "react"
import {
  Calculator,
  Database,
  Leaf,
  Coins,
  Cloud,
  TrendingUp,
  Info,
} from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SimulatorAreaChart, TopSitesBarChart } from "@/components/analytics-charts"
import { useSoil } from "@/lib/soil-context"
import { getSimulatorStats } from "@/lib/soil-data"
import { cn } from "@/lib/utils"

export default function SimulatorPage() {
  const { soilData, isUploadedData, farmArea, setFarmArea, soilDepth, setSoilDepth } = useSoil()

  const sim = useMemo(
    () => getSimulatorStats(soilData, farmArea, soilDepth),
    [soilData, farmArea, soilDepth],
  )

  return (
    <PageShell>
      <PageHeading
        eyebrow="Simulator"
        title="Carbon Credit Simulator"
        description="Adjust farm area and soil depth to model carbon stock and tradeable credits. Based entirely on SOC — no nutrient data required."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">

        {/* ── Active dataset badge ──────────────────────────────────────────── */}
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
            — avg SOC {sim.avgSOC}% across {soilData.length} samples
          </span>
        </div>

        {/* ── Inputs + formula ─────────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="size-5 text-primary" />
                Simulation Parameters
              </CardTitle>
              <CardDescription>
                Adjust farm area and soil depth to explore how they affect carbon credit estimates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="farm-area" className="text-sm font-medium">
                    Farm Area (hectares)
                  </label>
                  <Input
                    id="farm-area"
                    type="number"
                    min={0.1}
                    step={0.5}
                    value={farmArea}
                    onChange={(e) => setFarmArea(Math.max(0.1, Number(e.target.value)))}
                  />
                  <p className="text-xs text-muted-foreground">Default: 5 ha · Typical small farm</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="soil-depth" className="text-sm font-medium">
                    Soil Depth (cm)
                  </label>
                  <Input
                    id="soil-depth"
                    type="number"
                    min={5}
                    max={100}
                    step={5}
                    value={soilDepth}
                    onChange={(e) => setSoilDepth(Math.min(100, Math.max(5, Number(e.target.value))))}
                  />
                  <p className="text-xs text-muted-foreground">Default: 30 cm · Standard measurement depth</p>
                </div>
              </div>

              {/* Formula display */}
              <div className="mt-6 rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-sm">
                <p className="font-medium text-foreground">Formula</p>
                <div className="mt-2 space-y-1 font-mono text-xs text-muted-foreground">
                  <p>Carbon Stock (tC) = SOC% × Farm Area × (Soil Depth ÷ 30)</p>
                  <p className="text-primary">
                    = {sim.avgSOC}% × {farmArea} ha × ({soilDepth} ÷ 30) = <strong>{sim.carbonStock} tC</strong>
                  </p>
                  <p className="mt-2">Carbon Credits (tCO₂e) = Carbon Stock × 3.67</p>
                  <p className="text-primary">
                    = {sim.carbonStock} × 3.67 = <strong>{sim.carbonCredits} tCO₂e</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result cards column */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Leaf className="size-4 text-primary" />
                  Estimated Carbon Stock
                </div>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-primary">
                  {sim.carbonStock}
                  <span className="ml-1 text-base font-normal text-muted-foreground">tC</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">tonnes of carbon in soil</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="size-4 text-primary" />
                  Estimated Carbon Credits
                </div>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-primary">
                  {sim.carbonCredits}
                  <span className="ml-1 text-base font-normal text-muted-foreground">tCO₂e</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">tradeable credit potential</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Cloud className="size-4 text-primary" />
                  CO₂ Equivalent
                </div>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-primary">
                  {sim.co2Equivalent}
                  <span className="ml-1 text-base font-normal text-muted-foreground">tCO₂e</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">equivalent atmospheric offset</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Charts ───────────────────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-5 text-primary" />
                Credits vs Farm Area
              </CardTitle>
              <CardDescription>
                How carbon credits scale with farm area at avg SOC {sim.avgSOC}% and {soilDepth} cm
                soil depth. Credits increase linearly with area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimulatorAreaChart
                avgSOC={sim.avgSOC}
                soilDepth={soilDepth}
                currentFarmArea={farmArea}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="size-5 text-primary" />
                Top 10 Sites by Credit Potential
              </CardTitle>
              <CardDescription>
                The 10 highest-SOC sites and their projected credits at {farmArea} ha and {soilDepth} cm
                depth — showing the impact of SOC variation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopSitesBarChart data={soilData} farmArea={farmArea} soilDepth={soilDepth} />
            </CardContent>
          </Card>
        </div>

        {/* ── Scenario insights ────────────────────────────────────────────── */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="space-y-2">
                <p className="font-medium">How farm area and soil depth affect your estimates</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <strong className="text-foreground">Farm Area</strong> scales credits linearly — doubling
                      your area doubles the credits. A 10 ha farm at {sim.avgSOC}% SOC generates{" "}
                      {Math.round(sim.avgSOC * 10 * (soilDepth / 30) * 3.67 * 10) / 10} tCO₂e.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <strong className="text-foreground">Soil Depth</strong> reflects how deep carbon is
                      measured. The 30 cm baseline is standard; at 60 cm the same SOC delivers twice the
                      carbon stock.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <strong className="text-foreground">Improving SOC by 0.5%</strong> across {farmArea} ha
                      would add approximately{" "}
                      {Math.round(0.5 * farmArea * (soilDepth / 30) * 3.67 * 10) / 10} tCO₂e in credits —
                      achievable through cover cropping over 2–3 seasons.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </PageShell>
  )
}
