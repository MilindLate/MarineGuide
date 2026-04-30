<div align="center">

<img src="https://img.shields.io/badge/Google_Solution_Challenge-2026-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Solution Challenge 2026"/>

# ⚓ MarineGuide
### Maritime Intelligence Platform

**AI-powered situational awareness, route optimization, and geopolitical risk monitoring for global shipping operations.**

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Genkit](https://img.shields.io/badge/Genkit_1.28-EA4335?style=flat-square&logo=firebase&logoColor=white)](https://firebase.google.com/docs/genkit)
[![Firebase](https://img.shields.io/badge/Firebase_Hosting-FBBC04?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-34A853?style=flat-square)](LICENSE)

<br/>

[🚀 Live Demo](#-live-demo) · [✨ Features](#-features) · [🏗 Architecture](#-system-architecture) · [⚡ Quick Start](#-quick-start) · [🤖 AI Flows](#-ai-flows) · [📁 Project Structure](#-project-structure) · [🗺 Roadmap](#-roadmap)

<br/>

</div>

---

## 🌊 The Problem

Global maritime supply chains carry **$14 trillion** in trade annually — yet operators are flying blind.

- 🔴 **Geopolitical instability** (Red Sea / Houthi attacks, Strait of Hormuz tensions) disrupts established shipping lanes with no unified early-warning system
- 🟡 **Port congestion** at Shanghai, Rotterdam, and Singapore causes $100M+ in daily demurrage costs with no predictive intelligence
- 🔵 **Reactive decision-making** — fleet managers receive alerts *after* incidents, not before — leading to costly reroutes and cargo delays
- ⚫ **Fragmented tooling** — AIS tracking, risk maps, weather data, and route planners are siloed across 5+ platforms

**MarineGuide brings all of this into one AI-powered command center.**

---

## 💡 Solution Overview

MarineGuide is a **unified maritime intelligence platform** that integrates vessel tracking, geopolitical risk monitoring, port intelligence, and a generative AI engine into a single interface — enabling logistics operators to **see everything, decide faster, and act with confidence**.

> Built on **Google Gemini 2.5 Flash** via **Genkit**, deployed on **Firebase App Hosting**, and aligned with **SDG 14 (Life Below Water)** and **SDG 9 (Industry, Innovation & Infrastructure)**.

---

## ✨ Features

### 🗺 Live Ocean Intelligence Map
Interactive **Leaflet.js** map with ESRI Ocean Basemap tiles. Real-time vessel markers with heading indicators, clickable tooltips showing risk scores and destinations, color-coded **geopolitical risk zones** (Red Sea, Strait of Hormuz, Bab el-Mandeb), port markers with congestion overlays, and a 2D / Globe view toggle.

### 🤖 AI Route Optimizer *(Gemini 2.5 Flash)*
Select any vessel and origin–destination pair. Gemini analyzes geopolitical risk, weather patterns, fuel cost, and historical congestion to return **3+ structured route options** — each with risk score (0–100), ETA delta (days), cost delta (USD), and a plain-English recommendation. Output is **Zod-validated JSON**, not freeform text.

### 💬 AI Maritime Assistant *(Gemini 2.5 Flash)*
A conversational chat interface where operators can ask anything — "What's the risk in the Red Sea today?", "Suggest an alternative to Suez for a bulk carrier", "Which Indian ports have lowest congestion?". Powered by the `aiChatAssistant` Genkit flow.

### 📋 Daily Intelligence Briefing *(Auto-generated on load)*
Every Dashboard load triggers a fresh Gemini-generated briefing with three structured sections: **Critical Risks**, **Port Watch**, and **Recommendations**. The `dailyMaritimeBriefing` flow outputs validated JSON rendered into a clean briefing card.

### 🚨 Dynamic Alert System
Real-time alert feed with severity tiers (SEV1–SEV5), filterable by type: **Piracy**, **Weather**, **Congestion**, **Geopolitical**, **Anomaly**. Each alert includes affected region, recommended action, and timestamp.

### 🚢 Fleet Tracker
Monitor 100+ registered vessels with live risk scores, IMO numbers, vessel type (Container / Tanker / Bulk Carrier), speed, heading, and current destination — all generated from a structured maritime data layer.

### 🏭 Port Intelligence
50+ global ports including major Indian ports (JNPT Mumbai, Chennai, Mundra, Visakhapatnam), Turkish ports (Ambarlı, Mersin), and global hubs (Shanghai, Singapore, Rotterdam). Each port shows congestion level, average wait time, vessel count, and risk index.

### 🏢 Shipping Company Directory
9 major carriers including Indian operators (SCI, Adani Ports, JSW Shipping), with fleet sizes, routes, and operational risk summaries.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  ① CLIENT LAYER  —  Browser / Next.js Pages                    │
│                                                                   │
│  [Dashboard] [Live Map] [AI Assistant] [Optimizer] [Alerts]     │
└───────────────────────┬─────────────────────────────────────────┘
                        │  'use server'  Server Actions
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│  ② SERVER LAYER  —  Next.js 15 App Router · Node.js v20        │
│                                                                   │
│  [Genkit Orchestrator] [Maritime Data Layer] [API Gateway]      │
│   genkit.ts · 3 flows   maritime-data.ts        Server Actions  │
└──────────────┬──────────────────────────────────────────────────┘
               │  Gemini API  ·  GOOGLE_GENAI_API_KEY (secret)
               ▼
┌─────────────────────────────────────────────────────────────────┐
│  ③ AI LAYER  —  Google Genkit 1.28 · Gemini 2.5 Flash         │
│                                                                   │
│  [Gemini 2.5 Flash]  [Route Optimizer]  [Chat Assistant]        │
│  googleai/gemini-..  aiRouteOptimization  aiChatAssistant       │
│                                                                   │
│  [Daily Briefing]    [Leaflet.js Map]                           │
│  dailyBriefingFlow   ESRI Ocean Tiles                           │
└──────────────────────────────┬──────────────────────────────────┘
                               │  Firebase App Hosting · apphosting.yaml
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  ④ CLOUD HOSTING  —  Google Firebase                           │
│                                                                   │
│  [Firebase App Hosting]  [API Key Secret]  [Node.js Runtime]    │
│  Auto-deploy · CDN · SSL  Env secret only   v20 server render   │
└─────────────────────────────────────────────────────────────────┘

Data Flow:
User → Next.js Pages → Server Actions → Genkit → Gemini API → Zod JSON → UI
```

### Key Architectural Decisions

| Decision | Rationale |
|---|---|
| **`'use server'` Server Actions** | API keys never reach the browser — enforced by Next.js at compile time |
| **Zod schema output** | Gemini responses are type-validated at runtime — no freeform text parsing |
| **Firebase App Hosting** | Serverless, CDN-edge, zero-config SSL — scales to zero when idle |
| **Genkit abstraction** | Swappable AI models — can move from Gemini to any other model without rewriting flows |
| **Leaflet + ESRI Ocean** | Free-tier ocean basemap with nautical depth contours — purpose-built for maritime |

---

## 🤖 AI Flows

All three flows live in `src/ai/flows/` and are called via Next.js Server Actions. Each uses **Zod schemas** for type-safe structured output.

### 1. Route Optimization — `aiRouteOptimization()`

**File:** `src/ai/flows/route-optimization-flow.ts`

```typescript
// Input
{
  originPort: string;       // e.g. "Shanghai, China"
  destinationPort: string;  // e.g. "Rotterdam, Netherlands"
  vesselType: string;       // "Container" | "Tanker" | "Bulk Carrier"
}

// Output — Zod-validated JSON
{
  recommendations: [
    {
      routeName: string;       // "Via Cape of Good Hope"
      distanceNm: number;      // 12400
      etaDeltaDays: number;    // +3 days vs baseline
      costDeltaUsd: number;    // +12000 vs baseline
      riskScore: number;       // 0–100
      riskCategory: "Critical" | "High" | "Medium" | "Low"
    }
  ],
  aiRecommendation: string;  // Plain-English recommendation
}
```

Gemini considers: geopolitical risk zones, historical weather patterns, port congestion, fuel efficiency, and vessel type constraints.

---

### 2. Chat Assistant — `aiChatAssistant()`

**File:** `src/ai/flows/ai-chat-assistant-flow.ts`

```typescript
// Input
{ query: string }  // "What's the risk in the Red Sea today?"

// Output
{ response: string }  // Expert maritime intelligence response
```

System prompt positions Gemini as a maritime intelligence expert with knowledge of vessels, ports, routes, and geopolitical conditions.

---

### 3. Daily Briefing — `dailyMaritimeBriefing()`

**File:** `src/ai/flows/daily-maritime-briefing-flow.ts`

```typescript
// Input — none required
{}

// Output — 4-section structured briefing
{
  summaryTitle: string;       // "Daily Maritime Risk Summary — April 30, 2026"
  criticalSection: string;    // 🔴 Critical threats & vessel alerts
  portWatchSection: string;   // 🟡 Port congestion & delays
  recommendedSection: string; // 🟢 Strategic recommendations
}
```

Auto-triggered on every Dashboard load. Renders as a structured briefing card.

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v20 or higher
- **npm** v9+
- A **Google AI API key** — get one free at [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/MilindLate/MarineGuide.git
cd MarineGuide
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Required — Google AI (Gemini) API Key
GOOGLE_GENAI_API_KEY=your_api_key_here

# Optional — Firebase config (for future auth/Firestore integration)
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

> ⚠️ **Never commit your `.env.local` file.** It's already in `.gitignore`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

### 5. (Optional) Run the Genkit AI dev server

In a separate terminal, to inspect and test AI flows interactively:

```bash
npm run genkit:dev
```

This opens the Genkit Developer UI at [http://localhost:4000](http://localhost:4000) — you can test all three AI flows directly.

---

## 🚀 Deployment — Firebase App Hosting

`apphosting.yaml` is already configured. Deploy to production in 3 steps:

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2. Set the API key as a secret

```bash
firebase apphosting:secrets:set GOOGLE_GENAI_API_KEY
# Paste your Gemini API key when prompted
```

### 3. Deploy

```bash
firebase deploy
```

Your app will be live at `https://<project-id>.web.app` with auto-SSL, global CDN, and serverless scaling.

---

## 📁 Project Structure

```
MarineGuide/
├── src/
│   ├── ai/
│   │   ├── genkit.ts                          # Genkit init · Gemini 2.5 Flash config
│   │   ├── dev.ts                             # Genkit dev server entry
│   │   └── flows/
│   │       ├── route-optimization-flow.ts     # AI Route Optimizer (Zod schema)
│   │       ├── ai-chat-assistant-flow.ts      # AI Maritime Chat
│   │       └── daily-maritime-briefing-flow.ts # Auto Daily Briefing
│   │
│   ├── app/
│   │   ├── page.tsx                           # Dashboard — command center
│   │   ├── map/page.tsx                       # Live Ocean Map (Leaflet.js)
│   │   ├── assistant/page.tsx                 # AI Chat Interface
│   │   ├── optimizer/page.tsx                 # Route Optimizer UI
│   │   ├── alerts/page.tsx                    # Threat Alert Feed
│   │   ├── fleet/page.tsx                     # Fleet Tracker
│   │   ├── ports/page.jsx                     # Port Intelligence
│   │   ├── companies/page.tsx                 # Shipping Company Directory
│   │   ├── ra/page.tsx                        # Research & Analysis Hub
│   │   ├── settings/page.tsx                  # App Settings
│   │   ├── globals.css                        # Global styles (Google design tokens)
│   │   └── layout.tsx                         # Root layout · Shell component
│   │
│   ├── components/
│   │   ├── VesselMap.tsx                      # Leaflet map · vessel markers · risk zones
│   │   ├── layout/
│   │   │   ├── Shell.tsx                      # App shell wrapper
│   │   │   ├── Sidebar.tsx                    # Navigation sidebar (9 pages)
│   │   │   └── Topbar.tsx                     # Top navigation bar
│   │   └── ui/                                # ShadCN UI component library (25+ components)
│   │
│   ├── lib/
│   │   ├── maritime-data.ts                   # Maritime data layer (vessels, ports, alerts, zones)
│   │   └── utils.ts                           # Utility functions (cn, formatters)
│   │
│   └── hooks/
│       ├── use-mobile.tsx                     # Responsive breakpoint hook
│       └── use-toast.ts                       # Toast notification hook
│
├── apphosting.yaml                            # Firebase App Hosting config
├── next.config.ts                             # Next.js configuration
├── tailwind.config.ts                         # Tailwind CSS configuration
├── tsconfig.json                              # TypeScript configuration
└── package.json                               # Dependencies & scripts
```

---

## 🛠 Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js | 15.5.9 | App Router, SSR, Server Actions |
| **Language** | TypeScript | ^5 | Type safety throughout |
| **AI Engine** | Google Gemini | 2.5 Flash | LLM for route, chat, briefing |
| **AI Orchestration** | Genkit | 1.28.0 | Flow management, schema validation |
| **AI SDK** | @genkit-ai/google-genai | ^1.28.0 | Gemini API connector |
| **Validation** | Zod | ^3.24.2 | Structured AI output schemas |
| **Hosting** | Firebase App Hosting | — | Serverless · CDN · SSL |
| **Firebase SDK** | firebase | ^11.9.1 | Future Auth / Firestore |
| **UI Components** | ShadCN UI + Radix | — | Accessible component primitives |
| **Styling** | Tailwind CSS | ^3.4.1 | Utility-first, Google design tokens |
| **Mapping** | Leaflet.js + react-leaflet | 1.9.4 / 5.0 | Ocean map, vessel markers |
| **Charts** | Recharts | ^2.15.1 | Dashboard data visualizations |
| **Icons** | Lucide React | ^0.475.0 | UI iconography |
| **Runtime** | Node.js | v20 | Server-side execution |

---

## 🧪 Available Scripts

```bash
# Development
npm run dev              # Start dev server on http://localhost:9002 (Turbopack)
npm run genkit:dev       # Start Genkit AI dev UI on http://localhost:4000
npm run genkit:watch     # Start Genkit with file watching

# Production
npm run build            # Build for production
npm run start            # Start production server

# Quality
npm run lint             # ESLint check
npm run typecheck        # TypeScript type check (no emit)
```

---

## 🗺 Roadmap

### Phase 1 — Real Data Integration *(Q2 2026)*
- [ ] Live AIS vessel feed via MarineTraffic / vessel-finder API
- [ ] OpenWeatherMap Marine API for real ocean conditions
- [ ] Firebase Auth + Firestore for user persistence and saved routes
- [ ] Deploy to Firebase App Hosting — get a live URL

### Phase 2 — AI Deepening *(Q3 2026)*
- [ ] Multi-turn conversation history in AI Chat (pass `messages[]` to Genkit)
- [ ] Gemini Vision: satellite image analysis for port congestion detection
- [ ] AI-generated PDF reports from the R&A Hub
- [ ] Real-time risk scoring combining live AIS data + Gemini reasoning

### Phase 3 — Platform Scale *(Q4 2026)*
- [ ] Flutter mobile app for iOS and Android
- [ ] Multi-user fleet management with role-based access (Firebase Auth)
- [ ] Automated push/email alerts via Firebase Cloud Functions
- [ ] Public API for third-party shipping company integrations
- [ ] Additional global port coverage (100+ ports)

---

## 🌍 SDG Alignment

| Goal | How MarineGuide contributes |
|---|---|
| **SDG 14** — Life Below Water | Promotes safer, more efficient shipping routes that reduce marine pollution and fuel waste |
| **SDG 9** — Industry, Innovation & Infrastructure | Modernizes maritime logistics with AI-driven infrastructure that improves supply chain resilience |
| **SDG 13** — Climate Action | Optimized routes reduce unnecessary fuel consumption and CO₂ emissions from global shipping |

---

## 👥 Team

| Role | Name |
|---|---|
| **Team Leader / Full-Stack Developer** | Milind Late |

**Track:** Maritime & Logistics Intelligence
**Challenge:** Google Solution Challenge 2026

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🔗 Resources

| Resource | Link |
|---|---|
| **GitHub Repository** | [github.com/MilindLate/MarineGuide](https://github.com/MilindLate/MarineGuide) |
| **Live Prototype** | *Deploy to Firebase and add URL here* |
| **Demo Video** | *Record 3-minute walkthrough and add link here* |
| **Project Deck** | *Add Google Slides / PPT link here* |
| **Genkit Docs** | [firebase.google.com/docs/genkit](https://firebase.google.com/docs/genkit) |
| **Gemini API** | [aistudio.google.com](https://aistudio.google.com) |
| **Firebase App Hosting** | [firebase.google.com/docs/app-hosting](https://firebase.google.com/docs/app-hosting) |

---

<div align="center">

**Built with ❤️ for Google Solution Challenge 2026**

<img src="https://img.shields.io/badge/Powered_by-Google_Gemini_2.5-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
<img src="https://img.shields.io/badge/Hosted_on-Firebase-FBBC04?style=for-the-badge&logo=firebase&logoColor=black"/>

*MarineGuide — Navigate Smarter. Ship Safer.*

</div>
