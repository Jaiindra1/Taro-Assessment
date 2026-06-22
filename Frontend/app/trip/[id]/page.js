'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { tripService } from '@/services/api';
import BudgetCard from '@/components/BudgetCard';
import HotelCard from '@/components/HotelCard';
import TravelTips from '@/components/TravelTips';
import { formatDate } from '@/utils/formatters';

export default function TripDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const data = await tripService.getTripById(tripId);
        setTrip(data);
      } catch (err) {
        setError('Failed to load trip details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (tripId && tripId !== 'undefined') {
      fetchTrip();
    } else {
      setError('Invalid trip id.');
      setLoading(false);
    }
  }, [tripId, router]);

  const handleDeleteTrip = async () => {
    if (!trip?.id || deleting) {
      return;
    }

    const confirmed = window.confirm('Delete this trip?');

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      await tripService.deleteTrip(trip.id);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete trip. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">✈️</div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-600">Trip not found</p>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-700 font-semibold mb-8 block"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{trip.destination}</h1>
              <div className="flex gap-8 text-lg">
                <span className="flex items-center gap-2">
                  <span>📅</span>
                  {trip.duration} days
                </span>
                <span className="flex items-center gap-2">
                  <span>💰</span>
                  ${trip.totalBudget?.toLocaleString() || 'N/A'}
                </span>
                <span className="flex items-center gap-2">
                  <span>📌</span>
                  {formatDate(trip.createdAt)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDeleteTrip}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-5 py-2 rounded font-semibold transition"
            >
              {deleting ? 'Deleting...' : 'Delete Trip'}
            </button>
          </div>
        </div>

        {trip.budget && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Budget Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <BudgetCard label="Flights" amount={trip.budget.flights} />
              <BudgetCard label="Accommodation" amount={trip.budget.accommodation} />
              <BudgetCard label="Food" amount={trip.budget.food} />
              <BudgetCard label="Activities" amount={trip.budget.activities} />
              <BudgetCard label="Total" amount={trip.totalBudget} />
            </div>
          </div>
        )}

        {trip.hotels && trip.hotels.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Hotels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trip.hotels.map((hotel, idx) => (
                <HotelCard key={hotel.id ?? `${hotel.name}-${idx}`} hotel={hotel} />
              ))}
            </div>
          </div>
        )}

        {trip.itinerary && trip.itinerary.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Itinerary</h2>
            <div className="space-y-8">
              {trip.itinerary.map((day, idx) => (
                <div key={day.id ?? `day-${day.day ?? idx + 1}`} className="border-l-4 border-blue-600 pl-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Day {day.day || idx + 1}
                  </h3>
                  {day.activities && day.activities.length > 0 ? (
                    <ul className="space-y-3">
                      {day.activities.map((activity, actIdx) => (
                        <li
                          key={activity.id ?? `${activity.title ?? activity.name ?? activity}-${actIdx}`}
                          className="flex items-start gap-3"
                        >
                          <span className="text-blue-600 mt-1">•</span>
                          <div>
                            <p className="text-gray-800 font-semibold">
                              {typeof activity === 'string' ? activity : activity.name || activity.title}
                            </p>
                            {activity.description && (
                              <p className="text-gray-600 text-sm mt-1">
                                {activity.description}
                              </p>
                            )}
                            {activity.time && (
                              <p className="text-gray-500 text-sm">
                                🕐 {activity.time}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : day.description ? (
                    <p className="text-gray-700">{day.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {trip.tips && (
          <div className="mb-8">
            <TravelTips tips={trip.tips} />
          </div>
        )}
      </div>
    </div>
  );
}
