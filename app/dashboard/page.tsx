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
import { sampleSoilData, getStats } from "@/lib/soil-data"

const PAGE_SIZE = 6

export default function DashboardPage() {
  const [farmArea, setFarmArea] = useState(120)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const stats = useMemo(() => getStats(sampleSoilData, farmArea), [farmArea])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sampleSoilData
    return sampleSoilData.filter(
      (r) => r.field.toLowerCase().includes(q) || r.region.toLowerCase().includes(q),
    )
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function simulateUpload(name: string) {
    setLoading(true)
    setFileName(null)
    setTimeout(() => {
      setLoading(false)
      setFileName(name)
    }, 1200)
  }

  const statItems = [
    {
      label: "Total Records Analyzed",
      value: String(stats.totalRecords),
      hint: "soil samples in dataset",
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
            <CardContent>
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
                  simulateUpload(f ? f.name : "soil-samples.csv")
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/40"
                }`}
              >
                <input
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) simulateUpload(f.name)
                  }}
                />
                {loading ? (
                  <Loader2 className="size-8 animate-spin text-primary" />
                ) : (
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UploadCloud className="size-6" />
                  </span>
                )}
                <p className="mt-4 text-sm font-medium">
                  {loading
                    ? "Processing dataset..."
                    : "Drag & drop your CSV here, or click to browse"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supports .csv up to 10MB. Demo uses sample data.
                </p>
                {fileName && !loading && (
                  <span className="mt-4 inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                    <FileSpreadsheet className="size-4 text-primary" />
                    {fileName} loaded — showing sample data
                  </span>
                )}
              </label>
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
            <CardTitle className="text-base">Dataset Preview</CardTitle>
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
