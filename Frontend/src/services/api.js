import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://taro-assessment.onrender.com/api';

const parseBudget = (budget) => {
  if (!budget) {
    return null;
  }

  if (typeof budget === 'string') {
    try {
      return JSON.parse(budget);
    } catch {
      return null;
    }
  }

  return budget;
};

const normalizeTripSummary = (trip) => {
  const budget = parseBudget(trip.estimated_budget);

  return {
    ...trip,
    id: trip.id,
    destination: trip.destination,
    duration: trip.duration_days,
    budget,
    totalBudget: budget?.total ?? null,
    createdAt: trip.created_at,
  };
};

const normalizeTripDetails = (payload) => {
  const trip = payload?.trip ?? {};
  const budget = parseBudget(trip.estimated_budget);

  return {
    ...trip,
    id: trip.id,
    destination: trip.destination,
    duration: trip.duration_days,
    budget,
    totalBudget: budget?.total ?? null,
    createdAt: trip.created_at,
    hotels: payload?.hotels ?? [],
    packingList: payload?.packingList ?? [],
    itinerary: (payload?.itinerary ?? []).map((day) => ({
      ...day,
      day: day.day ?? day.dayNumber,
      activities: (day.activities ?? []).map((activity) => ({
        ...activity,
        name: activity.name ?? activity.title,
        time: activity.time ?? activity.time_of_day,
      })),
    })),
  };
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const tripService = {
  getTrips: async () => {
    const response = await api.get('/trips');
    return response.data.map(normalizeTripSummary);
  },
  getTripById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return normalizeTripDetails(response.data);
  },
  generateTrip: async (destination, days, budgetType, interests) => {
    const response = await api.post('/trips/generate', {
      destination,
      durationDays: days,
      budgetTier: budgetType,
      interests,
    });
    return response.data;
  },
  deleteTrip: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },
};

export default api;
