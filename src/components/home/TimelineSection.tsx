import { Gem, House, LucideIcon, Scroll } from 'lucide-react';

import { config } from '@/lib/lguConfig';
import highlightsData from '@/data/about/highlights.json';
import historyData from '@/data/about/history.json';

const eras = [
  {
    title: 'Foundations and Early Territory',
    description:
      'Meycauayan began as an early Franciscan settlement and became one of the largest towns in historic Bulacan.',
    years: ['1578', '1589', '1606', '1621', '1751', '1754', '1792', '1796'],
  },
  {
    title: 'Revolution and Independence',
    description:
      'Local revolutionaries joined the national struggle for Philippine freedom.',
    years: ['1896'],
  },
  {
    title: 'Destruction and Recovery',
    description:
      'After a devastating fire, Meycauayan rebuilt its infrastructure and strengthened its economy.',
    years: ['1949', '1960s', '1970s'],
  },
  {
    title: 'Cityhood and Modern Meycauayan',
    description:
      'Cityhood marked a new chapter in Meycauayan’s growth as an economic and industrial center.',
    years: ['2006'],
  },
];

const ICON_MAP: Record<string, LucideIcon> = { Scroll, House, Gem };
const highlightLabels: Record<string, string> = {
  'Fine Jewelry Craftsmanship': 'Reputation',
  'A Town Since 1578': 'History',
  "Bulacan's Third City": 'Legacy',
};
const orderedHighlights = [
  ...highlightsData.filter(item => item.title === 'Fine Jewelry Craftsmanship'),
  ...highlightsData.filter(item => item.title === 'A Town Since 1578'),
  ...highlightsData.filter(item => item.title === "Bulacan's Third City"),
];

export default function TimelineSection() {
  return (
    <section className='bg-[#edf3e5] py-14 md:py-20'>
      <div className='container mx-auto px-4'>
        <header className='mx-auto mb-12 max-w-3xl text-center md:mb-16'>
          <p className='mb-2 text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
            More than four centuries of history
          </p>
          <h2 className='text-3xl font-bold text-kapwa-text-strong md:text-4xl'>
            History of {config.lgu.name}
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-base leading-7 text-kapwa-text-support md:text-lg'>
            From a Franciscan settlement founded in 1578 to one of Bulacan’s
            major industrial cities, Meycauayan has developed through centuries
            of expansion, struggle, recovery, and civic progress.
          </p>
        </header>

        <div className='mx-auto max-w-4xl'>
          {eras.map((era, eraIndex) => {
            const events = historyData.filter(event =>
              era.years.includes(event.year)
            );

            return (
              <section
                key={era.title}
                aria-labelledby={`history-era-${eraIndex}`}
                className='border-t border-kapwa-border-weak py-9 first:border-0 first:pt-0 md:py-12'
              >
                <div className='mb-8 md:grid md:grid-cols-[9rem_1fr] md:gap-8'>
                  <p className='text-sm font-bold uppercase tracking-widest text-kapwa-text-brand'>
                    Era {eraIndex + 1}
                  </p>
                  <div>
                    <h3
                      id={`history-era-${eraIndex}`}
                      className='mt-1 text-xl font-bold text-kapwa-text-strong md:mt-0 md:text-2xl'
                    >
                      {era.title}
                    </h3>
                    <p className='mt-2 max-w-2xl leading-6 text-kapwa-text-support'>
                      {era.description}
                    </p>
                  </div>
                </div>

                <ol className='relative space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[0.4375rem] before:w-px before:bg-kapwa-border-brand md:space-y-10 md:before:left-[10.47rem]'>
                  {events.map(event => (
                    <li
                      key={event.year}
                      className='relative grid grid-cols-[1.25rem_1fr] gap-4 md:grid-cols-[9rem_1.25rem_1fr] md:gap-6'
                    >
                      <time className='hidden pt-0.5 text-right text-2xl font-black leading-none text-kapwa-text-brand md:block'>
                        {event.year}
                      </time>
                      <span className='relative z-10 mt-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#edf3e5] ring-2 ring-kapwa-border-brand'>
                        <span className='h-1.5 w-1.5 rounded-full bg-kapwa-bg-brand-default' />
                      </span>
                      <div className='pb-1'>
                        <time className='text-lg font-black text-kapwa-text-brand md:hidden'>
                          {event.year}
                        </time>
                        <h4 className='mt-1 text-lg font-bold leading-snug text-kapwa-text-strong md:mt-0 md:text-xl'>
                          {event.title}
                        </h4>
                        <p className='mt-2 max-w-2xl text-sm leading-6 text-kapwa-text-support md:text-base md:leading-7'>
                          {event.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>

        <div className='mx-auto mt-6 max-w-5xl border-t border-kapwa-border-weak pt-10 md:mt-10 md:pt-12'>
          <h3 className='sr-only'>Meycauayan historical highlights</h3>
          <div className='grid gap-8 md:grid-cols-3 md:gap-10'>
            {orderedHighlights.map(item => {
              const Icon = ICON_MAP[item.icon] || Scroll;
              return (
                <article key={item.title}>
                  <span className='flex h-10 w-10 items-center justify-center rounded-lg bg-kapwa-bg-brand-default text-kapwa-text-inverse'>
                    <Icon className='h-5 w-5' />
                  </span>
                  <p className='mt-4 text-xs font-bold uppercase tracking-widest text-kapwa-text-brand'>
                    {highlightLabels[item.title] || 'City fact'}
                  </p>
                  <h4 className='mt-1 text-lg font-bold text-kapwa-text-strong'>
                    {item.title}
                  </h4>
                  <p className='mt-2 text-sm leading-6 text-kapwa-text-support'>
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
