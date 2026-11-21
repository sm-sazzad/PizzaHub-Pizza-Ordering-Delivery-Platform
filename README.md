# PizzaHub — Artisan Woodfired Pizza Ordering & Restaurant Management Platform

<p align="center">
  <strong>A full-stack, role-based food ordering platform crafted with Next.js 16 (App Router), Tailwind CSS, Better Auth, MongoDB Atlas, and Stripe.</strong>
  <strong>A full-stack, role-based food ordering platform crafted with Next.js 16 (App Router), Tailwind CSS, Better Auth, Express.js, MongoDB Atlas, and Stripe.</strong>
</p>

<p align="center">
  <a href="https://pizzahub-delta.vercel.app" target="_blank"><strong>🌐 View Live Demo</strong></a> •
  <a href="https://github.com/sm-sazzad/PizzaHub-Pizza-Ordering-Delivery-Platform" target="_blank"><strong>💻 GitHub Repository</strong></a>
  <a href="https://pizzahub-delta.vercel.app" target="_blank"><strong>🌐 Live Client Demo</strong></a> •
  <a href="https://pizzahub-server-iota.vercel.app/" target="_blank"><strong>⚡ Live Backend API</strong></a> •
  <a href="https://github.com/sm-sazzad/PizzaHub-Pizza-Ordering-Delivery-Platform" target="_blank"><strong>💻 Client Repository</strong></a> •
  <a href="https://github.com/sm-sazzad/PizzaHub-Server" target="_blank"><strong>🗄️ Server Repository</strong></a>
</p>

---

## 🔗 Live Links & Repositories

