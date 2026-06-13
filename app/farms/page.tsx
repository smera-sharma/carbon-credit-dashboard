"use client"

import { useState, useEffect } from "react"
import {
  Plus, Pencil, Trash2, CheckCircle2, MapPin, Layers, Calculator,
  Sprout, UploadCloud, X, Loader2, AlertCircle, Database,
  TreePine, Coins,
} from "lucide-react"
import { PageShell, PageHeading } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { StatGrid } from "@/components/stat-card"
import { useFarm, type Farm } from "@/lib/farm-context"
import { getStats } from "@/lib/soil-data"
import { parseCSV } from "@/lib/csv-parser"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type DialogMode = "add" | "edit"
type UploadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; fileName: string; recordCount: number }
  | { status: "error"; message: string }

// ─── Farm Dialog ──────────────────────────────────────────────────────────────

function FarmDialog({
  open,
  onClose,
  mode,
  farm,
}: {
  open: boolean
  onClose: () => void
  mode: DialogMode
  farm: Farm | null
}) {
  const { addFarm, updateFarm } = useFarm()

  const [name,            setName]            = useState("")
  const [farmArea,        setFarmArea]        = useState(5)
  const [soilDepth,       setSoilDepth]       = useState(30)
  const [datasetSource,   setDatasetSource]   = useState<"sample" | "uploaded">("sample")
  const [uploadedRecords, setUploadedRecords] = useState<SoilRecord[] | null>(null)
  const [uploadState,     setUploadState]     = useState<UploadState>({ status: "idle" })
  const [nameError,       setNameError]       = useState("")

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (mode === "edit" && farm) {
        setName(farm.name)
        setFarmArea(farm.farmArea)
        setSoilDepth(farm.soilDepth)
        setDatasetSource(farm.datasetSource)
        setUploadedRecords(farm.uploadedRecords)
        setUploadState(
          farm.datasetSource === "uploaded" && farm.uploadedRecords
            ? { status: "success", fileName: "existing dataset", recordCount: farm.uploadedRecords.length }
            : { status: "idle" },
        )
      } else {
        setName("")
        setFarmArea(5)
        setSoilDepth(30)
        setDatasetSource("sample")
        setUploadedRecords(null)
        setUploadState({ status: "idle" })
      }
      setNameError("")
    }
  }, [open, mode, farm])

  async function handleFile(file: File) {
    setUploadState({ status: "loading" })
    const result = await parseCSV(file)
    if (!result.ok) {
      setUploadState({ status: "error", message: result.error })
      return
    }
    setUploadedRecords(result.records)
    setUploadState({ status: "success", fileName: file.name, recordCount: result.records.length })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setNameError("Farm name is required."); return }
    if (datasetSource === "uploaded" && !uploadedRecords) {
      setUploadState({ status: "error", message: "Please upload a valid CSV dataset." })
      return
    }

    const payload = {
      name: name.trim(),
      farmArea: Math.max(0.1, farmArea),
      soilDepth: Math.min(100, Math.max(5, soilDepth)),
      datasetSource,
      uploadedRecords: datasetSource === "uploaded" ? uploadedRecords : null,
    }

    if (mode === "edit" && farm) updateFarm(farm.id, payload)
    else addFarm(payload)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Farm" : "Edit Farm"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a farm to associate soil data and track carbon credit potential."
              : "Update this farm's details and dataset."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Farm Name */}
          <div className="space-y-1.5">
            <Label htmlFor="farm-name">Farm Name <span className="text-destructive">*</span></Label>
            <Input
              id="farm-name"
              placeholder="e.g. Green Valley Farm"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError("") }}
              autoFocus
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          {/* Area + Depth */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="farm-area">Farm Area (ha)</Label>
              <Input id="farm-area" type="number" min={0.1} step={0.5} value={farmArea}
                onChange={(e) => setFarmArea(Number(e.target.value))} />
              <p className="text-xs text-muted-foreground">Default: 5 ha</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="soil-depth">Soil Depth (cm)</Label>
              <Input id="soil-depth" type="number" min={5} max={100} step={5} value={soilDepth}
                onChange={(e) => setSoilDepth(Number(e.target.value))} />
              <p className="text-xs text-muted-foreground">Default: 30 cm</p>
            </div>
          </div>

          {/* Dataset Source */}
          <div className="space-y-2">
            <Label>Dataset Source</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["sample", "uploaded"] as const).map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => { setDatasetSource(src); if (src === "sample") setUploadState({ status: "idle" }) }}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition-colors text-left",
                    datasetSource === src
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {src === "sample" ? <Database className="size-4 shrink-0" /> : <UploadCloud className="size-4 shrink-0" />}
                  {src === "sample" ? "Sample SOC Dataset" : "Upload CSV"}
                </button>
              ))}
            </div>
          </div>

          {/* CSV Upload (shown when "uploaded" selected) */}
          {datasetSource === "uploaded" && (
            <div className="space-y-2">
              <label
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
                  uploadState.status === "error"
                    ? "border-destructive/50 bg-destructive/5"
                    : uploadState.status === "success"
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <input type="file" accept=".csv" className="sr-only"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = "" }} />
                {uploadState.status === "loading" ? (
                  <Loader2 className="size-6 animate-spin text-primary" />
                ) : uploadState.status === "success" ? (
                  <CheckCircle2 className="size-6 text-green-600" />
                ) : uploadState.status === "error" ? (
                  <AlertCircle className="size-6 text-destructive" />
                ) : (
                  <UploadCloud className="size-6 text-muted-foreground" />
                )}
                <p className="mt-2 text-sm">
                  {uploadState.status === "loading" ? "Parsing…"
                    : uploadState.status === "success"
                    ? `${uploadState.recordCount} records loaded`
                    : uploadState.status === "error"
                    ? "Upload failed — click to retry"
                    : "Click to upload CSV"}
                </p>
                {uploadState.status === "error" && (
                  <p className="mt-1 text-xs text-destructive">{uploadState.message}</p>
                )}
                {uploadState.status !== "success" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    SOC column required: SOC_target, SOC, or Organic_Carbon
                  </p>
                )}
              </label>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{mode === "add" ? "Add Farm" : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Farm Card ────────────────────────────────────────────────────────────────

function FarmCard({
  farm,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  farm: { id: string; name: string; farmArea: number; soilDepth: number; datasetSource: string; carbonCredits: number; createdAt: string }
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card
      className={cn(
        "relative transition-shadow hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2",
      )}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{farm.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Created {new Date(farm.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          {isSelected && (
            <Badge className="shrink-0 bg-primary text-primary-foreground">Active</Badge>
          )}
        </div>

        <Separator className="my-4" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: MapPin,     label: "Farm Area",    value: `${farm.farmArea} ha`     },
            { icon: Layers,     label: "Soil Depth",   value: `${farm.soilDepth} cm`    },
            { icon: Database,   label: "Dataset",      value: farm.datasetSource === "uploaded" ? "CSV" : "Sample" },
            { icon: Coins,      label: "Est. Credits", value: `${farm.carbonCredits} tCO₂e` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg bg-secondary/40 px-3 py-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="size-3.5" /> {label}
              </div>
              <p className="mt-0.5 text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          {!isSelected && (
            <Button size="sm" className="flex-1" onClick={onSelect}>
              <CheckCircle2 className="size-4" /> Select
            </Button>
          )}
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onEdit}>
            <Pencil className="size-3.5" /> Edit
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={onDelete}>
            <Trash2 className="size-3.5" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FarmsPage() {
  const { farmerProfile, allFarmsWithStats, selectedFarmId, selectFarm, deleteFarm, isLoaded } = useFarm()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>("add")
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null)

  function openAdd() { setDialogMode("add"); setEditingFarm(null); setDialogOpen(true) }
  function openEdit(farm: Farm) { setDialogMode("edit"); setEditingFarm(farm); setDialogOpen(true) }

  const totalCredits = allFarmsWithStats.reduce((s, f) => s + f.carbonCredits, 0)
  const topFarm      = allFarmsWithStats.reduce<typeof allFarmsWithStats[0] | null>(
    (best, f) => (best === null || f.carbonCredits > best.carbonCredits ? f : best),
    null,
  )

  const statItems = [
    {
      label: "Total Farms",
      value: String(allFarmsWithStats.length),
      hint: "in your portfolio",
      icon: TreePine,
    },
    {
      label: "Total Credits",
      value: `${Math.round(totalCredits * 100) / 100} tCO₂e`,
      hint: "across all farms",
      icon: Coins,
    },
    {
      label: "Top Farm",
      value: topFarm?.name ?? "—",
      hint: topFarm ? `${topFarm.carbonCredits} tCO₂e` : "no farms yet",
      icon: Sprout,
    },
    {
      label: "Selected Farm",
      value: allFarmsWithStats.find((f) => f.id === selectedFarmId)?.name ?? "None",
      hint: "currently active",
      icon: CheckCircle2,
    },
  ]

  if (!isLoaded) return null

  return (
    <PageShell>
      <PageHeading
        eyebrow="Farm Portfolio"
        title="Your Farms"
        description={
          farmerProfile
            ? `${farmerProfile.name}'s farm portfolio. Select a farm to drive the Dashboard, Simulator, and Recommendations.`
            : "Manage your farms and select one to analyse."
        }
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">

        {allFarmsWithStats.length > 0 && (
          <>
            <StatGrid items={statItems} className="lg:grid-cols-4" />
          </>
        )}

        {/* Empty state */}
        {allFarmsWithStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <TreePine className="size-8" />
            </span>
            <h2 className="mt-5 text-xl font-semibold">Start your sustainability journey</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Add your first farm to start analysing soil health, simulating carbon credits, and
              generating recommendations.
            </p>
            <Button className="mt-6 gap-2" onClick={openAdd}>
              <Plus className="size-4" /> Add Your First Farm
            </Button>
          </div>
        ) : (
          <>
            {/* Farm grid header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">
                {allFarmsWithStats.length} {allFarmsWithStats.length === 1 ? "Farm" : "Farms"}
              </h2>
              <Button className="gap-2" onClick={openAdd}>
                <Plus className="size-4" /> Add Farm
              </Button>
            </div>

            {/* Farm cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {allFarmsWithStats.map((farm) => (
                <FarmCard
                  key={farm.id}
                  farm={farm}
                  isSelected={farm.id === selectedFarmId}
                  onSelect={() => selectFarm(farm.id)}
                  onEdit={() => openEdit(farm)}
                  onDelete={() => {
                    if (window.confirm(`Delete "${farm.name}"? This cannot be undone.`)) deleteFarm(farm.id)
                  }}
                />
              ))}
            </div>
          </>
        )}

      </div>

      <FarmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        farm={editingFarm}
      />
    </PageShell>
  )
}
