# Elite Perfumes — عطور النخبة

## Overview
A full-stack e-commerce platform for Elite Perfumes, consisting of:
1. **Public Storefront** (Next.js 15) — customer-facing shop at port 5000
2. **Premium Admin Dashboard** (Next.js, glassmorphism) — at `/dashboard`
3. **Legacy Admin Panel** (HTML/JS) — at `/admin/login.html`

All connect to Firebase project `perfume-adbcb` / Firestore database.

## Tech Stack

### Storefront + Dashboard (storefront/)
- **Framework:** Next.js 15 (React 18)
- **Styling:** Tailwind CSS — Deep Blue (`#030d1a`) + Teal + Gold theme
- **Animations:** Framer Motion
- **Backend:** Firebase Admin SDK (server-side, bypasses security rules)
- **State:** React Context (CartContext) with localStorage persistence
- **Fonts:** Inter + Cairo (Arabic) + Playfair Display

### Legacy Admin (public/admin/)
- **Frontend:** Pure HTML5, CSS3, Vanilla JS (ES Modules)
- **Database:** Firebase Firestore (client-side SDK)
- **Auth:** Firebase Authentication

## Project Structure
```
storefront/
  pages/
    index.js                  — Home page (hero + featured products)
    shop.js                   — Full catalog with search/filter
    checkout.js               — Cart + checkout (2-step flow)
    order-success.js          — Order confirmation
    product/[id].js           — Product detail page
    dashboard/
      index.js                — Overview: stats + recent orders + low stock
      stock.js                — Inventory table with search + status badges
      orders.js               — Orders list with filters + detail panel
      analytics.js            — KPI cards + price/status charts
      ai-agent.js             — Full-screen AI chat (Groq via Vercel)
    api/
      products.js             — GET all products (Admin SDK)
      products/[id].js        — GET single product (Admin SDK)
      orders.js               — POST create order (Admin SDK)
      dashboard-stats.js      — GET aggregated stats (perfumes + orders + sales)
      admin-proxy.js          — POST proxy → Vercel admin API (Groq)
  components/
    Navbar.js                 — Storefront navigation with cart count
    Footer.js                 — Storefront footer
    ProductCard.js            — Product display card
    admin/
      DashboardLayout.js      — Sidebar + topbar layout for dashboard
      StatCard.js             — Animated glassmorphism stat card
      FloatingChat.js         — Floating AI chat bubble (all dashboard pages)
  contexts/
    CartContext.js            — Shopping cart state (localStorage)
  lib/
    firebase.js               — Client SDK (compatibility)
    firebase-admin.js         — Admin SDK (checks FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT)
  styles/
    globals.css               — Tailwind + custom CSS
  public/admin/               — Legacy admin HTML files
```

## Firestore Collections
- `perfumes` — Product inventory (name, brand, category, price, cost, quantity, minStock, barcode)
- `sales` — Sales transactions (barcode, name, quantitySold, salePrice, totalSale, profit, date)
- `expenses` — Business expenses (type, amount, note, date)
- `users` — User roles: admin/seller
- `orders` — Customer orders from storefront (customer, items, total, paymentMethod, status, createdAt)

## Environment Variables
- `FIREBASE_SERVICE_ACCOUNT_KEY` (or `FIREBASE_SERVICE_ACCOUNT`) — Firebase Admin SDK service account JSON

## AI Agent
- **Endpoint:** `https://perfume-ten-snowy.vercel.app/api/admin`
- **Auth:** Admin API password (entered in-UI — stored in session, not persisted)
- **Proxy:** `/api/admin-proxy` forwards requests to Vercel; Groq/Llama 3 processes them
- **Access:** Floating chat bubble on all dashboard pages + full-screen at `/dashboard/ai-agent`

## Running the App
- Workflow: `Start application` → `cd storefront && npm run dev`
- Host: `0.0.0.0:5000`
- Dashboard: `/dashboard`
- Legacy admin: `/admin/login.html`

## Deployment
- Target: autoscale
- Build: `cd storefront && npm run build`
- Start: `cd storefront && npm run start`

## Admin Access
- Dashboard at `/dashboard` (no auth gate — add one if needed)
- AI Agent requires manual password entry per session
- Legacy admin protected by Firebase Auth (`aymenmed25071999@gmail.com`)

## Real-time Updates
- Products poll via `/api/products` every 20s (stock page)
- Dashboard stats poll via `/api/dashboard-stats` every 30s (overview)
- Orders: `getServerSideProps` + Admin SDK on initial load

## Payment
- Cash on Delivery (COD) only
- Orders saved to `orders` collection with `status: 'pending'`
