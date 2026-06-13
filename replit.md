# Carbon Credit Estimator Dashboard

A Next.js 16 web application for sustainable agriculture analytics. Users can upload soil datasets to analyze soil health, estimate carbon credits, and discover sustainable farming recommendations.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui, Base UI, Lucide React
- **Charts**: Recharts
- **Theming**: next-themes (dark/light mode)

## Pages (4 total)

- `/` — Home: explains SOC and carbon credits, links to all sections, CTA to Dashboard
- `/dashboard` — Soil Analysis: SOC/pH/Clay/Soil Quality stats, 3 charts (SOC line, properties bar, SOC distribution histogram), CSV upload, soil health insights. **No carbon credit calculations.**
- `/simulator` — Carbon Credit Simulator: Farm Area + Soil Depth inputs (defaults: 5 ha, 30 cm), formula `Carbon Credits = SOC × Area × (Depth/30) × 3.67`, credits-vs-area chart, top 10 sites chart, scenario insights
- `/recommendations` — Recommendations & Report: SOC-level recommendations (High/Moderate/Low), Key Findings summary, Download Report button, disclaimer

## Dataset

- **Sample**: 227 real LimeSoDa field measurements (CC BY-SA 4.0) — BB.51 (Coastal Valley), BB.72 (Coastal Plains), G.104 (Highland Ridge)
- **Fields**: `SOC_target → organicCarbon`, `pH_target → ph`, `Clay_target → clay`, `Altitude → altitude`, `Slope → slope`
- **CSV Upload**: SOC column is mandatory (`SOC_target`, `SOC`, `Organic_Carbon`, or `Soil_Organic_Carbon`). Optional: pH, Clay, Altitude, Slope. Active dataset shared across all pages via context.

## Carbon Formula

```
Carbon Stock (tC)    = avgSOC% × farmArea × (soilDepth / 30)
Carbon Credits (tCO₂e) = Carbon Stock × 3.67
```

## Running the App

The app runs via the **"Start application"** workflow using:
```
npx next dev -p 5000
```

It is available on port **5000** in the Replit preview pane.

## User Preferences