- **Live Demo Deployment:** [https://pizzahub-delta.vercel.app](https://pizzahub-delta.vercel.app)
- **GitHub Repository:** [PizzaHub-Pizza-Ordering-Delivery-Platform](https://github.com/sm-sazzad/PizzaHub-Pizza-Ordering-Delivery-Platform)
- **Repository Clone URL:** `https://github.com/sm-sazzad/PizzaHub-Pizza-Ordering-Delivery-Platform.git`
- **Live Client Deployment:** [https://pizzahub-delta.vercel.app](https://pizzahub-delta.vercel.app)
- **Live Backend API:** [https://pizzahub-server-iota.vercel.app/](https://pizzahub-server-iota.vercel.app/)
- **Client GitHub Repository:** [PizzaHub-Pizza-Ordering-Delivery-Platform](https://github.com/sm-sazzad/PizzaHub-Pizza-Ordering-Delivery-Platform)
- **Server GitHub Repository:** [PizzaHub-Server](https://github.com/sm-sazzad/PizzaHub-Server)

---

## 👤 Test Credentials for Evaluation

You can use these pre-configured active demo accounts to evaluate role-based features without creating new accounts:

| Role         | Email              | Password       | Access & Capabilities                                                                                                                                                         |
| :----------- | :----------------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin**    | `admin@gmail.com`  | `Admin123!`    | Manage all users, change user roles (Customer/Vendor/Admin), suspend/unblock accounts, approve or decline vendor pizza recipes, and inspect Stripe subscription transactions. |
| **Vendor**   | `vendor@gmail.com` | `Vendor123!`   | Add new artisan pizzas (image uploads via ImgBB), edit menu items, manage incoming customer orders (Accept / Reject), and explore Pro membership.                             |
| **Customer** | `shawon@gamil.com` | `Customer123!` | Browse menu, search & filter pizzas, place orders with custom delivery dates and notes, cancel pending orders, view order history, and submit verified reviews.               |

_(Quick-fill demo buttons are also integrated directly into the `/signin` page for convenient 1-click evaluation.)_

---

## 🍕 Core Features

### 1. Customer Experience

- **Artisan Hero Showcase:** Interactive preview of woodfired dough styles (Diavola, Margherita, Truffle) with dynamic telemetry and smooth Framer Motion animations.
- **Smart Menu Filtering & Search:** Real-time search by pizza name, instant categorization filters (Classic, Spicy, Vegetarian, BBQ, Specialty), location filters, and price sorting (Low-to-High / High-to-Low).
- **Pizza Details & Custom Ordering:** High-res image galleries, allergen and ingredient breakdowns, woodfired oven badges, and an intuitive order modal with custom delivery dates and special instruction notes.
- **Duplicate Active Order Prevention:** Prohibits duplicate pending/accepted orders for the exact same pizza on the same delivery date.
- **Order Management (`/dashboard/my-orders`):** Live order tracking with status badges (`Pending`, `Accepted`, `Rejected`, `Cancelled`), with one-click order cancellation for pending requests.
- **Verified Customer Review System:** Only customers who have ordered a pizza can submit star ratings and detailed reviews, with the ability to update their existing reviews.

### 2. Vendor Portal (`/dashboard`)

- **Recipe & Menu Publishing:** Add and update artisan pizzas with multiple photo uploads hosted via the ImgBB API, category tagging, pricing, and kitchen location details.
- **Tiered Subscription Limits:** Free-tier vendors can publish up to 3 active menu items. Reaching the threshold provides an upgrade notice.
- **Stripe Premium Upgrade:** Seamless integration with Stripe Checkout to unlock unlimited active menu items and verified kitchen partner status.
- **Incoming Order Dispatch:** Live feed of incoming customer orders showing customer contact numbers, delivery addresses, custom notes, and instant `Accept` / `Reject` dispatch buttons.

### 3. Administrator Operations

- **User Management:** Complete roster of registered platform users with ability to toggle roles (Customer, Vendor, Admin) and immediately suspend/unblock accounts.
- **Menu Moderation:** Review queue for vendor-submitted pizzas with immediate approval/decline controls.
- **Financial Ledger:** Real-time calculation and listing of all vendor subscription transactions processed through Stripe.

### 4. UI/UX & Responsive Excellence

- **Mobile-First Responsive Layout:** Custom responsive navigation drawer, zero horizontal overflow, and responsive data tables & charts.
- **Adaptive Dark & Light Theme:** Persistent theme toggling powered by local storage.
- **Zero Layout Shift Skeletons:** Animated skeleton loaders across menu cards, analytics charts, and detail views.
- **Toast Notifications:** Screen-safe notification system tailored for small mobile viewports and desktop screens.

---

## 💻 Tech Stack

### Frontend

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion & Lucide Icons
- **Authentication Client:** Better Auth Client

### Backend & Cloud Services

- **Server Framework:** Express.js 5 & Node.js (ES Modules)
- **Database:** MongoDB Atlas (Native MongoDB Node.js Driver)
- **Authentication:** Better Auth (JWT plugin with public JWKS token verification via `jose`)
- **Payments:** Stripe Checkout API
- **Image Hosting:** ImgBB API
- **Deployment:** Vercel

---

## 🛠️ Getting Started Locally

### Prerequisites

- Node.js 18.x or later installed
- Git installed
- MongoDB Atlas database connection string

### 1. Clone the repository

```bash
git clone https://github.com/sm-sazzad/PizzaHub-Pizza-Ordering-Delivery-Platform.git
cd PizzaHub-Pizza-Ordering-Delivery-Platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of `pizzahub-client` and add your credentials:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/PizzaHub

# Google OAuth (Optional Social Login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB API Key (For hosting pizza images & avatar uploads)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Express Backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000
# Express Backend URL (Local or Production)
NEXT_PUBLIC_API_URL=https://pizzahub-server-iota.vercel.app

# Stripe Payment Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Engineering Challenges & Solutions

1. **Stateless Cross-Service JWT Verification (Better Auth + Express)**
   - _Challenge:_ The frontend runs on Next.js with Better Auth, while API operations run on a decoupled Express server.
   - _Solution:_ Better Auth's JWT plugin was leveraged with public JWKS exposure at `/api/auth/jwks`. The Express server utilizes `createRemoteJWKSet` from `jose` to cryptographically verify incoming Bearer tokens directly, eliminating double database lookups.

2. **Atomic Duplicate Order Prevention**
   - _Challenge:_ Preventing customers from accidentally triggering duplicate simultaneous orders for the same item and delivery slot.
   - _Solution:_ The order creation pipeline queries active orders matching `{ customerEmail, menuItemId, deliveryDate, status: { $in: ["pending", "accepted"] } }` before inserting, rejecting duplicates with HTTP 409 Conflict.

3. **Strict RBAC & Instant Suspension Propagation**
   - _Challenge:_ Blocking users must immediately revoke ordering and menu management capabilities even if an existing JWT has not yet expired.
   - _Solution:_ Middleware hooks (`verifyAdmin`, `verifyVendor`, `verifyCustomer`) perform an indexed lookup on `isBlocked` before executing protected mutations, instantly denying access with a 403 response if suspended.

4. **Synchronized Bar Chart Baselines Across Varying Label Lengths**
   - _Challenge:_ Mobile bar charts suffered from uneven vertical capsule alignment when label text wrapped into multiple lines.
   - _Solution:_ Implemented fixed label height boundaries combined with flexible capsule stretch (`flex-1`), mathematically guaranteeing that all chart bars sit on the exact same horizontal baseline across all device widths.

---

## 👨‍💻 Author & Connect

- **Author:** Sheikh Md. Sazzad Hossain
- **LinkedIn:** [linkedin.com/in/sm-sazzad](https://linkedin.com/in/sm-sazzad/)
- **GitHub:** [@sm-sazzad](https://github.com/sm-sazzad)

---
