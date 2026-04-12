# **App Name**: MarineGuide

## Core Features:

- Dashboard Overview: A central dashboard providing an at-a-glance view of key maritime operational metrics, critical alerts, average route risks, and port statuses.
- Interactive Live Map: A detailed, real-time map displaying vessel movements, shipping lanes, dynamic weather overlays, and critical port locations.
- Dynamic Alert System: Monitor and filter active disruption alerts based on severity, type, and impact, providing actionable intelligence.
- AI Route Optimization Tool: A generative AI tool to analyze various factors and recommend the most optimal shipping routes considering risk, distance, and cost implications.
- Conversational AI Assistant: An AI-powered chat interface acting as a tool for users to query specific maritime intelligence, receive vessel updates, port conditions, and route advice.
- Personalized Fleet Tracking: A dedicated module to monitor registered vessels, displaying their real-time status, associated risk scores, and current destinations.
- Application Settings Management: Manage user preferences, notification settings, and input mock API keys for custom configuration of the application.

## Style Guidelines:

- Primary action and info color: Google Blue (#4285f4), serving as `--blue` for medium risk and primary calls to action.
- Critical semantic color: Google Red (#ea4335), designated as `--red` for critical alerts, danger, and SEV 5 indications.
- Warning semantic color: Google Yellow (#fbbc04), designated as `--yellow` for high risk and warning states.
- Success semantic color: Google Green (#34a853), designated as `--green` for safe, low risk, and success indicators.
- Main page background color: Light neutral grey (`--surface`) at #f8f9fa.
- Card and panel background color: Pure white (`--card`) at #ffffff.
- Chrome Bar: A 4-segment horizontal bar featuring the colors #4285f4, #ea4335, #fbbc04, and #34a853, mirroring Google Chrome's identity.
- UI text: 'DM Sans' (sans-serif) for all user interface text. Note: currently only Google Fonts are supported.
- Monospace text: 'DM Mono' (monospace) for API keys and code values. Note: currently only Google Fonts are supported.
- Use descriptive navigation icons (e.g., house, map, bell, chat bubble) and specific emoji icons (e.g., ship, alert, anchor) for clear visual communication.
- Incorporate small colored orbs for the logo alongside textual elements, and utilize colored iconography consistent with risk scores and content categories.
- The layout features a fixed `4px Chrome Bar`, a `sticky 60px Topbar`, and a main `flex row` shell containing a `fixed 220px Sidebar` and a flexible main content area.
- Standardized border radii: `12px` for cards and panels, and `100px` for pill-shaped elements, chips, and buttons.
- Consistent use of `shadows` (`--sh`, `--sh2`) to indicate elevation and interaction states across UI components.
- Staggered fade-up animations on page load for stat cards to introduce content dynamically.
- Animated `stroke-dasharray` for shipping route lines and `radial pulse rings` for vessel markers on the map, providing engaging real-time visualization.
- Smooth CSS transitions for interactive hover states (e.g., `translateY`, shadow changes), toggle switch animations, and 'Thinking…' states for AI features.
- Toast notifications slide up from the bottom, automatically dismissing after a short duration to provide timely feedback for user actions.