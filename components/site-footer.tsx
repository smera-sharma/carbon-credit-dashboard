import Link from "next/link"
import { Leaf } from "lucide-react"

export function SiteFooter() {
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
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                <li><Link href="/estimation" className="hover:text-foreground">Estimation</Link></li>
                <li><Link href="/analytics" className="hover:text-foreground">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Insights</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/recommendations" className="hover:text-foreground">Recommendations</Link></li>
                <li><Link href="/report" className="hover:text-foreground">Report</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Project</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Portfolio Demo</li>
                <li>React + TypeScript</li>
                <li>Tailwind + shadcn/ui</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          {"\u00A9"} {new Date().getFullYear()} Carbon Credit Estimator Dashboard. Built for sustainable agriculture.
        </div>
      </div>
    </footer>
  )
}
