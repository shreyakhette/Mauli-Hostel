import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  BedDouble, 
  Users, 
  Calendar, 
  AlertCircle, 
  UserCheck, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { wardenApi, leaveApi, complaintApi, reportApi } from '../../api/services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import OccupancyVisualization from '../../components/reports/OccupancyVisualization';
import Skeleton from '../../components/common/Skeleton';

export const WardenDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [openComplaints, setOpenComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, leaveRes, complaintRes] = await Promise.allSettled([
        wardenApi.getDashboard(),
        leaveApi.getAll('PENDING'),
        complaintApi.getAll({ status: 'OPEN' })
      ]);

      if (dashRes.status === 'fulfilled') setDashboardData(dashRes.value);
      if (leaveRes.status === 'fulfilled') setPendingLeaves(leaveRes.value?.slice(0, 5) || []);
      if (complaintRes.status === 'fulfilled') setOpenComplaints(complaintRes.value?.slice(0, 5) || []);
    } catch (err) {
      console.error('Error loading warden dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickReviewLeave = async (id, status) => {
    try {
      await leaveApi.review(id, { 
        status, 
        remarks: status === 'APPROVED' ? 'Approved by Warden Kranti Bhoyar' : 'Declined per attendance regulations' 
      });
      showToast(`Leave request ${status.toLowerCase()} successfully!`, 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update leave request', 'error');
    }
  };

  const totalBeds = dashboardData?.totalBeds || 400;
  const occupiedBeds = dashboardData?.occupiedBeds || 363;
  const availableBeds = dashboardData?.availableBeds || 37;
  const occupancyRate = dashboardData?.occupancyRate || 90.75;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner (Light & Executive Aesthetic) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-50/90 via-white to-amber-50/50 border border-rose-200/70 text-slate-900 p-6 sm:p-8 shadow-soft">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white text-rose-950 border border-rose-200/80 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Chief Warden Command Center • MGICOET Shegaon</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-slate-900">
              Welcome, Chief Warden Kranti Bhoyar
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl">
              Supervising <span className="font-semibold text-slate-900">Sakhi Girls Hostel</span> • 100 Rooms • 400 Beds Capacity • Curfew 9:00 PM
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/warden/rooms">
              <button className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition">
                <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Rooms & Beds
              </button>
            </Link>
            <Link to="/warden/notices">
              <button className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Broadcast
              </button>
            </Link>
            <Link to="/warden/reports">
              <button className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white shadow-sm transition">
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Analytics Export
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Capacity & Occupancy */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted">Hostel Occupancy</p>
              <h3 className="text-2xl font-black text-surface-charcoal mt-1">
                {occupiedBeds} / {totalBeds}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                {occupancyRate}% Beds Allocated
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-wine-50 text-wine-700 flex items-center justify-center">
              <BedDouble className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-divider flex items-center justify-between">
            <span className="text-xs font-medium text-surface-muted">{availableBeds} Free Beds Left</span>
            <Link to="/warden/rooms" className="text-xs font-semibold text-wine-700 hover:text-wine-800 flex items-center">
              Manage <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </Card>

        {/* Present Today */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted">Today's Roll Call</p>
              <h3 className="text-2xl font-black text-surface-charcoal mt-1">
                {dashboardData?.presentToday || 358} Present
              </h3>
              <p className="text-xs text-amber-600 font-medium mt-1">
                {dashboardData?.onLeaveToday || 5} on Approved Out-Pass
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-divider flex items-center justify-between">
            <Link to="/warden/attendance" className="text-xs font-semibold text-wine-700 hover:text-wine-800 flex items-center">
              Open Biometric Roll Call <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </Card>

        {/* Pending Leaves */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted">Pending Out-Passes</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {pendingLeaves.length} Awaiting
              </h3>
              <p className="text-xs text-surface-muted mt-1">Requires Warden signature</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-divider flex items-center justify-between">
            <Link to="/warden/leave" className="text-xs font-semibold text-wine-700 hover:text-wine-800 flex items-center">
              Review Queue <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </Card>

        {/* Open Complaints */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted">Active Complaints</p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">
                {openComplaints.length} Open Tickets
              </h3>
              <p className="text-xs text-surface-muted mt-1">Plumbing, Electric & Wi-Fi</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-divider flex items-center justify-between">
            <Link to="/warden/complaints" className="text-xs font-semibold text-wine-700 hover:text-wine-800 flex items-center">
              Open Ticket Board <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Occupancy Analytics Interactive Visualizer */}
      <OccupancyVisualization
        totalBeds={totalBeds}
        occupiedBeds={occupiedBeds}
        availableBeds={availableBeds}
        occupancyPercentage={occupancyRate}
      />

      {/* Dual Column: Pending Leaves Review & Open Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Leaves Queue */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-wine-700" />
              <h3 className="text-base font-bold text-surface-charcoal">Pending Leave Requests</h3>
            </div>
            <Link to="/warden/leave">
              <Button variant="ghost" size="sm" className="text-wine-600">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <Skeleton className="h-40 w-full rounded-2xl" />
          ) : pendingLeaves.length === 0 ? (
            <p className="text-xs text-surface-muted py-6 text-center">No pending leave requests at this time.</p>
          ) : (
            <div className="space-y-3">
              {pendingLeaves.map((leave) => (
                <div key={leave.id} className="p-4 rounded-2xl bg-surface border border-surface-divider flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-surface-charcoal">{leave.studentName}</h4>
                      <span className="text-[10px] bg-wine-50 text-wine-800 px-2 py-0.5 rounded-full font-medium">
                        Room {leave.roomNumber || '203'}
                      </span>
                    </div>
                    <p className="text-xs text-surface-muted mt-1">
                      Reason: <span className="text-surface-charcoal font-medium">{leave.reason}</span> ({leave.destination})
                    </p>
                    <p className="text-[11px] text-wine-700 mt-0.5">
                      {new Date(leave.fromDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} – {new Date(leave.toDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                      onClick={() => handleQuickReviewLeave(leave.id, 'APPROVED')}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
                      onClick={() => handleQuickReviewLeave(leave.id, 'REJECTED')}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Open Complaints Queue */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-surface-charcoal">Recent Urgent Complaints</h3>
            </div>
            <Link to="/warden/complaints">
              <Button variant="ghost" size="sm" className="text-wine-600">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <Skeleton className="h-40 w-full rounded-2xl" />
          ) : openComplaints.length === 0 ? (
            <p className="text-xs text-surface-muted py-6 text-center">No open complaints reported.</p>
          ) : (
            <div className="space-y-3">
              {openComplaints.map((comp) => (
                <div key={comp.id} className="p-4 rounded-2xl bg-surface border border-surface-divider flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="danger">{comp.priority}</Badge>
                      <h4 className="text-xs font-bold text-surface-charcoal">{comp.title}</h4>
                    </div>
                    <p className="text-xs text-surface-muted mt-1 line-clamp-1">{comp.description}</p>
                    <span className="text-[11px] text-surface-muted mt-0.5 block">
                      Room {comp.roomNumber || '203'} • Reported by {comp.studentName}
                    </span>
                  </div>

                  <Link to="/warden/complaints">
                    <Button size="sm" variant="ghost" className="text-wine-700 text-xs shrink-0">
                      Manage <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WardenDashboard;
