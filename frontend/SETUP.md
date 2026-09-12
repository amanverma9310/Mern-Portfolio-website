# MERN Portfolio — Setup Guide

Your existing React frontend is unchanged in design. This adds a real
Node.js + Express + MongoDB backend and a private `/admin` dashboard.

## 1. Project structure

```
amanv8 portfolio/
├── src/                      ← your existing frontend (mostly untouched)
│   ├── pages/
│   │   ├── PortfolioPage.jsx     ← NEW (wraps your original page)
│   │   └── admin/                ← NEW (admin dashboard pages)
│   ├── components/admin/         ← NEW (ProtectedRoute)
│   ├── context/AuthContext.jsx   ← NEW
│   ├── services/api.js           ← NEW
│   ├── utils/iconMap.js          ← NEW
│   └── utils/analytics.js        ← NEW
├── public/projects/          ← NEW (your two project images, now servable by URL)
├── backend/                  ← ALL NEW — the Express + MongoDB API
│   ├── models/  controllers/  routes/  middleware/  utils/
│   ├── server.js
│   ├── seed.js
│   └── .env.example
├── .env.example               ← NEW (frontend: VITE_API_URL)
└── package.json                ← MODIFIED (added react-router-dom)
```

## 2. Files created vs. modified

**Created (backend — all new):**
`backend/server.js`, `backend/seed.js`, `backend/config/db.js`,
`backend/models/{User,Contact,Project,Skill,Planet,AnalyticsEvent,Settings}.js`,
`backend/controllers/*.js`, `backend/routes/*.js`,
`backend/middleware/{auth,errorHandler,rateLimiters}.js`,
`backend/utils/{generateToken,sendEmail}.js`, `backend/.env.example`, `backend/.gitignore`,
`backend/package.json`

**Created (frontend — new files, nothing replaced):**
`src/pages/PortfolioPage.jsx`, `src/pages/admin/*.jsx`,
`src/components/admin/ProtectedRoute.jsx`, `src/context/AuthContext.jsx`,
`src/services/api.js`, `src/utils/iconMap.js`, `src/utils/analytics.js`,
`.env.example`, `public/projects/*.png`

**Modified (only what was needed to connect to the backend):**
- `src/App.jsx` — now holds routes (`/` and `/admin/*`) instead of a flat component list. The public route still renders the exact same section order via `PortfolioPage.jsx`.
- `src/main.jsx` — wrapped in `BrowserRouter` + `AuthProvider`.
- `src/components/Contact.jsx` — added a **Subject** field, wired the form to `POST /api/contact` with loading/error states. Layout, styling, and animations unchanged.
- `src/components/Projects.jsx` — now fetches projects from `GET /api/projects` with a shimmer loading state; falls back to your original static list if the backend isn't reachable.
- `src/components/ProjectCard.jsx` — added one line to track a project view when it scrolls into view. No visual change.
- `src/components/TechMarquee.jsx` / `src/components/Manifesto.jsx` — now fetch skills from `GET /api/skills`, mapped back to the same icons via `iconMap.js`; fall back to your original hardcoded arrays if unreachable.
- `src/components/Journey.jsx` — now fetches the planet timeline from `GET /api/planets`; same animation code, falls back to your original data.
- `src/components/Hero.jsx` — added a third "Resume" button (same style as your existing buttons), shown only once a resume URL is set in Admin → Settings.
- `package.json` — added `react-router-dom`.
- `.gitignore` — added `.env` / `backend/.env`.

**Not touched at all:** Navbar, Certifications, Footer, FloatingDock, Terminal, all CSS/Tailwind config, animations, colors, images (other than copying two into `public/`).

## 3. Local setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (MongoDB Atlas free cluster), JWT_SECRET,
# ADMIN_USERNAME/ADMIN_EMAIL/ADMIN_PASSWORD, and optionally EMAIL_* vars
npm run seed     # creates your admin account + migrates existing projects/skills/journey into MongoDB
npm run dev      # starts the API on http://localhost:5000
```

### Frontend
```bash
# from the project root
npm install       # pulls in react-router-dom
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm run dev
```

Visit `http://localhost:5173` for the portfolio, `http://localhost:5173/admin/login`
for the dashboard (use the ADMIN_USERNAME/ADMIN_PASSWORD you set before seeding).

## 4. Generating a JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Paste the output into `backend/.env` as `JWT_SECRET`.

## 5. Deployment

- **Frontend** → Vercel/Netlify recommended over GitHub Pages once you have an
  `/admin` route, since GH Pages has no SPA fallback for deep links by
  default. Set `VITE_API_URL` as an environment variable in the host's dashboard.
- **Backend** → Render/Railway. Set all vars from `backend/.env.example` in
  the host's dashboard — **never commit `.env`**. Set `CLIENT_URL` to your
  deployed frontend's exact origin (CORS + cookies depend on this matching).
- **Database** → MongoDB Atlas. Whitelist `0.0.0.0/0` (or your host's IPs) in
  Atlas Network Access.
- After deploying, run `npm run seed` once against the production `MONGO_URI`
  (e.g. from your local machine with production `.env` values) to create the
  admin account and seed initial content.

## 6. Security notes

- Admin auth uses an httpOnly JWT cookie — never exposed to frontend JS.
- No public registration route exists anywhere; the only admin account is
  the one created by `npm run seed`.
- All admin-only routes (`/api/contact` list/update/delete, all `POST/PUT/
  DELETE` on projects/skills/planets, `/api/analytics/overview`,
  `/api/settings/admin`) require a valid session via the `protect` middleware.
- Contact form and login are rate-limited; all inputs are validated
  server-side (never trust frontend-only validation) and sanitized against
  NoSQL injection.
