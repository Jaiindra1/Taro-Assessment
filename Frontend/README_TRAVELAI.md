# TravelAI - AI Travel Planner Frontend

A modern, production-ready travel planning application built with Next.js 15, React, Tailwind CSS, and Axios. This frontend integrates with a backend API to provide AI-powered trip recommendations and itineraries.

## Features

- **User Authentication**: Secure login and registration system
- **Trip Dashboard**: View all your planned trips at a glance
- **AI Trip Generation**: Create customized trips with AI recommendations
- **Detailed Itineraries**: Day-wise breakdown of activities and attractions
- **Budget Planning**: Comprehensive budget breakdown by category
- **Hotel Recommendations**: Curated hotel suggestions for your destination
- **Travel Tips**: AI-powered local advice and money-saving tips
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Modern UI**: Clean, intuitive design with smooth transitions

## Project Structure

```
travel-planner/
├── app/
│   ├── layout.tsx                 # Root layout with Navbar
│   ├── page.tsx                   # Home page
│   ├── login/
│   │   └── page.js               # Login page
│   ├── register/
│   │   └── page.js               # Registration page
│   ├── dashboard/
│   │   └── page.js               # Trip dashboard
│   ├── create-trip/
│   │   └── page.js               # Create new trip page
│   ├── trip/
│   │   └── [id]/
│   │       └── page.js           # Trip details page
│   └── globals.css               # Global styles
├── src/
│   ├── components/
│   │   ├── Navbar.js             # Navigation bar component
│   │   ├── TripCard.js           # Trip card component
│   │   ├── BudgetCard.js         # Budget display card
│   │   ├── HotelCard.js          # Hotel recommendation card
│   │   └── TravelTips.js         # Travel tips component
│   ├── services/
│   │   └── api.js                # Axios API client with interceptors
│   └── utils/
│       └── formatters.js         # Utility functions for formatting
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on http://localhost:5000/api

## Installation

1. **Clone or navigate to the project directory**
```bash
cd travel-planner
```

2. **Install dependencies**
```bash
npm install
```

3. **Ensure backend is running**
The backend should be running on `http://localhost:5000/api`

## Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
npm run start
```

## API Configuration

The API base URL is configured in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### API Endpoints

**Authentication:**
- `POST /auth/login` - Login with email and password
- `POST /auth/register` - Register new user
- `GET /auth/me` - Get current user info

**Trips:**
- `GET /trips` - Get all user trips
- `GET /trips/:id` - Get trip details
- `POST /trips/generate` - Generate new AI trip

## Pages Overview

### Home Page (/)
Landing page with navigation links to login/register

### Login Page (/login)
- Email and password input fields
- Form validation
- JWT token saved to localStorage on success
- Redirects to dashboard

### Register Page (/register)
- Name, email, and password input fields
- Form validation
- Redirects to login after successful registration

### Dashboard Page (/dashboard)
- Displays all user trips
- Shows destination, duration, budget, and creation date
- "Create New Trip" button
- Empty state with helpful message when no trips exist

### Create Trip Page (/create-trip)
- Destination input
- Number of days selector
- Budget type dropdown (Low/Medium/High)
- Interest checkboxes (Food, Culture, Shopping, Adventure)
- Form validation requires at least one interest selected
- Submits to `/trips/generate` endpoint

### Trip Details Page (/trip/[id])
- Trip header with destination, duration, and budget
- Budget breakdown section showing:
  - Flights
  - Accommodation
  - Food
  - Activities
  - Total
- Recommended hotels section
- Day-wise itinerary with activities and descriptions
- AI travel tips including:
  - Local transport advice
  - Budget saving tips
  - Best visiting times
  - Additional tips

## Components

### Navbar.js
Navigation component that displays:
- TravelAI logo
- Links to dashboard (if logged in)
- User name (if logged in)
- Login/Register links (if not logged in)
- Logout button (if logged in)

### TripCard.js
Card component displaying trip summary:
- Destination emoji
- Trip name
- Duration
- Total budget
- Creation date
- View Details button

### BudgetCard.js
Simple card for displaying budget categories:
- Category label
- Amount formatted as currency

### HotelCard.js
Hotel recommendation card showing:
- Hotel image/emoji
- Hotel name
- Price per night
- Location
- Rating
- Description

### TravelTips.js
Comprehensive tips display with sections for:
- Local transport advice
- Budget saving tips
- Best visiting times
- Additional tips (array of strings)

## Service Layer (api.js)

The API service provides:

**Request Interceptor:**
- Automatically adds JWT token to Authorization header
- Only runs on client side

**Response Interceptor:**
- Handles 401 errors by clearing token and redirecting to login
- Provides error responses to components

**Auth Service:**
- `login(email, password)` - Login user
- `register(name, email, password)` - Register new user
- `getCurrentUser()` - Fetch current user data

**Trip Service:**
- `getTrips()` - Fetch all user trips
- `getTripById(id)` - Fetch specific trip
- `generateTrip(destination, days, budgetType, interests)` - Generate new trip

## Styling

- **Framework**: Tailwind CSS with a travel-themed color palette
- **Primary Colors**: Blue (#2563eb) and Indigo
- **Responsive**: Fully responsive with mobile-first approach
- **Modern Design**: Clean, minimalist design with smooth transitions
- **Accessibility**: Proper semantic HTML and ARIA labels

## Environment Variables

The application uses environment defaults:
- API Base URL: `http://localhost:5000/api`
- Token Storage: `localStorage` under key `authToken`

To modify, update `src/services/api.js`

## Error Handling

- Form validation with user-friendly error messages
- API error handling with fallback messages
- 401 Unauthorized automatic logout
- Try-catch blocks in async operations
- Loading states for better UX

## State Management

- React `useState` for local component state
- React `useEffect` for side effects and data fetching
- Next.js `useRouter` for navigation
- Next.js `useParams` for route parameters
- Browser `localStorage` for JWT token persistence

## Security Considerations

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Automatic logout on 401 response
- Protected routes check for token before data fetching
- CORS headers handled by backend

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Next.js App Router for optimal routing
- Turbopack for fast builds
- Image optimization ready
- Code splitting by route
- CSS optimization with Tailwind

## Development Tips

1. **Adding New Pages**: Create folder in `app/` directory with `page.js`
2. **Creating Components**: Add to `src/components/` and import using `@/components/`
3. **API Calls**: Use services from `@/services/api.js`
4. **Styling**: Use Tailwind CSS classes directly in JSX
5. **Utilities**: Add helper functions to `src/utils/`

## Troubleshooting

**Build Errors**: Clear `.next` folder and rebuild
```bash
rm -r .next && npm run build
```

**Module Not Found**: Verify tsconfig.json paths alias is set to `./src/*`

**API Connection Issues**: Ensure backend is running on localhost:5000

## License

MIT

## Support

For issues or questions, please refer to the backend API documentation or contact the development team.
