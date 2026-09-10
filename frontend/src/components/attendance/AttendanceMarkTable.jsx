import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Search, Check, X, Clock, Calendar } from 'lucide-react';

export const AttendanceMarkTable = ({
  attendanceList = [],
  selectedDate,
  onDateChange,
  onMarkAttendance,
  loading = false,
}) => {
  const [search, setSearch] = useState('');
  const [roomFilter, setRoomFilter] = useState('');

  const filtered = attendanceList.filter((item) => {
    const q = search.toLowerCase();
    const matchesName = item.studentName.toLowerCase().includes(q) || item.studentSystemId.toLowerCase().includes(q);
    const matchesRoom = !roomFilter || item.roomNumber === roomFilter;
    return matchesName && matchesRoom;
  });

  const rooms = Array.from(new Set(attendanceList.map((i) => i.roomNumber).filter(Boolean))).sort();

  return (
    <Card className="p-6">
      {/* Control Bar: Date picker + Search + Room Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
            Attendance Date:
          </label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800 w-48"
            />
          </div>

          {/* Room Filter */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
          >
            <option value="">All Rooms</option>
            {rooms.map((r) => (
              <option key={r} value={r}>
                Room {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Attendance List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-bold">
              <th className="pb-3 px-3">Student Name</th>
              <th className="pb-3 px-3">ID</th>
              <th className="pb-3 px-3">Room</th>
              <th className="pb-3 px-3">Status</th>
              <th className="pb-3 px-3 text-right">Quick Mark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No student records found
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.studentId} className="hover:bg-wine-50/30 transition">
                  <td className="py-3.5 px-3 font-bold text-gray-900">
                    {item.studentName}
                  </td>
                  <td className="py-3.5 px-3 text-gray-500 font-mono text-[11px]">
                    {item.studentSystemId}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-gray-700">
                    {item.roomNumber ? `Room ${item.roomNumber}` : 'Unassigned'}
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge status={item.status} />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onMarkAttendance(item.studentId, 'PRESENT')}
                        className={`p-1.5 rounded-lg transition ${
                          item.status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700'
                        }`}
                        title="Mark Present"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onMarkAttendance(item.studentId, 'ABSENT')}
                        className={`p-1.5 rounded-lg transition ${
                          item.status === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-700'
                        }`}
                        title="Mark Absent"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onMarkAttendance(item.studentId, 'LATE')}
                        className={`p-1.5 rounded-lg transition ${
                          item.status === 'LATE'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-gray-100 hover:bg-amber-50 text-gray-600 hover:text-amber-700'
                        }`}
                        title="Mark Late"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onMarkAttendance(item.studentId, 'ON_LEAVE')}
                        className={`p-1.5 rounded-lg transition ${
                          item.status === 'ON_LEAVE'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-gray-100 hover:bg-purple-50 text-gray-600 hover:text-purple-700'
                        }`}
                        title="Mark On Leave"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AttendanceMarkTable;
