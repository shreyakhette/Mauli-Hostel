import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { complaintApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ComplaintModal from '../../components/complaint/ComplaintModal';
import ComplaintDetailModal from '../../components/complaint/ComplaintDetailModal';
import ComplaintCard from '../../components/complaint/ComplaintCard';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';

export const StudentComplaints = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintApi.getMy();
      setComplaints(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load complaints', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleCreateComplaint = async (formData) => {
    try {
      await complaintApi.create(formData);
      showToast('Complaint lodged successfully! Warden notified.', 'success');
      fetchComplaints();
    } catch (err) {
      showToast('Failed to lodge complaint', 'error');
      throw err;
    }
  };

  const handleAddComment = async (id, text) => {
    try {
      const commentRes = await complaintApi.addComment(id, { comment: text });
      showToast('Comment posted', 'success');
      // Refresh current complaint details
      const updated = await complaintApi.getById(id);
      setSelectedComplaint(updated);
      fetchComplaints();
    } catch (err) {
      showToast('Failed to add comment', 'error');
      throw err;
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const totalCount = complaints.length;
  const openCount = complaints.filter(c => c.status === 'OPEN').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Complaints & Maintenance</h1>
          <p className="text-surface-muted text-sm mt-1">
            Report maintenance issues, plumbing, Wi-Fi, or hostel facility concerns directly to Warden Kranti Bhoyar.
          </p>
        </div>
        <Button onClick={() => setIsNewModalOpen(true)} className="shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Lodge New Complaint
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-surface text-surface-charcoal flex items-center justify-center font-bold">
            {totalCount}
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium">Total Lodged</p>
            <p className="text-sm font-bold text-surface-charcoal">All Records</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            {openCount}
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium">Awaiting Action</p>
            <p className="text-sm font-bold text-amber-600">Open Tickets</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            {inProgressCount}
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium">In Progress</p>
            <p className="text-sm font-bold text-blue-600">Technician Assigned</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            {resolvedCount}
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium">Resolved</p>
            <p className="text-sm font-bold text-emerald-600">Successfully Fixed</p>
          </div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search complaints by title, category, ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-surface-divider focus:outline-none focus:border-wine-600 focus:ring-1 focus:ring-wine-600"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((st) => (
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

        {/* Category Pills */}
        <div className="pt-2.5 border-t border-surface-divider flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-surface-muted font-semibold mr-1 shrink-0">Category:</span>
          {['ALL', 'WATER', 'ELECTRICITY', 'INTERNET', 'CLEANING', 'ROOM', 'FOOD'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-wine-100 text-wine-900 font-bold'
                  : 'text-surface-muted hover:text-surface-charcoal hover:bg-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Complaints Grid / List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      ) : filteredComplaints.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No complaints found"
          description={
            statusFilter === 'ALL'
              ? "You haven't reported any issues. Everything is functioning smoothly!"
              : `No complaints found with status ${statusFilter}.`
          }
          action={
            <Button onClick={() => setIsNewModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> File New Issue
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

      {/* Lodge Complaint Modal */}
      <ComplaintModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateComplaint}
        studentRoom={user?.roomNumber || '203'}
      />

      {/* Complaint Detail & Comments Modal */}
      <ComplaintDetailModal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        complaint={selectedComplaint}
        isWarden={false}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default StudentComplaints;
