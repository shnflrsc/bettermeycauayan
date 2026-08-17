import {
  ArrowRight,
  CalendarRange,
  FileText,
  Scale,
  ScrollText,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const documentLinks = [
  {
    title: 'Ordinances',
    description: 'Local rules and policies enacted by the city council.',
    to: '/openlgu?type=ordinance',
    icon: Scale,
  },
  {
    title: 'Resolutions',
    description: 'Formal decisions and positions of the city council.',
    to: '/openlgu?type=resolution',
    icon: ScrollText,
  },
  {
    title: 'Executive orders',
    description: 'Directives issued by the Office of the City Mayor.',
    to: '/openlgu?type=executive_order',
    icon: FileText,
  },
];

export default function OpenLGUSection() {
  return (
    <section className='bg-kapwa-bg-surface py-14 md:py-20'>
      <div className='container mx-auto px-4'>
        <div className='grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-start lg:gap-16'>
          <div>
            <p className='mb-2 text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
              OpenLGU public records
            </p>
            <h2 className='max-w-lg text-2xl font-bold leading-tight text-kapwa-text-strong md:text-4xl'>
              Local laws, without the document hunt
            </h2>
            <p className='mt-4 max-w-lg leading-relaxed text-kapwa-text-support'>
              Search Meycauayan’s ordinances, resolutions, and executive orders
              as one organized public archive.
            </p>
            <div className='mt-6 flex flex-wrap gap-x-5 gap-y-3'>
              <Link
                to='/openlgu'
                className='inline-flex items-center gap-2 rounded-lg bg-kapwa-bg-brand-default px-4 py-2.5 text-sm font-bold text-kapwa-text-inverse hover:bg-kapwa-bg-brand-hover'
              >
                Browse all records <ArrowRight className='h-4 w-4' />
              </Link>
              <Link
                to='/openlgu/officials'
                className='inline-flex items-center gap-2 text-sm font-bold text-kapwa-text-brand hover:underline'
              >
                <Users className='h-4 w-4' /> Officials
              </Link>
              <Link
                to='/openlgu/terms'
                className='inline-flex items-center gap-2 text-sm font-bold text-kapwa-text-brand hover:underline'
              >
                <CalendarRange className='h-4 w-4' /> Legislative terms
              </Link>
            </div>
          </div>
          <div className='rounded-2xl bg-kapwa-bg-surface p-2 shadow-sm ring-1 ring-kapwa-border-weak'>
            {documentLinks.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className='group flex items-start gap-4 rounded-xl p-4 transition hover:bg-kapwa-bg-surface-raised sm:p-5'
                >
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-kapwa-bg-brand-weak text-kapwa-text-brand'>
                    <Icon className='h-5 w-5' />
                  </span>
                  <span className='min-w-0 flex-1'>
                    <strong className='block text-kapwa-text-strong group-hover:text-kapwa-text-brand'>
                      {item.title}
                    </strong>
                    <span className='mt-1 block text-sm leading-relaxed text-kapwa-text-support'>
                      {item.description}
                    </span>
                  </span>
                  <ArrowRight className='mt-2 h-4 w-4 shrink-0 text-kapwa-text-disabled transition-transform group-hover:translate-x-1 group-hover:text-kapwa-text-brand' />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
