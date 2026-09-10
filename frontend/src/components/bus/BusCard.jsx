import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Bus, Clock, Users, ArrowRight } from 'lucide-react';

export const BusCard = ({ schedule, onEdit, onDelete, isWarden = false }) => {
  const isTuesday = schedule.dayOfWeek?.toUpperCase() === 'TUESDAY';
  const available = schedule.availableSeats ?? 18;
  const total = schedule.totalSeats ?? 40;
  const percentLeft = Math.round((available / total) * 100);

  return (
    <Card
      hover
      className={`p-6 flex flex-col justify-between ${
        isTuesday
          ? 'border-wine-200 bg-gradient-to-b from-wine-50/40 via-white to-white ring-1 ring-wine-300/40'
          : 'border-gray-100'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isTuesday
                  ? 'bg-wine-900 text-white shadow-soft'
                  : 'bg-wine-50 text-wine-900'
              }`}
            >
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                  {schedule.dayOfWeek}
                </h4>
                {isTuesday && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-wine-900 text-white uppercase tracking-wider">
                    Official Shuttle
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{schedule.busNumber || 'Hostel Campus Express'}</p>
            </div>
          </div>
          <Badge status={schedule.status} />
        </div>

        {/* Route Details */}
        <div className="p-3.5 rounded-2xl bg-surface-50 border border-gray-100/80 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2">
            <span>{schedule.route}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-wine-800" />
              <span>Departs: <strong>{schedule.departureTime}</strong></span>
            </div>
            {schedule.returnTime && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <span>Returns: <strong>{schedule.returnTime}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Seat Availability Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-gray-600">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              Seats
            </span>
            <span className={available > 5 ? 'text-emerald-700' : 'text-rose-600'}>
              {available} / {total} Available
            </span>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentLeft > 25 ? 'bg-emerald-600' : 'bg-rose-500'
              }`}
              style={{ width: `${percentLeft}%` }}
            />
          </div>
        </div>

        {schedule.notes && (
          <p className="text-[11px] text-gray-400 italic mt-3">{schedule.notes}</p>
        )}
      </div>

      {isWarden && (
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(schedule)}
            className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-wine-900 hover:bg-wine-50 rounded-lg transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(schedule.id)}
            className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            Delete
          </button>
        </div>
      )}
    </Card>
  );
};

export default BusCard;
