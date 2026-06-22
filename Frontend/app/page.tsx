import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to TravelAI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plan your perfect trip with AI-powered recommendations and personalized itineraries
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Explore</h3>
            <p className="text-gray-600">
              Discover amazing destinations and get personalized recommendations based on your interests
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Plan</h3>
            <p className="text-gray-600">
              Create detailed itineraries with AI suggestions for activities, restaurants, and attractions
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Budget</h3>
            <p className="text-gray-600">
              Get accurate budget estimates and money-saving tips for your dream vacation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
