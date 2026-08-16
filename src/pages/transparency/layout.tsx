import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

const sections = [
  { label: 'Overview', to: '/transparency', end: true },
  { label: 'Budget & finances', to: '/transparency/financial' },
  { label: 'Procurement', to: '/transparency/procurement' },
  { label: 'Infrastructure projects', to: '/transparency/infrastructure' },
];

export default function TransparencyLayout() {
  return (
    <div className='min-h-screen bg-kapwa-bg-surface-raised'>
      <div className='border-b border-kapwa-border-weak bg-kapwa-bg-surface'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between'>
            <NavLink
              to='/transparency'
              end
              className='text-lg font-extrabold text-kapwa-text-strong hover:text-kapwa-text-brand'
            >
              Transparency
            </NavLink>
            <nav
              aria-label='Transparency sections'
              className='flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            >
              {sections.map(section => (
                <NavLink
                  key={section.to}
                  to={section.to}
                  end={section.end}
                  className={({ isActive }) =>
                    cn(
                      'shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-kapwa-bg-brand-weak text-kapwa-text-brand'
                        : 'text-kapwa-text-support hover:bg-stone-100 hover:text-kapwa-text-strong'
                    )
                  }
                >
                  {section.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <main className='container mx-auto px-4 py-7 md:py-10'>
        <Outlet />
      </main>
    </div>
  );
}
