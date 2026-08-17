import { ArrowRight, FileSearch, HardHat, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const records = [
  {
    label: 'Budget & finances',
    detail: 'Income, spending, and fund balances',
    to: '/transparency/financial',
    icon: Landmark,
  },
  {
    label: 'Procurement',
    detail: 'Awarded contracts and suppliers',
    to: '/transparency/procurement',
    icon: FileSearch,
  },
  {
    label: 'Infrastructure',
    detail: 'DPWH projects, costs, and status',
    to: '/transparency/infrastructure',
    icon: HardHat,
  },
];

export default function PublicDataSection() {
  return (
    <section className='bg-[#f2f5ed] py-14 md:py-20'>
      <div className='container mx-auto px-4'>
        <div className='mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div className='max-w-2xl'>
            <p className='mb-2 text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
              Transparency portal
            </p>
            <h2 className='text-2xl font-bold leading-tight text-kapwa-text-strong md:text-4xl'>
              See the records behind public spending
            </h2>
            <p className='mt-3 max-w-xl leading-relaxed text-kapwa-text-support'>
              Move from the big picture to individual contracts and projects
              using public financial and government datasets.
            </p>
          </div>
          <Link
            to='/transparency'
            className='inline-flex shrink-0 items-center gap-2 text-sm font-bold text-kapwa-text-brand hover:underline'
          >
            Transparency overview <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
        <div className='grid overflow-hidden rounded-2xl border border-kapwa-border-weak bg-kapwa-bg-surface sm:grid-cols-3'>
          {records.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex min-h-48 flex-col justify-between p-6 transition hover:bg-kapwa-bg-surface-raised ${index ? 'border-t border-kapwa-border-weak sm:border-l sm:border-t-0' : ''}`}
              >
                <div className='flex items-start justify-between'>
                  <Icon className='h-6 w-6 text-kapwa-text-brand' />
                  <ArrowRight className='h-5 w-5 text-kapwa-text-disabled transition-transform group-hover:translate-x-1 group-hover:text-kapwa-text-brand' />
                </div>
                <div>
                  <h3 className='text-lg font-bold text-kapwa-text-strong'>
                    {item.label}
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-kapwa-text-support'>
                    {item.detail}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <p className='mt-5 max-w-3xl text-xs leading-relaxed text-kapwa-text-disabled'>
          BetterMeycauayan is an independent civic project. Each portal page
          identifies its public data source so residents can verify the original
          record.
        </p>
      </div>
    </section>
  );
}
