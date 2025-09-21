# Sentence Builder

## Scripts
- npm run dev: start Next dev server
- npm run build: production build
- npm run start: run production server
- npm run lint: run Next/ESLint
- npm run lint:fix: fix lint issues
- npm run format: Prettier format

## Structure
- src/app: Next App Router pages
- src/components: UI components
- public/data: static data (top_verbs.csv)
- database: SQL schema and seeds

## Development notes
- Prettier and ESLint are configured; please run `npm run format` before committing.
- CSV verbs are loaded from `/public/data/top_verbs.csv`.
