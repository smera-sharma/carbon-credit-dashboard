"use client"

import type { ReactNode } from "react"
import { useFarm } from "@/lib/farm-context"
import { FarmerProfileModal } from "@/components/farmer-profile-modal"

export function AppInit({ children }: { children: ReactNode }) {
  const { isLoaded, farmerProfile } = useFarm()
  return (
    <>
      {children}
      {isLoaded && !farmerProfile && <FarmerProfileModal />}
    </>
  )
}
