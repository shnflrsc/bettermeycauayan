import { Outlet, useLocation } from 'react-router-dom';

import { SidebarLayout } from '@/components/layout/SidebarLayout';

import ElectedOfficialsSidebar from './components/ElectedOfficialsSidebar';

export default function ElectedOfficialsLayout() {
  const location = useLocation();

  // Logic: Collapse if not on the main index
  const isDeepPage = location.pathname !== '/government/elected-officials';

  if (!isDeepPage) {
    return (
      <div className='container mx-auto px-4 py-6 md:py-8'>
        <Outlet />
      </div>
    );
  }

  return (
    <SidebarLayout
      sidebar={<ElectedOfficialsSidebar />}
      collapsible={true}
      defaultCollapsed={true}
    >
      <Outlet />
    </SidebarLayout>
  );
}
