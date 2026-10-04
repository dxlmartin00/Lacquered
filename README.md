# Laquered — Nail Studio Operating System

Laquered is an offline-first Progressive Web Application (PWA) engineered specifically for independent nail artists, booth renters, and private studio technicians. The application focuses on live chair touch ergonomics, local database autonomy, hardware runtime integration, and a refined editorial aesthetic.

---

## Core Engineering Principles

### 1. Glove-Friendly Touch Ergonomics
During live nail services, technicians wear nitrile gloves, creating touchscreen interaction challenges. Laquered enforces:
* Minimum 48x48 pixel interactive touch targets across all controls, buttons, and chips.
* Tactile active press response and smooth spring transitions.
* Two-step order flow: rapid customer name entry followed by instant service selection.
* Single-hand mobile ergonomics with an elevated center action button and swipe-to-delete gestures.

### 2. Absolute Local Autonomy (Offline-First)
Salon basements, convention centers, and studio spaces often suffer from intermittent or non-existent network connectivity.
* Every transaction, customer profile, and appointment log executes locally against IndexedDB via Dexie.js.
* The application shell and runtime assets are precached using Service Workers managed by Workbox (`vite-plugin-pwa`).
* The system boots and remains fully functional in airplane mode without remote server dependencies.

### 3. Studio Data Sovereignty & Backup
* **Zero-Leak Privacy:** All client contact information, appointment logs, and financial records stay exclusively on the technician's device.
* **One-Click Backup & Restore:** Complete studio database export and import via timestamped JSON files (`laquered-backup-YYYY-MM-DD.json`).
* **Safe Factory Reset:** Protected two-step reset mechanism to return the catalog to factory defaults when needed.

### 4. Hardware API Integration & Resilience
* **Screen Wake Lock API (`navigator.wakeLock`):** Maintains screen illumination during live appointments and timer countdowns.
* **Web Vibration API (`navigator.vibrate`):** Delivers non-auditory haptic notifications upon cure and soak timer completion.
* **React Error Boundary:** Graceful component-level error catching with single-tap session restoration.
* **Content Security Policy (CSP):** Strict CSP directives, nosniff headers, and referrer policies embedded directly in the application shell.

---

## Functional Architecture

### The Desk & Live Chair
* **In-Chair Session Card:** Highlights active appointments with live service context, elapsed duration, and quick service notes.
* **Chair Timers:** Dedicated 48px touch controls for 30s Flash Cure, 60s Full Cure, and 10m Acetone Soak-Off with pause, resume, and reset capabilities.
* **Dynamic Checkout:** Automatically tallies selected services, supports custom gratuity chips, and commits completed orders to the financial ledger.

### Service Catalog & Dynamic Pricing
* **Pre-Seeded 23-Item Catalog:** Complete studio price list pre-configured in Philippine Pesos (₱) across Soft Gel, Hard Gel, and Add-ons.
* **In-Place Price Editing:** Technicians can tap the edit trigger on any service to update prices immediately in IndexedDB.
* **Per-Nail Stepper Adjustments:** Add-ons (such as nail art, charms, and chrome) support dynamic 1 to 10 finger increments with real-time price accumulation.
* **Swipe-to-Delete Protection:** Swipe left on any service to reveal delete action, guarded by a confirmation modal to avoid accidental catalog loss.

### Studio Progress & Order History
* **Financial Ledger:** Aggregates completed appointment count and total revenue billed.
* **Chronological Timeline:** Displays complete service breakdowns, timestamps, and customer notes for past clients.

---

## Technical Stack

* **Language:** TypeScript 5.6 (strict mode enabled)
* **Framework:** React 19 + Vite 6
* **Styling:** Tailwind CSS 3.4
* **Icons:** Lucide React (single icon family, zero emojis)
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

## License

Private and proprietary. All rights reserved.

