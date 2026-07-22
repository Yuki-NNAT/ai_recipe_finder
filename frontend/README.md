# AI Recipe Finder — Frontend

AI-powered recipe discovery, nutrition analysis, calorie calculator and a cooking
assistant. Production-oriented React MVP; the backend (FastAPI / MySQL / AWS) is
mocked at the service layer for now.

## Stack
React 19 · Vite · TailwindCSS · React Router · Axios · Framer Motion ·
React Hook Form · Chart.js · SweetAlert2 · React Hot Toast · Lucide · clsx

## Getting started
```bash
npm install
npm run dev
```

## Architecture (feature-based)
```
src/
  app/          App shell & providers
  theme/        Design tokens + global styles
  ui/           Reusable UI kit (single import surface: '@/ui')
  layouts/      App shell layouts
  features/     Home, Recipes, Nutrition, Calculator, Chat, Auth, Profile, Admin
                (each: components/ pages/ hooks/ services/ data/)
  services/     Mocked API clients
  contexts/     Global providers (auth, favorites)
  hooks/        Cross-cutting hooks
  routes/       Router config
  utils/        Helpers (cn, formatters)
  constants/    Routes & app constants
  mock/         Mock datasets
```

## Build order (all modules complete)
1. Folder structure · 2. Theme · 3. UI Kit · 4. Layouts · 5. Dashboard ·
6. Home · 7. Recipe · 8. Nutrition · 9. Calculator · 10. AI Chat ·
11. Auth · 12. Profile · 13. Admin · 14. Routing · 15. Mock Services — ✅

## Routes
- `/` Home · `/recipes` · `/recipes/:id` · `/nutrition` · `/calculator`
- `/favorites` · `/chat` (login) · `/profile` (login)
- `/login` · `/register`
- `/admin`, `/admin/users`, `/admin/recipes`, `/admin/categories` (admin only)
- `*` 404 · `/_styleguide` (internal UI-kit reference)

## Demo credentials
- **User:** any email + a 6+ character password.
- **Admin:** an email starting with `admin` (e.g. `admin@airecipe.app`) + 6+ chars,
  which unlocks the Admin area and an Admin group in the sidebar.

## Connecting the FastAPI backend
The data layer runs in two modes, toggled by env (`src/config/env.js`):

- **Mock (default):** no config needed — standalone demo on mock data.
- **Real:** set `VITE_API_URL` and `VITE_USE_MOCK=false` in `.env` (see
  `.env.example`). Services then call the backend via `src/lib/api.js` (axios +
  bearer token from `src/lib/authToken.js`).

Because the RDS schema has no image/rating/reviews/category/macros, the mapping
"bám RDS → frontend" lives in one place — `src/services/adapters.js` — and the
recipe UI tolerates the missing fields (placeholder image, hidden rating/time,
calories-only nutrition).

`RecipeService`, `ChatService` and `FavoriteService` are already dual-mode.

### Still to wire for full real mode
- **Cognito auth:** `src/lib/authToken.js` currently returns the mock session
  token. Point it at the Cognito **id token** (via aws-amplify) and switch the
  login/register pages to Cognito sign-in/sign-up.
- **Categories filter** in real mode (RDS uses tags, not a category column).
- **Reviews / Nutrition dashboard** have no RDS tables yet (stay on mock).
