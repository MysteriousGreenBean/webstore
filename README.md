# Moongazer Supply storefront

A Next.js storefront built for the Breitling frontend engineering exercise. It uses the supplied Algolia `instant_search` index as its live product catalogue and covers searchable/filterable PLPs, PDPs, a persistent basket, event tracking, and mock checkout.

## Run locally

Requirements: Node.js 20.9 or newer (Node 22 is recommended) and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The supplied public Algolia search credentials are safe defaults so the exercise works immediately. To override them, copy `.env.example` to `.env.local` and change:

```text
NEXT_PUBLIC_ALGOLIA_APP_ID=latency
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=...
NEXT_PUBLIC_ALGOLIA_INDEX=instant_search
```

Useful verification commands:

```bash
npm test
npm run lint
npm run build
npm start
```