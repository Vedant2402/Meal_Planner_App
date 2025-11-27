# Meal Planner App

A full-stack web app for creating and managing personal meal plans, searching recipes via the Spoonacular API, and storing user preferences and meal plans in MongoDB.

This repo contains a Svelte (Vite) frontend and a Node.js/Express backend with JWT-based authentication and a MongoDB Atlas database.

## Tech Stack

- Frontend: Svelte 5, Vite 6, `svelte-routing`, Axios, Bootstrap (CDN), Font Awesome (CDN)
- Backend: Node.js, Express 4, Mongoose 8, JSON Web Tokens (`jsonwebtoken`), Node `crypto` (scrypt) for password hashing, Axios, CORS, `dotenv`
- Database: MongoDB Atlas (Mongoose ODM)
- External API: Spoonacular `recipes/complexSearch`
- Dev Tools: Nodemon, Thunder Client collection (included)

## Monorepo Structure

```
client/                 # Svelte + Vite frontend
  src/
    pages/
      LoginRegister.svelte
      Profile.svelte
    components/
      MealPlan.svelte
    styles/
      app.css
  index.html
  package.json

Server/                 # Express + Mongoose backend
  app.js
  .env                  # Environment variables (do NOT commit secrets)
  api/
    routes/             # Express routers (users, meals, mealplans)
    controllers/        # Route handlers
    models/             # Mongoose schemas (User, MealPlan)
    middleware/         # JWT auth verification
    util/               # Auth helpers (hash/compare/sign/verify)
  db/
    connection.js       # MongoDB connection via Mongoose
  package.json

thunder-collection_MealPlannerApp.json # Thunder Client requests
```

## Features

- User registration and login with JWT authentication
- Passwords hashed using Node `crypto` scrypt (salted)
- Store user preferences (array of diet strings)
- Search meals via Spoonacular by query and diets
- Create weekly meal plans (max 3 meals/week per plan)
- View profile with populated meal plans

## Environment Variables

Create `Server/.env` with the following keys. Use your own secrets and do not commit them.

```
# Spoonacular
SPOONACULAR_API_KEY=your_spoonacular_api_key
SPOONACULAR_API_URL=https://api.spoonacular.com/recipes/complexSearch

# Auth
JWT_SECRET=your_long_random_hex_secret

# MongoDB Atlas
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_ADDRESS=cluster0.xxxxx.mongodb.net
DB_NAME=MealPlannerApp
```

Tip: Generate a strong JWT secret in PowerShell

```
powershell -Command "$([BitConverter]::ToString((New-Object byte[] 32 | %{[void](New-Object Random).NextBytes($_);$_} ) ).Replace('-', '')).ToLower()"
```

## Getting Started

Prerequisites
- Node.js 18+ and npm
- A MongoDB Atlas cluster (or compatible MongoDB)
- A Spoonacular API key

Install and run the backend

```
# From repo root
cd Server
npm install
npm run dev
```

- Server runs on `http://localhost:8080`
- Connects to MongoDB using `Server/.env`

Install and run the frontend

```
# From repo root
cd client
npm install
npm run dev
```

- Vite dev server runs on the printed URL (default `http://localhost:5173`)
- The frontend calls the backend at `http://localhost:8080`

## How Authentication Works

- On login, the server issues a JWT signed with `JWT_SECRET` and 24h expiry.
- The client stores `{ _id, header_token }` in `localStorage` under key `Users`.
- Protected routes require `Authorization: Bearer <token>`.
- Middleware `verifyUsers` validates the token and attaches `req.verified = { username, user_id }`.

## Data Models

User (`Server/api/models/user.js`)

```
username: String (unique, lowercase, required)
password: String (hashed with scrypt, required)
preferences: [String] (default: [])
virtual mealplans: refs MealPlan by user_id
```

MealPlan (`Server/api/models/mealplan.js`)

```
user_id: ObjectId -> User (required)
week: Number (required)
meals: [
  {
    mealId: Number,
    name: String,
    diets: [String],
    image: String
  }
]
```

## API Reference

Base URL: `http://localhost:8080`

Auth header where noted: `Authorization: Bearer <token>`

- POST `/users/register`
  - Body: `{ "username": string, "password": string, "preferences": string[] }`
  - Response: `{ _id, username, preferences }`

- POST `/users/login`
  - Body: `{ "username": string, "password": string }`
  - Response: `{ _id, username, preferences, token_type: "Bearer", access_token }`

- GET `/users/:id` (protected)
  - Returns the user (without password) with populated `mealplans`.

- PUT `/users/:id` (protected)
  - Body: `{ "preferences": string[] }`
  - Updates the user’s preferences and returns the updated user.

- GET `/meals/search` (protected)
  - Query params: `meal=<query>&diets=comma,separated,diets`
  - Proxies to Spoonacular `complexSearch` with `addRecipeInformation=true`.
  - Response: `results[]` from Spoonacular.

- POST `/mealplans` (protected)
  - Body: `{ week: number, mealId: number, name: string, diets: string[], image: string }`
  - Creates or updates the user’s meal plan for `week`; max 3 meals.

- DELETE `/mealplans/:id` (protected)
  - `:id` is the user’s id. Deletes that user’s meal plan document.

## Using The App (Frontend)

- Open the client dev server URL in your browser.
- Register a new user or log in with existing credentials.
- After login you’re redirected to your profile: `/profile/:id`.
- The Profile page fetches your user with populated meal plans.

Note: A navigation link for “Search” exists, but a dedicated search page is not included. Use the API/Thunder Client to search and add meals to plans, or extend the UI as needed.

## Thunder Client Collection

A ready-to-use collection is included: `thunder-collection_MealPlannerApp.json`.
- Import into the Thunder Client VS Code extension.
- Update bearer tokens and any placeholder values.
- Requests include examples for Users, Meals, and Mealplans endpoints.

## CORS and Ports

- Backend enables CORS and exposes the `Authorization` header to the client.
- Backend listens on port `8080`.
- Frontend default dev port is `5173`.

## Common Issues & Tips

- 401/403 on protected routes: ensure you’re sending `Authorization: Bearer <token>` and the user id in the URL matches the token’s `user_id`.
- MongoDB connection errors: verify `DB_USER`, `DB_PASSWORD`, `DB_ADDRESS`, and `DB_NAME` in `Server/.env`.
- Spoonacular 401/402/429: check `SPOONACULAR_API_KEY`, usage limits, and `SPOONACULAR_API_URL`.
- Password hashing: implemented using Node `crypto` scrypt with per-user salt. Do not store plaintext passwords.
- Do not commit `.env` with secrets. Keep a local copy per developer/environment.

## Scripts

Backend (in `Server/`)
- `npm run dev`: Start Express with Nodemon.

Frontend (in `client/`)
- `npm run dev`: Start Vite dev server.
- `npm run build`: Production build.
- `npm run preview`: Preview production build.

## Roadmap Ideas

- Add a dedicated Search UI page to browse and add meals.
- Edit/remove individual meals within a week instead of deleting the plan document.
- Server-side input validation with a schema validator.
- Improve CORS configuration and security headers.
- Replace hardcoded port with `PORT` env var.

---

Made with Svelte, Express, and MongoDB.
