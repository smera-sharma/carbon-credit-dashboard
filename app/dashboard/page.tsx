"use client"

import { useMemo, useState } from "react"
import {
  UploadCloud, CheckCircle2, AlertCircle, Loader2, X, FileSpreadsheet,
  Database, Sprout, FlaskConical, Layers, Gauge, Search, TrendingUp,
  BarChart3, LineChart, TreePine, Coins, Star, Link2,
} from "lucide-react"
import Link from "next/link"
import { PageShell, PageHeading } from "@/components/page-shell"
import { StatGrid } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  CarbonLineChart, NutrientBarChart, SOCDistributionChart, FarmComparisonChart,
} from "@/components/analytics-charts"
import { useSoil } from "@/lib/soil-context"
import { useFarm } from "@/lib/farm-context"
import { getStats } from "@/lib/soil-data"
import { parseCSV } from "@/lib/csv-parser"
import { cn } from "@/lib/utils"

type UploadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; fileName: string; recordCount: number; warnings: string[] }
  | { status: "error"; message: string }

const PAGE_SIZE = 15

function generateInsights(stats: ReturnType<typeof getStats>) {
  const items: { icon: typeof Sprout; text: string; tone: "good" | "warn" }[] = []
  const soc = stats.avgOrganicCarbon
  if (soc !== null) {
    if (soc >= 2.5)
      items.push({ icon: Sprout, text: `High SOC of ${soc}% — excellent carbon sequestration potential.`, tone: "good" })
    else if (soc >= 1.0)
      items.push({ icon: Sprout, text: `Moderate SOC of ${soc}% — composting and cover cropping can improve sequestration.`, tone: "warn" })
    else
      items.push({ icon: Sprout, text: `Low SOC of ${soc}% — organic amendments and reduced tillage strongly recommended.`, tone: "warn" })
  }
  if (stats.avgPh !== null) {
    const ph = stats.avgPh
    if (ph < 5.5)
      items.push({ icon: FlaskConical, text: `Soil pH of ${ph} is acidic. Lime application may be needed.`, tone: "warn" })
    else if (ph > 7.5)
      items.push({ icon: FlaskConical, text: `Soil pH of ${ph} is alkaline — monitor for nutrient lock-out.`, tone: "warn" })
    else
      items.push({ icon: FlaskConical, text: `Soil pH of ${ph} is within the optimal 5.5–7.5 range.`, tone: "good" })
  }
  if (stats.avgClay !== null) {
    const clay = stats.avgClay
    if (clay < 15)
      items.push({ icon: Layers, text: `Low clay content of ${clay}% — organic matter additions will improve water retention.`, tone: "warn" })
    else if (clay > 50)
      items.push({ icon: Layers, text: `Very high clay content of ${clay}% — drainage improvements may be needed.`, tone: "warn" })
    else
      items.push({ icon: Layers, text: `Clay content of ${clay}% supports good carbon retention and soil structure.`, tone: "good" })
  }
  items.push({
    icon: TrendingUp,
    text: `Soil Quality Score of ${stats.soilQualityScore}/100 — ${stats.soilQualityScore >= 70 ? "above-average; continue current management" : "targeted improvements recommended"}.`,
    tone: stats.soilQualityScore >= 70 ? "good" : "warn",
  })
  return items
}

