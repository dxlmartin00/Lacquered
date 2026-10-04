# Lacquered — Nail Studio Operating System

Lacquered is an offline-first Progressive Web Application (PWA) engineered specifically for independent nail artists, booth renters, and private studio technicians. The application focuses on live chair touch ergonomics, local database autonomy, hardware runtime integration, and an editorial darkroom aesthetic tailored for salon lighting.

---

## Core Engineering Principles

### 1. Glove-Friendly Touch Ergonomics
During live nail services, technicians wear nitrile gloves, creating touchscreen interaction challenges. Lacquered enforces:
* Minimum 48x48 pixel interactive targets across all controls, buttons, and chips.
* Tactile active press response and visual feedback states.
* Zero mandatory keyboard typing during active chair sessions; adjustments utilize oversized numerical steppers, preset chips, and device camera capture.
* Thumb-accessible layouts optimized for single-hand interaction while holding implements.

### 2. Absolute Local Autonomy (Offline-First)
Salon basements, convention centers, and studio spaces often suffer from intermittent or non-existent network connectivity.
* Every transaction, sizing update, and appointment change executes against IndexedDB via Dexie.js.
* The application shell and runtime assets are cached using Service Workers managed by Workbox (`vite-plugin-pwa`).
* The system boots and remains fully functional in airplane mode without remote server dependencies.

### 3. Hardware API Integration
* **Screen Wake Lock API (`navigator.wakeLock`):** Maintains screen illumination during services and timer countdowns, automatically releasing when services conclude and reacquiring upon document visibility transitions.
* **Web Vibration API (`navigator.vibrate`):** Delivers non-auditory haptic notifications (`[200, 100, 200, 100, 300]`) upon cure and soak timer completion, complemented by a synthetic studio chime via the Web Audio API.
* **HTML5 Canvas Compression Pipeline:** Intercepts high-resolution camera uploads directly from device hardware, constraining dimensions to a maximum of 1440px and encoding to WebP at 0.8 quality. This reduces storage payloads to under 250KB before committing raw Blobs to IndexedDB.

### 4. Studio Lighting Color Calibration
Gel polish shade matching and art design are sensitive to screen glare and ambient color cast. Lacquered utilizes an ultra-neutral darkroom theme:
* Base: Stone-950 (`#0c0a09`)
* Surface: Stone-900 (`#1c1917`)
* Borders: Stone-800 (`#292524`)
* Text: Stone-100 (`#f5f5f4`)
* Critical Medical Warnings: High-visibility Crimson (`#e11d48`, Rose-950/Rose-800) for HEMA and acrylate sensitivities.

---

## Functional Architecture

### The Desk
* **In-Chair Session Card:** Detects active appointments (`status: 'in_chair'`) and displays live service context.
* **Safety Banner:** Renders an immediate crimson alert if the active client has recorded HEMA or acrylate sensitivities.
* **Chair Timers:** Dedicated 48px touch controls for 30s Flash Cure, 60s Full Cure, and 10m Acetone Soak-Off with pause, resume, and reset capabilities.
* **Verified Sizing Readout:** Instant thumb-to-pinky sizing profile display for quick tip prep.
* **Single-Tap Checkout:** Computes final service balance, supports gratuity percentage chips (15%, 20%, 25%, 30%, and custom), and provides integrated camera capture for archival logs.

### Sizing Vault
* **10-Finger Interactive Map:** Independent Left and Right hand grids with oversized decrement (`-`) and increment (`+`) steppers.
* **Tip Sizing Systems:** Supports Gel-X (`00` to `9`), Paper-Forms, Press-On, and Custom sizing metrics.
* **Client Roster:** Full offline client profile manager including chemical allergy toggles, phone numbers, social handles, and nail shape preferences (Square, Squoval, Almond, Coffin, Stiletto, Duck).

### Consultation Quick-Quote Engine
* **Base Services:** Natural Manicure ($45 / 45m), Structured BIAB ($75 / 60m), Gel-X Extensions ($85 / 75m), Hard Gel Full Set ($95 / 90m), Acrylic Full Set ($90 / 90m).
* **Art Tiers:** Tier 0 (Solid Color), Tier 1 (Minimal Accents), Tier 2 (Elevated Classics: French/Chrome/Velvet), Tier 3 (Dimensional 3D/Encapsulation/Blooming), Tier 4 (Editorial/Murals).
* **Structural Add-ons:** Per-nail repairs stepper ($5 and +10m) and foreign salon removal toggle (+$25 and +30m).
* **Real-Time Aggregator:** Continuously calculates total price and schedule buffer in minutes, offering single-tap clipboard formatting for direct messaging.

### Gel Formulas & Photo Archive
* **Recipe Logging:** Captures base system brands, specific shade and pigment codes, and top finishes (Glossy, Matte, Chrome Gel).
* **Financial Ledger:** Aggregates billed revenue and accumulated gratuity across completed appointments.
* **Photography Viewer:** Full-resolution modal viewer for WebP-compressed finish photography.

---

## Technical Stack

* **Language:** TypeScript 5.6 (strict mode enabled)
* **Framework:** React 19 + Vite 6
* **Styling:** Tailwind CSS 3.4
* **Icons:** Lucide React
* **Local Persistence:** Dexie.js 4.0 (`dexie` + `dexie-react-hooks`)
* **Session State:** Zustand 5.0
* **PWA & Offline Worker:** `vite-plugin-pwa` with Workbox Cache-First strategy

---

## Getting Started

### Prerequisites
* Node.js 18.0.0 or higher
* npm 9.0.0 or higher

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/dxlmartin00/Lacquered.git
cd Lacquered
npm install
```

### Development Server
Start the local Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Production Build
Compile TypeScript and generate the production PWA bundle:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## Data Schema & Seed Architecture

The local database (`LacqueredDatabase`) contains three primary object stores:
* `clients`: `id, name, phone, createdAt`
* `appointments`: `id, clientId, scheduledTime, status`
* `serviceLogs`: `id, appointmentId, clientId, timestamp`

Initial launch automatically seeds demonstration data:
* **Maya Lin:** Recorded HEMA allergy (`hema: true`), sizes L: [0, 4, 3, 5, 8], R: [0, 4, 3, 4, 8], preferred shape Almond, seated in the chair for Structured BIAB + Tier 2 Art ($95).
* **Elena Rostova:** No chemical sensitivities, sizes L: [1, 5, 4, 5, 9], R: [1, 5, 4, 5, 9], preferred shape Coffin, scheduled for Hard Gel Extensions + Tier 3 Art ($135).
* **Historical Logs:** Pre-loaded gel formulas and application notes.

---

## License

Private and proprietary. All rights reserved.
