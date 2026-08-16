import { Outlet, useLocation } from 'react-router-dom';

import { SidebarLayout } from '@/components/layout/SidebarLayout';

import DepartmentsSidebar from './components/DepartmentsSidebar';

export default function DepartmentsPageLayout() {
  const location = useLocation();

  // Logic: Collapse if not on the index
  const isDeepPage = location.pathname !== '/government/departments';

  if (!isDeepPage) {
    return (
      <div className='container mx-auto px-4 py-6 md:py-8'>
        <Outlet />
      </div>
    );
  }

  return (
    <SidebarLayout
      sidebar={<DepartmentsSidebar />}
      collapsible={true}
      defaultCollapsed={true}
    >
      <Outlet />
    </SidebarLayout>
  );
}
