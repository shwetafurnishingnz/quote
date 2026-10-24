# Indoor Blinds Quote App — scaffold

A working UI scaffold for an indoor-blinds version of the outdoor
blinds Quote App, reusing the same architecture: Firebase Auth login,
Firestore-synced pricing variables with a localStorage fallback, and
a HashRouter for static hosting on GitHub Pages.

## What's here

- **Home** (`/`) — links to the quote form and the variables screen.
- **New quote** (`/quote`) — width, height, quantity, style, fabric,
  and mount inputs, calculated with `computeQuote`.
- **Variables** (`/variables`) — edits the pricing variables that
  `computeQuote` reads, synced to Firestore.

## Pricing logic — placeholder

`src/features/quote/utils/quote.js` contains a **placeholder** formula:

```
price per blind = max(
  area(m²) x base rate x fabric multiplier x style multiplier + mount adjustment,
  minimum charge
)
```

This is only a working starting point so the UI has something to
calculate against. Replace the body of `computeQuote` with the real
formula when it's ready — the rest of the app (form, variables editor,
sync) doesn't need to change, since every number it depends on is
already exposed on the Variables screen.

## Local development

1. `cp .env.example .env.local` and fill in Firebase project values.
2. `npm install`
3. `npm run dev`

## Firebase / Firestore

Same pattern as the outdoor app:

- Collection: `Indoor_Quote_App` (override with
  `VITE_FIREBASE_VARS_COLLECTION`)
- Document: `Shared_Variables` (override with
  `VITE_FIREBASE_VARS_DOC_ID`)
- Document shape is nested, grouped by `rates`, `fabricMultipliers`,
  `styleMultipliers`, `mountAdjustments` — see
  `src/features/variables/utils/variables.js` for the exact keys.

## Access — two accounts only

The site is public on GitHub Pages, so access is enforced by Firebase,
not by the page. Setup (all free on the Spark plan):

1. **Authentication → Sign-in method**: enable **Email/Password**.
2. **Authentication → Users → Add user**: create the two accounts
   (admin and Shweta).
3. **Authentication → Settings → User actions**: untick
   **Enable create (sign-up)** so nobody can register a third account.
4. **Authentication → Settings → Authorized domains**: add the domain
   the site is served from (e.g. `shwetafurnishingnz.github.io`).
5. **Firestore Database → Rules**: paste [`firestore.rules`](firestore.rules)
   with the two real emails and publish.

The app shows only the sign-in screen until someone signs in. If an
account that isn't in the rules signs in, Firestore returns
`permission-denied` and the app signs it out.

## GitHub Actions secrets

The deploy workflow (`.github/workflows/deploy-pages.yml` at the repo
root) reads the `VITE_FIREBASE_*` values from the repository's Actions
secrets — see `.env.example` for the list.

## Tests

`npm test` runs Vitest, including a few sanity checks on
`computeQuote` in `src/features/quote/utils/quote.test.js`.
