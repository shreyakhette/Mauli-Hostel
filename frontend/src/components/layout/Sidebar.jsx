import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  BedDouble,
  BellRing,
  AlertCircle,
  CalendarCheck,
  ClipboardList,
  Bus,
  UtensilsCrossed,
  Users,
  PhoneCall,
  Settings,
  LogOut,
  BarChart3,
  Building2,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import collegeLogoImg from '../../assets/college_logo.png';

export const Sidebar = ({ isMobile = false, onCloseMobile }) => {
  const { isStudent, isWarden, logout, user } = useAuth();

  const studentNavItems = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Digital ID & Profile', icon: User },
    { to: '/student/room', label: 'My Room & Bed', icon: BedDouble },
    { to: '/student/complaints', label: 'Complaints Desk', icon: AlertCircle },
    { to: '/student/leave', label: 'Leave Out-Pass', icon: CalendarCheck },
    { to: '/student/attendance', label: 'Biometric Attendance', icon: ClipboardList },
    { to: '/student/notices', label: 'Notice Board', icon: BellRing },
    { to: '/student/bus', label: 'Campus Bus Schedule', icon: Bus },
    { to: '/student/mess', label: 'Dining Mess Menu', icon: UtensilsCrossed },
    { to: '/student/visitors', label: 'Visitor Passes', icon: Users },
    { to: '/student/emergency', label: 'Emergency & Warden SOS', icon: PhoneCall, highlight: true },
    { to: '/student/settings', label: 'Account Settings', icon: Settings },
  ];

  const wardenNavItems = [
    { to: '/warden/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { to: '/warden/students', label: 'Student Roster', icon: GraduationCap },
    { to: '/warden/rooms', label: '100 Rooms & 400 Beds', icon: BedDouble },
    { to: '/warden/complaints', label: 'Grievance Desk', icon: AlertCircle },
    { to: '/warden/leaves', label: 'Out-Pass Approvals', icon: CalendarCheck },
    { to: '/warden/attendance', label: 'Night Roll Call', icon: ClipboardList },
    { to: '/warden/notices', label: 'Official Broadcasts', icon: BellRing },
    { to: '/warden/bus', label: 'Transit Management', icon: Bus },
    { to: '/warden/mess', label: 'Dining & Kitchen', icon: UtensilsCrossed },
    { to: '/warden/visitors', label: 'Visitor Logs', icon: Users },
    { to: '/warden/emergency', label: 'Emergency Control', icon: PhoneCall, highlight: true },
    { to: '/warden/reports', label: 'Hostel Analytics', icon: BarChart3 },
    { to: '/warden/settings', label: 'Hostel Configuration', icon: Building2 },
    { to: '/warden/profile', label: 'Chief Warden Profile', icon: User },
  ];

  const navItems = isWarden ? wardenNavItems : studentNavItems;

  return (
    <aside className="w-64 h-full flex flex-col bg-white border-r border-slate-200/80 select-none shadow-xs">
      {/* Sidebar Header with Official Institution Emblem */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white ring-2 ring-amber-500/25 p-0.5 shadow-sm flex-shrink-0 overflow-hidden flex items-center justify-center">
            <img
              src={collegeLogoImg}
              alt="Mauli Group of Institutions Shegaon"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 bg-amber-50/90 border border-amber-200/70 px-1.5 py-0.5 rounded inline-block leading-tight mb-1">
              MGICOET Shegaon
            </span>
            <h2 className="text-sm font-black text-slate-900 tracking-tight leading-snug truncate">
              Sakhi Girls Hostel
            </h2>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              Mauli Group of Institutions
            </p>
          </div>
        </div>

        {/* Portal Identifier Strip */}
        <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
            {isWarden ? 'Chief Warden Desk' : 'Student Resident Portal'}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={isMobile ? onCloseMobile : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-gradient-to-r from-wine-900 to-wine-800 text-white shadow-sm'
                    : item.highlight
                    ? 'text-rose-700 bg-rose-50/80 hover:bg-rose-100 hover:text-rose-800 border border-rose-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-rose-600' : 'text-slate-400 group-hover:text-wine-800'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom User Card & Sign Out */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 shadow-xs flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {user?.profilePhotoUrl ? (
              <img
                src={user.profilePhotoUrl}
                alt={user.fullName || 'User'}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-wine-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">
                {isWarden ? 'Kranti Bhoyar • Chief Warden' : user?.studentId ? `${user.studentId} • Room ${user.roomNumber || '203'}` : 'Room 203'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
