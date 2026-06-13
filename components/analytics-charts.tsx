"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
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
import type { FarmWithStats } from "@/lib/farm-context"
import { UploadCloud, TreePine } from "lucide-react"

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border text-muted-foreground">
      <UploadCloud className="size-8 opacity-40" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

// ─── 1. SOC Line Chart (dashboard) ───────────────────────────────────────────

const carbonConfig = {
  organicCarbon: { label: "SOC (%)", color: "var(--chart-1)" },
} satisfies ChartConfig

export function CarbonLineChart({ data }: { data: SoilRecord[] }) {
  if (!data.length) return <EmptyChart label="Upload a dataset to see SOC values." />

  const chartData = data.map((r) => ({
    name: r.field.length > 14 ? r.field.slice(0, 13) + "…" : r.field,
    organicCarbon: r.organicCarbon,
  }))

  return (
    <ChartContainer config={carbonConfig} className="h-64 w-full">
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
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={34} domain={[0, "auto"]} tick={{ fontSize: 11 }} />
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

// ─── 2. Soil Properties Bar Chart — avg SOC, Clay & pH by region (dashboard) ──

const soilPropsConfig = {
  soc:  { label: "Avg SOC (%)",  color: "var(--chart-1)" },
  clay: { label: "Avg Clay (%)", color: "var(--chart-2)" },
  ph:   { label: "Avg pH",       color: "var(--chart-4)" },
} satisfies ChartConfig

function buildRegionData(records: SoilRecord[]) {
  const map = new Map<string, { soc: number; socN: number; clay: number; clayN: number; ph: number; phN: number }>()
  for (const r of records) {
    const key = r.region || "Unknown"
    const e = map.get(key) ?? { soc: 0, socN: 0, clay: 0, clayN: 0, ph: 0, phN: 0 }
    if (r.organicCarbon !== null && isFinite(r.organicCarbon)) { e.soc  += r.organicCarbon; e.socN  += 1 }
    if (r.clay          !== null && isFinite(r.clay))          { e.clay += r.clay;          e.clayN += 1 }
    if (r.ph            !== null && isFinite(r.ph))            { e.ph   += r.ph;            e.phN   += 1 }
    map.set(key, e)
  }
  return Array.from(map.entries()).map(([region, e]) => ({
    region: region.length > 14 ? region.slice(0, 13) + "…" : region,
    soc:    e.socN  > 0 ? Math.round((e.soc  / e.socN)  * 100) / 100 : undefined,
    clay:   e.clayN > 0 ? Math.round(e.clay  / e.clayN)              : undefined,
    ph:     e.phN   > 0 ? Math.round((e.ph   / e.phN)   * 100) / 100 : undefined,
  }))
}

export function NutrientBarChart({ data }: { data: SoilRecord[] }) {
  if (!data.length) return <EmptyChart label="Upload a dataset to see soil properties by region." />
  const chartData = buildRegionData(data)
  return (
    <ChartContainer config={soilPropsConfig} className="h-64 w-full">
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

// ─── 3. SOC Distribution Histogram (dashboard) ───────────────────────────────

const distConfig = {
  count: { label: "Sites", color: "var(--chart-1)" },
} satisfies ChartConfig

const SOC_BINS = [
  { label: "< 0.5%",   min: -Infinity, max: 0.5  },
  { label: "0.5–1.0%", min: 0.5,       max: 1.0  },
  { label: "1.0–1.5%", min: 1.0,       max: 1.5  },
  { label: "1.5–2.0%", min: 1.5,       max: 2.0  },
  { label: "2.0–2.5%", min: 2.0,       max: 2.5  },
  { label: "2.5–3.0%", min: 2.5,       max: 3.0  },
  { label: "≥ 3.0%",   min: 3.0,       max: Infinity },
]

export function SOCDistributionChart({ data }: { data: SoilRecord[] }) {
  if (!data.length) return <EmptyChart label="Upload a dataset to see SOC distribution." />

  const counts = SOC_BINS.map((bin) => ({
    range: bin.label,
    count: data.filter((r) => r.organicCarbon !== null && r.organicCarbon > bin.min && r.organicCarbon <= bin.max).length,
  }))

  return (
    <ChartContainer config={distConfig} className="h-64 w-full">
      <BarChart data={counts} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 10 }} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} tick={{ fontSize: 11 }} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]}>
          {counts.map((_, i) => (
            <Cell
              key={`cell-${i}`}
              fill={
                i === 0 ? "var(--chart-5)" :
                i <= 1  ? "var(--chart-4)" :
                i <= 3  ? "var(--chart-1)" :
                           "var(--chart-2)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

// ─── 4. Credits vs Farm Area Chart (simulator) ────────────────────────────────

const simAreaConfig = {
  credits: { label: "Carbon Credits (tCO₂e)", color: "var(--chart-1)" },
} satisfies ChartConfig

export function SimulatorAreaChart({
  avgSOC,
  soilDepth,
  currentFarmArea,
}: {
  avgSOC: number
  soilDepth: number
  currentFarmArea: number
}) {
  const areas = [1, 2, 5, 10, 15, 20, 30, 40, 50, 75, 100]
  const chartData = areas.map((area) => ({
    area,
    credits: Math.round(avgSOC * area * (soilDepth / 30) * 3.67 * 100) / 100,
  }))

  return (
    <ChartContainer config={simAreaConfig} className="h-64 w-full">
      <AreaChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillCredits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-credits)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--color-credits)" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="area"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
          label={{ value: "Farm Area (ha)", position: "insideBottom", offset: -2, fontSize: 11 }}
          height={36}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} tick={{ fontSize: 11 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="credits"
          type="monotone"
          stroke="var(--color-credits)"
          strokeWidth={2}
          fill="url(#fillCredits)"
          dot={{ r: 3, fill: "var(--color-credits)" }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}

// ─── 5. Top 10 Sites by Carbon Potential (simulator) ─────────────────────────

const topConfig = {
  credits: { label: "Carbon Credits (tCO₂e)", color: "var(--chart-2)" },
} satisfies ChartConfig

export function TopSitesBarChart({
  data,
  farmArea,
  soilDepth,
}: {
  data: SoilRecord[]
  farmArea: number
  soilDepth: number
}) {
  if (!data.length) return <EmptyChart label="No data available." />

  const factor = farmArea * (soilDepth / 30) * 3.67
  const top10 = [...data]
    .filter((r) => r.organicCarbon !== null && isFinite(r.organicCarbon))
    .sort((a, b) => (b.organicCarbon ?? 0) - (a.organicCarbon ?? 0))
    .slice(0, 10)
    .map((r) => ({
      field:   r.field.length > 10 ? r.field.slice(0, 9) + "…" : r.field,
      credits: Math.round((r.organicCarbon ?? 0) * factor * 100) / 100,
    }))

  return (
    <ChartContainer config={topConfig} className="h-64 w-full">
      <BarChart data={top10} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="field" tickLine={false} axisLine={false} width={60} tick={{ fontSize: 11 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="credits" fill="var(--color-credits)" radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ChartContainer>
  )
}

// ─── 6. Farm Portfolio Comparison Chart (dashboard) ──────────────────────────

const farmCompConfig = {
  credits: { label: "Carbon Credits (tCO₂e)", color: "var(--chart-1)" },
} satisfies ChartConfig

export function FarmComparisonChart({ farms }: { farms: FarmWithStats[] }) {
  if (!farms.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border text-muted-foreground">
        <TreePine className="size-8 opacity-40" />
        <p className="text-sm">Add farms to see a portfolio comparison.</p>
      </div>
    )
  }

  const chartData = farms.map((f) => ({
    name: f.name.length > 14 ? f.name.slice(0, 13) + "…" : f.name,
    credits: f.carbonCredits,
  }))

  return (
    <ChartContainer config={farmCompConfig} className="h-64 w-full">
      <BarChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} tick={{ fontSize: 11 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="credits" radius={[4, 4, 0, 0]} maxBarSize={52}>
          {chartData.map((_, i) => (
            <Cell
              key={`cell-${i}`}
              fill={
                i % 5 === 0 ? "var(--chart-1)" :
                i % 5 === 1 ? "var(--chart-2)" :
                i % 5 === 2 ? "var(--chart-3)" :
                i % 5 === 3 ? "var(--chart-4)" :
                               "var(--chart-5)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
