"use client"

import { useMemo, useState, useEffect } from "react"
import {
  Calculator, Database, Leaf, Coins, Cloud, TrendingUp, Info,
  Save, Link2, TreePine, ArrowUpDown,
} from "lucide-react"
import Link from "next/link"
import { PageShell, PageHeading } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SimulatorAreaChart, TopSitesBarChart } from "@/components/analytics-charts"
import { useSoil } from "@/lib/soil-context"
import { useFarm } from "@/lib/farm-context"
import { getSimulatorStats } from "@/lib/soil-data"
import { cn } from "@/lib/utils"

export default function SimulatorPage() {
  const { soilData, isUploadedData, farmArea, soilDepth } = useSoil()
  const { selectedFarm, selectedFarmId, updateFarm, isLoaded } = useFarm()

  // Local simulation state — allows temporary exploration without saving to farm
  const [simArea,  setSimArea]  = useState(farmArea)
  const [simDepth, setSimDepth] = useState(soilDepth)

  // Sync with selected farm when farm selection changes
  useEffect(() => {
    setSimArea(farmArea)
    setSimDepth(soilDepth)
  }, [selectedFarmId]) // only on farm switch, not every farmArea change

  const savedSim  = useMemo(() => getSimulatorStats(soilData, farmArea, soilDepth),   [soilData, farmArea, soilDepth])
  const localSim  = useMemo(() => getSimulatorStats(soilData, simArea,  simDepth),    [soilData, simArea,  simDepth])

  const isDirty        = simArea !== farmArea || simDepth !== soilDepth
  const creditsDiff    = Math.round((localSim.carbonCredits - savedSim.carbonCredits) * 100) / 100
  const stockDiff      = Math.round((localSim.carbonStock   - savedSim.carbonStock)   * 100) / 100
  const diffPositive   = creditsDiff > 0

  function saveToFarm() {
    if (selectedFarmId) updateFarm(selectedFarmId, { farmArea: simArea, soilDepth: simDepth })
  }

  return (
    <PageShell>
      <PageHeading
        eyebrow="Simulator"
        title="Carbon Credit Simulator"
        description="Explore how farm area and soil depth affect carbon potential. Saved values come from the selected farm — adjust them freely to compare scenarios."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">

        {/* ── Currently viewing banner ─────────────────────────────────────── */}
        {isLoaded && (
          <div className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
            selectedFarm ? "border-primary/20 bg-primary/5" : "border-border bg-secondary/40",
          )}>
            {selectedFarm ? (
              <>
                <Link2 className="size-4 shrink-0 text-primary" />
                <span className="font-medium text-primary">Currently Viewing: {selectedFarm.name}</span>
                <span className="ml-1 font-normal text-muted-foreground">
                  · {isUploadedData ? "Uploaded Dataset" : "Sample SOC Dataset"} · avg SOC {savedSim.avgSOC}%
                </span>
              </>
            ) : (
              <>
                <TreePine className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">No farm selected —</span>
                <Link href="/farms" className="font-medium text-primary hover:underline">select a farm</Link>
                <span className="text-muted-foreground">to pre-populate values and save scenarios.</span>
              </>
            )}
          </div>
        )}

        {/* ── Saved + Simulated comparison ────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Saved (farm values) */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Save className="size-5 text-primary" /> Current Farm Settings
              </CardTitle>
              <CardDescription>
                {selectedFarm
                  ? `Saved values for "${selectedFarm.name}". These drive the portfolio credits.`
                  : "Default values — select a farm to sync saved settings."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-secondary/50 px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">Farm Area</p>
                  <p className="mt-0.5 text-lg font-semibold">{farmArea} ha</p>
                </div>
                <div className="rounded-lg bg-secondary/50 px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">Soil Depth</p>
                  <p className="mt-0.5 text-lg font-semibold">{soilDepth} cm</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-3 text-sm">
                {[
                  { label: "Carbon Stock",   value: `${savedSim.carbonStock} tC`    },
                  { label: "Credits",        value: `${savedSim.carbonCredits} tCO₂e` },
                  { label: "CO₂ Equiv.",     value: `${savedSim.co2Equivalent} tCO₂e` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border px-3 py-2.5">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-semibold text-primary">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Simulation (local override) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="size-5 text-primary" /> Simulate Scenario
              </CardTitle>
              <CardDescription>
                Adjust values below to explore. Changes here do not affect saved farm data unless
                you click "Save to Farm".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sim-area">Farm Area (ha)</Label>
                  <Input id="sim-area" type="number" min={0.1} step={0.5} value={simArea}
                    onChange={(e) => setSimArea(Math.max(0.1, Number(e.target.value)))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sim-depth">Soil Depth (cm)</Label>
                  <Input id="sim-depth" type="number" min={5} max={100} step={5} value={simDepth}
                    onChange={(e) => setSimDepth(Math.min(100, Math.max(5, Number(e.target.value))))} />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-3 text-sm">
                {[
                  { label: "Carbon Stock",   value: `${localSim.carbonStock} tC`    },
                  { label: "Credits",        value: `${localSim.carbonCredits} tCO₂e` },
                  { label: "CO₂ Equiv.",     value: `${localSim.co2Equivalent} tCO₂e` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border px-3 py-2.5">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-semibold text-primary">{value}</p>
                  </div>
                ))}
              </div>
              {isDirty && (
                <div className="flex items-center gap-3">
                  <Button size="sm" className="gap-2" onClick={saveToFarm} disabled={!selectedFarmId}>
                    <Save className="size-3.5" /> Save to Farm
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-2" onClick={() => { setSimArea(farmArea); setSimDepth(soilDepth) }}>
                    Reset
                  </Button>
                  {!selectedFarmId && (
                    <p className="text-xs text-muted-foreground">Select a farm to save.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Difference card ──────────────────────────────────────────────── */}
        {isDirty && (
          <Card className={cn(
            "border",
            diffPositive
              ? "border-green-500/30 bg-green-500/5"
              : creditsDiff < 0
              ? "border-red-500/30 bg-red-500/5"
              : "border-border",
          )}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <ArrowUpDown className={cn("size-5", diffPositive ? "text-green-600" : creditsDiff < 0 ? "text-red-500" : "text-muted-foreground")} />
                  <div>
                    <p className="text-xs text-muted-foreground">Carbon Credits Difference</p>
                    <p className={cn("text-xl font-semibold", diffPositive ? "text-green-700 dark:text-green-400" : creditsDiff < 0 ? "text-red-600 dark:text-red-400" : "text-foreground")}>
                      {creditsDiff > 0 ? "+" : ""}{creditsDiff} tCO₂e
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Carbon Stock Difference</p>
                  <p className="text-xl font-semibold">
                    {stockDiff > 0 ? "+" : ""}{stockDiff} tC
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {diffPositive
                    ? `Increasing farm area from ${farmArea} → ${simArea} ha${simDepth !== soilDepth ? ` and depth from ${soilDepth} → ${simDepth} cm` : ""} would generate ${creditsDiff} additional tCO₂e.`
                    : creditsDiff < 0
                    ? `Reducing farm area or depth would decrease credits by ${Math.abs(creditsDiff)} tCO₂e.`
                    : "No change in credit potential."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Formula display ───────────────────────────────────────────────── */}
        <Card className="border-dashed">
          <CardContent className="p-5">
            <p className="mb-2 font-medium">Formula</p>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>Carbon Stock (tC) = SOC% × Farm Area × (Soil Depth ÷ 30)</p>
              <p className="text-primary">
                = {savedSim.avgSOC}% × {simArea} ha × ({simDepth} ÷ 30) = <strong>{localSim.carbonStock} tC</strong>
              </p>
              <p className="mt-1">Carbon Credits (tCO₂e) = Carbon Stock × 3.67</p>
              <p className="text-primary">
                = {localSim.carbonStock} × 3.67 = <strong>{localSim.carbonCredits} tCO₂e</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Charts ───────────────────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-5 text-primary" /> Credits vs Farm Area
              </CardTitle>
              <CardDescription>
                How credits scale with area at avg SOC {savedSim.avgSOC}% and {simDepth} cm depth.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimulatorAreaChart avgSOC={savedSim.avgSOC} soilDepth={simDepth} currentFarmArea={simArea} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="size-5 text-primary" /> Top 10 Sites by Credit Potential
              </CardTitle>
              <CardDescription>
                Projected credits for the 10 highest-SOC sites at {simArea} ha and {simDepth} cm depth.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopSitesBarChart data={soilData} farmArea={simArea} soilDepth={simDepth} />
            </CardContent>
          </Card>
        </div>

        {/* ── Scenario insights ────────────────────────────────────────────── */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="space-y-2">
                <p className="font-medium">Scenario insights</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span><strong className="text-foreground">Farm Area</strong> scales credits linearly. A 10 ha farm at {savedSim.avgSOC}% SOC generates {Math.round(savedSim.avgSOC * 10 * (simDepth / 30) * 3.67 * 10) / 10} tCO₂e.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span><strong className="text-foreground">Soil Depth</strong> acts as a multiplier. At 60 cm the same SOC delivers twice the carbon stock of 30 cm.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span><strong className="text-foreground">Improving SOC by 0.5%</strong> across {simArea} ha would add {Math.round(0.5 * simArea * (simDepth / 30) * 3.67 * 10) / 10} tCO₂e — achievable through cover cropping over 2–3 seasons.</span>
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
