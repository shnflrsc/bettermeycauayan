import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPinned, Users } from 'lucide-react';

const destinations = [
  {
    title: 'Meet your city officials',
    description:
      'Know the elected officials serving Meycauayan and their roles.',
    to: '/government/elected-officials',
    icon: Users,
    accent: 'bg-amber-100 text-amber-800',
  },
  {
    title: 'Find a department',
    description: 'See what each city office handles and how to reach it.',
    to: '/government/departments',
    icon: Building2,
    accent: 'bg-stone-200 text-stone-800',
  },
  {
    title: 'Explore the barangays',
    description: 'Browse Meycauayan’s barangays and their local information.',
    to: '/government/barangays',
    icon: MapPinned,
    accent: 'bg-orange-100 text-orange-800',
  },
];

export default function GovernmentSection() {
  return (
    <section className='border-b border-kapwa-border-weak bg-kapwa-bg-surface py-14 md:py-16'>
      <div className='container mx-auto px-4'>
        <div className='mb-7 max-w-2xl'>
          <p className='mb-2 text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
            City Government
          </p>
          <h2 className='text-2xl font-bold text-kapwa-text-strong md:text-3xl'>
            Meet the people serving your city
          </h2>
          <p className='mt-2 text-kapwa-text-support'>
            Find the people, offices, and barangays responsible for serving the
            city.
          </p>
        </div>
        <div className='grid gap-3 md:grid-cols-3'>
          {destinations.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className='group flex gap-4 rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface p-5 transition hover:border-stone-400 hover:shadow-sm'
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${item.accent}`}
                >
                  <Icon className='h-5 w-5' />
                </span>
                <span>
                  <span className='flex items-center gap-2 font-semibold text-kapwa-text-strong'>
                    {item.title}
                    <ArrowRight className='h-4 w-4 text-kapwa-text-brand transition-transform group-hover:translate-x-1' />
                  </span>
                  <span className='mt-1 block text-sm leading-relaxed text-kapwa-text-support'>
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
