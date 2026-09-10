import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Home, 
  GraduationCap, 
  ShieldCheck, 
  Eye, 
  FileSpreadsheet,
  Heart
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { studentApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const StudentList = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getAll();
        setStudents(data || []);
      } catch (err) {
        console.error(err);
        showToast('Failed to load resident roster', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.fullName?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.rollNumber?.toLowerCase().includes(q) ||
      s.roomNumber?.toString().includes(q) ||
      s.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Hostel Residents Directory</h1>
          <p className="text-surface-muted text-sm mt-1">
            Complete roster of all enrolled students, room allocations, emergency phone numbers, and academic profiles.
          </p>
        </div>

        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-wine-50 text-wine-900 border border-wine-200">
          Enrolled Residents: {students.length}
        </span>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by name, roll number, room (e.g. 203)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-surface-divider focus:outline-none focus:border-wine-600 focus:ring-1 focus:ring-wine-600"
          />
        </div>
      </Card>

      {/* Residents Table */}
      <Card>
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students match search"
            description="Try searching with a different name or room number."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-divider text-surface-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Resident</th>
                  <th className="py-3 px-4">Room & Bed</th>
                  <th className="py-3 px-4">Department / Year</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Guardian Emergency</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-divider">
                {filteredStudents.map((stud) => (
                  <tr key={stud.id} className="hover:bg-wine-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-surface-charcoal block">{stud.fullName}</span>
                        <span className="text-[11px] text-surface-muted font-mono">{stud.studentId} • Roll: {stud.rollNumber || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {stud.roomNumber ? (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-wine-50 text-wine-900 font-medium">
                          <Home className="w-3.5 h-3.5 mr-1 text-wine-700" />
                          <span>Room {stud.roomNumber} ({stud.bedLabel || 'Bed 1'})</span>
                        </div>
                      ) : (
                        <span className="text-surface-muted italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-surface-charcoal">
                      <span>{stud.department || 'Engineering'}</span>
                      <span className="text-[10px] text-surface-muted block">Year {stud.yearOfStudy || 1}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-surface-charcoal">
                      {stud.phone || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-surface-charcoal block">{stud.guardianName || 'Guardian'}</span>
                        <span className="text-[11px] font-mono text-wine-700">{stud.guardianPhone || '—'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-wine-700"
                        onClick={() => setSelectedStudent(stud)}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View Dossier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Student Details Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Resident Dossier"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface border border-surface-divider flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-wine-100 text-wine-800 flex items-center justify-center font-serif font-bold text-xl">
                {selectedStudent.fullName?.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-surface-charcoal">{selectedStudent.fullName}</h3>
                <p className="text-xs text-surface-muted">ID: {selectedStudent.studentId} • Roll: {selectedStudent.rollNumber || 'N/A'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="primary">Room {selectedStudent.roomNumber || '203'} — {selectedStudent.bedLabel || 'Bed 2'}</Badge>
                  <span className="text-[11px] text-surface-muted">Blood Group: {selectedStudent.bloodGroup || 'O+'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-surface-divider">
                <span className="text-surface-muted block text-[10px] uppercase font-bold">Contact Number</span>
                <span className="font-semibold text-surface-charcoal">{selectedStudent.phone || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface-divider">
                <span className="text-surface-muted block text-[10px] uppercase font-bold">Email Address</span>
                <span className="font-semibold text-surface-charcoal truncate block">{selectedStudent.email || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface-divider">
                <span className="text-surface-muted block text-[10px] uppercase font-bold">Guardian Name & Phone</span>
                <span className="font-semibold text-surface-charcoal">{selectedStudent.guardianName} ({selectedStudent.guardianPhone})</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface-divider">
                <span className="text-surface-muted block text-[10px] uppercase font-bold">Guardian Relation</span>
                <span className="font-semibold text-surface-charcoal">{selectedStudent.guardianRelation || 'Parent'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-surface-divider text-xs">
              <span className="text-surface-muted block text-[10px] uppercase font-bold">Permanent Home Address</span>
              <p className="font-medium text-surface-charcoal mt-1 leading-relaxed">
                {selectedStudent.homeAddress || 'Pune, Maharashtra, India'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentList;
