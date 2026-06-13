"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { sampleSoilData, getSimulatorStats, type SoilRecord } from "@/lib/soil-data"

export type FarmerProfile = {
  name: string
  email: string
  region: string
}

export type Farm = {
  id: string
  name: string
  farmArea: number      // hectares
  soilDepth: number     // cm
  datasetSource: "sample" | "uploaded"
  uploadedRecords: SoilRecord[] | null
  createdAt: string
}

export type FarmWithStats = Farm & {
  soilData: SoilRecord[]
  carbonCredits: number
}

type FarmContextValue = {
  isLoaded: boolean
  farmerProfile: FarmerProfile | null
  setFarmerProfile: (profile: FarmerProfile) => void
  farms: Farm[]
  selectedFarmId: string | null
  selectedFarm: FarmWithStats | null
  allFarmsWithStats: FarmWithStats[]
  addFarm: (data: Omit<Farm, "id" | "createdAt">) => Farm
  updateFarm: (id: string, updates: Partial<Omit<Farm, "id" | "createdAt">>) => void
  deleteFarm: (id: string) => void
  selectFarm: (id: string | null) => void
}

const LS_PROFILE  = "cc_farmer_profile"
const LS_FARMS    = "cc_farms"
const LS_SELECTED = "cc_selected_farm_id"

function enrichFarm(farm: Farm): FarmWithStats {
  const soilData =
    farm.datasetSource === "uploaded" && farm.uploadedRecords
      ? farm.uploadedRecords
      : sampleSoilData
  const { carbonCredits } = getSimulatorStats(soilData, farm.farmArea, farm.soilDepth)
  return { ...farm, soilData, carbonCredits }
}

const FarmContext = createContext<FarmContextValue | null>(null)

export function FarmProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded]             = useState(false)
  const [farmerProfile, setFarmerProfileSt] = useState<FarmerProfile | null>(null)
  const [farms, setFarmsState]              = useState<Farm[]>([])
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const p = localStorage.getItem(LS_PROFILE)
      if (p) setFarmerProfileSt(JSON.parse(p))
      const f = localStorage.getItem(LS_FARMS)
      if (f) setFarmsState(JSON.parse(f))
      const s = localStorage.getItem(LS_SELECTED)
      if (s) setSelectedFarmId(s)
    } catch {}
    setIsLoaded(true)
  }, [])

  function setFarmerProfile(profile: FarmerProfile) {
    setFarmerProfileSt(profile)
    localStorage.setItem(LS_PROFILE, JSON.stringify(profile))
  }

  function saveFarms(updated: Farm[]) {
    setFarmsState(updated)
    try { localStorage.setItem(LS_FARMS, JSON.stringify(updated)) } catch (e) {
      console.warn("localStorage quota exceeded — uploaded CSV data may not persist across refreshes.")
    }
  }

  function addFarm(data: Omit<Farm, "id" | "createdAt">): Farm {
    const farm: Farm = {
      ...data,
      id: `farm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    }
    const updated = [...farms, farm]
    saveFarms(updated)
    if (updated.length === 1) selectFarm(farm.id)
    return farm
  }

  function updateFarm(id: string, updates: Partial<Omit<Farm, "id" | "createdAt">>) {
    saveFarms(farms.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  function deleteFarm(id: string) {
    const updated = farms.filter((f) => f.id !== id)
    saveFarms(updated)
    if (selectedFarmId === id) {
      selectFarm(updated.length > 0 ? updated[0].id : null)
    }
  }

  function selectFarm(id: string | null) {
    setSelectedFarmId(id)
    if (id) localStorage.setItem(LS_SELECTED, id)
    else localStorage.removeItem(LS_SELECTED)
  }

  const allFarmsWithStats = farms.map(enrichFarm)
  const selectedFarm = selectedFarmId
    ? (allFarmsWithStats.find((f) => f.id === selectedFarmId) ?? null)
    : null

  return (
    <FarmContext.Provider
      value={{
        isLoaded,
        farmerProfile,
        setFarmerProfile,
        farms,
        selectedFarmId,
        selectedFarm,
        allFarmsWithStats,
        addFarm,
        updateFarm,
        deleteFarm,
        selectFarm,
      }}
    >
      {children}
    </FarmContext.Provider>
  )
}

export function useFarm(): FarmContextValue {
  const ctx = useContext(FarmContext)
  if (!ctx) throw new Error("useFarm must be used inside <FarmProvider>")
  return ctx
}
