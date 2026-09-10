import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../api/services';
import { Bell, ShieldCheck, User, LogOut, Settings, Menu, X, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CollegeLogo from '../common/CollegeLogo';

export const Navbar = ({ onOpenMobileMenu }) => {
  const { user, logout, isStudent, isWarden } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const fetchNotifications = async () => {
    try {
      const unread = await notificationApi.getUnread();
      setNotifications(unread.slice(0, 8));
      const countRes = await notificationApi.getUnreadCount();
      setUnreadCount(countRes.unreadCount || 0);
    } catch (e) {
      console.warn('Notification fetch error', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      await notificationApi.markAsRead(notif.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setShowNotifications(false);
      if (notif.linkUrl) {
        navigate(notif.linkUrl);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Toggle & Brand (Only visible on mobile) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-600 hover:text-wine-900 rounded-xl hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile-only brand */}
        <div className="lg:hidden">
          <Link to={isWarden ? '/warden/dashboard' : '/student/dashboard'}>
            <CollegeLogo size="xs" subtitle={false} />
          </Link>
        </div>

        {/* Desktop Breadcrumb / Location Indicator */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs">
          <span className="font-black text-amber-800 bg-amber-50/90 border border-amber-200/80 px-2 py-0.5 rounded text-[11px] tracking-wide">
            MGICOET Shegaon
          </span>
          <span className="text-slate-300 font-bold">/</span>
          <span className="font-bold text-slate-800">
            {isWarden ? 'Chief Warden Administration' : 'Hostel Resident Portal'}
          </span>
        </div>
      </div>

      {/* Center: Institutional Safety & Curfew Status */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/70 text-emerald-800 text-xs font-semibold shadow-xs">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Campus Protected 24/7 • Curfew 9:00 PM Sharp</span>
      </div>

      {/* Right Action Icons & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-gray-600 hover:text-wine-900 hover:bg-wine-50 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-wine-700 hover:text-wine-900 font-medium flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-xs">
                    No new notifications ✨
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className="p-3.5 hover:bg-wine-50/50 cursor-pointer transition flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-900">{n.title}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-wine-50 transition text-left"
          >
            {user?.profilePhotoUrl ? (
              <img
                src={user.profilePhotoUrl}
                alt={user.fullName || 'User'}
                className="w-8 h-8 rounded-xl object-cover border border-rose-200 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-wine-100 to-rose-100 border border-wine-200 text-wine-900 font-bold text-xs flex items-center justify-center">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-900 leading-none truncate max-w-[120px]">
                {user?.fullName || user?.username}
              </p>
              <p className="text-[10px] text-gray-500 capitalize mt-0.5">
                {isWarden ? 'Chief Warden' : user?.studentId || 'Student'}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95"
              onClick={() => setShowUserMenu(false)}
            >
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">{user?.fullName}</p>
                <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                {isStudent && user?.roomNumber && (
                  <p className="text-[10px] font-semibold text-wine-700 mt-1">
                    Room {user.roomNumber} • {user.bedLabel}
                  </p>
                )}
              </div>

              <Link
                to={isWarden ? '/warden/profile' : '/student/profile'}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-wine-50 hover:text-wine-900 transition"
              >
                <User className="w-4 h-4 text-gray-400" />
                My Profile
              </Link>

              <Link
                to={isWarden ? '/warden/settings' : '/student/settings'}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-wine-50 hover:text-wine-900 transition"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Settings & Security
              </Link>

              <div className="border-t border-gray-100 my-1" />

              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
