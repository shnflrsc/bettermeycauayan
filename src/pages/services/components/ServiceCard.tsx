import { Link } from 'react-router-dom';

import {
  ArrowRightIcon,
  Clock3Icon,
  PhilippinePesoIcon,
  ShieldCheckIcon,
} from 'lucide-react';

import type { Service } from '@/types/servicesTypes';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const title = service.plainLanguageName || service.service;
  const processingTime =
    service.quickInfo?.processingTime || service.processingTime;
  const fee = getFeeLabel(service);

  return (
    <Link
      to={`/services/${service.slug}`}
      className='group block rounded-xl focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none'
      data-testid='service-card'
      data-service-slug={service.slug}
      aria-label={`View requirements for ${title}`}
    >
      <article className='border-kapwa-border-weak bg-kapwa-bg-surface rounded-xl border px-4 py-4 shadow-sm transition hover:border-stone-400 hover:shadow-md sm:px-5'>
        <div className='grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(18rem,34rem)] sm:items-center'>
          <div className='min-w-0'>
            <div className='mb-1.5 flex flex-wrap items-center gap-2'>
              <span className='text-kapwa-text-brand text-xs font-bold tracking-wide uppercase'>
                {service.category.name}
              </span>
              {service.source === 'citizens-charter' && (
                <span className='text-kapwa-text-success bg-kapwa-bg-success-weak inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold'>
                  <ShieldCheckIcon className='h-3 w-3' />
                  Official
                </span>
              )}
            </div>
            <h3 className='text-kapwa-text-strong text-base leading-snug font-bold group-hover:text-kapwa-text-brand sm:text-lg'>
              {title}
            </h3>
            {service.officeDivision && (
              <p className='text-kapwa-text-support mt-1 truncate text-sm'>
                {service.officeDivision}
              </p>
            )}
          </div>

          <div className='border-kapwa-border-weak flex min-w-0 items-center gap-3 border-t pt-3 sm:border-t-0 sm:pt-0'>
            {(fee || processingTime) && (
              <dl className='grid min-w-0 flex-1 grid-cols-1 gap-x-5 gap-y-3 text-sm md:grid-cols-2'>
                {fee && (
                  <div className='flex min-w-0 items-start gap-2'>
                    <PhilippinePesoIcon className='text-kapwa-text-disabled mt-0.5 h-4 w-4 shrink-0' />
                    <div className='min-w-0'>
                      <dt className='sr-only'>Fee</dt>
                      <dd className='text-kapwa-text-support break-words leading-5'>
                        {fee}
                      </dd>
                    </div>
                  </div>
                )}
                {processingTime && (
                  <div className='flex min-w-0 items-start gap-2'>
                    <Clock3Icon className='text-kapwa-text-disabled mt-0.5 h-4 w-4 shrink-0' />
                    <div className='min-w-0'>
                      <dt className='sr-only'>Processing time</dt>
                      <dd className='text-kapwa-text-support break-words leading-5'>
                        {processingTime}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            )}
            <span className='text-kapwa-text-brand ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-kapwa-bg-brand-weak'>
              <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              <span className='sr-only'>View requirements</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function getFeeLabel(service: Service): string | undefined {
  if (service.quickInfo?.fee) return service.quickInfo.fee;
  if (!service.fees) return undefined;
  if (service.fees.amount === null || service.fees.amount === undefined) {
    return service.fees.description || undefined;
  }
  if (typeof service.fees.amount === 'number') {
    if (service.fees.amount === 0) return 'Free';
    return `₱${service.fees.amount.toLocaleString('en-PH')}`;
  }
  const amount = String(service.fees.amount).trim();
  if (/^(none|free|no fee|₱?0(?:\.00)?)$/i.test(amount)) return 'Free';
  return amount;
}
