import { Outlet, useLocation } from 'react-router-dom';

import { SidebarLayout } from '@/components/layout/SidebarLayout';

import BarangaysSidebar from './components/BarangaysSidebar';

export default function BarangaysPageLayout() {
  const location = useLocation();

  // Logic: Collapse if not on the index
  const isDeepPage = location.pathname !== '/government/barangays';

  if (!isDeepPage) {
    return (
      <div className='container mx-auto px-4 py-6 md:py-8'>
        <Outlet />
      </div>
    );
  }

  return (
    <SidebarLayout
      sidebar={<BarangaysSidebar />}
      collapsible={true}
      defaultCollapsed={true}
    >
      <Outlet />
    </SidebarLayout>
  );
}
