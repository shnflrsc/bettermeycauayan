import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useOutletContext } from 'react-router-dom';

import { SearchXIcon } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { config } from '@/lib/lguConfig';
import { filterServices } from '@/lib/services';

import ServiceCard from './components/ServiceCard';
import type { ServicesOutletContext } from './layout';

const ITEMS_PER_PAGE = 12;

export default function ServicesPage() {
  const {
    searchQuery,
    selectedCategorySlug,
    selectedOfficeDivision,
    selectedSource,
    selectedClassification,
    setOfficeDivision,
    setSource,
    setClassification,
  } = useOutletContext<ServicesOutletContext>();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'relevance' | 'alphabetical'>(
    'relevance'
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 1. Filtering logic with new filters
  const filteredServices = useMemo(() => {
    const services = filterServices({
      category: selectedCategorySlug,
      officeDivision: selectedOfficeDivision,
      source: selectedSource,
      classification:
        selectedClassification !== 'all' ? selectedClassification : undefined,
      search: searchQuery || undefined,
    });
    if (sortOrder === 'alphabetical') {
      return [...services].sort((a, b) =>
        (a.plainLanguageName || a.service).localeCompare(
          b.plainLanguageName || b.service
        )
      );
    }
    return services;
  }, [
    searchQuery,
    selectedCategorySlug,
    selectedOfficeDivision,
    selectedSource,
    selectedClassification,
    sortOrder,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategorySlug,
    selectedOfficeDivision,
    selectedSource,
    selectedClassification,
  ]);

  // 2. Pagination & Infinite Scroll logic
  const handleLoadMore = useCallback(() => {
    if (filteredServices.length > currentPage * ITEMS_PER_PAGE) {
      setCurrentPage(prev => prev + 1);
    }
  }, [filteredServices.length, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      { rootMargin: '200px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  // 3. EMPTY STATE
  if (filteredServices.length === 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title='No services found'
        message={
          "We couldn't find any services matching your filters. Try adjusting your search or filters."
        }
        actionHref={`${config.portal.githubUrl}/issues/new?template=contribution.yml`}
        actionLabel='Suggest New Service'
      />
    );
  }

  return (
    <div className='animate-in fade-in space-y-6 duration-500'>
      <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
        <div>
          <h2 className='text-kapwa-text-strong text-xl font-bold'>
            {filteredServices.length}{' '}
            {filteredServices.length === 1 ? 'service' : 'services'} found
          </h2>
          <p className='text-kapwa-text-support mt-1 text-sm'>
            Select a service to view its requirements and complete procedure.
          </p>
        </div>
        <label className='flex items-center gap-2 text-sm'>
          <span className='text-kapwa-text-support font-medium'>Sort</span>
          <select
            value={sortOrder}
            onChange={event =>
              setSortOrder(event.target.value as typeof sortOrder)
            }
            className='border-kapwa-border-weak bg-kapwa-bg-surface text-kapwa-text-strong min-h-10 rounded-lg border px-3 py-2 font-medium focus:ring-2 focus:ring-kapwa-border-brand focus:outline-none'
          >
            <option value='relevance'>Relevance</option>
            <option value='alphabetical'>A–Z</option>
          </select>
        </label>
      </div>

      {(selectedOfficeDivision !== 'all' ||
        selectedSource !== 'all' ||
        selectedClassification !== 'all') && (
        <div className='flex flex-wrap gap-2' aria-label='Active filters'>
          {selectedOfficeDivision !== 'all' && (
            <Badge variant='primary' className='gap-1'>
              {selectedOfficeDivision}
              <button
                type='button'
                onClick={() => setOfficeDivision('all')}
                className='hover:text-kapwa-text-inverse ml-1'
              >
                ×
              </button>
            </Badge>
          )}
          {selectedSource !== 'all' && (
            <Badge variant='primary' className='gap-1'>
              {selectedSource === 'citizens-charter' ? 'Official' : 'Community'}
              <button
                type='button'
                onClick={() => setSource('all')}
                className='hover:text-kapwa-text-inverse ml-1'
              >
                ×
              </button>
            </Badge>
          )}
          {selectedClassification !== 'all' && (
            <Badge variant='primary' className='gap-1'>
              {selectedClassification}
              <button
                type='button'
                onClick={() => setClassification('all')}
                className='hover:text-kapwa-text-inverse ml-1'
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      <div className='flex flex-col gap-3'>
        {filteredServices
          .slice(0, currentPage * ITEMS_PER_PAGE)
          .map(service => (
            <ServiceCard key={service.slug} service={service} />
          ))}

        {/* Infinite Scroll Loader */}
        {filteredServices.length > currentPage * ITEMS_PER_PAGE && (
          <div
            ref={loadMoreRef}
            className='flex justify-center py-12 col-span-full'
          >
            <div className='border-kapwa-border-brand h-6 w-6 animate-spin rounded-full border-2 border-t-transparent' />
          </div>
        )}
      </div>
    </div>
  );
}
