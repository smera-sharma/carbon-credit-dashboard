"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Leaf, Moon, Sun, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFarm } from "@/lib/farm-context"

const links = [
  { href: "/",               label: "Home"            },
  { href: "/farms",          label: "Farms"           },
  { href: "/dashboard",      label: "Dashboard"       },
  { href: "/simulator",      label: "Simulator"       },
  { href: "/recommendations", label: "Recommendations" },
]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </Button>
  )
}

export function SiteHeader() {
  const pathname   = usePathname()
  const [open, setOpen] = useState(false)
  const { farmerProfile, selectedFarm, isLoaded } = useFarm()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="hidden text-base font-semibold tracking-tight sm:inline">
            Carbon Estimator
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 xl:flex">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Farmer chip */}
          {isLoaded && farmerProfile && (
            <Link
              href="/farms"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary sm:flex"
            >
              <User className="size-3.5 text-primary" />
              {farmerProfile.name}
            </Link>
          )}
          <ThemeToggle />
          <Button
            render={<Link href="/dashboard" />}
            nativeButton={false}
            className="hidden sm:inline-flex"
          >
            Upload Dataset
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-border bg-background px-4 pb-4 pt-2 xl:hidden">
          {isLoaded && farmerProfile && (
            <div className="mb-3 flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
              <User className="size-4 text-primary" />
              {farmerProfile.name}
              {selectedFarm && (
                <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {selectedFarm.name}
                </span>
              )}
            </div>
          )}
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
