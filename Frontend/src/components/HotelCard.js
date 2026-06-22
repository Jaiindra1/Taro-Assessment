'use client';

export default function HotelCard({ hotel }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
        <span className="text-6xl">🏨</span>
      </div>

      <div className="p-4">
        <h4 className="text-lg font-bold text-gray-800 mb-2">
          {hotel.name || 'Hotel'}
        </h4>

        <div className="space-y-2 text-gray-600 mb-4">
          {hotel.pricePerNight && (
            <p className="text-sm">
              <span className="font-semibold">Price/Night:</span> ${hotel.pricePerNight?.toLocaleString()}
            </p>
          )}
          {hotel.location && (
            <p className="text-sm">
              <span className="font-semibold">Location:</span> {hotel.location}
            </p>
          )}
          {hotel.rating && (
            <p className="text-sm">
              <span className="font-semibold">Rating:</span> ⭐ {hotel.rating}/5
            </p>
          )}
        </div>

        {hotel.description && (
          <p className="text-sm text-gray-500 line-clamp-3">
            {hotel.description}
          </p>
        )}
      </div>
    </div>
  );
}
