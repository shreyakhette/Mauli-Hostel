import React from 'react';
import { Card } from '../common/Card';
import { CircularProgress } from '../common/CircularProgress';
import { CheckCircle2, XCircle, Clock, CalendarDays } from 'lucide-react';

export const AttendanceStatsCard = ({ stats }) => {
  if (!stats) return null;

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Circular Chart */}
        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={stats.percentage}
            size={140}
            strokeWidth={12}
            label="Attendance"
            sublabel="Minimum 75% required"
            color={
              stats.percentage >= 85
                ? 'stroke-emerald-600'
                : stats.percentage >= 75
                ? 'stroke-amber-500'
                : 'stroke-rose-600'
            }
          />
        </div>

        {/* Right: Key metrics */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 text-emerald-700 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Present</span>
            </div>
            <span className="text-2xl font-black text-emerald-950">{stats.presentCount}</span>
            <span className="text-[11px] text-emerald-600 mt-0.5">Days attended</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 text-rose-700 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Absent</span>
            </div>
            <span className="text-2xl font-black text-rose-950">{stats.absentCount}</span>
            <span className="text-[11px] text-rose-600 mt-0.5">Unexcused</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Late</span>
            </div>
            <span className="text-2xl font-black text-amber-950">{stats.lateCount}</span>
            <span className="text-[11px] text-amber-600 mt-0.5">Recorded late</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <CalendarDays className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Leave</span>
            </div>
            <span className="text-2xl font-black text-purple-950">{stats.onLeaveCount ?? stats.leaveCount ?? 0}</span>
            <span className="text-[11px] text-purple-600 mt-0.5">Approved out</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceStatsCard;
