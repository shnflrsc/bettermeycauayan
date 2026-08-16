import { Button } from '@bettergov/kapwa/button';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import SelectPicker from '@/components/ui/SelectPicker';

import type { FilterType } from '../layout';

interface DocumentFiltersProps {
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  authorIds: string[];
  setAuthorIds: (ids: string[]) => void;
  year: string;
  setYear: (year: string) => void;
  authorOptions: Array<{ label: string; value: string }>;
  yearOptions: Array<{ label: string; value: string }>;
}

export default function DocumentFilters({
  filterType,
  setFilterType,
  authorIds,
  setAuthorIds,
  year,
  setYear,
  authorOptions,
  yearOptions,
}: DocumentFiltersProps) {
  const hasActiveFilters =
    filterType !== 'all' || authorIds.length > 0 || year !== '';

  const handleClearAll = () => {
    setFilterType('all');
    setAuthorIds([]);
    setYear('');
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-3'>
        {/* Author Filter - Multi Select */}
        <div className='min-w-[240px] flex-1 sm:flex-none'>
          <SelectPicker
            options={authorOptions}
            selectedValues={authorIds}
            onSelect={selected => setAuthorIds(selected.map(s => s.value))}
            placeholder='Authors'
            size='md'
            searchable={true}
            clearable={true}
          />
        </div>

        {/* Year Filter - Single Select */}
        <div className='min-w-[140px] flex-1 sm:flex-none'>
          <SelectPicker
            options={yearOptions}
            selectedValues={year ? [year] : []}
            onSelect={selected => setYear(selected[0]?.value || '')}
            placeholder='Year'
            size='md'
            searchable={true}
            clearable={true}
          />
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='md'
            onClick={handleClearAll}
            leftIcon={<X className='h-4 w-4' />}
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2'>
          {authorIds.length > 0 && (
            <Badge
              variant='secondary'
              className='cursor-pointer hover:opacity-80'
              onClick={() => setAuthorIds([])}
            >
              {authorIds.length} Author{authorIds.length > 1 ? 's' : ''}
            </Badge>
          )}
          {year && (
            <Badge
              variant='slate'
              className='cursor-pointer hover:opacity-80'
              onClick={() => setYear('')}
            >
              Year: {year}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
