# 🏋️‍♂️ FitMate

FitMate is a personalized fitness analysis app built with **Next.js**, **Tailwind CSS**, **Hono.js**, and **PostgreSQL**. It lets users analyze their health metrics, get smart recommendations, and view fitness summaries.

---

## 📁 Project Structure

```
fitmate/
├── fitmate-api/      # Backend (Hono.js + TypeScript)
├── frontend/         # Frontend (Next.js + Tailwind CSS)
├── .env.sample
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```
git clone https://github.com/Hurshikesh/keploy-FitMate.git
cd keploy-FitMate
```


### 2. Set Up Environment Variables

Create a `.env` file in the root directory or in the `fitmate-api` folder:

```
cp .env.sample fitmate-api/.env
```


Make sure your `.env` includes:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5433/fitmate
```


### 3. Start PostgreSQL via Docker

Make sure Docker is installed, then run:

```
cd fitmate-api
docker-compose up -d
```
This starts PostgreSQL on port `5433`.


### 4. Install Dependencies

```
cd fitmate-api
npm install --save-dev tsx
```
```
cd ../frontend
npm install -D @tailwindcss/postcss

```
#### Root (if using concurrently)
```
cd ..
npm install
```

#### Or install separately:

```
cd fitmate-api
npm install
```

```
cd ../frontend
npm install
```



### 5. Start the App

#### From the root (using concurrently):

```
npm run dev
```

#### Or separately:
Terminal 1: backend
```
cd fitmate-api
npm run dev
```
Terminal 2: frontend
```
cd frontend
npm run dev
```


---

## 🌐 URLs

- **Frontend:** [http://localhost:3000](http://localhost:3002)
- **Backend:** [http://localhost:3001](http://localhost:3000)
- **Swagger API Docs:** [http://localhost:3001/swagger](http://localhost:3000/swagger)

---

## 🧩 Features

- Analyze user data: age, weight, height, body fat
- Get health recommendations
- View fitness summaries
- Recalculate metrics on weight change
- Tailwind CSS-powered modern UI
- Swagger API documentation

---