export default function DashboardPage() {
  const { soilData, isUploadedData, setUploadedData, clearUploadedData } = useSoil()
  const { allFarmsWithStats, selectedFarm, selectedFarmId, isLoaded } = useFarm()

  const stats   = useMemo(() => getStats(soilData), [soilData])
  const insights = useMemo(() => generateInsights(stats), [stats])

  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" })
  const [isDragging,  setIsDragging]  = useState(false)
  const [search,      setSearch]      = useState("")
  const [page,        setPage]        = useState(1)

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase()
    return q ? soilData.filter((r) => r.field.toLowerCase().includes(q) || r.region.toLowerCase().includes(q)) : soilData
  }, [soilData, search])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const rows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleFile(file: File) {
    setUploadState({ status: "loading" })
    const result = await parseCSV(file)
    if (!result.ok) { setUploadState({ status: "error", message: result.error }); return }
    setUploadedData(result.records)
    setUploadState({ status: "success", fileName: file.name, recordCount: result.records.length, warnings: result.warnings })
  }

  function clearUpload() { clearUploadedData(); setUploadState({ status: "idle" }); setSearch(""); setPage(1) }

  // Portfolio stats
  const totalFarms    = allFarmsWithStats.length
  const totalCredits  = Math.round(allFarmsWithStats.reduce((s, f) => s + f.carbonCredits, 0) * 100) / 100
  const topFarm       = allFarmsWithStats.reduce<typeof allFarmsWithStats[0] | null>((best, f) => (!best || f.carbonCredits > best.carbonCredits ? f : best), null)
  const avgSOCAllFarms = allFarmsWithStats.length > 0
    ? Math.round((allFarmsWithStats.reduce((s, f) => {
        const st = getStats(f.soilData)
        return s + (st.avgOrganicCarbon ?? 0)
      }, 0) / allFarmsWithStats.length) * 100) / 100
    : null

  const portfolioStats = [
    { label: "Total Farms",      value: String(totalFarms),             hint: "in your portfolio",              icon: TreePine },
    { label: "Total Credits",    value: `${totalCredits} tCO₂e`,        hint: "across all farms",               icon: Coins    },
    { label: "Top Farm",         value: topFarm?.name ?? "—",           hint: topFarm ? `${topFarm.carbonCredits} tCO₂e` : "add a farm", icon: Star },
    { label: "Avg SOC (all)",    value: avgSOCAllFarms !== null ? `${avgSOCAllFarms}%` : "—", hint: "across all farm datasets", icon: Sprout },
  ]

  const soilStatItems = [
    { label: "Avg SOC",          value: stats.avgOrganicCarbon !== null ? `${stats.avgOrganicCarbon}%` : "—", hint: "soil organic carbon", icon: Sprout     },
    { label: "Avg pH",           value: stats.avgPh            !== null ? String(stats.avgPh)           : "—", hint: "soil acidity",        icon: FlaskConical },
    { label: "Avg Clay",         value: stats.avgClay          !== null ? `${stats.avgClay}%`           : "—", hint: "clay content",        icon: Layers     },
    { label: "Total Samples",    value: String(stats.totalRecords),                                            hint: isUploadedData ? "from CSV" : "sample dataset", icon: Database },
    { label: "Soil Quality",     value: `${stats.soilQualityScore}/100`,                                       hint: "weighted health score", icon: Gauge     },
  ]

  return (
    <PageShell>
      <PageHeading
        eyebrow="Dashboard"
        title="Soil Analysis"
        description="Understand soil conditions and manage your farm portfolio. Select a farm on the Farms page to analyse its specific dataset."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">

        {/* ── Currently viewing banner ─────────────────────────────────────── */}
        {isLoaded && (
          <div
            className={cn(
              "flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3 text-sm",
              selectedFarm
                ? "border-primary/20 bg-primary/5"
                : "border-border bg-secondary/40",
            )}
          >
            {selectedFarm ? (
              <>
                <Link2 className="size-4 shrink-0 text-primary" />
                <span className="font-medium text-primary">Currently Viewing: {selectedFarm.name}</span>
                <span className="text-muted-foreground">· {selectedFarm.farmArea} ha · {selectedFarm.soilDepth} cm depth</span>
              </>
            ) : (
              <>
                <TreePine className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">No farm selected —</span>
                <Link href="/farms" className="font-medium text-primary hover:underline">
                  go to Farms to select or create one
                </Link>
              </>
            )}
          </div>
        )}

        {/* ── Portfolio overview stats ─────────────────────────────────────── */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Portfolio Overview</h2>
          <StatGrid items={portfolioStats} className="lg:grid-cols-4" />
        </div>

        {/* ── Farm comparison chart ────────────────────────────────────────── */}
        {allFarmsWithStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="size-5 text-primary" /> Farm Portfolio — Carbon Credits Comparison
              </CardTitle>
              <CardDescription>
                Estimated carbon credits for each farm in your portfolio. Credits are computed using
                each farm's saved area, depth, and dataset.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FarmComparisonChart farms={allFarmsWithStats} />
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* ── Active dataset banner ─────────────────────────────────────────── */}
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
            — {soilData.length} samples
            {selectedFarm ? ` · ${selectedFarm.name}` : ""}
          </span>
        </div>

        {/* ── Upload card ───────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload Dataset</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                isDragging ? "border-primary bg-primary/5"
                : uploadState.status === "error"   ? "border-destructive/50 bg-destructive/5"
                : uploadState.status === "success"  ? "border-green-500/50 bg-green-500/5"
                : "border-border hover:border-primary/50 hover:bg-secondary/40",
              )}
            >
              <input type="file" accept=".csv" className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = "" }} />

              {uploadState.status === "loading" ? <Loader2 className="size-8 animate-spin text-primary" />
              : uploadState.status === "success" ? <span className="flex size-10 items-center justify-center rounded-full bg-green-500/10 text-green-600"><CheckCircle2 className="size-5" /></span>
              : uploadState.status === "error"   ? <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive"><AlertCircle className="size-5" /></span>
              : <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"><UploadCloud className="size-5" /></span>}

              <p className="mt-3 text-sm font-medium">
                {uploadState.status === "loading"  ? "Parsing dataset…"
                : uploadState.status === "success" ? `${uploadState.recordCount} records loaded from ${uploadState.fileName}`
                : uploadState.status === "error"   ? "Upload failed — click to try again"
                : "Drag & drop your CSV here, or click to browse"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {uploadState.status === "error" ? uploadState.message
                : uploadState.status === "success" ? "Drop a new file to replace, or clear to return to sample data."
                : "SOC column required · Optional: pH_target, Clay_target, Altitude, Slope"}
              </p>
              {uploadState.status === "success" && uploadState.warnings.length > 0 && (
                <div className="mt-3 space-y-1">
                  {uploadState.warnings.map((w) => (
                    <span key={w} className="inline-flex items-center gap-1.5 rounded-md bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-700">
                      <AlertCircle className="size-3" /> {w}
                    </span>
                  ))}
                </div>
              )}
            </label>
            {(uploadState.status === "success" || uploadState.status === "error") && (
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="gap-2 text-xs" onClick={clearUpload}>
                  <X className="size-3" /> Clear &amp; use sample data
                </Button>
                {uploadState.status === "success" && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileSpreadsheet className="size-3.5 text-primary" />
                    {selectedFarm ? `Saved to "${selectedFarm.name}"` : "Live CSV data"}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Soil stat cards ───────────────────────────────────────────────── */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Soil Analysis{selectedFarm ? ` — ${selectedFarm.name}` : ""}
          </h2>
          <StatGrid items={soilStatItems} className="lg:grid-cols-5" />
        </div>

        {/* ── Charts ───────────────────────────────────────────────────────── */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LineChart className="size-5 text-primary" /> SOC Across All Sites
              </CardTitle>
              <CardDescription>SOC (%) for every sampled site. Higher values indicate greater carbon sequestration potential.</CardDescription>
            </CardHeader>
            <CardContent><CarbonLineChart data={soilData} /></CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="size-5 text-primary" /> Avg Properties by Region
                </CardTitle>
                <CardDescription>Average SOC, Clay %, and pH grouped by region.</CardDescription>
              </CardHeader>
              <CardContent><NutrientBarChart data={soilData} /></CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="size-5 text-primary" /> SOC Distribution
                </CardTitle>
                <CardDescription>Count of sites in each SOC range.</CardDescription>
              </CardHeader>
              <CardContent><SOCDistributionChart data={soilData} /></CardContent>
            </Card>
          </div>
        </div>

        {/* ── Insights ─────────────────────────────────────────────────────── */}
        <div>
          <h2 className="mb-4 text-base font-semibold">Soil Health Insights</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {insights.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
                  item.tone === "good"
                    ? "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400"
                    : "border-yellow-500/30 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400",
                )}>
                  <Icon className="mt-0.5 size-4 shrink-0" />
                  <span>{item.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Data table ───────────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle className="text-base">Dataset Preview</CardTitle>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search field or region" value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead><TableHead>Region</TableHead>
                    <TableHead className="text-right">SOC (%)</TableHead>
                    <TableHead className="text-right">pH</TableHead>
                    <TableHead className="text-right">Clay (%)</TableHead>
                    <TableHead className="text-right">Altitude (m)</TableHead>
                    <TableHead className="text-right">Slope</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No records match your search.</TableCell></TableRow>
                  ) : (
                    rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.field}</TableCell>
                        <TableCell className="text-muted-foreground">{r.region}</TableCell>
                        <TableCell className="text-right">{r.organicCarbon ?? <span className="text-muted-foreground/50">—</span>}</TableCell>
                        <TableCell className="text-right">{r.ph            ?? <span className="text-muted-foreground/50">—</span>}</TableCell>
                        <TableCell className="text-right">{r.clay          ?? <span className="text-muted-foreground/50">—</span>}</TableCell>
                        <TableCell className="text-right">{r.altitude      ?? <span className="text-muted-foreground/50">—</span>}</TableCell>
                        <TableCell className="text-right">{r.slope         ?? <span className="text-muted-foreground/50">—</span>}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredRows.length)}–{Math.min(page * PAGE_SIZE, filteredRows.length)} of {filteredRows.length}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </PageShell>
  )
}
