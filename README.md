# Al-Naz Biryani Website (Next.js App Router)

This is the official Al-Naz Biryani website built with **Next.js App Router**.

The codebase is organized into reusable components, route pages, data modules, and utility helpers for clean maintenance and future feature growth.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- ESLint

## Features

- Premium restaurant-style UI with consistent colors, layout, sections, and interactions
- Responsive landing page with sections:
  - Hero
  - Stats
  - Menu
  - About
  - Contact
  - Footer
- Menu category tabs and dynamic item cards
- Cart flow:
  - Add/remove/update quantity
  - Cart drawer
  - Floating cart button
  - Toast notifications
- Checkout modal with 3 steps:
  - Details
  - Review
  - Done
- WhatsApp order integration with formatted order message
- Separate App Router pages for section-focused entry routes

## Routes

- `/` → Home view
- `/menu` → Menu-focused entry
- `/about` → About-focused entry
- `/contact` → Contact-focused entry

All routes render the same core website component and navigate users to the relevant section.

## Project Structure

```text
src/
  app/
    about/page.tsx
    contact/page.tsx
    menu/page.tsx
    layout.tsx
    page.tsx
  components/
    alnaz/
      AlNazWebsite.tsx
  data/
    menu.ts
  lib/
    order.ts
```

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

Run lint:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

## Notes

- To lint only app source files, use:

```bash
npx eslint "src/**/*.{ts,tsx}"
```

- If a hydration warning appears with unknown attributes on `<body>` (for example `__processed_...`), it is usually caused by browser extensions injecting DOM attributes.
