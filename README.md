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

- **Frontend:** [http://localhost:3002](http://localhost:3002)
- **Backend:** [http://localhost:3000](http://localhost:3000)
- **Swagger API Docs:** [http://localhost:3000/swagger](http://localhost:3000/swagger)

---

## 🧩 Features

- Analyze user data: age, weight, height, body fat
- Get health recommendations
- View fitness summaries
- Recalculate metrics on weight change
- Tailwind CSS-powered modern UI
- Swagger API documentation

---

## 🔌 API Overview

### 1. `POST /api/analyze`
Creates a new analysis record based on the provided user metrics.

**Request Body:**
```
{
"age": 25,
"weight": 70,
"height": 175,
"bodyFat": 15,
"gender": "male",
"activityLevel": "moderate",
"goal": "maintain"
}
```

**Response:**

```
{
"id": 1,
"bmi": 22.86,
"bmr": 1655.25,
"tdee": 2565.64,
"recommendedCalories": 2565,
"createdAt": "2025-06-23T09:55:00.000Z"
}
```

**Test Coverage:**
- Creates new analysis
- Asserts field calculations
- Validates database persistence

---

### 2. `POST /api/recommendation`
Generates personalized recommendations based on an existing analysis ID.

**Request Body:**
```
{
"analysisId": 1
}
```

**Response:**

```
{
"id": 5,
"analysisId": 1,
"meals": [ { "name": "Oats", "calories": 300 }, ... ],
"workouts": ["Pushups", "Running"],
"proteinGrams": 140,
"fatGrams": 80,
"carbGrams": 300,
"createdAt": "2025-06-23T09:56:00.000Z"
}

```

**Test Coverage:**
- Creates recommendation
- Handles missing analysis
- Validates structure of meals/workouts

---

### 3. `POST /api/recalculate`
Recalculates a new analysis from a previous one, modifying specific fields.

**Request Body:**
```
{
"analysisId": 1,
"weight": 80,
"bodyFat": 20
}
```

**Response:**
```
{
"id": 2,
"weight": 80,
"bodyFat": 20,
"bmi": 26.12,
"bmr": 1725.43,
"tdee": 2684.32,
"recommendedCalories": 2684,
"createdAt": "2025-06-23T10:00:00.000Z"
}
```

**Test Coverage:**
- Successful recalculation
- Handles non-existent `analysisId`

---

### 4. `GET /api/history`
Fetches all previous analysis records with optional recommendation data.

**Response:**
```
[
{
"id": 1,
"weight": 70,
"bmi": 22.8,
"createdAt": "2025-06-23T09:55:00.000Z",
"recommendation": {
"meals": [
{ "name": "Oats", "calories": 250 },
{ "name": "Chicken", "calories": 400 }
],
"workouts": ["Pushups", "Running"]
}
}
// ...more records
]
```

**Test Coverage:**
- Returns full list
- Checks presence and structure of nested recommendation
- Validates meals is an array and each meal has a name and calorie count

---

### 5. `DELETE /api/delete/:id`
Deletes an analysis record and its related recommendation (if exists).

**Example URL:**
```
DELETE /api/delete/1
```

**Success Response:**
```
{ "success": true }
```

**Error Responses:**
```
{ "error": "Invalid ID" } // ID is not a number
{ "error": "Not Found or already deleted" } 
```

**Test Coverage:**
- Successful deletion
- Attempt to delete already-removed record
- Invalid ID format (string, negative, etc.)

### ▶️ Run Tests

```
cd fitmate-api
npm run test
```
- Uses the real PostgreSQL database.
- Data is cleaned up before and after each test.

---

### 🧰 Testing Tools Used


| Tool             | Purpose                        |
|------------------|-------------------------------|
| Vitest           | Test runner                   |
| Zod              | Schema validation             |
| Prisma           | Database ORM                  |
| Superfetch-style | `app.fetch()` for integration |

---

### 📊 Test Coverage Report

![Screenshot 2025-06-23 at 3 02 44 PM](https://github.com/user-attachments/assets/aa57670a-8692-4e34-85b9-af072a6b05bc)
