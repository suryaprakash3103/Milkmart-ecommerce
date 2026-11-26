# Antigravity Rules & Technical Reference for MilkMart

## Project Overview
**MilkMart** is a production-grade, fullstack dairy e-commerce application built with **React 18 + Vite + React Router 6** on the frontend and **Node.js + Express REST API** on the backend with file-persisted JSON database storage. It features single-purchase items, recurring morning milk subscriptions (5:30 AM – 7:30 AM window) delivered in sanitized glass bottles with an unbroken 4°C cold chain, and a complete multi-portal ecosystem (Customer, Farmer/Seller, Admin Operations, Delivery Fleet).

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
│   ├── images/              # Static SVG & brand assets
│   └── uploads/             # User-uploaded images & farm photos
├── server/                  # Dedicated Express REST API Backend (Port 5000)
│   ├── data/                # Persistent JSON database collections (users, products, farms, orders...)
│   ├── db/
│   │   └── database.js      # MilkMartDB atomic persistence engine
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication & role authorization
│   │   └── upload.js        # Multer image upload handler
│   ├── routes/              # REST API route controllers
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── farmRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── subscriptionRoutes.js
│   │   ├── deliveryRoutes.js
│   │   ├── walletRoutes.js
│   │   ├── batchRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── uploadRoutes.js
│   └── server.js            # Express app entrypoint
├── src/
│   ├── assets/              # Bundled image assets
│   ├── components/          # Reusable UI widgets (Cart, Common, Product, Subscription)
│   ├── context/             # React context providers (Auth, Product, Order, Subscriptions, Cart, Toast)
│   ├── data/                # Mock datasets & initial seeds
│   ├── pages/               # Customer, Seller, Admin, Delivery & Auth views
│   ├── services/
│   │   ├── api.js           # Fullstack HTTP API client (/api proxy)
│   │   └── sellerService.js # Seller & producer services
│   ├── styles/              # Global & variable design tokens
│   ├── App.jsx              # Routes & modal layout wrapper
│   └── main.jsx             # React entrypoint
├── package.json             # Concurrent dev script (Express + Vite)
└── vite.config.js           # Vite dev config with /api and /uploads proxy
```

---

## 🚀 Development Commands
- **Start Fullstack App**: `npm start` or `npm run dev` (Runs Express on port 5000 + Vite on port 3000 concurrently)
- **Start Backend Only**: `npm run server`
- **Start Frontend Only**: `npm run client`
- **Production Build**: `npm run build` (Outputs optimized bundle in `dist/`)

---

## 🔒 Fullstack State & Persistence Architecture
- **Backend Persistence**: Disk-persisted atomic JSON collections in `server/data/` (users, products, farms, orders, subscriptions, wallet_tx, bottle_logs, batches, reviews, notifications).
- **Security**: JWT tokens with role-based access control (`customer`, `seller`, `admin`, `delivery`).
- **Resilience**: Client-side localStorage fallback ensures offline resiliency and instant responsive UI updates.
