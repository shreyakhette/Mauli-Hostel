import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Phone, 
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { leaveApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LeaveApprovalModal from '../../components/leave/LeaveApprovalModal';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const LeaveApproval = () => {
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeave, setSelectedLeave] = useState(null);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveApi.getAll(statusFilter === 'ALL' ? undefined : statusFilter);
      setLeaves(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load leave requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const handleReview = async (id, reviewData) => {
    try {
      await leaveApi.review(id, reviewData);
      showToast(`Leave application ${reviewData.status.toLowerCase()} successfully!`, 'success');
      fetchLeaves();
    } catch (err) {
      showToast('Failed to review leave application', 'error');
      throw err;
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.studentName?.toLowerCase().includes(q) ||
      l.roomNumber?.toString().includes(q) ||
      l.destination?.toLowerCase().includes(q) ||
      l.reason?.toLowerCase().includes(q)
    );
  });

  const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'ALL'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Leave & Out-Pass Approvals</h1>
          <p className="text-surface-muted text-sm mt-1">
            Review resident night-out, weekend home visits, and emergency leave requests with parental contact verification.
          </p>
        </div>

        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
          Pending Reviews: {leaves.filter(l => l.status === 'PENDING').length}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by student, room, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-surface-divider focus:outline-none focus:border-wine-600 focus:ring-1 focus:ring-wine-600"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st 
                    ? 'bg-wine-900 text-white shadow-sm' 
                    : 'bg-surface text-surface-muted hover:text-surface-charcoal hover:bg-wine-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Leaves Table */}
      <Card>
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredLeaves.length === 0 ? (
          <EmptyState 
            icon={Calendar}
            title="No applications found"
            description={`There are currently no leave requests with status ${statusFilter}.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-divider text-surface-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Resident</th>
                  <th className="py-3 px-4">Room</th>
                  <th className="py-3 px-4">Duration & Dates</th>
                  <th className="py-3 px-4">Destination & Reason</th>
                  <th className="py-3 px-4">Guardian Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-divider">
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-wine-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-surface-charcoal">
                      {leave.studentName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-wine-50 text-wine-900 font-medium">
                        Room {leave.roomNumber || '203'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-surface-charcoal">
                        {new Date(leave.fromDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} – {new Date(leave.toDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                      <span className="text-[10px] text-surface-muted">
                        Applied: {new Date(leave.appliedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-surface-charcoal">{leave.destination}</div>
                      <span className="text-surface-muted line-clamp-1">{leave.reason}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-wine-700">
                      {leave.guardianContact || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge 
                        variant={
                          leave.status === 'APPROVED' ? 'success' : 
                          leave.status === 'REJECTED' ? 'danger' : 'warning'
                        }
                      >
                        {leave.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button 
                        size="sm" 
                        variant={leave.status === 'PENDING' ? 'primary' : 'ghost'}
                        className="text-xs"
                        onClick={() => setSelectedLeave(leave)}
                      >
                        {leave.status === 'PENDING' ? 'Review Application' : 'Inspect'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Review Modal */}
      <LeaveApprovalModal 
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leave={selectedLeave}
        onReview={handleReview}
      />
    </div>
  );
};

export default LeaveApproval;
