import { NavLink, Outlet } from 'react-router-dom';

import { cn } from '@/lib/utils';

const navigation = [
  { label: 'Overview', to: '/government', end: true },
  { label: 'Officials', to: '/government/elected-officials' },
  { label: 'Departments', to: '/government/departments' },
  { label: 'Barangays', to: '/government/barangays' },
];

export default function GovernmentRootLayout() {
  return (
    <div className='min-h-screen bg-kapwa-bg-surface-raised'>
      <div className='border-b border-kapwa-border-weak bg-kapwa-bg-surface'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between'>
            <NavLink
              to='/government'
              end
              className='text-lg font-extrabold text-kapwa-text-strong hover:text-kapwa-text-brand'
            >
              City Government
            </NavLink>
            <nav
              aria-label='City government sections'
              className='flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            >
              {navigation.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-kapwa-bg-brand-weak text-kapwa-text-brand'
                        : 'text-kapwa-text-support hover:bg-stone-100 hover:text-kapwa-text-strong'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
