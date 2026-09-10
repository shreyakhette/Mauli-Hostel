import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { attendanceApi } from '../../api/services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import AttendanceStatsCard from '../../components/attendance/AttendanceStatsCard';
import Skeleton from '../../components/common/Skeleton';

export const StudentAttendance = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const statsData = await attendanceApi.getMyStats();
        setStats(statsData || {
          percentage: 92.5,
          presentCount: 37,
          absentCount: 1,
          lateCount: 2,
          onLeaveCount: 4,
          totalDays: 44
        });

        // Mock recent 14-day log entries if not returned in single call
        const mockLog = Array.from({ length: 14 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const isWeekend = d.getDay() === 0;
          return {
            id: i + 1,
            date: d.toISOString().split('T')[0],
            status: isWeekend ? 'ON_LEAVE' : i === 5 ? 'LATE' : 'PRESENT',
            checkInTime: isWeekend ? '-' : i === 5 ? '9:14 PM' : '8:35 PM',
            remarks: i === 5 ? 'Delayed due to college library project' : isWeekend ? 'Approved home visit pass' : 'Normal gate check-in'
          };
        });
        setHistory(mockLog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Attendance & Curfew Tracking</h1>
        <p className="text-surface-muted text-sm mt-1">
          Daily 9:00 PM hostel gate biometric check-in log and semester attendance compliance.
        </p>
      </div>

      {/* Stats Card */}
      {loading ? (
        <Skeleton className="h-44 w-full rounded-3xl" />
      ) : (
        <AttendanceStatsCard stats={stats} />
      )}

      {/* Curfew Rules Notice Banner */}
      <Card className="bg-gradient-to-r from-wine-900 to-rose-800 text-white p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Hostel Curfew & Gate Policy</h3>
              <p className="text-xs text-rose-100/90 mt-1 max-w-2xl leading-relaxed">
                Hostel main gates close at <span className="font-semibold text-white">9:00 PM sharp</span>. Check-ins past 9:00 PM require prior permission from Warden Kranti Bhoyar or emergency pass confirmation. Three unexcused late marks trigger guardian notification.
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-rose-200 block">Current Status</span>
            <span className="text-xs font-bold text-emerald-300">✓ In Good Standing</span>
          </div>
        </div>
      </Card>

      {/* Attendance History Table */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-surface-charcoal">Recent Gate Entry Log</h3>
            <p className="text-xs text-surface-muted">Biometric verified check-ins at Sakhi Main Gate</p>
          </div>
          <span className="text-xs font-medium text-surface-muted">Showing past 14 days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-divider text-surface-muted uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Gate Check-In Time</th>
                <th className="py-3 px-4">Remarks / Exception</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-divider">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-wine-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-surface-charcoal">
                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge 
                      variant={
                        record.status === 'PRESENT' ? 'success' : 
                        record.status === 'LATE' ? 'warning' : 
                        record.status === 'ON_LEAVE' ? 'neutral' : 'danger'
                      }
                    >
                      {record.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-surface-charcoal">
                    {record.checkInTime}
                  </td>
                  <td className="py-3.5 px-4 text-surface-muted">
                    {record.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentAttendance;
