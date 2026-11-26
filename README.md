# 🥛 MilkMart - Farmstead Dairy E-Commerce Platform

> **Pure Farm Fresh Milk & Ethical Dairy Delivered Before Sunrise in Sanitized Glass Bottles**

MilkMart is a modern, responsive, frontend-only dairy subscription e-commerce platform built with **React 18 + Vite + React Router 6**. It is tailored for conscious households seeking raw A2 indigenous Gir cow milk, Vedic Bilona ghee, cultured butter, and fresh morning dairy subscriptions delivered quietly between **5:30 AM – 7:30 AM** with zero single-use plastic.

---

## ✨ Key Features

### 1. 🌅 Morning Subscription & Habit Engine
- **Flexible Subscription Frequencies**: Daily, Alternate Days, Weekdays Only, or Custom Day-by-Day schedule.
- **Vacation Pause & Resume**: 1-click delivery hold with a strict 10:00 PM previous-night cutoff.
- **Doorstep Silent Delivery Protocol**: Toggle for silent drop without ringing doorbells before 7:00 AM, plus thermal bag placement instructions.

### 2. ♻️ Digital Glass Bottle Loop & Eco-Wallet
- **Zero Single-Use Plastic**: Heavy-gauge European sanitized glass bottles.
- **Digital Bottle Passbook**: Automatic tracking of bottles delivered vs. returned.
- **Instant ₹10/Bottle Cashback**: Automated wallet refund upon morning collection.
- **Prepaid Wallet Checkout**: Instant 1-click payment with low-balance alerts.

### 3. 📜 Indian Dairy GST Architecture & Tax Invoices
- **HSN & GST Matrix**:
  - Fresh Raw Milk (HSN `0401`): **0% GST**
  - Pre-packaged Dahi & Paneer (HSN `0403` / `0406`): **5% GST**
  - Vedic Bilona Ghee & White Butter (HSN `0405`): **12% GST**
  - Ice Cream & Frozen Dairy (HSN `2105`): **18% GST**
- **Real-Time Tax Breakdown**: Taxable Value, CGST, and SGST calculated dynamically.
- **B2B GSTIN Claim**: Input tax credit field for business purchasing.
- **Printable GST Tax Invoice**: Official invoice with Seller GSTIN (`29AABCM8491K1Z2`) and FSSAI Central License (`10024043000492`).

### 4. 🧪 Farm-to-Doorstep Purity Certificate
- **NABL Lab Verified**: Real-time batch purity certificate on all products.
- **Purity Test Panel**: Aflatoxin M1 (<0.01 µg/kg), Antibiotics (Nil), Synthetic Hormones (Zero Oxytocin), and Adulteration (0.00% purity).
- **Unbroken 4°C Cold Chain**: Real-time 3.6°C chilling curve sensor tracking from milking to pouch.

### 5. 🏪 Multi-Portal Ecosystem
- **Customer Storefront**: Catalog, smart substitutions, wishlist, basket drawer, multi-step checkout.
- **Admin Operations Hub**: Product inventory, categories, subscriptions monitoring, and dispatch reports.
- **Morning Delivery Fleet Portal**: Route planning, doorstep drop confirmation, and bottle scan logging.

---

## 🎨 Design & Branding
- **Primary Theme Color**: Deep Forest Pasture Green (`#183626`)
- **Accent Tones**: Sunlit Honey Gold (`#E8C582` / `#A26D24`), Warm Artisan Cream (`#FAF7F2`)
- **Typography**: `Fraunces` (Editorial Serif) + `Plus Jakarta Sans` (Clean Modern Sans)
- **Icons**: Lucide React Icons

---

## 🛠️ Fullstack Architecture & Tech Stack
- **Frontend**: React 18, Vite 6, React Router DOM v6, Lucide React, Canvas-Confetti
- **Backend**: Node.js, Express.js REST API, CORS, Morgan, Multer, JSON Web Tokens (JWT), BcryptJS
- **Persistence**: Atomic file-persisted JSON database (`server/data/*.json`)
- **Portals**:
  - 🛒 **Customer Storefront**: `http://localhost:3000/`
  - 🌾 **Farmer / Producer Portal**: `http://localhost:3000/seller/dashboard`
  - 🛡️ **Admin Operations Hub**: `http://localhost:3000/admin`
  - 🚚 **Morning Delivery Partner**: `http://localhost:3000/partner`
  - 📡 **Backend REST API**: `http://localhost:5000/api` (Health: `/api/health`)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm`

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Run both Backend (Express on port 5000) and Frontend (Vite on port 3000) concurrently
npm run dev
```

The application will start on `http://localhost:3000/` with proxying to `http://localhost:5000/` for `/api` and `/uploads`.

### Production Build
```bash
npm run build
```

---

## 📡 REST API Reference

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/login` | POST | Public | Authenticate user & issue JWT |
| `/api/auth/register` | POST | Public | Register customer, farmer/seller, or driver |
| `/api/auth/me` | GET | Authenticated | Current user profile & wallet balance |
| `/api/products` | GET / POST | Public / Seller | Catalog search, category filter, SKU creation |
| `/api/products/:id/approval` | PATCH | Admin | Quality approval / rejection |
| `/api/products/:id/stock` | PATCH | Seller / Admin | Real-time stock adjustment |
| `/api/farms` | GET / PUT | Public / Seller | Farm profiles, cattle headcount, photo gallery |
| `/api/orders` | GET / POST | Customer / Seller | Doorstep orders, wallet payments, inventory reserves |
| `/api/orders/:id/status` | PATCH | Seller / Delivery | Stepper order progression |
| `/api/subscriptions` | GET / POST / PATCH | Customer | Daily recurring morning milk subscriptions |
| `/api/delivery/route` | GET | Delivery | Route 4B morning manifest |
| `/api/delivery/complete` | POST | Delivery | Doorstep drop proof & ₹10/bottle loop credit |
| `/api/wallet` | GET / POST | Customer | Balance check & instant UPI top-up |
| `/api/batches` | GET / POST | Seller / Public | Morning milking batches & NABL lab certificates |
| `/api/upload` | POST | Authenticated | Multer image file upload |

---

## 📄 License
MIT License. © 2026 MilkMart Pure Farm Private Limited.
