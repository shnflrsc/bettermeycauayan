import { NavLink, Outlet } from 'react-router-dom';
import { parseAsStringEnum, useQueryState } from 'nuqs';

import { cn } from '@/lib/utils';
import useOpenLGU from '@/hooks/useOpenLGU';

const filterValues = [
  'all',
  'ordinance',
  'resolution',
  'executive_order',
] as const;

export type FilterType = (typeof filterValues)[number];

const navigation = [
  { label: 'Documents', to: '/openlgu', end: true },
  { label: 'Officials', to: '/openlgu/officials' },
  { label: 'Legislative terms', to: '/openlgu/terms' },
];

export default function OpenLGULayout() {
  const [searchQuery, setSearchQuery] = useQueryState('search', {
    defaultValue: '',
  });
  const [filterType, setFilterType] = useQueryState(
    'type',
    parseAsStringEnum([...filterValues])
      .withDefault('all')
      .withOptions({ clearOnDefault: true })
  );
  const [authorIds, setAuthorIds] = useQueryState('authors', {
    defaultValue: [] as string[],
    parse: value => (value ? value.split(',').filter(Boolean) : []),
    serialize: values => values.join(','),
  });
  const [year, setYear] = useQueryState('year', { defaultValue: '' });
  const legislation = useOpenLGU();

  return (
    <div className='min-h-screen bg-kapwa-bg-surface-raised'>
      <div className='border-b border-kapwa-border-weak bg-kapwa-bg-surface'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between'>
            <NavLink
              to='/openlgu'
              end
              className='text-lg font-extrabold text-kapwa-text-strong hover:text-kapwa-text-brand'
            >
              OpenLGU
            </NavLink>
            <nav
              aria-label='OpenLGU sections'
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

      <main className='container mx-auto px-4 py-7 md:py-10'>
        <Outlet
          context={{
            searchQuery,
            setSearchQuery,
            filterType,
            setFilterType,
            authorIds,
            setAuthorIds,
            year,
            setYear,
            ...legislation,
          }}
        />
      </main>
    </div>
  );
}
