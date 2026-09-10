import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Save, 
  Users,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { attendanceApi, studentApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import AttendanceMarkTable from '../../components/attendance/AttendanceMarkTable';

export const AttendanceManager = () => {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async (date) => {
    try {
      setLoading(true);
      const [attData, students] = await Promise.all([
        attendanceApi.getByDate(date),
        studentApi.getAll()
      ]);

      // Merge students with their attendance record for the date
      const merged = students.map((stud) => {
        const record = attData?.find(a => a.studentId === stud.id || a.studentSystemId === stud.studentId);
        return {
          studentId: stud.id,
          studentSystemId: stud.studentId,
          studentName: stud.fullName,
          roomNumber: stud.roomNumber || '203',
          bedLabel: stud.bedLabel || 'Bed 1',
          status: record?.status || 'PRESENT',
          checkInTime: record?.checkInTime || '8:45 PM',
          remarks: record?.remarks || ''
        };
      });

      setAttendanceList(merged);
    } catch (err) {
      console.error(err);
      showToast('Could not load attendance for this date', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const handleMarkAttendance = async (studentId, status) => {
    try {
      await attendanceApi.mark({
        studentId,
        date: selectedDate,
        status,
        checkInTime: status === 'PRESENT' ? '8:50 PM' : status === 'LATE' ? '9:25 PM' : null,
        remarks: `Marked by Chief Warden Kranti Bhoyar`
      });
      // Local state update
      setAttendanceList((prev) => 
        prev.map(item => item.studentId === studentId ? { ...item, status } : item)
      );
      showToast('Attendance recorded', 'success');
    } catch (err) {
      showToast('Failed to record attendance', 'error');
    }
  };

  const handleMarkAllPresent = async () => {
    try {
      const items = attendanceList.map(item => ({
        studentId: item.studentId,
        date: selectedDate,
        status: 'PRESENT',
        checkInTime: '8:45 PM',
        remarks: 'Bulk confirmed present by Warden'
      }));

      await attendanceApi.bulkMark(items);
      showToast('All residents marked Present for ' + selectedDate, 'success');
      fetchAttendance(selectedDate);
    } catch (err) {
      showToast('Failed to save bulk attendance', 'error');
    }
  };

  const presentCount = attendanceList.filter(a => a.status === 'PRESENT').length;
  const absentCount = attendanceList.filter(a => a.status === 'ABSENT').length;
  const lateCount = attendanceList.filter(a => a.status === 'LATE').length;
  const leaveCount = attendanceList.filter(a => a.status === 'ON_LEAVE').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Biometric Curfew & Roll Call</h1>
          <p className="text-surface-muted text-sm mt-1">
            Conduct 9:00 PM nightly roll call, register late entries, and track curfew compliance across all 100 rooms.
          </p>
        </div>

        <Button onClick={handleMarkAllPresent} className="shadow-md">
          <CheckCircle2 className="w-4 h-4 mr-2" /> Quick Mark All Present
        </Button>
      </div>

      {/* Stats Ribbon for Selected Date */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-3 bg-emerald-50/50 border-emerald-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            {presentCount}
          </div>
          <div>
            <p className="text-xs text-emerald-800 font-semibold uppercase">Present In Hostel</p>
            <span className="text-xs text-surface-muted">Gates checked in</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 bg-rose-50/50 border-rose-100">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            {absentCount}
          </div>
          <div>
            <p className="text-xs text-rose-800 font-semibold uppercase">Unaccounted / Absent</p>
            <span className="text-xs text-surface-muted">Requires phone follow-up</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 bg-amber-50/50 border-amber-100">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            {lateCount}
          </div>
          <div>
            <p className="text-xs text-amber-800 font-semibold uppercase">Late Past 9:00 PM</p>
            <span className="text-xs text-surface-muted">Gate warning issued</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 bg-purple-50/50 border-purple-100">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            {leaveCount}
          </div>
          <div>
            <p className="text-xs text-purple-800 font-semibold uppercase">On Approved Leave</p>
            <span className="text-xs text-surface-muted">Out-pass verified</span>
          </div>
        </Card>
      </div>

      {/* Attendance Interactive Mark Table */}
      <AttendanceMarkTable
        attendanceList={attendanceList}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onMarkAttendance={handleMarkAttendance}
        loading={loading}
      />
    </div>
  );
};

export default AttendanceManager;
