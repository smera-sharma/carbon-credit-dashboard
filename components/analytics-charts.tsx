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

// ─── 1. SOC Line Chart ────────────────────────────────────────────────────────

const carbonConfig = {
  organicCarbon: { label: "SOC (%)", color: "var(--chart-1)" },
} satisfies ChartConfig

export function CarbonLineChart({ data }: { data: SoilRecord[] }) {
  if (!data.length) {
    return <EmptyChart label="Upload a dataset to see SOC values." />
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
          dot={chartData.length <= 30 ? { r: 3, fill: "var(--color-organicCarbon)" } : false}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}

// ─── 2. Soil Properties Bar Chart (SOC & Clay by region) ─────────────────────

const soilPropsConfig = {
  soc:  { label: "Avg SOC (%)",   color: "var(--chart-1)" },
  clay: { label: "Avg Clay (%)",  color: "var(--chart-2)" },
  ph:   { label: "Avg pH",        color: "var(--chart-4)" },
} satisfies ChartConfig

function buildSoilPropsData(records: SoilRecord[]) {
  const map = new Map<string, {
    soc: number; socCount: number
    clay: number; clayCount: number
    ph: number; phCount: number
  }>()
  for (const r of records) {
    const key = r.region || "Unknown"
    const e = map.get(key) ?? { soc: 0, socCount: 0, clay: 0, clayCount: 0, ph: 0, phCount: 0 }
    if (r.organicCarbon !== null && isFinite(r.organicCarbon)) { e.soc  += r.organicCarbon; e.socCount  += 1 }
    if (r.clay          !== null && isFinite(r.clay))          { e.clay += r.clay;          e.clayCount += 1 }
    if (r.ph            !== null && isFinite(r.ph))            { e.ph   += r.ph;            e.phCount   += 1 }
    map.set(key, e)
  }
  return Array.from(map.entries()).map(([region, e]) => ({
    region:  region.length > 14 ? region.slice(0, 13) + "…" : region,
    soc:     e.socCount  > 0 ? Math.round((e.soc  / e.socCount)  * 100) / 100 : undefined,
    clay:    e.clayCount > 0 ? Math.round(e.clay  / e.clayCount)              : undefined,
    ph:      e.phCount   > 0 ? Math.round((e.ph   / e.phCount)   * 100) / 100 : undefined,
  }))
}

export function NutrientBarChart({ data }: { data: SoilRecord[] }) {
  if (!data.length) {
    return <EmptyChart label="Upload a dataset to see soil properties by region." />
  }

  const chartData = buildSoilPropsData(data)

  return (
    <ChartContainer config={soilPropsConfig} className="h-72 w-full">
      <BarChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="region" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} tick={{ fontSize: 11 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="soc"  fill="var(--color-soc)"  radius={[4, 4, 0, 0]} maxBarSize={36} />
        <Bar dataKey="clay" fill="var(--color-clay)" radius={[4, 4, 0, 0]} maxBarSize={36} />
        <Bar dataKey="ph"   fill="var(--color-ph)"   radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ChartContainer>
  )
}

// ─── 3. Sustainability Score Pie Chart ────────────────────────────────────────

const scoreConfig = {
  count:     { label: "Sites" },
  excellent: { label: "Excellent (80+)",  color: "var(--chart-1)" },
  good:      { label: "Good (60–79)",     color: "var(--chart-2)" },
  fair:      { label: "Fair (40–59)",     color: "var(--chart-4)" },
  poor:      { label: "Needs Work (<40)", color: "var(--chart-5)" },
} satisfies ChartConfig

function buildScoreDistribution(records: SoilRecord[]) {
  const buckets = { excellent: 0, good: 0, fair: 0, poor: 0 }
  for (const r of records) {
    const { sustainabilityScore } = getStats([r], 1)
    if      (sustainabilityScore >= 80) buckets.excellent += 1
    else if (sustainabilityScore >= 60) buckets.good      += 1
    else if (sustainabilityScore >= 40) buckets.fair      += 1
    else                                buckets.poor      += 1
  }
  return [
    { key: "excellent", label: "Excellent (80+)",  count: buckets.excellent },
    { key: "good",      label: "Good (60–79)",     count: buckets.good      },
    { key: "fair",      label: "Fair (40–59)",     count: buckets.fair      },
    { key: "poor",      label: "Needs Work (<40)", count: buckets.poor      },
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
