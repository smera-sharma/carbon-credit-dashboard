"use client"

import { useMemo, useState } from "react"
import {
  Database,
  Sprout,
  Coins,
  Gauge,
  Search,
  UploadCloud,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { StatGrid } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { sampleSoilData, getStats, type SoilRecord } from "@/lib/soil-data"
import { parseCSV } from "@/lib/csv-parser"

const PAGE_SIZE = 6

type UploadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; fileName: string; recordCount: number; warnings: string[] }
  | { status: "error"; message: string }

export default function DashboardPage() {
  const [farmArea, setFarmArea] = useState(120)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" })
  const [csvData, setCsvData] = useState<SoilRecord[] | null>(null)

  const activeData = csvData ?? sampleSoilData
  const stats = useMemo(() => getStats(activeData, farmArea), [activeData, farmArea])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return activeData
    return activeData.filter(
      (r) => r.field.toLowerCase().includes(q) || r.region.toLowerCase().includes(q),
    )
  }, [search, activeData])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  async function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) {
      setUploadState({ status: "error", message: "Only .csv files are supported." })
      return
    }
    setUploadState({ status: "loading" })
    setSearch("")
    setPage(1)

    const result = await parseCSV(file)
    if (!result.ok) {
      setUploadState({ status: "error", message: result.error })
      return
    }

    setCsvData(result.records)
    setUploadState({
      status: "success",
      fileName: file.name,
      recordCount: result.records.length,
      warnings: result.warnings,
    })
  }

  function clearUpload() {
    setCsvData(null)
    setUploadState({ status: "idle" })
    setSearch("")
    setPage(1)
  }

  const statItems = [
    {
      label: "Total Records Analyzed",
      value: String(stats.totalRecords),
      hint: csvData ? "from uploaded CSV" : "soil samples in dataset",
      icon: Database,
    },
    {
      label: "Average Organic Carbon",
      value: `${stats.avgOrganicCarbon}%`,
      hint: "across all fields",
      icon: Sprout,
    },
    {
      label: "Estimated Carbon Credits",
      value: `${stats.carbonCredits} t`,
      hint: `for ${farmArea} ha`,
      icon: Coins,
    },
    {
      label: "Sustainability Score",
      value: `${stats.sustainabilityScore}/100`,
      hint: "weighted soil health index",
      icon: Gauge,
    },
  ]

  return (
    <PageShell>
      <PageHeading
        eyebrow="Dashboard"
        title="Soil Dataset Analysis"
        description="Upload a CSV of soil samples or explore the included sample data. Set your farm area to estimate carbon credit potential."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
        {/* Upload + farm area */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Upload Dataset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const f = e.dataTransfer.files?.[0]
                  if (f) handleFile(f)
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : uploadState.status === "error"
                      ? "border-destructive/50 bg-destructive/5"
                      : uploadState.status === "success"
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-border hover:border-primary/50 hover:bg-secondary/40"
                }`}
              >
                <input
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                    e.target.value = ""
                  }}
                />

                {uploadState.status === "loading" ? (
                  <Loader2 className="size-8 animate-spin text-primary" />
                ) : uploadState.status === "success" ? (
                  <span className="flex size-12 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="size-6" />
                  </span>
                ) : uploadState.status === "error" ? (
                  <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertCircle className="size-6" />
                  </span>
                ) : (
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UploadCloud className="size-6" />
                  </span>
                )}

                <p className="mt-4 text-sm font-medium">
                  {uploadState.status === "loading"
                    ? "Parsing dataset…"
                    : uploadState.status === "success"
                      ? `${uploadState.recordCount} records loaded from ${uploadState.fileName}`
                      : uploadState.status === "error"
                        ? "Upload failed — click to try again"
                        : "Drag & drop your CSV here, or click to browse"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {uploadState.status === "error"
                    ? uploadState.message
                    : uploadState.status === "success"
                      ? "Drop a new file to replace, or clear to return to sample data."
                      : "Supports .csv up to 10 MB. Flexible column names — see examples below."}
                </p>

                {uploadState.status === "success" && uploadState.warnings.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {uploadState.warnings.map((w) => (
                      <span
                        key={w}
                        className="inline-flex items-center gap-1.5 rounded-md bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-700 dark:text-yellow-400"
                      >
                        <AlertCircle className="size-3 shrink-0" />
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </label>

              {uploadState.status === "idle" && (
                <p className="text-xs text-muted-foreground">
                  Expected columns (flexible naming):{" "}
                  <span className="font-mono">field, region, organic_carbon, nitrogen, phosphorus, potassium, ph, moisture</span>
                </p>
              )}

              {(uploadState.status === "success" || uploadState.status === "error") && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={clearUpload}
                  >
                    <X className="size-3" />
                    Clear &amp; use sample data
                  </Button>
                  {uploadState.status === "success" && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileSpreadsheet className="size-3.5 text-primary" />
                      Showing live CSV data
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Farm Area</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="farm-area" className="text-sm text-muted-foreground">
                  Total area (hectares)
                </label>
                <Input
                  id="farm-area"
                  type="number"
                  min={0}
                  value={farmArea}
                  onChange={(e) => setFarmArea(Math.max(0, Number(e.target.value)))}
                  className="mt-2"
                />
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-xs text-muted-foreground">Estimated credits at current area</p>
                <p className="mt-1 text-2xl font-semibold text-primary">
                  {stats.carbonCredits} t
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary cards */}
        <StatGrid items={statItems} />

        {/* Dataset table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Dataset Preview</CardTitle>
              {csvData ? (
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                  CSV
                </span>
              ) : (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  Sample
                </span>
              )}
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search field or region"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Org. Carbon (%)</TableHead>
                    <TableHead className="text-right">N (ppm)</TableHead>
                    <TableHead className="text-right">P (ppm)</TableHead>
                    <TableHead className="text-right">K (ppm)</TableHead>
                    <TableHead className="text-right">pH</TableHead>
                    <TableHead className="text-right">Moisture (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                        No records match your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.field}</TableCell>
                        <TableCell className="text-muted-foreground">{r.region}</TableCell>
                        <TableCell className="text-right">{r.organicCarbon}</TableCell>
                        <TableCell className="text-right">{r.nitrogen}</TableCell>
                        <TableCell className="text-right">{r.phosphorus}</TableCell>
                        <TableCell className="text-right">{r.potassium}</TableCell>
                        <TableCell className="text-right">{r.ph}</TableCell>
                        <TableCell className="text-right">{r.moisture}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {rows.length} of {filtered.length} records
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
