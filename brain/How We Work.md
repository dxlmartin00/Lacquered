# How We Work

## Technology Stack

- **Framework:** React 19 + TypeScript 5.6 + Vite 6
- **Styling:** Tailwind CSS 3.4 (pastel design tokens: `#fff5f7` canvas, `#ff4d79` primary pink, rounded-3xl cards)
- **Database & Persistence:** Dexie.js 4 (IndexedDB) with `dexie-react-hooks` (`useLiveQuery`)
- **Offline / PWA:** `vite-plugin-pwa` with Workbox Cache-First strategy
- **Tactile Feedback:** Web Audio API synthesize chimes and haptic vibrations (`navigator.vibrate`)

## Engineering Standards

1. **Touch Ergonomics:** All interactive buttons and steppers must have a minimum target of 48x48px (`touch-target`).
2. **Offline-First:** All mutations must save locally to Dexie tables first; never assume cloud network access.
3. **Reactive UI:** Rely on `useLiveQuery` for instant UI updates when database tables change.
4. **No Placeholder Code:** Every screen and modal must be fully functional and tested end-to-end.
