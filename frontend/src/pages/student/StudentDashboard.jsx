import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  AlertCircle, 
  Clock, 
  Bus, 
  Utensils, 
  UserCheck, 
  ShieldAlert, 
  ArrowUpRight, 
  ChevronRight,
  Bell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentApi, noticeApi, busApi, messApi } from '../../api/services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import CircularProgress from '../../components/common/CircularProgress';
import Skeleton from '../../components/common/Skeleton';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [notices, setNotices] = useState([]);
  const [tuesdayBus, setTuesdayBus] = useState(null);
  const [todayMenu, setTodayMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const todayDay = days[new Date().getDay()];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, noticesRes, busRes, messRes] = await Promise.allSettled([
          studentApi.getDashboard(),
          noticeApi.getActive(),
          busApi.getByDay('TUESDAY'),
          messApi.getByDay(todayDay)
        ]);

        if (dashRes.status === 'fulfilled') setDashboardData(dashRes.value);
        if (noticesRes.status === 'fulfilled') setNotices(noticesRes.value || []);
        if (busRes.status === 'fulfilled' && busRes.value?.length > 0) setTuesdayBus(busRes.value[0]);
        if (messRes.status === 'fulfilled') setTodayMenu(messRes.value);
      } catch (err) {
        console.error('Error fetching student dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [todayDay]);

  const profile = dashboardData?.profile || user;
  const attendanceRate = dashboardData?.attendancePercentage || 92;
  const recentNotices = notices.slice(0, 3);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome Card (Light & Aesthetic) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-50/90 via-white to-amber-50/50 border border-rose-200/70 text-slate-900 p-6 sm:p-8 shadow-soft">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-rose-200/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white text-rose-900 border border-rose-200/80 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Resident Student Portal • MGICOET Shegaon</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-slate-900">
              Welcome back, {profile?.fullName || user?.fullName || 'Resident'}! 🌸
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl">
              Room {profile?.roomNumber || '203'} • {profile?.bedLabel || 'Bed 2'} • Curfew 9:00 PM • Chief Warden: <span className="font-semibold text-slate-900">Kranti Bhoyar</span>
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/student/leave">
              <button className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Out-Pass
              </button>
            </Link>
            <Link to="/student/complaints">
              <button className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Report Issue
              </button>
            </Link>
            <Link to="/student/emergency">
              <button className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition">
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Warden SOS
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Room Card */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted">Assigned Room</p>
              <h3 className="text-2xl font-bold text-surface-charcoal mt-1">
                Room {profile?.roomNumber || '203'}
              </h3>
              <p className="text-xs text-wine-600 font-medium mt-1">
                {profile?.bedLabel || 'Bed 2'} (Lower Tier)
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-wine-50 text-wine-600 flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-divider flex items-center justify-between">
            <Link to="/student/room" className="text-xs font-semibold text-wine-700 hover:text-wine-800 flex items-center">
              View 4-Bed Room Blueprint <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </Card>

        {/* Attendance Percentage */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted">Attendance Rate</p>
              <h3 className="text-2xl font-bold text-surface-charcoal mt-1">
                {attendanceRate}%
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                ✓ Curfew Compliant (9:00 PM)
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <CircularProgress value={attendanceRate} size={48} strokeWidth={4} color="#D4476D" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-divider flex items-center justify-between">
            <Link to="/student/attendance" className="text-xs font-semibold text-wine-700 hover:text-wine-800 flex items-center">
              Detailed Attendance Log <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </Card>

        {/* Pending Leaves */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted">Active Leave Requests</p>
              <h3 className="text-2xl font-bold text-surface-charcoal mt-1">
                {dashboardData?.pendingLeavesCount || 0} Pending
              </h3>
              <p className="text-xs text-surface-muted mt-1">
                {dashboardData?.approvedLeavesCount || 0} Approved this semester
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-divider flex items-center justify-between">
            <Link to="/student/leave" className="text-xs font-semibold text-wine-700 hover:text-wine-800 flex items-center">
              Track Leave Status <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </Card>

        {/* Open Complaints */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted">Maintenance Issues</p>
              <h3 className="text-2xl font-bold text-surface-charcoal mt-1">
                {dashboardData?.openComplaintsCount || 0} Open
              </h3>
              <p className="text-xs text-surface-muted mt-1">
                Resolved in avg &lt; 24h
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-divider flex items-center justify-between">
            <Link to="/student/complaints" className="text-xs font-semibold text-wine-700 hover:text-wine-800 flex items-center">
              View Complaint Desk <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Main Content Grid: Notices & Tuesday Bus / Mess */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Notices & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-wine-50 text-wine-700 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-surface-charcoal">Official Notice Board</h2>
                  <p className="text-xs text-surface-muted">Announcements directly from Warden Kranti Bhoyar</p>
                </div>
              </div>
              <Link to="/student/notices">
                <Button variant="ghost" size="sm" className="text-wine-600 hover:text-wine-700">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : recentNotices.length === 0 ? (
              <p className="text-sm text-surface-muted py-6 text-center">No current notices announced.</p>
            ) : (
              <div className="space-y-4">
                {recentNotices.map((notice) => (
                  <div key={notice.id} className="p-4 rounded-2xl bg-surface-card border border-surface-divider hover:border-wine-200 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={notice.category === 'EMERGENCY' ? 'danger' : notice.category === 'CURFEW' ? 'warning' : 'primary'}>
                            {notice.category}
                          </Badge>
                          {notice.isPinned && (
                            <span className="text-[11px] font-semibold text-wine-600 bg-wine-50 px-2 py-0.5 rounded-full">
                              📌 Pinned
                            </span>
                          )}
                          <span className="text-xs text-surface-muted">
                            {new Date(notice.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-surface-charcoal pt-1">{notice.title}</h4>
                        <p className="text-xs text-surface-muted line-clamp-2 leading-relaxed">{notice.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Today's Meals Snapshot */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-surface-charcoal">Today's Dining Menu ({todayDay})</h2>
                  <p className="text-xs text-surface-muted">Fresh, hygienic meals cooked on premise</p>
                </div>
              </div>
              <Link to="/student/mess">
                <Button variant="ghost" size="sm" className="text-wine-600 hover:text-wine-700">
                  Weekly Menu <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-surface border border-surface-divider">
                <span className="text-[11px] font-bold text-wine-700 uppercase tracking-wider">Breakfast</span>
                <p className="text-xs font-semibold text-surface-charcoal mt-1.5 line-clamp-2">
                  {todayMenu?.breakfastMenu || 'Poha, Boiled Eggs, Tea & Fresh Fruits'}
                </p>
                <span className="text-[10px] text-surface-muted block mt-2">7:30 AM – 9:00 AM</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface border border-surface-divider">
                <span className="text-[11px] font-bold text-wine-700 uppercase tracking-wider">Lunch</span>
                <p className="text-xs font-semibold text-surface-charcoal mt-1.5 line-clamp-2">
                  {todayMenu?.lunchMenu || 'Paneer Butter Masala, Dal Tadka, Roti & Rice'}
                </p>
                <span className="text-[10px] text-surface-muted block mt-2">12:30 PM – 2:30 PM</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface border border-surface-divider">
                <span className="text-[11px] font-bold text-wine-700 uppercase tracking-wider">Hi-Tea</span>
                <p className="text-xs font-semibold text-surface-charcoal mt-1.5 line-clamp-2">
                  {todayMenu?.snacksMenu || 'Veg Cutlet, Masala Chai & Biscuits'}
                </p>
                <span className="text-[10px] text-surface-muted block mt-2">5:00 PM – 6:00 PM</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface border border-surface-divider">
                <span className="text-[11px] font-bold text-wine-700 uppercase tracking-wider">Dinner</span>
                <p className="text-xs font-semibold text-surface-charcoal mt-1.5 line-clamp-2">
                  {todayMenu?.dinnerMenu || 'Rajma Masala, Jeera Rice, Chapati & Kheer'}
                </p>
                <span className="text-[10px] text-surface-muted block mt-2">8:00 PM – 9:30 PM</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Tuesday Bus Highlight & Quick Safety Reminders */}
        <div className="space-y-6">
          {/* Tuesday Shuttle Highlight */}
          <Card className="border-2 border-wine-200 bg-gradient-to-b from-wine-50/50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-wine-600 text-white flex items-center justify-center shadow-sm">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-surface-charcoal">Tuesday Shuttle Service</h3>
                  <span className="text-[11px] font-medium text-wine-600">Weekly College & Market Run</span>
                </div>
              </div>
              <Badge variant="primary">Active</Badge>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-wine-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-muted">Route:</span>
                <span className="font-semibold text-surface-charcoal">Sakhi Hostel ⇄ Metro & City Hub</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-muted">Departure:</span>
                <span className="font-semibold text-emerald-600">4:30 PM (Hostel Gate 1)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-muted">Return:</span>
                <span className="font-semibold text-wine-600">7:45 PM (Sharp)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-muted">Bus Number:</span>
                <span className="font-mono font-medium text-surface-charcoal">MH-31-SK-2026</span>
              </div>
            </div>

            <div className="mt-4">
              <Link to="/student/bus">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  View Full Week Transit Table
                </Button>
              </Link>
            </div>
          </Card>

          {/* Warden Contact Widget */}
          <Card>
            <h3 className="text-sm font-bold text-surface-charcoal mb-3">Hostel Administration</h3>
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-surface border border-surface-divider">
              <div className="w-10 h-10 rounded-full bg-wine-100 text-wine-800 flex items-center justify-center font-serif font-bold text-sm">
                KB
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-surface-charcoal">Kranti Bhoyar</h4>
                <p className="text-[11px] text-surface-muted">Chief Hostel Warden</p>
                <p className="text-[11px] font-mono text-wine-700 mt-0.5">+91 98765 43210</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-surface-divider space-y-2 text-xs text-surface-muted">
              <div className="flex items-center justify-between">
                <span>Gate Curfew:</span>
                <span className="font-semibold text-rose-600">9:00 PM Everyday</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Study Room Quiet Hours:</span>
                <span className="font-medium text-surface-charcoal">10:00 PM – 6:00 AM</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
