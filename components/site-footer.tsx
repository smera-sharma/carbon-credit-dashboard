"use client"

import Link from "next/link"
import { Leaf } from "lucide-react"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Leaf className="size-5" />
              </span>
              <span className="text-base font-semibold tracking-tight">Carbon Estimator</span>
            </div>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              A sustainability analytics dashboard that turns soil data into carbon credit
              estimates and actionable recommendations for regenerative agriculture.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold">Product</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link></li>
                <li><Link href="/estimation" className="transition-colors hover:text-foreground">Estimation</Link></li>
                <li><Link href="/analytics" className="transition-colors hover:text-foreground">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Insights</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/recommendations" className="transition-colors hover:text-foreground">Recommendations</Link></li>
                <li><Link href="/report" className="transition-colors hover:text-foreground">Report</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Stack</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Next.js 16 + React 19</li>
                <li>TypeScript</li>
                <li>Tailwind + shadcn/ui</li>
                <li>Recharts · Papa Parse</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <span>© {year} Carbon Credit Estimator Dashboard. Built for sustainable agriculture.</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-green-500" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  )
}
