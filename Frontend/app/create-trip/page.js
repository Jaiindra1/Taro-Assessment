'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tripService } from '@/services/api';

const INTERESTS_OPTIONS = ['Food', 'Culture', 'Shopping', 'Adventure'];
const BUDGET_TYPES = ['Low', 'Medium', 'High'];

export default function CreateTripPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: '',
    days: '',
    budgetType: 'Medium',
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await tripService.generateTrip(
        formData.destination,
        parseInt(formData.days),
        formData.budgetType,
        formData.interests
      );

      if (response.tripId) {
        router.push(`/trip/${response.tripId}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create trip. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Plan Your Trip
            </h1>
            <p className="text-gray-600">
              Let AI help you create the perfect itinerary
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Paris, Tokyo, New York"
                required
              />
            </div>

            <div>
              <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Days
              </label>
              <input
                type="number"
                id="days"
                name="days"
                value={formData.days}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 7"
                min="1"
                max="365"
                required
              />
            </div>

            <div>
              <label htmlFor="budgetType" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Type
              </label>
              <select
                id="budgetType"
                name="budgetType"
                value={formData.budgetType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {BUDGET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interests (Select at least one)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {INTERESTS_OPTIONS.map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestToggle(interest)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || formData.interests.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Creating your trip...' : 'Generate Trip Plan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
