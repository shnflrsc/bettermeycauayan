import { FC, useMemo } from 'react';

import { Link } from 'react-router-dom';

import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { getCategoryIcon } from '@/lib/serviceIcons';

import serviceCategories from '../../data/service_categories.json';

interface Category {
  name: string;
  slug: string;
  description: string;
}

interface ServiceCategory extends Category {
  services?: unknown[];
}

const ServicesSection: FC = () => {
  const { t } = useTranslation('common');

  // Cast JSON data to new Interface
  const categories = serviceCategories.categories as Category[];

  // Calculate service count per category
  const categoriesWithCount = useMemo(() => {
    return categories.map((cat: ServiceCategory) => ({
      ...cat,
      serviceCount: cat.services?.length || 0,
    }));
  }, [categories]);

  // Keep the homepage scannable; the full catalog remains one click away.
  const displayedCategories = categoriesWithCount.slice(0, 6);

  return (
    <section className='bg-kapwa-bg-surface py-12'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 text-center'>
          <h2 className='text-kapwa-text-strong mb-4 kapwa-heading-lg font-bold'>
            Browse city services
          </h2>
          <p className='text-kapwa-text-support mx-auto max-w-2xl'>
            Choose a category or view the complete catalog of services,
            requirements, fees, locations, and processing steps.
          </p>
        </div>

        <div className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
          {displayedCategories.map(category => {
            const Icon = getCategoryIcon(category.name);
            return (
              <Link
                key={category.slug}
                to={`/services?category=${category.slug}`}
                className='group flex min-w-0 flex-col rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-kapwa-border-brand hover:shadow-md sm:p-5'
              >
                <div className='mb-3 flex items-start'>
                  <div className='rounded-lg bg-kapwa-bg-surface-brand p-2.5 text-kapwa-text-brand transition-colors group-hover:bg-kapwa-bg-brand-default group-hover:text-kapwa-text-inverse'>
                    <Icon className='h-5 w-5' />
                  </div>
                </div>
                <h3 className='mb-2 text-sm font-bold leading-snug text-kapwa-text-strong group-hover:text-kapwa-text-brand sm:text-lg'>
                  {category.name}
                </h3>
                <p className='mb-4 hidden flex-1 text-sm text-kapwa-text-support sm:line-clamp-2 sm:block'>
                  {category.description}
                </p>
                <div className='mt-auto flex items-center text-xs font-medium text-kapwa-text-brand group-hover:underline sm:text-sm'>
                  {t('services.viewAllCategory')}
                  <LucideIcons.ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </div>
              </Link>
            );
          })}
        </div>

        <div className='mt-10 text-center'>
          <Link
            to='/services?category=all'
            className='bg-kapwa-bg-brand-default hover:bg-kapwa-bg-brand-hover focus:ring-kapwa-border-brand text-kapwa-text-inverse inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden'
          >
            {t('services.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
