import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { studentApi } from '../../api/services';
import { Search, UserCheck } from 'lucide-react';

export const BedAssignModal = ({ isOpen, onClose, bed, onAssigned }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStudents();
    }
  }, [isOpen]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const list = await studentApi.getAll();
      setStudents(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !bed) return;

    setSubmitting(true);
    try {
      await onAssigned(bed.id, Number(selectedStudentId));
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!bed) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign ${bed.bedLabel}`}
      subtitle={`Select a student to allocate to Room ${bed.roomNumber || ''}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
          />
        </div>

        {/* Student Selection List */}
        <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-xl p-1 bg-surface-50">
          {loading ? (
            <div className="p-4 text-center text-xs text-gray-400">Loading student roster...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400">No students found matching search</div>
          ) : (
            filteredStudents.map((s) => {
              const isSelected = selectedStudentId === String(s.id);
              const alreadyHasBed = Boolean(s.bedId);

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStudentId(String(s.id))}
                  className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-wine-900 text-white'
                      : 'hover:bg-white text-gray-800'
                  }`}
                >
                  <div>
                    <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {s.fullName}
                    </p>
                    <p className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                      {s.studentId} • {s.department}
                    </p>
                    {alreadyHasBed && (
                      <span className={`text-[10px] font-medium ${isSelected ? 'text-rose-200' : 'text-amber-600'}`}>
                        Currently in Room {s.roomNumber} ({s.bedLabel})
                      </span>
                    )}
                  </div>
                  {isSelected && <UserCheck className="w-4 h-4 text-white flex-shrink-0" />}
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-2.5 pt-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!selectedStudentId || submitting}
            isLoading={submitting}
          >
            Confirm Bed Allocation
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BedAssignModal;
