import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Facebook, Newspaper } from 'lucide-react';

import { config } from '@/lib/lguConfig';

const facebookPageUrl =
  'https://www.facebook.com/CITYINFORMATIONANDCOMMUNITYRELATIONSOFFICE';
const facebookEmbedUrl = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
  facebookPageUrl
)}&tabs=timeline&width=500&height=620&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;

export default function NewsSection() {
  const [shouldLoadFeed, setShouldLoadFeed] = useState(false);
  const [feedLoaded, setFeedLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoadFeed(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setShouldLoadFeed(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby='city-updates-title'
      className='border-b border-kapwa-border-weak bg-stone-100 py-14 md:py-16'
    >
      <div className='container mx-auto px-4'>
        <div className='grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(320px,500px)] lg:items-center lg:justify-between'>
          <div className='max-w-2xl'>
            <span className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-800'>
              <Newspaper className='h-6 w-6' />
            </span>
            <p className='mb-2 text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
              Official city updates
            </p>
            <h2
              id='city-updates-title'
              className='text-2xl font-bold text-kapwa-text-strong md:text-3xl'
            >
              Latest from Meycauayan
            </h2>
            <p className='mt-3 leading-relaxed text-kapwa-text-support'>
              Read announcements and community updates from the City Information
              and Community Relations Office’s official Facebook Page.
            </p>

            <div className='mt-6 flex flex-wrap gap-3'>
              <a
                href={config.portal.facebookUrl || facebookPageUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex min-h-11 items-center gap-2 rounded-lg border border-kapwa-border-weak bg-kapwa-bg-surface px-5 py-2.5 font-semibold text-kapwa-text-strong transition hover:border-stone-400 focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none'
              >
                View on Facebook
                <ExternalLink className='h-4 w-4' />
              </a>
            </div>
          </div>

          <div className='mx-auto w-full max-w-[500px]'>
            {shouldLoadFeed ? (
              <div className='relative overflow-hidden rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface shadow-sm'>
                {!feedLoaded && (
                  <div className='absolute inset-x-0 top-0 z-10 flex h-[620px] flex-col items-center justify-center bg-kapwa-bg-surface p-8 text-center'>
                    <span className='flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-sky-100 text-sky-800'>
                      <Facebook className='h-7 w-7' />
                    </span>
                    <p className='mt-4 font-semibold text-kapwa-text-strong'>
                      Loading official updates…
                    </p>
                  </div>
                )}
                <iframe
                  title='Official Meycauayan Facebook Page updates'
                  src={facebookEmbedUrl}
                  width='500'
                  height='620'
                  className='block h-[620px] w-full border-0'
                  scrolling='no'
                  allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
                  loading='lazy'
                  referrerPolicy='strict-origin-when-cross-origin'
                  onLoad={() => setFeedLoaded(true)}
                />
                <div className='border-t border-kapwa-border-weak bg-stone-50 p-3 text-center text-xs text-kapwa-text-support'>
                  If the feed does not appear,{' '}
                  <a
                    href={facebookPageUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-kapwa-text-brand hover:underline'
                  >
                    open it directly on Facebook
                  </a>
                  .
                </div>
              </div>
            ) : (
              <div className='flex min-h-[620px] flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-kapwa-bg-surface p-8 text-center'>
                <span className='flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-800'>
                  <Facebook className='h-7 w-7' />
                </span>
                <h3 className='mt-4 text-lg font-bold text-kapwa-text-strong'>
                  Official updates will load here
                </h3>
                <p className='mt-2 max-w-sm text-sm leading-relaxed text-kapwa-text-support'>
                  The Facebook timeline will load automatically when this
                  section is near your screen.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
