import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowRight,
  BookOpen,
  Building2,
  Landmark,
  MapPin,
  Users,
} from 'lucide-react';

import SearchInput from '@/components/ui/SearchInput';
import { toTitleCase } from '@/lib/stringUtils';

import barangaysData from '@/data/directory/barangays.json';
import departmentsData from '@/data/directory/departments.json';
import executiveData from '@/data/directory/executive.json';

const sections = [
  {
    title: 'Elected officials',
    description: 'Meet the Mayor, Vice Mayor, and members of the City Council.',
    to: '/government/elected-officials',
    icon: Users,
  },
  {
    title: 'City departments',
    description: 'Find the office responsible for a service or concern.',
    to: '/government/departments',
    icon: Building2,
  },
  {
    title: 'Barangays',
    description: 'Browse local officials and contact details by barangay.',
    to: '/government/barangays',
    icon: MapPin,
  },
];

export default function GovernmentOverview() {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!normalized) return [];
    const officials = executiveData
      .filter(item =>
        `${item.name} ${item.role} ${item.office}`
          .toLowerCase()
          .includes(normalized)
      )
      .map(item => ({
        title: item.name,
        meta: item.role,
        type: 'Official',
        to: '/government/elected-officials',
      }));
    const departments = departmentsData
      .filter(item =>
        `${item.office_name} ${item.department_head?.name || ''}`
          .toLowerCase()
          .includes(normalized)
      )
      .map(item => ({
        title: toTitleCase(item.office_name),
        meta: item.department_head?.name
          ? `Head: ${toTitleCase(item.department_head.name)}`
          : 'City department',
        type: 'Department',
        to: `/government/departments/${item.slug}`,
      }));
    const barangays = barangaysData
      .filter(item =>
        `${item.barangay_name} ${item.officials.map(person => person.name).join(' ')}`
          .toLowerCase()
          .includes(normalized)
      )
      .map(item => ({
        title: `Barangay ${toTitleCase(item.barangay_name.replace('BARANGAY ', ''))}`,
        meta:
          item.officials.find(person => person.role.includes('Captain'))
            ?.name || 'Barangay profile',
        type: 'Barangay',
        to: `/government/barangays/${item.slug}`,
      }));
    return [...officials, ...departments, ...barangays].slice(0, 8);
  }, [normalized]);

  return (
    <main className='container mx-auto px-4 py-8 md:py-12'>
      <header className='max-w-3xl'>
        <p className='text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
          City Government of Meycauayan
        </p>
        <h1 className='mt-2 text-3xl font-black tracking-tight text-kapwa-text-strong md:text-4xl'>
          Find the people and offices serving your city
        </h1>
        <p className='mt-3 max-w-2xl leading-7 text-kapwa-text-support'>
          Look up city officials, departments, barangay leaders,
          responsibilities, and contact information from one directory.
        </p>
      </header>

      <div className='relative mt-7 max-w-4xl'>
        <SearchInput
          value={query}
          onChangeValue={setQuery}
          size='lg'
          placeholder='Search an official, department, or barangay…'
          aria-label='Search the city government directory'
          className='rounded-xl bg-kapwa-bg-surface shadow-sm'
        />
        {normalized && (
          <div className='absolute right-0 left-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface shadow-xl'>
            {matches.length ? (
              <ul className='divide-y divide-kapwa-border-weak p-1'>
                {matches.map(item => (
                  <li key={`${item.type}-${item.to}-${item.title}`}>
                    <Link
                      to={item.to}
                      className='flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-kapwa-bg-surface-raised'
                    >
                      <span className='min-w-0 flex-1'>
                        <span className='block font-semibold text-kapwa-text-strong'>
                          {item.title}
                        </span>
                        <span className='mt-0.5 block truncate text-sm text-kapwa-text-support'>
                          {item.meta}
                        </span>
                      </span>
                      <span className='text-xs font-bold uppercase tracking-wide text-kapwa-text-brand'>
                        {item.type}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='px-4 py-4 text-sm text-kapwa-text-support'>
                No matching officials, departments, or barangays found.
              </p>
            )}
          </div>
        )}
      </div>

      <section aria-labelledby='government-directory' className='mt-10'>
        <h2
          id='government-directory'
          className='text-xl font-bold text-kapwa-text-strong'
        >
          Browse the directory
        </h2>
        <div className='mt-4 grid gap-3 md:grid-cols-3'>
          {sections.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className='group flex gap-4 rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface p-5 transition hover:border-kapwa-border-brand hover:shadow-sm'
              >
                <Icon className='mt-0.5 h-5 w-5 shrink-0 text-kapwa-text-brand' />
                <span className='min-w-0'>
                  <span className='flex items-center justify-between gap-2 font-bold text-kapwa-text-strong group-hover:text-kapwa-text-brand'>
                    {item.title}
                    <ArrowRight className='h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1' />
                  </span>
                  <span className='mt-1.5 block text-sm leading-6 text-kapwa-text-support'>
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className='mt-10 grid gap-6 border-t border-kapwa-border-weak pt-8 md:grid-cols-[1fr_auto] md:items-center'>
        <div>
          <div className='flex items-center gap-2 text-kapwa-text-brand'>
            <Landmark className='h-5 w-5' />
            <h2 className='text-lg font-bold text-kapwa-text-strong'>
              How the city is organized
            </h2>
          </div>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-kapwa-text-support'>
            The Mayor leads the executive offices, while the Sangguniang
            Panlungsod creates local legislation. Barangays provide government
            closest to each community.
          </p>
        </div>
        <Link
          to='/government/elected-officials/committees'
          className='inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-kapwa-border-brand px-4 py-2.5 text-sm font-bold text-kapwa-text-brand hover:bg-kapwa-bg-brand-weak'
        >
          <BookOpen className='h-4 w-4' /> View council committees
        </Link>
      </section>
    </main>
  );
}
