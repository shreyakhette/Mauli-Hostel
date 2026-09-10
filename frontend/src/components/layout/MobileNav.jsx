import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BedDouble,
  AlertCircle,
  CalendarCheck,
  Menu,
  GraduationCap
} from 'lucide-react';

export const MobileNav = ({ onOpenDrawer }) => {
  const { isWarden } = useAuth();

  const studentItems = [
    { to: '/student/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/student/room', label: 'My Room', icon: BedDouble },
    { to: '/student/leave', label: 'Leave', icon: CalendarCheck },
    { to: '/student/complaints', label: 'Complaints', icon: AlertCircle },
  ];

  const wardenItems = [
    { to: '/warden/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/warden/students', label: 'Students', icon: GraduationCap },
    { to: '/warden/rooms', label: 'Rooms', icon: BedDouble },
    { to: '/warden/leaves', label: 'Leaves', icon: CalendarCheck },
  ];

  const items = isWarden ? wardenItems : studentItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-3 py-2 flex items-center justify-around shadow-card">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                isActive ? 'text-wine-900 font-bold' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        );
      })}
      <button
        onClick={onOpenDrawer}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-gray-400 hover:text-gray-600"
        aria-label="More options"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px]">More</span>
      </button>
    </nav>
  );
};

export default MobileNav;
