# B-Diva's Hair — Luxury Hair E-commerce Platform

Full-stack scaffold for a premium hair vendor storefront: React 19 + Vite + Tailwind CSS v4
frontend, Node/Express + MongoDB backend, JWT auth, Cloudinary image uploads, and Paystack
payments.

This zip contains the **project structure, starter pages/components, models, routes, and
controllers already wired together and building successfully.** `node_modules` is NOT included
(that's normal — every dev installs their own), but `package.json` / `package-lock.json` are, so
`npm install` will pull the exact same dependency versions that were tested while building this.

```
b-divas-hair/
├── frontend/     React 19 + Vite + Tailwind v4 + Framer Motion
└── backend/      Express + MongoDB + JWT + Cloudinary + Paystack
```

---

## 1. What YOU need to install on your machine

| Tool | Why | Link |
|---|---|---|
| **Node.js 18+** (20 or 22 recommended) | Runs both frontend and backend | https://nodejs.org |
| **Git** | Version control, deploying | https://git-scm.com |
| **VS Code** (or any editor) | Editing the code | https://code.visualstudio.com |
| **MongoDB Compass** (optional) | GUI to view your database | https://www.mongodb.com/products/compass |

You do **not** need to install MongoDB locally — use a free **MongoDB Atlas** cluster instead (see below).

## 2. Accounts you need to create (all have free tiers)

1. **MongoDB Atlas** — https://www.mongodb.com/cloud/atlas/register — create a free M0 cluster,
   add a database user, whitelist your IP (or `0.0.0.0/0` for dev), and copy the connection string.
2. **Cloudinary** — https://cloudinary.com/users/register/free — for product image hosting. Copy
   your Cloud Name, API Key, and API Secret from the dashboard.
3. **Paystack** — https://dashboard.paystack.com/#/signup — for Nigerian payments (card, bank
   transfer, USSD). Use the **test** secret/public keys while developing.
4. **Gmail App Password** (or any SMTP provider) — for Nodemailer order-confirmation emails.
   https://myaccount.google.com/apppasswords

---

## 3. Running the backend

```bash
cd backend
npm install
cp .env.example .env
# open .env and paste in your MongoDB URI, Cloudinary keys, Paystack keys, JWT secret, email creds
npm run dev
```

Backend runs on `http://localhost:5000`. Health check: `GET /api/health`.

## 4. Running the frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## 5. What's already built

**Frontend**
- Folder structure: `components / pages / layouts / hooks / services / redux / routes / utils / animations`
- Tailwind v4 configured with the B-Diva's brand palette (`#0F0F0F`, `#D4AF37`, `#FFF8F0`, `#6B4F4F`, `#F7E7CE`) as theme tokens in `src/index.css`
- Glassmorphism sticky `Navbar` with mobile menu (Framer Motion)
- Luxury animated `Hero` section with CTA buttons
- `Footer`, `Home` page, React Router setup, Axios instance with JWT auto-attach, `react-hot-toast` wired into `App.jsx`

**Backend**
- MongoDB models: `User`, `Product` (with embedded reviews + ratings), `Order`, `Review`
- JWT auth (`register`, `login`, `profile`) with bcrypt password hashing
- Product CRUD + search/filter/pagination + Cloudinary image upload + review submission
- Order creation with **Paystack** transaction initialize/verify (via direct REST calls — no
  paid/unmaintained SDK dependency), order status tracking, admin order management
- Centralized error handling, `protect` / `admin` auth middleware, Multer memory-storage uploads

## 6. What's intentionally left for you to build next

- Remaining pages: Shop (with filters), Product Details, About, Contact, Auth forms, Customer
  Dashboard, Admin Dashboard — folders are already scaffolded in `frontend/src/pages/`
- Redux (or Context) for cart/wishlist state — `frontend/src/redux/` is ready
- Cart drawer, checkout flow, coupon codes, shipping calculator
- Wiring the frontend to actually call the backend endpoints via `src/services/api.js`
- Admin charts, newsletter subscriber management
- Deployment: Vercel (frontend) + Render/Railway (backend)

## 7. Deployment quick notes

- **Frontend → Vercel**: import the `frontend` folder as the project root, set `VITE_API_URL` to
  your deployed backend URL.
- **Backend → Render or Railway**: set the root directory to `backend`, build command
  `npm install`, start command `npm start`, and add all the `.env` variables in the dashboard.
- Update `CLIENT_URL` in the backend `.env` to your deployed frontend URL once live (needed for
  CORS and the Paystack callback).

---

Built to match the B-Diva's Hair brand spec: luxury salon-boutique aesthetic, Playfair Display +
Poppins typography, gold-on-dark accents, and premium micro-interactions throughout.
