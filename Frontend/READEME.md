# AI Travel Planner

## Project Overview

AI Travel Planner is a full-stack web application that generates personalized travel itineraries using Google's Gemini AI.

Users can:

* Register and login securely
* Create AI-generated travel plans
* View detailed itineraries
* Access budget estimates
* Explore hotel recommendations
* Manage trips from a personalized dashboard

The application supports multiple users with strict data isolation.

---

## Tech Stack

### Frontend

* Next.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt

### Database

* SQLite

### AI

* Google Gemini API

### Why SQLite?

MongoDB was listed as preferred but not mandatory.

SQLite was selected because the project data model is highly relational:

Users → Trips → Days → Activities → Hotels

SQLite simplified development, deployment, and relational querying while satisfying all project requirements.

---

## Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

Create:

.env

PORT=5000
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Architecture

Frontend (Next.js)
↓
Backend (Express)
↓
SQLite
↓
Gemini AI

---

## Authentication & Authorization

Authentication uses JWT.

Passwords are hashed using bcrypt before storage.

Protected routes validate JWT tokens.

All trip-related queries are filtered using the authenticated user's ID to prevent unauthorized access.

---

## AI Agent Design

The AI agent receives:

* Destination
* Number of days
* Budget tier
* Interests

Gemini generates:

* Day-by-day itinerary
* Budget estimation
* Hotel recommendations

Responses are returned as structured JSON and persisted in SQLite.

---

## Custom Feature

### Smart Travel Advisor

The application generates destination-specific travel tips including:

* Local transportation advice
* Money-saving recommendations
* Travel precautions
* Best visiting times

This improves user decision-making and trip quality.

---

## Key Design Decisions

* SQLite chosen over MongoDB for relational consistency
* JWT-based stateless authentication
* Structured AI JSON responses for reliable storage
* Separation of concerns using controllers, middleware, services, and routes

---

## Trade-offs

Advantages:

* Fast development
* Simple deployment
* Strong relational modeling

Trade-offs:

* SQLite is less suitable for large-scale distributed workloads compared to MongoDB
* Gemini API quotas may affect generation requests during high usage

---

## Known Limitations

* AI responses depend on Gemini API availability
* Hotel recommendations are AI-generated and not connected to live booking platforms
* Budget estimates are approximate and intended for planning purposes
