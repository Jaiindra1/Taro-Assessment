'use client';

import Link from 'next/link';
import { formatDate } from '@/utils/formatters';

export default function TripCard({ trip, onDelete, deleting = false }) {
  const tripHref = trip.id ? `/trip/${trip.id}` : '/dashboard';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <span className="text-6xl">🌍</span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {trip.destination}
        </h3>

        <div className="space-y-2 mb-4 text-gray-600">
          <p className="flex items-center gap-2">
            <span>📅</span>
            <span>{trip.duration} days</span>
          </p>
          <p className="flex items-center gap-2">
            <span>💰</span>
            <span>${trip.totalBudget?.toLocaleString() || 'N/A'}</span>
          </p>
          <p className="flex items-center gap-2">
            <span>📌</span>
            <span className="text-sm">{formatDate(trip.createdAt)}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={tripHref}
            aria-disabled={!trip.id}
            className="flex-1 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => onDelete?.(trip.id)}
            disabled={!trip.id || deleting}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold transition"
          >
            {deleting ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
