import { useEffect, useState } from 'react';

import { Outlet, useLocation, useSearchParams } from 'react-router-dom';

import { useQueryState } from 'nuqs';

import SearchInput from '@/components/ui/SearchInput';
import { getMergedServices, getServicesCountByCategory } from '@/lib/services';

import serviceCategories from '@/data/service_categories.json';

import FilterBar from './components/FilterBar';

export type ServiceSource = 'citizens-charter' | 'community' | 'all';
export type ClassificationFilter = 'Simple' | 'Complex' | 'all';

export interface ServicesOutletContext {
  searchQuery: string;
  selectedCategorySlug: string;
  selectedOfficeDivision: string;
  selectedSource: ServiceSource;
  selectedClassification: ClassificationFilter;
  setOfficeDivision: (division: string) => void;
  setSource: (source: ServiceSource) => void;
  setClassification: (classification: ClassificationFilter) => void;
}

const shortCategoryNames: Record<string, string> = {
  'certificates-vital-records': 'Certificates',
  'business-trade-investment': 'Business',
  'social-services-assistance': 'Social assistance',
  'health-wellness': 'Health',
  'taxation-payments': 'Taxes & payments',
  'agriculture-economic-development': 'Agriculture',
  'infrastructure-public-works': 'Public works',
  'education-scholarship': 'Education',
  'public-safety-security': 'Public safety',
  'environment-natural-resources': 'Environment',
};

export default function ServicesLayout() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isIndexPage =
    location.pathname === '/services' || location.pathname === '/services/';
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(
    searchParams.get('category') || 'all'
  );

  const handleCategoryChange = (slug: string) => {
    setSelectedCategorySlug(slug);
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      if (slug === 'all') next.delete('category');
      else next.set('category', slug);
      return next;
    });
  };

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    if (categoryFromUrl !== selectedCategorySlug) {
      setSelectedCategorySlug(categoryFromUrl);
    }
  }, [searchParams, selectedCategorySlug]);

  const [searchQuery, setSearchQuery] = useQueryState('search', {
    defaultValue: '',
  });
  const [selectedOfficeDivision, setSelectedOfficeDivision] = useState('all');
  const [selectedSource, setSelectedSource] = useState<ServiceSource>('all');
  const [selectedClassification, setSelectedClassification] =
    useState<ClassificationFilter>('all');
  const categoryCounts = getServicesCountByCategory();

  const outlet = (
    <Outlet
      context={{
        searchQuery,
        selectedCategorySlug,
        selectedOfficeDivision,
        selectedSource,
        selectedClassification,
        setOfficeDivision: setSelectedOfficeDivision,
        setSource: setSelectedSource,
        setClassification: setSelectedClassification,
      }}
    />
  );

  if (!isIndexPage) {
    return (
      <div className='bg-kapwa-bg-surface-raised min-h-screen'>
        <div className='container mx-auto px-4 py-5 md:py-7'>{outlet}</div>
      </div>
    );
  }

  return (
    <div className='bg-kapwa-bg-surface-raised min-h-screen'>
      <section className='border-kapwa-border-weak bg-kapwa-bg-surface border-b'>
        <div className='container mx-auto space-y-3 px-4 py-4 md:py-5'>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3'>
            <h1 className='text-kapwa-text-strong text-2xl font-bold md:text-3xl'>
              City services
            </h1>
            <p className='text-kapwa-text-support text-sm'>
              Requirements, fees, processing times, and procedures
            </p>
          </div>

          <div>
            <label htmlFor='services-search' className='sr-only'>
              Search city services
            </label>
            <SearchInput
              id='services-search'
              placeholder='Try “business permit”, “senior ID”, or “medical assistance”…'
              value={searchQuery}
              onChangeValue={setSearchQuery}
              size='md'
              className='w-full'
            />
          </div>

          <div className='flex min-w-0 items-center gap-2'>
            <span className='text-kapwa-text-support hidden shrink-0 text-xs font-bold uppercase sm:inline'>
              Category
            </span>
            <div className='flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
              <CategoryChip
                label='All services'
                count={getMergedServices().length}
                active={selectedCategorySlug === 'all'}
                onClick={() => handleCategoryChange('all')}
              />
              {serviceCategories.categories.map(category => (
                <CategoryChip
                  key={category.slug}
                  label={shortCategoryNames[category.slug] || category.name}
                  count={categoryCounts[category.slug] || 0}
                  active={selectedCategorySlug === category.slug}
                  onClick={() => handleCategoryChange(category.slug)}
                />
              ))}
            </div>
          </div>

          <FilterBar
            selectedOfficeDivision={selectedOfficeDivision}
            selectedSource={selectedSource}
            selectedClassification={selectedClassification}
            onOfficeDivisionChange={setSelectedOfficeDivision}
            onSourceChange={setSelectedSource}
            onClassificationChange={setSelectedClassification}
          />
        </div>
      </section>

      <div className='container mx-auto px-4 py-5 md:py-6'>{outlet}</div>
    </div>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none ${
        active
          ? 'border-kapwa-border-brand bg-kapwa-bg-brand-default text-kapwa-text-inverse'
          : 'border-kapwa-border-weak bg-kapwa-bg-surface text-kapwa-text-support hover:border-stone-400 hover:bg-stone-50'
      }`}
    >
      {label}{' '}
      <span className={active ? 'text-white/75' : 'text-kapwa-text-disabled'}>
        {count}
      </span>
    </button>
  );
}
