import React, { useState } from 'react';
import { Card } from '../common/Card';
import { BedDouble, Sparkles, Building } from 'lucide-react';

export const OccupancyVisualization = ({
  today,
  week,
  month,
  totalBeds = 400,
  occupiedBeds = 363,
  availableBeds = 37,
  occupancyPercentage = 90.7,
}) => {
  const [period, setPeriod] = useState('Today');

  const activeData =
    period === 'Today'
      ? today || { totalCapacity: totalBeds, occupied: occupiedBeds, available: availableBeds, occupancyRate: occupancyPercentage }
      : period === 'This Week'
      ? week || { totalCapacity: totalBeds, occupied: 360, available: 40, occupancyRate: 90.0 }
      : month || { totalCapacity: totalBeds, occupied: 355, available: 45, occupancyRate: 88.8 };

  const rate = activeData.occupancyRate ?? occupancyPercentage;

  return (
    <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-surface-50 to-wine-50/20">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Occupancy Analytics
          </span>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
            Hostel Occupancy
          </h3>
        </div>

        {/* Period Switch: Today | This Week | This Month */}
        <div className="flex items-center p-1 rounded-xl bg-gray-100/90 border border-gray-200/60 text-xs font-bold">
          {['Today', 'This Week', 'This Month'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                period === p
                  ? 'bg-white text-wine-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Occupancy Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-wine-950 tracking-tight">
              {rate}%
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Capacity Utilization
            </span>
          </div>

          <span className="text-sm font-bold text-gray-700">
            {activeData.occupied} / {activeData.totalCapacity} Beds Occupied
          </span>
        </div>

        {/* Progress Bar with Gradient */}
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-wine-900 via-wine-700 to-rose-600 transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
          />
        </div>
      </div>

      {/* Breakdown Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400">Total Beds</span>
          <p className="text-lg font-black text-gray-900">{activeData.totalCapacity}</p>
        </div>

        <div className="p-3 rounded-xl bg-wine-50 border border-wine-100">
          <span className="text-[10px] uppercase font-bold text-wine-800">Occupied</span>
          <p className="text-lg font-black text-wine-950">{activeData.occupied}</p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
          <span className="text-[10px] uppercase font-bold text-emerald-800">Available</span>
          <p className="text-lg font-black text-emerald-950">{activeData.available}</p>
        </div>

        <div className="p-3 rounded-xl bg-surface-100 border border-gray-100">
          <span className="text-[10px] uppercase font-bold text-gray-500">Rooms</span>
          <p className="text-lg font-black text-gray-900">100 (4 Beds/Rm)</p>
        </div>
      </div>
    </Card>
  );
};

export default OccupancyVisualization;
