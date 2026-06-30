import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { logoutUser } from '@/store/authSlice';
import type { AppDispatch } from '@/store';

export function AdminLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={() => void dispatch(logoutUser())}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
