
# MarineGuide | Maritime Intelligence Platform

MarineGuide is a high-performance Next.js application designed for resilient logistics and dynamic maritime supply chain optimization. It provides real-time situational awareness, oceanographic telemetry, and AI-powered decision support for global shipping operations.

## 🚀 Key Features

- **Dynamic Dashboard**: A central command center providing real-time statistics on active vessels, critical alerts, and global port congestion.
- **Ocean Intelligence Navigator (Live Map)**:
  - **Dual-Mode Visualization**: Toggle between a Tactical 2D map (powered by Google Maps) and an immersive Orbital Globe view.
  - **Scientific Layers**: Integrated telemetry for Sea Surface Temperature (SST) and Ocean Currents (Flow velocity).
  - **Geopolitical Risk Monitoring**: Real-time visualization of chokepoints and conflict zones like the Red Sea and Strait of Hormuz.
- **AI Route Optimizer**: Leverages Google Gemini (via Genkit) to analyze origin/destination pairs and suggest optimal routes based on distance, cost, and tactical risk scores.
- **Port Watch**: Real-time monitoring of 50+ major global ports, providing congestion levels, vessel counts, and average wait times.
- **AI Maritime Assistant**: A specialized GenAI chat interface powered by Gemini for instant maritime intelligence, vessel tracking info, and tactical advice.
- **Daily Intelligence Briefing**: Automated AI-generated daily summaries of critical maritime risks, port status, and strategic recommendations.
- **Fleet Tracker**: A dedicated interface for managing and monitoring the operational status and risk levels of a registered fleet.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI Engine**: Genkit with Google Gemini 2.5 models
- **Styling**: Tailwind CSS & ShadCN UI
- **Mapping**: Google Maps JavaScript API with custom tactical styling and custom SVG Globe projection.
- **Icons**: Lucide React
- **Data Layer**: Custom structured datasets for vessels, ports, and geopolitical zones.

## 🚢 Getting Started

To explore the intelligence capabilities of MarineGuide, navigate to the **Live Map** for real-time tracking or the **AI Assistant** for deep-dive queries into maritime logistics.

## 📦 Exporting the Project

To bundle the project for sharing or local development, run the following command in your terminal:

```bash
zip -r marineguide.zip . -x "node_modules/*" ".next/*" ".git/*"
```

## 🎯 Problem Statement
Global maritime supply chains face increasing disruption from geopolitical instability, climate-related weather events, and port congestion. Logistics operators lack a unified, real-time intelligence platform to proactively assess risks and optimize routes, leading to costly delays, increased fuel consumption, and higher operational uncertainty.

## 💡 Solution Overview
MarineGuide is an AI-powered maritime intelligence platform that provides a central command center for global shipping operations. It integrates real-time vessel tracking (AIS-S), geopolitical risk data, and oceanographic telemetry into a single, interactive interface. Our core innovation is a generative AI Route Optimizer that analyzes these multi-domain inputs to recommend tactical route adjustments, enhancing supply chain resilience and operational efficiency.

## 🔗 Project Resources

| Resource | Link |
| :--- | :--- |
| **Prototype Link** | `[Your Live MVP Link Here]` |
| **Project Deck** | `[Your Project Deck Link Here]` |
| **GitHub Repository** | [github.com/MilindLate/MarineGuide](https://github.com/MilindLate/MarineGuide.git) |


---
*Developed as an AI-powered prototype in Firebase Studio.*
