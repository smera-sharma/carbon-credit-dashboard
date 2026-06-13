"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { SoilRecord } from "@/lib/soil-data"
import { getStats } from "@/lib/soil-data"
import { BarChart3, LineChart, PieChart as PieIcon, UploadCloud } from "lucide-react"

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border text-muted-foreground">
      <UploadCloud className="size-8 opacity-40" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

// ─── 1. Organic Carbon Line Chart ────────────────────────────────────────────

const carbonConfig = {
  organicCarbon: { label: "Organic Carbon (%)", color: "var(--chart-1)" },
} satisfies ChartConfig

export function CarbonLineChart({ data }: { data: SoilRecord[] }) {
  if (!data.length) {
    return <EmptyChart label="Upload a dataset to see organic carbon values." />
  }

  const chartData = data.map((r) => ({
    name: r.field.length > 14 ? r.field.slice(0, 13) + "…" : r.field,
    organicCarbon: r.organicCarbon,
  }))

  return (
    <ChartContainer config={carbonConfig} className="h-72 w-full">
      <AreaChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillCarbon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-organicCarbon)" stopOpacity={0.45} />
            <stop offset="95%" stopColor="var(--color-organicCarbon)" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={Math.max(0, Math.floor(chartData.length / 10) - 1)}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={34}
          domain={[0, "auto"]}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="organicCarbon"
          type="monotone"
          stroke="var(--color-organicCarbon)"
          strokeWidth={2}
          fill="url(#fillCarbon)"
          dot={chartData.length <= 20 ? { r: 3, fill: "var(--color-organicCarbon)" } : false}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}

// ─── 2. Nutrient Bar Chart (by region) ───────────────────────────────────────

const nutrientConfig = {
  nitrogen: { label: "Nitrogen", color: "var(--chart-1)" },
  phosphorus: { label: "Phosphorus", color: "var(--chart-2)" },
  potassium: { label: "Potassium", color: "var(--chart-4)" },
} satisfies ChartConfig

function buildNutrientData(records: SoilRecord[]) {
  const map = new Map<string, { n: number; nCount: number; p: number; pCount: number; k: number; kCount: number }>()
  for (const r of records) {
    const key = r.region || "Unknown"
    const e = map.get(key) ?? { n: 0, nCount: 0, p: 0, pCount: 0, k: 0, kCount: 0 }
    if (r.nitrogen  !== null && isFinite(r.nitrogen))  { e.n += r.nitrogen;  e.nCount += 1 }
    if (r.phosphorus !== null && isFinite(r.phosphorus)) { e.p += r.phosphorus; e.pCount += 1 }
    if (r.potassium !== null && isFinite(r.potassium)) { e.k += r.potassium; e.kCount += 1 }
    map.set(key, e)
  }
  return Array.from(map.entries()).map(([region, e]) => ({
    region: region.length > 12 ? region.slice(0, 11) + "…" : region,
    nitrogen:   e.nCount > 0 ? Math.round(e.n / e.nCount) : undefined,
    phosphorus: e.pCount > 0 ? Math.round(e.p / e.pCount) : undefined,
    potassium:  e.kCount > 0 ? Math.round(e.k / e.kCount) : undefined,
  }))
}

export function NutrientBarChart({ data }: { data: SoilRecord[] }) {
  if (!data.length) {
    return <EmptyChart label="Upload a dataset to see nutrient levels." />
  }

  const chartData = buildNutrientData(data)

  return (
    <ChartContainer config={nutrientConfig} className="h-72 w-full">
      <BarChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="region" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} tick={{ fontSize: 11 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="nitrogen" fill="var(--color-nitrogen)" radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="phosphorus" fill="var(--color-phosphorus)" radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="potassium" fill="var(--color-potassium)" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ChartContainer>
  )
}

// ─── 3. Sustainability Score Pie Chart ────────────────────────────────────────

const scoreConfig = {
  count: { label: "Fields" },
  excellent: { label: "Excellent (80+)", color: "var(--chart-1)" },
  good: { label: "Good (60–79)", color: "var(--chart-2)" },
  fair: { label: "Fair (40–59)", color: "var(--chart-4)" },
  poor: { label: "Needs Work (<40)", color: "var(--chart-5)" },
} satisfies ChartConfig

function buildScoreDistribution(records: SoilRecord[]) {
  const buckets = { excellent: 0, good: 0, fair: 0, poor: 0 }
  for (const r of records) {
    const { sustainabilityScore } = getStats([r], 1)
    if (sustainabilityScore >= 80) buckets.excellent += 1
    else if (sustainabilityScore >= 60) buckets.good += 1
    else if (sustainabilityScore >= 40) buckets.fair += 1
    else buckets.poor += 1
  }
  return [
    { key: "excellent", label: "Excellent (80+)", count: buckets.excellent },
    { key: "good", label: "Good (60–79)", count: buckets.good },
    { key: "fair", label: "Fair (40–59)", count: buckets.fair },
    { key: "poor", label: "Needs Work (<40)", count: buckets.poor },
  ].filter((b) => b.count > 0)
}

export function SustainabilityPieChart({ data }: { data: SoilRecord[] }) {
  if (!data.length) {
    return <EmptyChart label="Upload a dataset to see score distribution." />
  }

  const chartData = buildScoreDistribution(data)

  return (
    <ChartContainer config={scoreConfig} className="mx-auto aspect-square h-72">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="label"
          innerRadius={58}
          outerRadius={100}
          strokeWidth={2}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="label" />} />
      </PieChart>
    </ChartContainer>
  )
}
