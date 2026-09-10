import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Clock, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  LogIn, 
  LogOut,
  Eye
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { visitorApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const VisitorManager = () => {
  const { showToast } = useToast();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await visitorApi.getAll(statusFilter === 'ALL' ? undefined : statusFilter);
      setVisitors(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load visitor registers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [statusFilter]);

  const handleReview = async (id, status) => {
    try {
      await visitorApi.review(id, { 
        status, 
        remarks: status === 'APPROVED' ? 'Approved for Reception Lounge' : 'Denied per safety protocol' 
      });
      showToast(`Visitor entry pass ${status.toLowerCase()}!`, 'success');
      fetchVisitors();
    } catch (err) {
      showToast('Failed to update pass', 'error');
    }
  };

  const handleUpdatePassStatus = async (id, status) => {
    try {
      await visitorApi.review(id, { status, remarks: `Gate status updated to ${status}` });
      showToast(`Visitor marked ${status.replace('_', ' ')}`, 'success');
      fetchVisitors();
    } catch (err) {
      showToast('Failed to update visitor status', 'error');
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      v.visitorName?.toLowerCase().includes(q) ||
      v.studentName?.toLowerCase().includes(q) ||
      v.phone?.includes(q) ||
      v.roomNumber?.toString().includes(q)
    );
  });

  const statuses = ['ALL', 'PENDING', 'APPROVED', 'CHECKED_IN', 'CHECKED_OUT', 'REJECTED'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Gate Security & Visitor Desk</h1>
          <p className="text-surface-muted text-sm mt-1">
            Authorize visitor passes, monitor check-in / check-out timestamps, and enforce lounge perimeter rules.
          </p>
        </div>

        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-wine-50 text-wine-900 border border-wine-200">
          Total Passes: {visitors.length}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by visitor, student or room..."
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
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Visitors Table */}
      <Card>
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredVisitors.length === 0 ? (
          <EmptyState 
            icon={Users}
            title="No visitor records found"
            description="There are no guest passes registered under this filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-divider text-surface-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Visitor Details</th>
                  <th className="py-3 px-4">Student Visited</th>
                  <th className="py-3 px-4">Visit Date & Hours</th>
                  <th className="py-3 px-4">Purpose</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Gate Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-divider">
                {filteredVisitors.map((v) => (
                  <tr key={v.id} className="hover:bg-wine-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-surface-charcoal">{v.visitorName}</div>
                      <span className="text-[11px] text-surface-muted">{v.relationship} • {v.phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-surface-charcoal">{v.studentName || 'Resident'}</div>
                      <span className="text-[10px] text-wine-800 bg-wine-50 px-1.5 py-0.5 rounded font-semibold">
                        Room {v.roomNumber || '203'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-surface-charcoal">
                        {new Date(v.visitDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                      <span className="text-[10px] text-surface-muted">{v.entryTime} – {v.exitTime}</span>
                    </td>
                    <td className="py-3.5 px-4 text-surface-charcoal max-w-xs truncate">
                      {v.purpose || 'Family Visit'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge 
                        variant={
                          v.status === 'APPROVED' ? 'success' : 
                          v.status === 'CHECKED_IN' ? 'primary' :
                          v.status === 'CHECKED_OUT' ? 'neutral' :
                          v.status === 'REJECTED' ? 'danger' : 'warning'
                        }
                      >
                        {v.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {v.status === 'PENDING' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs text-emerald-700 border-emerald-300"
                              onClick={() => handleReview(v.id, 'APPROVED')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs text-rose-700 border-rose-300"
                              onClick={() => handleReview(v.id, 'REJECTED')}
                            >
                              Decline
                            </Button>
                          </>
                        )}

                        {v.status === 'APPROVED' && (
                          <Button 
                            size="sm" 
                            className="text-xs bg-wine-900"
                            onClick={() => handleUpdatePassStatus(v.id, 'CHECKED_IN')}
                          >
                            <LogIn className="w-3.5 h-3.5 mr-1" /> Mark In
                          </Button>
                        )}

                        {v.status === 'CHECKED_IN' && (
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="text-xs"
                            onClick={() => handleUpdatePassStatus(v.id, 'CHECKED_OUT')}
                          >
                            <LogOut className="w-3.5 h-3.5 mr-1" /> Mark Out
                          </Button>
                        )}

                        {(v.status === 'CHECKED_OUT' || v.status === 'REJECTED') && (
                          <span className="text-[11px] text-surface-muted italic">Archived</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VisitorManager;
