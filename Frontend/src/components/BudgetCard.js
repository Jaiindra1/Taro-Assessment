'use client';

export default function BudgetCard({ label, amount }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-blue-600">
        ${amount?.toLocaleString() || 0}
      </p>
    </div>
  );
}
