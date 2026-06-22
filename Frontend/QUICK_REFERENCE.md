# TravelAI Frontend - Quick Reference Guide

## 🚀 Getting Started (2 Minutes)

```bash
cd travel-planner
npm run dev
# Opens at http://localhost:3000
```

## 📍 Page Routes at a Glance

```
/              → Home page (public)
/login         → Login form (redirects to /dashboard if authenticated)
/register      → Registration form
/dashboard     → Trip list (requires auth)
/create-trip   → Trip creation form (requires auth)
/trip/[id]     → Trip details (requires auth)
```

## 🔌 API Endpoints

**Base URL**: `http://localhost:5000/api`

### Auth
```
POST   /auth/login          → { email, password }
POST   /auth/register       → { name, email, password }
GET    /auth/me            → Returns current user
```

### Trips
```
GET    /trips              → Returns array of trips
GET    /trips/:id          → Returns single trip
POST   /trips/generate     → { destination, days, budgetType, interests }
```

## 💾 Data Storage

**Token Storage**: `localStorage.authToken` (set after login)

**Auto-cleared**: On 401 error or logout

## 🧩 Component Props

### TripCard
```javascript
<TripCard trip={{
  _id: string,
  destination: string,
  duration: number,
  totalBudget: number,
  createdAt: string (ISO date)
}} />
```

### BudgetCard
```javascript
<BudgetCard 
  label="Flights"
  amount={1000}
/>
```

### HotelCard
```javascript
<HotelCard hotel={{
  name: string,
  pricePerNight: number,
  location: string,
  rating: number,
  description: string
}} />
```

### TravelTips
```javascript
<TravelTips tips={{
  localTransport: string,
  budgetSavingTips: string,
  bestVisitingTimes: string,
  additionalTips: string[]
}} />
```

## 📝 Common Tasks

### Add a New Page
1. Create folder: `app/my-page/`
2. Create file: `app/my-page/page.js`
3. Add 'use client' directive if interactive
4. Route available at `/my-page`

### Create a New Component
1. Create file: `src/components/MyComponent.js`
2. Export default function
3. Import with: `import MyComponent from '@/components/MyComponent'`

### Make API Call
```javascript
import { tripService } from '@/services/api';

const trips = await tripService.getTrips();
const trip = await tripService.getTripById(id);
```

### Format Date
```javascript
import { formatDate } from '@/utils/formatters';

const formatted = formatDate('2026-06-22T10:00:00Z');
// Output: "Jun 22, 2026"
```

### Check Authentication
```javascript
const token = localStorage.getItem('authToken');
if (!token) {
  router.push('/login');
}
```

## 🎨 Tailwind Classes Used

### Colors
```
bg-blue-600          → Primary action buttons
bg-gray-50           → Page backgrounds
text-gray-800        → Main text
text-gray-600        → Secondary text
border-blue-200      → Light borders
```

### Spacing
```
px-4, py-2           → Button padding
gap-4, gap-6         → Component spacing
mb-8, mt-4           → Vertical spacing
```

### Layout
```
max-w-7xl            → Container width
grid grid-cols-1 md:grid-cols-3 → Responsive grid
flex items-center    → Horizontal alignment
```

## 🔐 Authentication Flow

```
1. User fills login form
2. Submit → POST /auth/login
3. Server returns { token }
4. Save to localStorage.authToken
5. Auto-redirect to /dashboard
6. Navbar updates with user info
7. Axios interceptor adds Bearer token to all requests
```

## ⚠️ Error Handling

**Expected Patterns**:
```javascript
try {
  const data = await apiCall();
  setData(data);
} catch (err) {
  setError(err.response?.data?.message || 'Failed');
} finally {
  setLoading(false);
}
```

**401 Handling**: Auto-logout + redirect to /login

## 📦 File Size Benchmarks

- `api.js` → ~1.8 KB
- `Navbar.js` → ~2.6 KB
- `TripCard.js` → ~1.4 KB
- Pages → 3-8 KB each

## 🧪 Test Scenarios

1. **Register & Login**: Valid credentials → Dashboard
2. **Create Trip**: Fill form → Generates trip → Details page
3. **View Trip**: Click card → Shows full itinerary
4. **Logout**: Click logout → Back to home (redirects to /login)
5. **Invalid Auth**: Manual URL access → Redirects to /login

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| 404 on component | Check import path uses `@/` |
| Build fails | Delete `.next` folder, rebuild |
| API 401 | Check token in localStorage |
| Styles not applied | Clear browser cache (Ctrl+Shift+R) |
| Module not found | Verify tsconfig.json path alias |

## 🔍 Debug Tips

```javascript
// Check authentication status
console.log(localStorage.getItem('authToken'));

// Verify API response
try {
  const data = await tripService.getTrips();
  console.log('Trips:', data);
} catch (err) {
  console.error('Error:', err.response?.data);
}

// Check component state
console.log({ loading, error, trips });
```

## 📚 External Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios Docs](https://axios-http.com)
- [React Hooks](https://react.dev/reference/react)

## 🎯 Performance Tips

1. **Images**: Use next/image for optimization
2. **CSS**: Tailwind purges unused styles in production
3. **Bundle**: App Router enables automatic code splitting
4. **Caching**: Set appropriate cache headers in production

## ✅ Pre-Deployment Checklist

- [ ] Backend API is running
- [ ] Environment URLs are correct
- [ ] No console errors
- [ ] All pages load
- [ ] Forms validate properly
- [ ] Auth flow works
- [ ] Build passes: `npm run build`
- [ ] Tested on mobile

## 📊 Bundle Size

```
Development: ~500 KB (with maps)
Production:  ~150 KB (optimized)
```

## 🎯 Next Steps

1. **Development**: Use `npm run dev`
2. **Testing**: Test all user flows
3. **Production Build**: `npm run build`
4. **Deploy**: Use Vercel, Netlify, or any Node.js host

---

**Last Updated**: June 22, 2026
**Version**: 1.0.0 (Complete)
