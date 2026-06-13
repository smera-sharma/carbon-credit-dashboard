"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { sampleSoilData, type SoilRecord } from "@/lib/soil-data"

type SoilContextValue = {
  soilData: SoilRecord[]
  isUploadedData: boolean
  farmArea: number
  setFarmArea: (area: number) => void
  setUploadedData: (records: SoilRecord[]) => void
  clearUploadedData: () => void
}

const SoilContext = createContext<SoilContextValue | null>(null)

export function SoilProvider({ children }: { children: ReactNode }) {
  const [uploadedData, setUploadedDataState] = useState<SoilRecord[] | null>(null)
  const [farmArea, setFarmArea] = useState(120)

  function setUploadedData(records: SoilRecord[]) {
    setUploadedDataState(records)
  }

  function clearUploadedData() {
    setUploadedDataState(null)
  }

  return (
    <SoilContext.Provider
      value={{
        soilData: uploadedData ?? sampleSoilData,
        isUploadedData: uploadedData !== null,
        farmArea,
        setFarmArea,
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
