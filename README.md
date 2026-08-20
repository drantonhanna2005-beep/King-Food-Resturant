# King Food Project

## Configuration
Copy `.env.example` to `.env` and fill in your own values. `.env` is git-ignored and must never be committed.

```bash
cp .env.example .env
npm install
npm run dev
```

`MONGO_URI` and `SESSION_SECRET` are required — the server refuses to start without them.

## Admin Login
The admin account is created on first login only when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `.env`.
Choose your own credentials; they are never hardcoded in the source.

## Email + AI
- `SMTP_USER` / `SMTP_PASS` (Gmail App Password) are used to deliver password reset codes and admin emails.
  Without them, reset codes are only logged to the server console in development.
- `EYEGPT_API_KEY` / `OPENROUTER_API_KEY` enable the AI chat endpoint. It is disabled when neither is set.

## Features
- Password eye toggle in login/register/forgot-reset pages.
- Register blocks duplicated email and shows red "already exist" warning.
- Fully responsive pages for mobile/tablet/desktop.
- Admin dashboard with hamburger menu on phone.
- MongoDB CRUD for categories/products/orders/users/coupons/notifications/logs/analytics.
- Import 15 food API categories and products into MongoDB.
