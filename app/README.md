# Pizza Restaurant KDS (MVP)

A minimal Kitchen Display System built with React + MUI to manage pizza orders on the line.

## Features
- Dynamic orders with status flow: Queued → In Progress → Ready
- Columns layout per status
- New Order modal to quickly add orders
- Bulk actions: Start all queued, Complete all in-progress
- Sort by Priority or ETA
- Snackbar + chime when orders become Ready
- LocalStorage persistence

## Quick Start
```bash
cd app
npm install
npm start
```
App runs at http://localhost:3000

## Scripts
- `npm start` – run dev server
- `npm run build` – production build
- `npm test` – test runner

## Tech Stack
- React 18, TypeScript
- MUI 5 (Material UI)
- Create React App (react-scripts)

## Key Files
- `src/App.tsx` – mounts `Dashboard`
- `src/containers/orders.tsx` – core KDS logic: columns, sorting, bulk actions, new order modal, persistence
- `src/components/order.tsx` – minimal order card UI
- `public/pizza.jpeg` – sample image asset (optional)

## Customize
- Adjust card look in `src/components/order.tsx`
- Change initial mock orders and behavior in `src/containers/orders.tsx`

## License
MIT
