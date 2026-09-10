import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { X } from 'lucide-react';

export const MainLayout = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface antialiased text-slate-900">
      {/* Desktop Sidebar (Fixed Full-Height Left) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64">
        <Sidebar />
      </div>

      {/* Main Content Area (Offset by lg:pl-64) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar spans only the content area */}
        <Navbar onOpenMobileMenu={() => setMobileDrawerOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 pb-20 lg:pb-12 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-elevated z-10 flex flex-col">
            <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sakhi Girls Hostel</span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Sidebar isMobile onCloseMobile={() => setMobileDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation on Mobile */}
      <MobileNav onOpenDrawer={() => setMobileDrawerOpen(true)} />
    </div>
  );
};

export default MainLayout;
