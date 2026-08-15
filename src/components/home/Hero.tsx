import { FC, useId, useMemo, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import Fuse from 'fuse.js';
import { ArrowRight, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import SearchInput from '@/components/ui/SearchInput';
import ServiceDiscoverySection from '@/components/home/ServiceDiscoverySection';

import mergedServicesData from '@/data/citizens-charter/merged-services.json';
import type { Service } from '@/types/servicesTypes';

const popularServices = [
  {
    label: 'Certificates',
    to: '/services/issuance-of-certified-true-copy-of-birth-marriage-death-certificate',
  },
  {
    label: 'Business permit',
    to: '/services?search=business%20permit',
  },
  { label: 'Property tax', to: '/services/real-property-tax' },
  { label: 'Medical assistance', to: '/services/medical-assistance' },
  { label: 'Senior ID', to: '/services/senior-citizen-id' },
  {
    label: 'PWD ID',
    to: '/services/person-with-disability-pwd-id',
  },
];

const Hero: FC = () => {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const listboxId = useId();
  const showResults = query.trim().length > 0;

  const fuse = useMemo(() => {
    return new Fuse(mergedServicesData as Service[], {
      keys: [
        'service',
        'plainLanguageName',
        'category.name',
        'officeDivision',
        'description',
      ],
      threshold: 0.3,
    });
  }, []);

  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query).map(r => r.item);
  }, [query, fuse]);

  const visibleResults = results.slice(0, 5);

  const handleChangeValue = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || visibleResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % visibleResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(
        i => (i - 1 + visibleResults.length) % visibleResults.length
      );
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      navigate(`/services/${visibleResults[activeIndex].slug}`);
    }
  };

  return (
    <div className='relative bg-linear-to-br from-[#f1eddd] via-[#e9f0dd] to-[#d9e7ca] py-10 md:py-16'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 overflow-hidden'
      >
        <div className='absolute -top-28 -right-24 h-80 w-80 rounded-full bg-kapwa-bg-brand-default/8 blur-3xl' />
      </div>
      <div className='container relative mx-auto px-4'>
        <div className='grid grid-cols-1 gap-8 items-center lg:grid-cols-2'>
          <div className='animate-fade-in'>
            <h1 className='mb-4 max-w-full text-4xl font-black leading-tight break-words text-kapwa-text-strong sm:text-5xl lg:text-6xl'>
              {t('hero.title')}
            </h1>
            <p className='mb-7 max-w-xl text-base leading-relaxed text-kapwa-text-support sm:text-lg'>
              BetterMeycauayan brings city services, public records, local
              government information, community updates, and useful resources
              together in one accessible place for every Meycaueño.
            </p>

            <div className='relative z-30 mb-4'>
              <label htmlFor='hero-service-search' className='sr-only'>
                {t('hero.searchLabel')}
              </label>
              <div className='rounded-2xl bg-white/45 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur-sm'>
                <SearchInput
                  id='hero-service-search'
                  role='combobox'
                  size='lg'
                  icon={<Search className='h-5 w-5 text-kapwa-text-brand' />}
                  aria-expanded={showResults}
                  aria-controls={listboxId}
                  aria-autocomplete='list'
                  aria-label={t('hero.searchLabel')}
                  value={query}
                  onChangeValue={handleChangeValue}
                  onKeyDown={handleKeyDown}
                  aria-activedescendant={
                    activeIndex >= 0
                      ? `${listboxId}-opt-${visibleResults[activeIndex]?.slug}`
                      : undefined
                  }
                  placeholder={t('hero.searchPlaceholder')}
                  className='bg-kapwa-bg-surface rounded-xl shadow-sm'
                />
              </div>

              <div
                id={`${listboxId}-status`}
                role='status'
                aria-live='polite'
                className='sr-only'
              >
                {showResults
                  ? `${results.length} result${results.length === 1 ? '' : 's'}`
                  : ''}
              </div>

              {showResults && (
                <div className='absolute top-full right-0 left-0 mt-2 overflow-hidden rounded-2xl border border-kapwa-border-weak bg-kapwa-bg-surface shadow-2xl'>
                  {results.length > 0 ? (
                    <ul
                      id={listboxId}
                      role='listbox'
                      aria-label='Matching services'
                      className='max-h-96 overflow-y-auto p-1.5 text-kapwa-text-strong'
                    >
                      {visibleResults.map((hit, index) => (
                        <li
                          key={hit.slug}
                          id={`${listboxId}-opt-${hit.slug}`}
                          role='option'
                          aria-selected={index === activeIndex}
                        >
                          <Link
                            to={`/services/${hit.slug}`}
                            className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 transition hover:bg-kapwa-bg-hover focus-visible:bg-kapwa-bg-hover focus-visible:outline-none ${
                              index === activeIndex ? 'bg-kapwa-bg-hover' : ''
                            }`}
                          >
                            <span className='min-w-0 flex-1'>
                              <span className='block truncate font-semibold'>
                                {hit.plainLanguageName || hit.service}
                              </span>
                              <span className='mt-0.5 block text-xs font-medium text-kapwa-text-brand'>
                                {hit.category.name}
                              </span>
                              {hit.description && (
                                <span className='mt-1 block truncate text-sm text-kapwa-text-support'>
                                  {hit.description}
                                </span>
                              )}
                            </span>
                            <ArrowRight className='h-4 w-4 shrink-0 text-kapwa-text-disabled transition group-hover:translate-x-0.5 group-hover:text-kapwa-text-brand' />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      role='status'
                      className='px-5 py-4 text-sm text-kapwa-text-support'
                    >
                      {t('hero.noResults')}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className='mt-4'>
              <p className='mb-2 text-xs font-bold uppercase tracking-wide text-kapwa-text-support'>
                Popular services
              </p>
              <div className='flex min-w-0 flex-wrap gap-2'>
                {popularServices.map(service => (
                  <Link
                    key={service.label}
                    to={service.to}
                    className='rounded-full border border-kapwa-border-weak bg-kapwa-bg-surface px-3 py-1.5 text-sm font-semibold text-kapwa-text-support transition hover:border-kapwa-border-brand hover:text-kapwa-text-brand focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none'
                  >
                    {service.label}
                  </Link>
                ))}
                <Link
                  to='/services'
                  className='rounded-full px-3 py-1.5 text-sm font-semibold text-kapwa-text-brand hover:underline focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none'
                >
                  All services →
                </Link>
              </div>
            </div>
          </div>

          <ServiceDiscoverySection />
        </div>
      </div>
    </div>
  );
};

export default Hero;
