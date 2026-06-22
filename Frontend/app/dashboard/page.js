'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tripService } from '@/services/api';
import TripCard from '@/components/TripCard';

export default function DashboardPage() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingTripId, setDeletingTripId] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const data = await tripService.getTrips();
        setTrips(data);
      } catch (err) {
        setError('Failed to load trips. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [router]);

  const handleDeleteTrip = async (tripId) => {
    if (!tripId || deletingTripId) {
      return;
    }

    const confirmed = window.confirm('Delete this trip?');

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTripId(tripId);
      await tripService.deleteTrip(tripId);
      setTrips((currentTrips) => currentTrips.filter((trip) => trip.id !== tripId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete trip. Please try again.');
      console.error(err);
    } finally {
      setDeletingTripId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">✈️</div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">My Trips</h1>
            <p className="text-gray-600 mt-2">Plan your next adventure</p>
          </div>
          <Link
            href="/create-trip"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            + Create New Trip
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No trips yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start planning your first adventure with AI recommendations
            </p>
            <Link
              href="/create-trip"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Create First Trip
            </Link>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip, index) => (
              <TripCard
                key={trip.id ?? `${trip.destination}-${trip.createdAt}-${index}`}
                trip={trip}
                onDelete={handleDeleteTrip}
                deleting={deletingTripId === trip.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
