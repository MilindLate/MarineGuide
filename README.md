# MarineGuide | Maritime Intelligence Platform

MarineGuide is a high-performance Next.js application designed for resilient logistics and dynamic maritime supply chain optimization. It provides real-time situational awareness, oceanographic telemetry, and AI-powered decision support for global shipping operations.

## 🚀 Key Features

- **Dynamic Dashboard**: A central command center providing real-time statistics on active vessels, critical alerts, and global port congestion.
- **Ocean Intelligence Navigator (Live Map)**:
  - **Dual-Mode Visualization**: Toggle between a Tactical 2D map (using nautical charts) and an immersive Orbital Globe view.
  - **Scientific Layers**: Integrated telemetry for Sea Surface Temperature (SST) and Ocean Currents (Flow velocity).
  - **Geopolitical Risk Monitoring**: Real-time visualization of chokepoints and conflict zones like the Red Sea and Strait of Hormuz.
- **AI Route Optimizer**: Leverages Google Gemini (via Genkit) to analyze origin/destination pairs and suggest optimal routes based on distance, cost, and tactical risk scores.
- **Port Watch**: Real-time monitoring of 50+ major global ports, providing congestion levels, vessel counts, and average wait times.
- **AI Maritime Assistant**: A specialized GenAI chat interface powered by Gemini for instant maritime intelligence, vessel tracking info, and tactical advice.
- **Daily Intelligence Briefing**: Automated AI-generated daily summaries of critical maritime risks, port status, and strategic recommendations.
- **Fleet Tracker**: A dedicated interface for managing and monitoring the operational status and risk levels of a registered fleet.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI Engine**: [Genkit](https://github.com/firebase/genkit) with Google Gemini 2.5 models
- **Styling**: Tailwind CSS & [ShadCN UI](https://ui.shadcn.com/)
- **Mapping**: [Leaflet.js](https://leafletjs.com/) with ESRI Ocean Basemap and OpenSeaMap overlays
- **Icons**: Lucide React
- **Data Layer**: Custom structured datasets for vessels, ports, and geopolitical zones.

## 🚢 Getting Started

To explore the intelligence capabilities of MarineGuide, navigate to the **Live Map** for real-time tracking or the **AI Assistant** for deep-dive queries into maritime logistics.

---
*Developed as an AI-powered prototype in Firebase Studio.*
