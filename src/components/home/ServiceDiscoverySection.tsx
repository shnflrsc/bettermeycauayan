import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bone,
  Building2,
  HeartPulse,
  Leaf,
  Lightbulb,
  PawPrint,
  Sprout,
  Users,
} from 'lucide-react';

import mergedServicesData from '@/data/citizens-charter/merged-services.json';
import type { Service } from '@/types/servicesTypes';

const featured = [
  {
    slug: 'microchip-implantation-for-dogs',
    teaser:
      'Help identify and protect your dog through the city’s microchipping service.',
    icon: PawPrint,
    accent: 'bg-amber-100 text-amber-800',
  },
  {
    slug: 'vegetable-seedlings-distribution',
    teaser:
      'Residents can request vegetable seedlings to start or support a home garden.',
    icon: Sprout,
    accent: 'bg-lime-100 text-lime-800',
  },
  {
    slug: 'city-health-units',
    teaser:
      'Find the City Health Unit assigned to your barangay and see available care.',
    icon: HeartPulse,
    accent: 'bg-rose-100 text-rose-800',
  },
  {
    slug: 'meycauayan-convention-center-reservation',
    teaser:
      'See how residents and organizations can reserve the city convention center.',
    icon: Building2,
    accent: 'bg-violet-100 text-violet-800',
  },
  {
    slug: 'anti-rabies-vaccination-for-walk-in-dog-cat-owners',
    teaser:
      'Protect dogs, cats, and the community through walk-in anti-rabies vaccination.',
    icon: Bone,
    accent: 'bg-orange-100 text-orange-800',
  },
  {
    slug: 'livelihood-assistance-registration',
    teaser:
      'Learn how eligible residents can register for livelihood assistance opportunities.',
    icon: Users,
    accent: 'bg-sky-100 text-sky-800',
  },
  {
    slug: 'seminar-and-training-for-urban-gardening-and-other-topics-related-to-agri-aqua-production-implementation',
    teaser:
      'Join city-led learning sessions on urban gardening and agri-aqua production.',
    icon: Leaf,
    accent: 'bg-emerald-100 text-emerald-800',
  },
];

export default function ServiceDiscoverySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const services = useMemo(() => {
    const all = mergedServicesData as Service[];
    return featured
      .map(feature => {
        const service = all.find(item => item.slug === feature.slug);
        return service ? { ...feature, service } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (services.length < 2 || paused || manual || reduceMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setActiveIndex(current => (current + 1) % services.length);
      }
    }, 9000);
    return () => window.clearInterval(timer);
  }, [manual, paused, reduceMotion, services.length]);

  if (!services.length) return null;

  const item = services[activeIndex];
  const Icon = item.icon;
  const name = item.service.plainLanguageName || item.service.service;
  const usefulFact =
    item.service.quickInfo?.fee ||
    item.service.processingTime ||
    item.service.deliveryChannel;

  const move = (direction: number) => {
    setManual(true);
    setActiveIndex(
      current => (current + direction + services.length) % services.length
    );
  };

  return (
    <div
      ref={cardRef}
      className='animate-slide-in overflow-hidden rounded-2xl border border-kapwa-border-weak bg-kapwa-bg-surface shadow-sm'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={event => {
        if (!cardRef.current?.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div className='border-b border-kapwa-border-weak bg-stone-50 px-5 py-4 sm:px-6'>
        <p className='flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
          <Lightbulb className='h-4 w-4' /> Explore services
        </p>
        <p className='mt-1 text-sm text-kapwa-text-support'>
          Discover something the city can help you with.
        </p>
      </div>

      <Link
        key={item.slug}
        to={`/services/${item.slug}`}
        className='group block p-5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-kapwa-border-brand focus-visible:outline-none sm:p-6'
      >
        <div className='flex items-start justify-between gap-3'>
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.accent}`}
          >
            <Icon className='h-6 w-6' />
          </span>
          <span className='rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-kapwa-text-support'>
            {item.service.category.name}
          </span>
        </div>
        <h2 className='mt-5 text-2xl font-bold leading-tight text-kapwa-text-strong group-hover:text-kapwa-text-brand'>
          {name}
        </h2>
        <p className='mt-3 min-h-12 text-sm leading-relaxed text-kapwa-text-support sm:text-base'>
          {item.teaser}
        </p>
        <div className='mt-6 flex items-end justify-between gap-3'>
          <span className='text-xs font-semibold text-kapwa-text-support'>
            {usefulFact || 'View requirements and steps'}
          </span>
          <span className='flex shrink-0 items-center gap-1 text-sm font-semibold text-kapwa-text-brand'>
            View service
            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </span>
        </div>
      </Link>

      <div className='flex items-center justify-between border-t border-kapwa-border-weak bg-stone-50 px-4 py-3'>
        <button
          type='button'
          aria-label='Previous featured service'
          onClick={() => move(-1)}
          className='flex h-9 w-9 items-center justify-center rounded-full text-kapwa-text-support hover:bg-kapwa-bg-surface hover:text-kapwa-text-brand focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none'
        >
          <ArrowLeft className='h-4 w-4' />
        </button>
        <div
          className='flex items-center gap-1.5'
          aria-label={`Featured service ${activeIndex + 1} of ${services.length}`}
        >
          {services.map((service, index) => (
            <button
              key={service.slug}
              type='button'
              aria-label={`Show featured service ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => {
                setManual(true);
                setActiveIndex(index);
              }}
              className={`h-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none ${index === activeIndex ? 'w-6 bg-kapwa-bg-brand-default' : 'w-2 bg-stone-300 hover:bg-stone-400'}`}
            />
          ))}
        </div>
        <button
          type='button'
          aria-label='Next featured service'
          onClick={() => move(1)}
          className='flex h-9 w-9 items-center justify-center rounded-full text-kapwa-text-support hover:bg-kapwa-bg-surface hover:text-kapwa-text-brand focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none'
        >
          <ArrowRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
