import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  MapPin, 
  Phone, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { leaveApi, studentApi } from '../../api/services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LeaveApplicationForm from '../../components/leave/LeaveApplicationForm';
import LeaveTimeline from '../../components/leave/LeaveTimeline';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';

export const StudentLeave = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'apply'

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leaveData, profData] = await Promise.all([
        leaveApi.getMy(),
        studentApi.getProfile()
      ]);
      setLeaves(leaveData || []);
      setProfile(profData);
    } catch (err) {
      console.error(err);
      showToast('Failed to load leave records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyLeave = async (formData) => {
    try {
      await leaveApi.apply(formData);
      showToast('Leave request submitted to Warden Kranti Bhoyar!', 'success');
      setActiveTab('history');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit leave application', 'error');
      throw err;
    }
  };

  const pendingCount = leaves.filter(l => l.status === 'PENDING').length;
  const approvedCount = leaves.filter(l => l.status === 'APPROVED').length;
  const rejectedCount = leaves.filter(l => l.status === 'REJECTED').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Leave & Out-Pass Management</h1>
          <p className="text-surface-muted text-sm mt-1">
            Apply for weekend home visits, festival leave, or emergencies requiring overnight stay outside hostel.
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center space-x-2 bg-surface p-1 rounded-2xl border border-surface-divider">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'history' 
                ? 'bg-wine-900 text-white shadow-sm' 
                : 'text-surface-muted hover:text-surface-charcoal'
            }`}
          >
            My Applications ({leaves.length})
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'apply' 
                ? 'bg-wine-900 text-white shadow-sm' 
                : 'text-surface-muted hover:text-surface-charcoal'
            }`}
          >
            + Apply for Leave
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-4 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium">Pending Approvals</p>
            <h3 className="text-xl font-bold text-amber-600">{pendingCount} Application(s)</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium">Approved Passes</p>
            <h3 className="text-xl font-bold text-emerald-600">{approvedCount} Valid Passes</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-surface-muted font-medium">Rejected / Cancelled</p>
            <h3 className="text-xl font-bold text-rose-600">{rejectedCount} Applications</h3>
          </div>
        </Card>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'apply' ? (
        <div className="max-w-3xl mx-auto">
          <LeaveApplicationForm 
            onSubmit={handleApplyLeave}
            defaultGuardianContact={profile?.guardianPhone || ''}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
            </div>
          ) : leaves.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No leave applications found"
              description="You have not submitted any out-station or night leave applications yet."
              action={
                <Button onClick={() => setActiveTab('apply')} size="sm">
                  <PlusCircle className="w-4 h-4 mr-1.5" /> Apply for Leave
                </Button>
              }
            />
          ) : (
            <div className="space-y-5">
              {leaves.map((leave) => (
                <Card key={leave.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-surface-divider">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={
                            leave.status === 'APPROVED' ? 'success' : 
                            leave.status === 'REJECTED' ? 'danger' : 'warning'
                          }
                        >
                          {leave.status}
                        </Badge>
                        <span className="text-xs text-surface-muted">
                          Applied: {new Date(leave.appliedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-surface-charcoal">
                        Reason: {leave.reason}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-surface-muted">
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-wine-600" />
                          {leave.destination || 'Home Town'}
                        </span>
                        <span className="flex items-center">
                          <Phone className="w-3.5 h-3.5 mr-1 text-wine-600" />
                          Guardian: {leave.guardianContact || 'Verified'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-surface p-4 rounded-2xl border border-surface-divider text-center min-w-[220px]">
                      <span className="text-[11px] font-bold text-wine-800 uppercase tracking-wider block">Duration</span>
                      <p className="text-sm font-bold text-surface-charcoal mt-1">
                        {new Date(leave.fromDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} — {new Date(leave.toDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <span className="text-[11px] text-surface-muted block mt-0.5">
                        {Math.max(1, Math.ceil((new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)))} Day(s) Leave
                      </span>
                    </div>
                  </div>

                  {/* Visual Status Progress Flow */}
                  <div className="pt-4">
                    <LeaveTimeline leave={leave} />
                  </div>

                  {/* Warden Remarks if any */}
                  {leave.wardenRemarks && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-wine-50/60 border border-wine-100 text-xs">
                      <span className="font-bold text-wine-900">Warden Kranti Bhoyar Note: </span>
                      <span className="text-wine-800">{leave.wardenRemarks}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentLeave;
