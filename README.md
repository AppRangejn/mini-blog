# MINI BLOG

## Project Overview & Tech Stack

MINI BLOG is a full-stack blogging application with public post browsing and an
admin interface for managing posts.

- **Backend:** Express, TypeScript, PostgreSQL, Sequelize
- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS, Yup

## Project Structure

```text
backend/
  src/          API, database models, validation, and seeder
  tests/        HTTP request examples
frontend/
  src/app/      Next.js routes and layouts
  src/components/
```

## Database & Backend Setup

1. Create a PostgreSQL database. The example configuration uses database
   `mini_blog` on `localhost:5432` with the `postgres` user.
2. Configure and install the backend:

   ```bash
   cd backend
   cp .env.example .env
   npm install
   ```

   Update `.env` with your database credentials and a strong `JWT_SECRET`.
   `PORT` defaults to `5000`; the example sets it explicitly.
3. Start the backend once to connect to PostgreSQL and initialize the schema:

   ```bash
   npm run dev
   ```

4. With the backend running and the schema initialized, run seed :

   ```bash
   cd backend
   npm run seed
   ```

   Local development defaults are email `admin@example.com` and password
   `password123` (name `Admin`). 
5. To compile the backend for production:

   ```bash
   npm run build
   ```

## Frontend Setup

1. Configure and install the frontend:

   ```bash
   cd frontend
   cp .env.example .env.local
   npm install
   ```

   `NEXT_PUBLIC_API_URL` defaults to `http://localhost:5000/api`.
2. Start the frontend at Next.js's default development port (`3000`):

   ```bash
   npm run dev
   ```

3. Build the production frontend:

   ```bash
   npm run build
   ```

## User Roles & API Endpoints

All endpoints are under `/api`.

| Method | Route | Access |
|---|---|---|
| `POST` | `/auth/register` | Guest |
| `POST` | `/auth/login` | Guest |
| `GET` | `/auth/me` | User, Admin |
| `GET` | `/posts` | Guest, User, Admin |
| `GET` | `/posts/:id` | Guest, User, Admin |
| `POST` | `/posts` | Admin |
| `PUT` | `/posts/:id` | Admin |
| `DELETE` | `/posts/:id` | Admin |
