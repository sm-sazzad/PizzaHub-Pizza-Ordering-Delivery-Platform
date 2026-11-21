# PizzaHub — Artisan Pizza Ordering & Restaurant Management Web App

PizzaHub is a full-stack food ordering platform built for ordering handcrafted, woodfired pizzas from independent kitchens. It includes role-based dashboards for Customers, Restaurant Vendors, and Platform Admins, along with Stripe subscription billing, live order tracking, and a verified customer review system.

Built with **Next.js (App Router)**, **Express.js**, **MongoDB**, **Better Auth**, and **Tailwind CSS**.

---

## 🔗 Live Links & Repositories

* **Live Frontend:** [https://pizzahub-client.vercel.app](https://pizzahub-client.vercel.app) *(Replace with your live client URL)*
* **Live API Backend:** [https://pizzahub-server.onrender.com](https://pizzahub-server.onrender.com) *(Replace with your live server URL)*
* **Client GitHub Repository:** [https://github.com/your-username/pizzahub-client](https://github.com/your-username/pizzahub-client)
* **Server GitHub Repository:** [https://github.com/your-username/pizzahub-server](https://github.com/your-username/pizzahub-server)

---

## 👤 Test Credentials for Evaluation

You can use these pre-configured demo accounts to test each role without having to register from scratch:

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@pizzahub.com` | `Admin123!` | Approve/reject vendor pizzas, change user roles, block/unblock accounts, and view Stripe subscription revenue. |
| **Vendor** | `luigi@woodfired.com` | `Vendor123!` | Add/edit pizzas (tested free tier max 3 limit), accept/reject orders, and test upgrading to Pro with Stripe. |
| **Customer** | `alex@example.com` | `Customer123!` | Browse catalog, order a pizza with delivery date/notes, cancel pending orders, and submit verified 5-star reviews. |

*(Note: There are also quick-fill buttons on the Sign In page for one-click testing.)*

---

## 🍕 Core Features

### For Customers
* **Artisan Hero Showcase:** Interactive preview of dough styles (Diavola, Truffle, Margherita) on the landing page with smooth Framer Motion animations.
* **Menu Browsing & Search:** Search pizzas by name, filter by food category, filter by kitchen location, and sort by price (low to high / high to low).
* **Pizza Details & Ordering:** Full description, multiple photo thumbnails, woodfired oven badges, and order popup with date picker, address, phone, and delivery notes.
* **Duplicate Order Prevention:** Prevents placing duplicate active orders (pending/accepted) for the same pizza on the same delivery date.
* **My Orders Page:** View past and current orders with real-time status badges, and cancel any order while it is still in "Pending" status.
* **Verified Customer Reviews:** Only customers who have actually ordered a pizza can submit ratings (1 to 5 stars) and feedback. If you already reviewed an item, you can edit and update your review.

### For Vendors
* **Add & Edit Pizzas:** Upload multiple photos (hosted directly via ImgBB), specify category, price, description, and location.
* **Free Plan Limit (Max 3 Items):** Free tier vendors are limited to 3 items. Trying to add a 4th item prompts an upgrade reminder.
* **Pro Vendor Upgrade (Stripe):** Vendors can upgrade to the Premium plan for $29/month via Stripe Checkout to unlock unlimited menu items.
* **Kitchen Order Management:** Live list of incoming customer orders with customer contact details, delivery address, notes, and one-click "Accept" or "Reject" buttons.

### For Admins
* **User Management:** View all registered accounts, change roles (Customer / Vendor / Admin), and immediately block or unblock accounts.
* **Menu Approvals:** Review new pizzas submitted by vendors and either approve them (making them live on the public menu) or reject them.
* **Transactions Ledger:** View a financial log of all vendor Stripe subscription payments with total revenue calculation.

### Design & Polish
* **Dark / Light Mode:** Clean theme switcher with persistent local storage state.
* **Skeleton Loaders:** Custom skeleton animations for cards, tables, detail views, and page routes so the app never feels blank while loading.
* **Pointer Cursors:** Consistent hand pointer on all buttons, dropdowns, links, and avatar menus, with proper not-allowed state on disabled buttons.

---

## 💻 Tech Stack

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript
* **Styling & Motion:** Tailwind CSS, Framer Motion
* **Authentication:** Better Auth (JWT plugin with public JWKS verification)
* **Backend:** Express.js 5, Node.js (ES Modules)
* **Database:** MongoDB Atlas (Native MongoDB driver)
* **Payments:** Stripe Checkout
* **Image Hosting:** ImgBB API

---

## 🛠️ How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pizzahub-client.git
cd pizzahub-client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root folder with the following variables:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/PizzaHub

# Google OAuth (Optional for social login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB API Key (For hosting pizza & avatar photos)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Express Backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Stripe Payment Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

### 4. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. (Make sure your Express server is also running on port 5000).

---

## 💡 Challenges I Handled in this Project

Here are a few tricky requirements from the assignment and how I solved them:

### 1. Blocking Duplicate Active Orders
* **The Problem:** A customer shouldn't be able to accidentally spam-order the exact same pizza for the same delivery date while their previous order is still pending or accepted.
* **How I solved it:** In the backend `POST /orders` handler, before saving the order, I run a query checking if there is already an order with `{ customerEmail, menuItemId, deliveryDate, status: { $in: ["pending", "accepted"] } }`. If found, the server sends back a `409 Conflict` error and the frontend shows a helpful warning toast.

### 2. JWT Flow with Remote JWKS
* **The Problem:** The frontend runs on Next.js with Better Auth, while the API runs separately on Express. Sharing secrets or querying the database twice for every token verification can be messy.
* **How I solved it:** I configured Better Auth's JWT plugin so it exposes public JSON Web Key Sets at `/api/auth/jwks`. On the Express server, I used the `jose` library's `createRemoteJWKSet` to verify incoming Bearer tokens directly against Better Auth's public keys. This keeps the auth stateless and cleanly decoupled.

### 3. Immediate Account Suspension
* **The Problem:** When an admin blocks a user, that user should not be able to place orders or modify catalog items even if their token has not expired yet.
* **How I solved it:** Every protected middleware (`verifyAdmin`, `verifyVendor`, `verifyCustomer`) does a quick check against the database to confirm `dbUser.isBlocked` is false. If blocked, it immediately returns `403 Forbidden`, and the client redirects them to a dedicated `/blocked` notice page.

### 4. Multi-Facet Filtering on the Menu Page
* **The Problem:** Users need to search by name, filter by category buttons, filter by kitchen location, and sort by price all at the same time without conflicting states.
* **How I solved it:** In `src/app/menu/page.tsx`, I extracted unique locations dynamically from the loaded items, and piped the item list through a clean chained filter checking name match, active category, and selected location, followed by sorting. This keeps the UI responsive without needing multiple API refetches.
