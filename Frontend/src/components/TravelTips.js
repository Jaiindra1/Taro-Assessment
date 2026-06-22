'use client';

export default function TravelTips({ tips }) {
  if (!tips) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
      <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
        <span>💡</span>
        Travel Tips & Advice
      </h3>

      <div className="space-y-4">
        {tips.localTransport && (
          <div className="bg-white rounded p-4 border-l-4 border-green-600">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>🚗</span>
              Local Transport
            </h4>
            <p className="text-gray-700">{tips.localTransport}</p>
          </div>
        )}

        {tips.budgetSavingTips && (
          <div className="bg-white rounded p-4 border-l-4 border-yellow-600">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>💰</span>
              Budget Saving Tips
            </h4>
            <p className="text-gray-700">{tips.budgetSavingTips}</p>
          </div>
        )}

        {tips.bestVisitingTimes && (
          <div className="bg-white rounded p-4 border-l-4 border-blue-600">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>📅</span>
              Best Visiting Times
            </h4>
            <p className="text-gray-700">{tips.bestVisitingTimes}</p>
          </div>
        )}

        {tips.additionalTips && Array.isArray(tips.additionalTips) && (
          <div className="bg-white rounded p-4 border-l-4 border-purple-600">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>✨</span>
              Additional Tips
            </h4>
            <ul className="space-y-2">
              {tips.additionalTips.map((tip, idx) => (
                <li key={idx} className="text-gray-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
