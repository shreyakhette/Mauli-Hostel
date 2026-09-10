import React from 'react';
import { Card } from '../common/Card';
import { CheckCircle2, AlertCircle, CalendarCheck, Users, BarChart2 } from 'lucide-react';

export const ReportCharts = ({ summary }) => {
  if (!summary) return null;

  const { occupancy, complaints, leaves, attendanceTrends, visitors } = summary;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-wine-800" />
              Recent Attendance Trends
            </h4>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              98.2% Average
            </span>
          </div>

          <div className="space-y-3">
            {attendanceTrends && attendanceTrends.map((trend) => {
              const total = trend.present + trend.absent + trend.late + trend.onLeave;
              const presentPct = total > 0 ? Math.round((trend.present / total) * 100) : 95;

              return (
                <div key={trend.date} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">{trend.date}</span>
                    <span className="font-bold text-gray-900">
                      {trend.present} Present • {trend.absent} Absent • {trend.late} Late
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-600 h-full"
                      style={{ width: `${presentPct}%` }}
                      title={`Present: ${trend.present}`}
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${(trend.late / (total || 1)) * 100}%` }}
                      title={`Late: ${trend.late}`}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${(trend.absent / (total || 1)) * 100}%` }}
                      title={`Absent: ${trend.absent}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Complaints Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-wine-800" />
              Complaints Status & Resolution
            </h4>
            <span className="text-xs font-bold text-gray-500">
              Total: {complaints?.total || 0}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="p-3 rounded-xl bg-blue-50 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-800">Open</span>
              <p className="text-lg font-black text-blue-950">{complaints?.open || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800">In Progress</span>
              <p className="text-lg font-black text-amber-950">{complaints?.inProgress || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Resolved</span>
              <p className="text-lg font-black text-emerald-950">{complaints?.resolved || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-center">
              <span className="text-[10px] uppercase font-bold text-rose-800">Rejected</span>
              <p className="text-lg font-black text-rose-950">{complaints?.rejected || 0}</p>
            </div>
          </div>

          {/* Category distribution */}
          <div>
            <h5 className="text-[11px] font-bold uppercase text-gray-400 mb-2">
              Issue Breakdown by Category
            </h5>
            <div className="space-y-2">
              {complaints?.byCategory && Object.entries(complaints.byCategory).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700">{cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="bg-wine-800 h-full rounded-full"
                        style={{ width: `${Math.min(100, count * 15)}%` }}
                      />
                    </div>
                    <span className="font-bold text-gray-900 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Leave Requests Analytics */}
        <Card className="p-6">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
            <CalendarCheck className="w-4 h-4 text-wine-800" />
            Out-Station Leave Breakdown
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-amber-50 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800">Pending Review</span>
              <p className="text-2xl font-black text-amber-950 mt-1">{leaves?.pending || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Approved</span>
              <p className="text-2xl font-black text-emerald-950 mt-1">{leaves?.approved || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 text-center">
              <span className="text-[10px] uppercase font-bold text-rose-800">Rejected</span>
              <p className="text-2xl font-black text-rose-950 mt-1">{leaves?.rejected || 0}</p>
            </div>
          </div>
        </Card>

        {/* Visitor Stats */}
        <Card className="p-6">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-wine-800" />
            Visitor Pass Traffic
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-surface-100 text-center">
              <span className="text-[10px] uppercase font-bold text-gray-500">Today's Visits</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{visitors?.todayCount || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Approved</span>
              <p className="text-2xl font-black text-emerald-950 mt-1">{visitors?.approved || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-800">Monthly Total</span>
              <p className="text-2xl font-black text-purple-950 mt-1">{visitors?.totalMonthly || 0}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportCharts;
