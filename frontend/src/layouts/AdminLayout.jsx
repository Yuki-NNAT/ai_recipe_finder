import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Drawer, Badge } from '@/ui';
import { ADMIN_NAV } from './navigation';
import Sidebar, { SidebarContent } from './components/Sidebar';
import Navbar from './components/Navbar';

const ADMIN_GROUPS = [{ title: 'Management', items: ADMIN_NAV }];

/**
 * Admin shell. Reuses the exact same sidebar/navbar primitives as MainLayout
 * but swaps in the admin navigation — architecture consistency over a bespoke
 * dashboard chrome.
 */
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar groups={ADMIN_GROUPS} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <div className="px-3 pt-4 sm:px-4">
          <Badge tone="solid">Admin</Badge>
        </div>
        <main className="flex-1 px-3 pb-10 pt-2 sm:px-4">
          <Outlet />
        </main>
      </div>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} side="left" width="w-[280px]">
        <SidebarContent groups={ADMIN_GROUPS} onNavigate={() => setMobileOpen(false)} />
      </Drawer>
    </div>
  );
}
