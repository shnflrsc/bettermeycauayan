import { Link } from 'react-router-dom';

import {
  Baby,
  Bone,
  BriefcaseBusiness,
  HeartHandshake,
  HeartPulse,
  Home,
  IdCard,
  Landmark,
} from 'lucide-react';

const lifeEvents = [
  {
    title: 'Get an ID or certificate',
    description: 'Birth, marriage and death records, clearances and local IDs',
    to: '/services?category=certificates-vital-records',
    icon: IdCard,
    accent: 'bg-amber-100 text-amber-800',
  },
  {
    title: 'Start or renew a business',
    description: 'Permits, licenses, clearances and business requirements',
    to: '/services?category=business-trade-investment',
    icon: BriefcaseBusiness,
    accent: 'bg-orange-100 text-orange-800',
  },
  {
    title: 'Get medical help',
    description: 'Consultations, treatment, laboratory and dental services',
    to: '/services?category=health-wellness',
    icon: HeartPulse,
    accent: 'bg-teal-100 text-teal-800',
  },
  {
    title: 'Apply for assistance',
    description: 'Financial, burial, senior, PWD and family support',
    to: '/services?category=social-services-assistance',
    icon: HeartHandshake,
    accent: 'bg-violet-100 text-violet-800',
  },
  {
    title: 'Build or renovate',
    description: 'Building, electrical, occupancy and zoning permits',
    to: '/services?category=infrastructure-public-works',
    icon: Home,
    accent: 'bg-stone-200 text-stone-800',
  },
  {
    title: 'Pay taxes or city fees',
    description: 'Property tax, professional tax, payments and receipts',
    to: '/services?category=taxation-payments',
    icon: Landmark,
    accent: 'bg-slate-200 text-slate-800',
  },
  {
    title: 'Get help for a child or student',
    description: 'Registration, scholarships and youth programs',
    to: '/services?category=education-scholarship',
    icon: Baby,
    accent: 'bg-indigo-100 text-indigo-800',
  },
  {
    title: 'Find services for a pet',
    description: 'Vaccination, microchipping and animal-related services',
    to: '/services?category=health-wellness',
    icon: Bone,
    accent: 'bg-rose-100 text-rose-800',
  },
];

export default function LifeEventsSection() {
  return (
    <section className='bg-kapwa-bg-surface py-14 md:py-16'>
      <div className='container mx-auto px-4'>
        <div className='mb-8 max-w-2xl'>
          <p className='mb-2 text-sm font-bold tracking-wide text-kapwa-text-brand uppercase'>
            Browse by situation
          </p>
          <h2 className='mb-3 text-2xl font-bold text-kapwa-text-strong md:text-3xl'>
            What are you trying to do?
          </h2>
          <p className='text-kapwa-text-support'>
            You do not need to know which city office handles your concern.
            Start with the task that best matches your situation.
          </p>
        </div>

        <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          {lifeEvents.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className='group flex min-w-0 flex-col gap-3 rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-kapwa-border-brand focus-visible:outline-none sm:flex-row'
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.accent}`}
                >
                  <Icon className='h-5 w-5' />
                </span>
                <span className='min-w-0'>
                  <span className='block font-semibold text-kapwa-text-strong'>
                    {item.title}
                  </span>
                  <span className='mt-1 hidden text-xs leading-relaxed text-kapwa-text-support sm:block'>
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
