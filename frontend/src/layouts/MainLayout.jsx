import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Drawer } from '@/ui';
import Sidebar, { SidebarContent } from './components/Sidebar';
import Navbar from './components/Navbar';

/**
 * Primary app shell: floating sidebar on desktop, sticky glass navbar, and a
 * Drawer-based sidebar on mobile. Page content renders through <Outlet/>.
 * The navbar sources auth + favorites from context itself.
 */
export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-3 pb-10 pt-4 sm:px-4">
          <Outlet />
        </main>
      </div>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} side="left" width="w-[280px]">
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </Drawer>
    </div>
  );
}
