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

## 7. Customer Management (Edit/Delete) & Card Visual Layout Cleanup
- **Context:** User requested ability to edit and delete customers, and fix the awkward vertical 4-line wrapping of phone numbers and cramped information in customer cards.
- **Decision:**
  - Re-architected Customer Cards with clean visual hierarchy: name with HEMA Free badge, non-wrapping phone and Instagram badges with icons, subtle quote block for client notes, and dedicated quick-action controls.
  - Added `EditCustomerModal` to update name, phone, Instagram handle, preferred nail shape & length, HEMA sensitivity flag, and studio notes directly in IndexedDB.
  - Added `DeleteCustomerModal` with confirmation dialog and cascade cleanup of orphaned appointments.
  - Purged historical dev prototype IDs (`client-maya-lin`, `client-elena-rostova`, `client-chloe-vance`) from local Dexie database migration routine.
## 8. Cloudflare Pages Free Edge Deployment
- **Context:** User requested deployment of Laquered on a free hosting platform. Selected Cloudflare Pages for its zero-cost edge network, unlimited bandwidth, and continuous deployment from GitHub.
- **Decision:**
  - Added `wrangler.json` with SPA not_found_handling and static assets directory pointing to `./dist`.
  - Added `public/_headers` for edge-level security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) and asset caching policies.
  - Pre-configured build command `npm run build` and output directory `dist` for direct GitHub integration.
- **Date:** October 2026

## 9. React Portal Modal Mounting & Backdrop-Filter Containing Block Fix
- **Context:** `BackupRestoreModal` was rendered inside `<header>` which has `backdrop-blur-md`. Under CSS spec, any ancestor with `backdrop-filter` creates a new containing block for `position: fixed` elements, trapping the modal inside the ~50px header box and cutting it off at the top of the screen.
- **Decision:**
  - Wrapped `BackupRestoreModal`, `EditCustomerModal`, and `DeleteCustomerModal` in React `createPortal(..., document.body)`.
  - Added `my-auto` centering, `max-h-[90dvh]`, and `overflow-y-auto` to prevent viewport overflow on mobile devices.
  - Added backdrop click and `Escape` keyboard shortcuts to dismiss modals cleanly.
- **Date:** October 2026




