import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  Eye,
  MessageSquare,
  AlertTriangle,
  Zap,
  Droplets,
  Wifi,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { complaintApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ComplaintCard from '../../components/complaint/ComplaintCard';
import ComplaintDetailModal from '../../components/complaint/ComplaintDetailModal';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const ComplaintBoard = () => {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintApi.getAll();
      setComplaints(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load complaint board', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id, statusData) => {
    try {
      await complaintApi.updateStatus(id, statusData);
      showToast('Complaint ticket status updated successfully!', 'success');
      fetchComplaints();
    } catch (err) {
      showToast('Failed to update complaint status', 'error');
      throw err;
    }
  };

  const handleAddComment = async (id, text) => {
    try {
      await complaintApi.addComment(id, { comment: text });
      showToast('Warden remark recorded on ticket', 'success');
      const updated = await complaintApi.getById(id);
      setSelectedComplaint(updated);
      fetchComplaints();
    } catch (err) {
      showToast('Failed to post remark', 'error');
      throw err;
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchesSearch = searchQuery === '' || 
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roomNumber?.toString().includes(searchQuery) ||
      c.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
  });

  const statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
  const categories = [
    'ALL',
    'WATER',
    'ELECTRICITY',
    'INTERNET',
    'CLEANING',
    'ROOM',
    'FOOD',
    'MAINTENANCE'
  ];

  const totalCount = complaints.length;
  const openCount = complaints.filter(c => c.status === 'OPEN').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;
  const urgentCount = complaints.filter(c => c.priority === 'URGENT' || c.priority === 'HIGH').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-wine-50 text-wine-900 border border-wine-200 text-xs font-semibold mb-2">
            <Wrench className="w-3.5 h-3.5 text-wine-700" />
            <span>Facility Management & Student Grievances</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Hostel Maintenance & Grievance Desk</h1>
          <p className="text-surface-muted text-sm mt-1">
            Supervise maintenance tickets, dispatch plumbers and electricians, and communicate directly with students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {urgentCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              {urgentCount} Urgent Tickets
            </span>
          )}
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-3.5 border hover:border-wine-200 transition-colors">
          <div className="w-11 h-11 rounded-2xl bg-surface text-surface-charcoal flex items-center justify-center font-bold text-base shadow-sm">
            {totalCount}
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium uppercase tracking-wider">Total Tickets</p>
            <p className="text-sm font-bold text-surface-charcoal">All Logged Issues</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3.5 border hover:border-amber-200 transition-colors">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base shadow-sm">
            {openCount}
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium uppercase tracking-wider">Awaiting Dispatch</p>
            <p className="text-sm font-bold text-amber-600">Pending Review</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3.5 border hover:border-blue-200 transition-colors">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base shadow-sm">
            {inProgressCount}
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium uppercase tracking-wider">Under Repair</p>
            <p className="text-sm font-bold text-blue-600">Technician Working</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3.5 border hover:border-emerald-200 transition-colors">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base shadow-sm">
            {resolvedCount}
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium uppercase tracking-wider">Resolved</p>
            <p className="text-sm font-bold text-emerald-600">Fixed & Verified</p>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-surface-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by student, room (e.g. 203), ticket, or technician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-surface-divider focus:outline-none focus:border-wine-600 focus:ring-1 focus:ring-wine-600 bg-surface/30"
            />
          </div>

          {/* Status Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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

        {/* Category and Priority secondary filters */}
        <div className="pt-3 border-t border-surface-divider flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-surface-muted font-semibold">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-wine-100 text-wine-900 font-bold'
                    : 'text-surface-muted hover:text-surface-charcoal hover:bg-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-surface-muted font-semibold">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-surface-divider text-xs font-semibold text-surface-charcoal bg-white focus:outline-none focus:border-wine-600"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent Only</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Complaints Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ) : filteredComplaints.length === 0 ? (
        <EmptyState 
          icon={AlertCircle}
          title="No complaints match your filters"
          description="There are currently no tickets matching your search query or selected criteria."
          action={
            (statusFilter !== 'ALL' || categoryFilter !== 'ALL' || priorityFilter !== 'ALL' || searchQuery !== '') ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setStatusFilter('ALL');
                  setCategoryFilter('ALL');
                  setPriorityFilter('ALL');
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredComplaints.map((c) => (
            <div 
              key={c.id} 
              onClick={() => setSelectedComplaint(c)}
              className="cursor-pointer"
            >
              <ComplaintCard complaint={c} />
            </div>
          ))}
        </div>
      )}

      {/* Warden Detail & Action Modal with Resolution Stepper & Technician Assignment */}
      <ComplaintDetailModal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        complaint={selectedComplaint}
        isWarden={true}
        onUpdateStatus={handleUpdateStatus}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default ComplaintBoard;
