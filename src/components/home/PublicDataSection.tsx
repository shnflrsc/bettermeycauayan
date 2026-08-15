import { Link } from 'react-router-dom';
import { ArrowRight, Building2, FileSearch, Landmark } from 'lucide-react';

const records = [
  {
    title: 'Financial performance',
    description: 'Review city income, expenditures, and financial reports.',
    to: '/transparency/financial',
    icon: Landmark,
  },
  {
    title: 'Procurement records',
    description:
      'Search publicly available city procurement and award information.',
    to: '/transparency/procurement',
    icon: FileSearch,
  },
  {
    title: 'Infrastructure projects',
    description:
      'Explore public works and flood-control projects affecting Meycauayan.',
    to: '/transparency/infrastructure',
    icon: Building2,
  },
];

export default function PublicDataSection() {
  return (
    <section className='bg-[#edf3e5] py-14 md:py-16'>
      <div className='container mx-auto px-4'>
        <div className='grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center'>
          <div>
            <p className='mb-2 text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
              Transparency portal
            </p>
            <h2 className='text-2xl font-bold text-kapwa-text-strong md:text-3xl'>
              See how public money is used
            </h2>
            <p className='mt-3 max-w-xl leading-relaxed text-kapwa-text-support'>
              Explore financial records, procurement awards, and infrastructure
              projects gathered into a more searchable public view.
            </p>
            <Link
              to='/transparency'
              className='mt-5 inline-flex items-center gap-2 font-semibold text-kapwa-text-brand hover:underline'
            >
              Explore the Transparency Portal <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='grid gap-3 sm:grid-cols-3'>
            {records.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className='group rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface p-5 transition hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-md'
                >
                  <span className='mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800'>
                    <Icon className='h-5 w-5' />
                  </span>
                  <h3 className='font-semibold text-kapwa-text-strong'>
                    {item.title}
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-kapwa-text-support'>
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
