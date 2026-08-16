import { useState } from 'react';

import { Link } from 'react-router-dom';

import { ArrowRight, MapPinIcon, Phone, User2 } from 'lucide-react';

import { ModuleHeader } from '@/components/layout/PageLayouts';
import SearchInput from '@/components/ui/SearchInput';

import { toTitleCase } from '@/lib/stringUtils';
import { lguLabels } from '@/lib/lguLabels';

import barangaysData from '@/data/directory/barangays.json';

export default function BarangaysIndex() {
  const [search, setSearch] = useState('');

  const filtered = barangaysData
    .filter(b => b.barangay_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.barangay_name.localeCompare(b.barangay_name));

  return (
    <>
      <ModuleHeader
        title='Barangays'
        description={`${filtered.length} component barangays of the ${lguLabels.fullName}.`}
      >
        <SearchInput
          value={search}
          onChangeValue={setSearchTerm => setSearch(setSearchTerm)}
          placeholder='Search by name (e.g. Mayondon)...'
          className='w-full md:w-96'
        />
      </ModuleHeader>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        {filtered.map(brgy => {
          const punong = brgy.officials?.find(o =>
            o.role.includes('Barangay Captain')
          );

          return (
            <Link
              key={brgy.slug}
              to={brgy.slug}
              className='group block h-full'
              aria-label={`View profile of Barangay ${brgy.barangay_name}`}
            >
              <article className='flex h-full flex-col gap-4 rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface p-4 transition hover:border-kapwa-border-brand hover:shadow-sm'>
                <div className='flex items-start gap-3'>
                  {/* Consistent Icon Styling (Primary) */}
                  <div className='bg-kapwa-bg-surface text-kapwa-text-brand border-kapwa-border-brand group-hover:bg-kapwa-bg-brand-default group-hover:text-kapwa-text-inverse shrink-0 rounded-lg border p-2 shadow-sm transition-colors'>
                    <MapPinIcon className='h-5 w-5' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h3 className='group-hover:text-kapwa-text-brand text-kapwa-text-strong text-base leading-tight font-bold transition-colors'>
                      {toTitleCase(brgy.barangay_name.replace('BARANGAY ', ''))}
                    </h3>
                    <p className='mt-1 text-xs text-kapwa-text-support'>
                      Barangay profile
                    </p>
                  </div>
                  <ArrowRight className='group-hover:text-kapwa-text-brand text-kapwa-text-support mt-1 h-4 w-4 transition-all' />
                </div>

                <div className='flex items-center gap-2'>
                  <div className='shrink-0 text-kapwa-text-disabled'>
                    <User2 className='h-3.5 w-3.5' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-kapwa-text-disabled mb-0.5 text-[9px] leading-none font-bold tracking-tighter uppercase'>
                      Punong Barangay
                    </p>
                    <p className='text-kapwa-text-support truncate text-xs leading-tight font-bold'>
                      {punong ? toTitleCase(punong.name) : 'Awaiting Data'}
                    </p>
                  </div>
                </div>

                <div className='mt-auto flex items-center justify-between gap-4 border-t border-kapwa-border-weak pt-3'>
                  {brgy.trunkline && brgy.trunkline.length > 0 ? (
                    <div className='text-kapwa-text-disabled flex items-center gap-1.5 text-[11px] font-medium'>
                      <Phone className='text-kapwa-text-brand h-3 w-3' />
                      <span>{brgy.trunkline[0]}</span>
                    </div>
                  ) : (
                    <div className='text-kapwa-text-support text-[10px] italic'>
                      No contact listed
                    </div>
                  )}

                  <span className='sr-only'>View profile</span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </>
  );
}
