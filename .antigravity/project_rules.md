# Antigravity Rules & Technical Reference for MilkMart

## Project Overview
**MilkMart** is a production-grade, responsive, frontend-only dairy e-commerce application built with **React 18 + Vite + React Router 6**. It features single-purchase items and recurring morning milk subscriptions (5:30 AM – 7:30 AM window) delivered in sanitized glass bottles with an unbroken 4°C cold chain.

---

## 🎨 Artisan Visual Design System
- **Pasture Green (Primary)**: `#183626` (dark forest: `#0F2318`, subtle: `#EBF3EE`)
- **Sunlit Wheat Gold (Accent)**: `#E8C582` (deep amber: `#A26D24`, light: `#FBF4E7`)
- **Warm Cream Canvas (Background)**: `#FAF7F2` (card: `#FFFFFF`, surface: `#FAF5EE`)
- **Organic Borders**: `#E6DEC9`
- **Typography**:
  - Headings, Prices, Numerals: `Fraunces`, Georgia, serif
  - Body, Specs, Controls: `Plus Jakarta Sans`, sans-serif

---

## 📁 Clean Directory Architecture
```text
MilkMart e commerce/
├── public/
│   └── images/              # Static SVG & raster brand assets (logo, milk-bottle, glass-loop)
├── src/
│   ├── assets/
│   │   └── images/          # Bundled image assets
│   ├── components/
│   │   ├── cart/            # Cart drawer, items, coupons
│   │   ├── common/          # Top banner, Navbar, Footer, Stars, Quantity, Wallet & PRD modals
│   │   ├── product/         # Product cards, quick view, substitution, filter
│   │   └── subscription/    # Daily plan configurator & recurrence cards
│   ├── context/             # Auth, Cart, Wishlist, Products, Orders, Subscriptions, Toasts
│   ├── data/                # 40+ mock dairy products, 10 categories, orders, vats telemetry
│   ├── pages/
│   │   ├── admin/           # Dashboard, catalog CRUD, batch inventory, dispatch, fleet
│   │   ├── customer/        # Home, Shop, Details, Cart, Checkout, Tracking, Subscriptions
│   │   └── delivery/        # Route 4B manifest, stop progression, bottle return credits
│   ├── styles/              # variables.css, global.css
│   ├── App.jsx              # Routes and modal layout wrapper
│   └── main.jsx             # React DOM entrypoint with BrowserRouter
├── .antigravity/            # Antigravity agent configuration & rules
├── index.html               # Fonts & root HTML
├── package.json             # Scripts (start, dev, build) & dependencies
└── vite.config.js           # Vite dev configuration (port 3000, auto-open)
```

---

## 🚀 Development Commands
- **Start Dev Server**: `npm start` or `npm run dev` (Opens on `http://localhost:3000`)
- **Production Build**: `npm run build` (Outputs optimized bundle in `dist/`)
- **Preview Build**: `npm run preview`

---

## 🔒 State & Persistence Principles
- Strictly frontend-only: State persists across refreshes using `localStorage` keys:
  - `milkmart_cart`: Active items, variant sizes, quantities.
  - `milkmart_user`: Profile, saved addresses, wallet balance (`₹1,250`).
  - `milkmart_orders`: Active and historical doorstep delivery runs.
  - `milkmart_subscriptions`: Daily/alternate schedules, paused status, skipped runs.
  - `milkmart_products`: Admin catalog edits, prices, stock levels.
