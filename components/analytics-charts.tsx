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
import { carbonTrend } from "@/lib/soil-data"

const trendConfig = {
  organicCarbon: { label: "Organic Carbon (%)", color: "var(--chart-1)" },
} satisfies ChartConfig

export function CarbonTrendChart() {
  return (
    <ChartContainer config={trendConfig} className="h-72 w-full">
      <AreaChart data={carbonTrend} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillCarbon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-organicCarbon)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--color-organicCarbon)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} domain={[0, 4]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="organicCarbon"
          type="monotone"
          stroke="var(--color-organicCarbon)"
          strokeWidth={2}
          fill="url(#fillCarbon)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

const nutrientConfig = {
  nitrogen: { label: "Nitrogen", color: "var(--chart-1)" },
  phosphorus: { label: "Phosphorus", color: "var(--chart-2)" },
  potassium: { label: "Potassium", color: "var(--chart-4)" },
} satisfies ChartConfig

export function NutrientBarChart({
  data,
}: {
  data: { region: string; nitrogen: number; phosphorus: number; potassium: number }[]
}) {
  return (
    <ChartContainer config={nutrientConfig} className="h-72 w-full">
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="region" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="nitrogen" fill="var(--color-nitrogen)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="phosphorus" fill="var(--color-phosphorus)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="potassium" fill="var(--color-potassium)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

const scoreConfig = {
  count: { label: "Fields" },
  excellent: { label: "Excellent (80+)", color: "var(--chart-1)" },
  good: { label: "Good (60-79)", color: "var(--chart-2)" },
  fair: { label: "Fair (40-59)", color: "var(--chart-4)" },
  poor: { label: "Needs Work (<40)", color: "var(--chart-5)" },
} satisfies ChartConfig

export function SustainabilityPieChart({
  data,
}: {
  data: { key: string; label: string; count: number }[]
}) {
  return (
    <ChartContainer config={scoreConfig} className="mx-auto aspect-square h-72">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
        <Pie data={data} dataKey="count" nameKey="label" innerRadius={55} strokeWidth={3}>
          {data.map((entry) => (
            <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="label" />} />
      </PieChart>
    </ChartContainer>
  )
}
