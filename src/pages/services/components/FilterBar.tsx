import { useState } from 'react';

import { ChevronDown, SlidersHorizontal } from 'lucide-react';

import { getAllOfficeDivisions } from '@/lib/services';

export type ServiceSource = 'citizens-charter' | 'community' | 'all';
export type ClassificationFilter = 'Simple' | 'Complex' | 'all';

interface FilterBarProps {
  selectedOfficeDivision: string;
  selectedSource: ServiceSource;
  selectedClassification: ClassificationFilter;
  onOfficeDivisionChange: (division: string) => void;
  onSourceChange: (source: ServiceSource) => void;
  onClassificationChange: (classification: ClassificationFilter) => void;
}

export default function FilterBar({
  selectedOfficeDivision,
  selectedSource,
  selectedClassification,
  onOfficeDivisionChange,
  onSourceChange,
  onClassificationChange,
}: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const officeDivisions = getAllOfficeDivisions();
  const hasActiveFilters =
    selectedOfficeDivision !== 'all' ||
    selectedSource !== 'all' ||
    selectedClassification !== 'all';

  return (
    <div data-testid='filter-bar'>
      <div className='flex items-center justify-between gap-4 md:mb-2'>
        <button
          type='button'
          onClick={() => setMobileOpen(open => !open)}
          className='border-kapwa-border-weak text-kapwa-text-strong flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold md:pointer-events-none md:border-0 md:px-0'
          aria-expanded={mobileOpen}
        >
          <SlidersHorizontal className='h-4 w-4' />
          More filters
          {hasActiveFilters && (
            <span className='bg-kapwa-bg-brand-default h-2 w-2 rounded-full' />
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform md:hidden ${mobileOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {hasActiveFilters && (
          <button
            type='button'
            onClick={() => {
              onOfficeDivisionChange('all');
              onSourceChange('all');
              onClassificationChange('all');
            }}
            className='text-kapwa-text-brand text-sm font-semibold hover:underline'
            data-testid='filter-clear-all'
          >
            Clear filters
          </button>
        )}
      </div>
      <div
        className={`${mobileOpen ? 'grid' : 'hidden'} mt-2 w-full grid-cols-1 gap-2 md:mt-0 md:grid md:grid-cols-3`}
      >
        <FilterSelect
          label='Office'
          value={selectedOfficeDivision}
          onChange={onOfficeDivisionChange}
          testId='filter-office-select'
          options={[
            { value: 'all', label: 'All offices' },
            ...officeDivisions.map(division => ({
              value: division,
              label: division,
            })),
          ]}
        />
        <FilterSelect
          label='Classification'
          value={selectedClassification}
          onChange={value =>
            onClassificationChange(value as ClassificationFilter)
          }
          testId='filter-classification-select'
          options={[
            { value: 'all', label: 'All classifications' },
            { value: 'Simple', label: 'Simple' },
            { value: 'Complex', label: 'Complex' },
          ]}
        />
        <FilterSelect
          label='Source'
          value={selectedSource}
          onChange={value => onSourceChange(value as ServiceSource)}
          testId='filter-source-select'
          options={[
            { value: 'all', label: 'All sources' },
            { value: 'citizens-charter', label: 'Official Citizens Charter' },
            { value: 'community', label: 'Community contributed' },
          ]}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  testId: string;
}) {
  return (
    <label className='min-w-0'>
      <span className='sr-only'>{label}</span>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        className='border-kapwa-border-weak bg-kapwa-bg-surface text-kapwa-text-strong min-h-10 w-full rounded-lg border px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-kapwa-border-brand focus:outline-none'
        data-testid={testId}
        aria-label={label}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
