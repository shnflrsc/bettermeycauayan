import { Link } from 'react-router-dom';

import { MapPin, MessageCircle, Phone, Search } from 'lucide-react';

import { config } from '@/lib/lguConfig';

const items = [
  {
    title: 'Emergency hotlines',
    description: 'Call police, fire, rescue, medical and disaster hotlines.',
    href: 'https://hotlines.bettergov.ph/?city=Meycauayan&province=Bulacan',
    icon: Phone,
    external: true,
    accent: 'bg-rose-100 text-rose-800',
  },
  {
    title: 'Locate City Hall',
    description: 'Open the location of Meycauayan City Hall on the map.',
    href: `https://www.openstreetmap.org/?mlat=${config.location.coordinates.lat}&mlon=${config.location.coordinates.lon}#map=17/${config.location.coordinates.lat}/${config.location.coordinates.lon}`,
    icon: MapPin,
    accent: 'bg-stone-200 text-stone-800',
    external: true,
  },
  {
    title: 'Contact the portal',
    description: 'Ask a question or report information that needs correction.',
    href: '/contact',
    icon: MessageCircle,
    accent: 'bg-amber-100 text-amber-800',
  },
  {
    title: 'Search the whole portal',
    description: 'Look across services, offices and public information.',
    href: '/search',
    icon: Search,
    accent: 'bg-slate-200 text-slate-800',
  },
];

export default function EssentialInfoSection() {
  return (
    <section className='border-b border-stone-200 bg-stone-100 py-14 md:py-16'>
      <div className='container mx-auto px-4'>
        <div className='mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end'>
          <div>
            <p className='mb-2 text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
              Quick information
            </p>
            <h2 className='text-2xl font-bold text-kapwa-text-strong'>
              Important contacts and locations
            </h2>
            <p className='mt-2 text-kapwa-text-support'>
              Reach the right office without searching through the entire site.
            </p>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          {items.map(item => {
            const Icon = item.icon;
            const content = (
              <>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.accent}`}
                >
                  <Icon className='h-5 w-5' />
                </span>
                <span>
                  <span className='block font-semibold text-kapwa-text-strong'>
                    {item.title}
                  </span>
                  <span className='mt-1 block text-sm leading-relaxed text-kapwa-text-support'>
                    {item.description}
                  </span>
                </span>
              </>
            );
            const classes =
              'flex flex-col gap-3 rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface p-4 transition hover:border-stone-400 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none sm:flex-row';
            return item.external ? (
              <a
                key={item.title}
                href={item.href}
                target='_blank'
                rel='noreferrer'
                className={classes}
              >
                {content}
              </a>
            ) : (
              <Link key={item.title} to={item.href} className={classes}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
