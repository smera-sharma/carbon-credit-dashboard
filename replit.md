# Carbon Credit Estimator Dashboard

A Next.js 16 web application for sustainable agriculture analytics. A single farmer can manage multiple farms, upload per-farm soil datasets, and track carbon credit potential across a full portfolio.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Base UI), Lucide React
- **Charts**: Recharts
- **Theming**: next-themes (dark/light mode)

## Pages (5 total)

- `/` — Home: explains SOC and carbon credits, links to all sections, CTA to Dashboard
- `/farms` — Farm Portfolio: CRUD for farms, per-farm dataset assignment, farm selection, portfolio stats
- `/dashboard` — Soil Analysis: portfolio overview (total farms, total credits, top farm, avg SOC), farm comparison chart, selected-farm soil analysis (SOC/pH/Clay/Quality stats, 3 charts, CSV upload)
- `/simulator` — Carbon Credit Simulator: saved farm values vs temporary simulation values side-by-side, difference card, credits-vs-area chart, top 10 sites chart. "Save to Farm" persists simulation values.
- `/recommendations` — Recommendations & Report: farm-specific SOC-level recommendations (High/Moderate/Low), Key Findings summary, Download Report button, disclaimer

## Farm Portfolio System

- **Farmer Profile**: set on first visit via modal (name required, email + region optional). Persists in `localStorage`. Name shown in nav.
- **Farm**: `{ id, name, farmArea (ha), soilDepth (cm), datasetSource: "sample"|"uploaded", uploadedRecords, createdAt }`
- **Selection**: selecting a farm drives Dashboard, Simulator, and Recommendations automatically
- **"Currently Viewing" banner**: shown on Dashboard, Simulator, and Recommendations
- **Comparison chart**: `FarmComparisonChart` on dashboard shows credits per farm

## localStorage Keys

| Key | Content |
|-----|---------|
| `cc_farmer_profile` | `FarmerProfile` JSON |
| `cc_farms` | `Farm[]` JSON (includes uploaded CSV records) |
| `cc_selected_farm_id` | active farm ID string |

## Provider Hierarchy (app/layout.tsx)

```
ThemeProvider
  └─ FarmProvider          (lib/farm-context.tsx)
       └─ SoilProvider     (lib/soil-context.tsx — derives data from selected farm)
            └─ AppInit     (components/app-init.tsx — shows profile modal if needed)
```

## Dataset

- **Sample**: 227 real LimeSoDa field measurements (CC BY-SA 4.0) — BB.51 (Coastal Valley), BB.72 (Coastal Plains), G.104 (Highland Ridge)
- **Fields**: `SOC_target → organicCarbon`, `pH_target → ph`, `Clay_target → clay`, `Altitude → altitude`, `Slope → slope`
- **CSV Upload**: SOC column mandatory (`SOC_target`, `SOC`, `Organic_Carbon`, or `Soil_Organic_Carbon`). Optional: pH, Clay, Altitude, Slope. Dataset is associated with the selected farm.

## Carbon Formula

```
Carbon Stock (tC)      = avgSOC% × farmArea × (soilDepth / 30)
Carbon Credits (tCO₂e) = Carbon Stock × 3.67
```

## Running the App

The app runs via the **"Start application"** workflow using:
```
npx next dev -p 5000
```

Available on port **5000** in the Replit preview pane.

## User Preferences
