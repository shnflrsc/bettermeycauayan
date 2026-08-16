import { useState } from 'react';

import { Link } from 'react-router-dom';

import { ArrowRight, Building2Icon, Globe, Phone, User2 } from 'lucide-react';

import { ModuleHeader } from '@/components/layout/PageLayouts';
import SearchInput from '@/components/ui/SearchInput';

import { officeIcons } from '@/lib/officeIcons';
import { formatGovName, toTitleCase } from '@/lib/stringUtils';
import { toTelUri } from '@/lib/utils';

import departmentsData from '@/data/directory/departments.json';

export default function DepartmentsIndex() {
  const [search, setSearch] = useState('');

  const filtered = departmentsData
    .filter(d => d.office_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const clean = (name: string) =>
        name.replace(/DEPARTMENT OF |MUNICIPAL |LOCAL /g, '');
      return clean(a.office_name).localeCompare(clean(b.office_name));
    });

  return (
    <>
      <ModuleHeader
        title='City departments'
        description={`${filtered.length} offices serving Meycauayan.`}
      >
        <SearchInput
          value={search}
          onChangeValue={setSearch}
          placeholder='Search departments...'
          className='w-full md:w-96'
        />
      </ModuleHeader>

      <div className='flex flex-col gap-3'>
        {filtered.map(dept => {
          const Icon = officeIcons[dept.slug] || Building2Icon;

          return (
            <Link
              key={dept.slug}
              to={dept.slug}
              className='group block rounded-xl focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none'
              aria-label={`View details for ${dept.office_name}`}
            >
              <article className='flex flex-col gap-4 rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface p-4 transition hover:border-kapwa-border-brand hover:shadow-sm md:flex-row md:items-center'>
                <div className='flex min-w-0 flex-1 items-start gap-3'>
                  <div className='bg-kapwa-bg-surface text-kapwa-text-brand border-kapwa-border-brand group-hover:bg-kapwa-bg-brand-default group-hover:text-kapwa-text-inverse shrink-0 rounded-lg border p-2 shadow-sm transition-colors'>
                    <Icon className='h-5 w-5' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h3 className='group-hover:text-kapwa-text-brand text-kapwa-text-strong truncate text-sm leading-tight font-bold transition-colors md:text-base'>
                      {toTitleCase(
                        formatGovName(dept.office_name, 'department')
                      )}
                    </h3>
                    <p className='mt-1 text-xs text-kapwa-text-support'>
                      City department
                    </p>
                  </div>
                  <ArrowRight className='group-hover:text-kapwa-text-brand text-kapwa-text-support mt-1 h-4 w-4 transition-all' />
                </div>

                {dept.department_head?.name ? (
                  <div className='flex min-w-48 items-center gap-2 md:max-w-60'>
                    <div className='shrink-0 text-kapwa-text-disabled'>
                      <User2 className='h-3.5 w-3.5' />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-kapwa-text-disabled mb-0.5 text-[9px] leading-none font-bold tracking-tighter uppercase'>
                        Department Head
                      </p>
                      <p className='text-kapwa-text-support truncate text-xs leading-tight font-bold'>
                        {toTitleCase(dept.department_head.name)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className='hidden min-w-48 md:block'
                    aria-hidden='true'
                  />
                )}

                <div className='flex min-w-44 items-center justify-between gap-4 border-t border-kapwa-border-weak pt-3 md:border-t-0 md:pt-0'>
                  {dept.trunkline ? (
                    <a
                      href={
                        toTelUri(
                          Array.isArray(dept.trunkline)
                            ? dept.trunkline[0]
                            : dept.trunkline
                        ) || '#'
                      }
                      className='text-kapwa-text-disabled flex items-center gap-1.5 text-[11px] font-medium hover:text-kapwa-text-brand transition-colors'
                    >
                      <Phone className='text-kapwa-text-brand h-3 w-3' />
                      <span>
                        {Array.isArray(dept.trunkline)
                          ? dept.trunkline[0]
                          : dept.trunkline}
                      </span>
                    </a>
                  ) : (
                    <div className='text-kapwa-text-support text-[10px] italic'>
                      No contact
                    </div>
                  )}

                  <div className='flex items-center gap-2'>
                    {dept.website && (
                      <div
                        className='bg-kapwa-bg-surface text-kapwa-text-brand rounded-md p-1.5'
                        title='Website Available'
                      >
                        <Globe className='h-3.5 w-3.5' />
                      </div>
                    )}
                    <span className='sr-only'>View profile</span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </>
  );
}
