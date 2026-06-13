"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { sampleSoilData, type SoilRecord } from "@/lib/soil-data"
import { useFarm } from "@/lib/farm-context"

type SoilContextValue = {
  soilData: SoilRecord[]
  isUploadedData: boolean
  farmArea: number
  setFarmArea: (area: number) => void
  soilDepth: number
  setSoilDepth: (depth: number) => void
  setUploadedData: (records: SoilRecord[]) => void
  clearUploadedData: () => void
}

const SoilContext = createContext<SoilContextValue | null>(null)

export function SoilProvider({ children }: { children: ReactNode }) {
  const { selectedFarm, selectedFarmId, updateFarm } = useFarm()

  // Standalone state — used when no farm is selected
  const [localFarmArea, setLocalFarmArea]   = useState(5)
  const [localSoilDepth, setLocalSoilDepth] = useState(30)
  const [localUploaded, setLocalUploaded]   = useState<SoilRecord[] | null>(null)

  const soilData      = selectedFarm?.soilData ?? localUploaded ?? sampleSoilData
  const isUploadedData = selectedFarm
    ? selectedFarm.datasetSource === "uploaded"
    : localUploaded !== null
  const farmArea  = selectedFarm?.farmArea  ?? localFarmArea
  const soilDepth = selectedFarm?.soilDepth ?? localSoilDepth

  function setFarmArea(area: number) {
    if (selectedFarmId) updateFarm(selectedFarmId, { farmArea: area })
    else setLocalFarmArea(area)
  }

  function setSoilDepth(depth: number) {
    if (selectedFarmId) updateFarm(selectedFarmId, { soilDepth: depth })
    else setLocalSoilDepth(depth)
  }

  function setUploadedData(records: SoilRecord[]) {
    if (selectedFarmId)
      updateFarm(selectedFarmId, { datasetSource: "uploaded", uploadedRecords: records })
    else setLocalUploaded(records)
  }

  function clearUploadedData() {
    if (selectedFarmId)
      updateFarm(selectedFarmId, { datasetSource: "sample", uploadedRecords: null })
    else setLocalUploaded(null)
  }

  return (
    <SoilContext.Provider
      value={{
        soilData,
        isUploadedData,
        farmArea,
        setFarmArea,
        soilDepth,
        setSoilDepth,
        setUploadedData,
        clearUploadedData,
      }}
    >
      {children}
    </SoilContext.Provider>
  )
}

export function useSoil(): SoilContextValue {
  const ctx = useContext(SoilContext)
  if (!ctx) throw new Error("useSoil must be used inside <SoilProvider>")
  return ctx
}
