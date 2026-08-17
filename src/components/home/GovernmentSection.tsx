import { ArrowUpRight, Building2, MapPinned, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const destinations = [
  {
    title: 'Elected officials',
    description: 'Meet the mayor, vice mayor, and city council.',
    to: '/government/elected-officials',
    icon: Users,
    number: '01',
  },
  {
    title: 'City departments',
    description: 'Find the office responsible for the help you need.',
    to: '/government/departments',
    icon: Building2,
    number: '02',
  },
  {
    title: 'Barangay directory',
    description: 'Browse local information for Meycauayan’s barangays.',
    to: '/government/barangays',
    icon: MapPinned,
    number: '03',
  },
];

export default function GovernmentSection() {
  return (
    <section className='border-b border-kapwa-border-weak bg-kapwa-bg-surface py-14 md:py-20'>
      <div className='container mx-auto px-4'>
        <div className='grid gap-9 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16'>
          <div className='lg:sticky lg:top-24 lg:self-start'>
            <p className='mb-2 text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
              City government
            </p>
            <h2 className='max-w-md text-2xl font-bold leading-tight text-kapwa-text-strong md:text-4xl'>
              Know who serves your community
            </h2>
            <p className='mt-4 max-w-md leading-relaxed text-kapwa-text-support'>
              Go directly to the people, offices, and local communities that
              make up the City Government of Meycauayan.
            </p>
            <Link
              to='/government'
              className='mt-6 inline-flex items-center gap-2 text-sm font-bold text-kapwa-text-brand hover:underline'
            >
              City government overview <ArrowUpRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='divide-y divide-kapwa-border-weak border-y border-kapwa-border-weak'>
            {destinations.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className='group grid grid-cols-[2rem_2.75rem_minmax(0,1fr)_1.5rem] items-center gap-3 py-5 transition-colors hover:bg-kapwa-bg-surface-raised sm:gap-5 sm:px-4 sm:py-6'
                >
                  <span className='text-xs font-bold tabular-nums text-kapwa-text-disabled'>
                    {item.number}
                  </span>
                  <span className='flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-kapwa-text-strong'>
                    <Icon className='h-5 w-5' />
                  </span>
                  <span>
                    <strong className='block text-base text-kapwa-text-strong transition-colors group-hover:text-kapwa-text-brand sm:text-lg'>
                      {item.title}
                    </strong>
                    <span className='mt-1 block text-sm leading-relaxed text-kapwa-text-support'>
                      {item.description}
                    </span>
                  </span>
                  <ArrowUpRight className='h-5 w-5 text-kapwa-text-disabled transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-kapwa-text-brand' />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
