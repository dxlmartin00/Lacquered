# Decisions

Key architecture and product choices made, with the context so they stay made:

## 1. UI Rehaul to Soft Pastel Theme
- **Context:** Original darkroom theme was overly complex and cluttered.
- **Decision:** Adopted the soft pink/cream aesthetic from reference designs (`#fff5f7` bg, `#ff4d79` pink accents, rounded 3xl cards, and center elevated pink `+` button in bottom navigation).
- **Date:** October 2026

## 2. 2-Step Customer & Service Selection Flow
- **Context:** Live salon chair needs immediate input without multi-screen navigation.
- **Decision:**
  - Step 1: Customer Name input with instant proceed.
  - Step 2: Service selection from menu with dynamic price accumulation and per-nail steppers.
- **Date:** October 2026

## 3. "Pretty Tips by Nyx" Service Catalog in Philippine Pesos (₱)
- **Context:** Studio menu reference was explicitly in Philippine Pesos (₱) with Soft Gel, Hard Gel, and Add-ons per nail.
- **Decision:** Pre-seeded all 23 items into Dexie DB with instant price editability and custom service creation.
- **Date:** October 2026

## 4. Swipe-to-Delete with Confirmation Modal
- **Context:** Prevent accidental deletion of services while enabling fast touch management.
- **Decision:** Touch horizontal swipe gestures reveal a delete button; tapping triggers a dedicated confirmation modal before executing `db.services.delete(id)`.
- **Date:** October 2026

## 5. Renaming to Laquered and Single-Family Iconography
- **Context:** User requested app name change to "Laquered" and strict ban on emojis.
- **Decision:** Standardized name to "Laquered" across metadata, headers, and UI. Replaced all emoji badges with unified `lucide-react` icons (e.g. `Sparkles` for logo/styling, `Armchair` for chair sessions, `Clock` for timers, `CheckCircle2` for completions).
- **Date:** October 2026

## 6. Production Readiness, Sample Data Purge & Local Data Sovereignty
- **Context:** Transitioning from prototype/development phase with mock clients to real-world production deployment.
- **Decision:**
  - Removed all mock clients, appointments, and test logs. Preserved the 23-item studio service catalog (in PHP ₱) so users launch with a functional catalog.
  - Implemented automatic migration cleanup in `seedDatabaseIfEmpty` to purge development sample IDs from existing client databases.
  - Implemented client-side security hardening: Content Security Policy (CSP), Referrer-Policy, input length sanitization (`maxLength`), and numerical price clamping to prevent corrupted state.
  - Added React `ErrorBoundary` with graceful crash recovery so users never hit an unrecoverable blank screen.
  - Added offline-first Studio Data Backup & Restore (`.json` export/import) and safe factory reset to ensure technicians retain complete sovereignty over their salon records.
- **Date:** October 2026

