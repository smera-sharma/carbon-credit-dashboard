"use client"

import { useState } from "react"
import { Leaf } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFarm } from "@/lib/farm-context"

export function FarmerProfileModal() {
  const { setFarmerProfile } = useFarm()
  const [name,   setName]   = useState("")
  const [email,  setEmail]  = useState("")
  const [region, setRegion] = useState("")
  const [error,  setError]  = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError("Please enter your name."); return }
    setFarmerProfile({ name: name.trim(), email: email.trim(), region: region.trim() })
  }

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Leaf className="size-6" />
          </div>
          <DialogTitle className="text-xl">Welcome to Carbon Estimator</DialogTitle>
          <DialogDescription>
            Set up your farmer profile to get started. Your name will appear in the dashboard
            header across all sessions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="profile-name"
              placeholder="e.g. Jordan Smith"
              value={name}
              onChange={(e) => { setName(e.target.value); setError("") }}
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-email">Email Address <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input
              id="profile-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-region">Region / Location <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input
              id="profile-region"
              placeholder="e.g. Canterbury, New Zealand"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full">
              Get Started
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
