import {
  ArrowRight,
  ExternalLink,
  FileText,
  HardHat,
  Landmark,
  ShoppingBag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { config } from '@/lib/lguConfig';

const sections = [
  {
    title: 'Budget & finances',
    description:
      'Understand city income, spending, and fund balances using official financial reports.',
    detail: 'Annual financial reports',
    icon: Landmark,
    href: '/transparency/financial',
  },
  {
    title: 'Procurement',
    description:
      'Search awarded government contracts and see who supplied goods, services, and public works.',
    detail: 'PhilGEPS award records',
    icon: ShoppingBag,
    href: '/transparency/procurement',
  },
  {
    title: 'Infrastructure projects',
    description:
      'Find DPWH projects affecting Meycauayan, including their cost, location, and reported status.',
    detail: 'National infrastructure records',
    icon: HardHat,
    href: '/transparency/infrastructure',
  },
];

export default function TransparencyIndex() {
  return (
    <div className='mx-auto max-w-6xl space-y-10'>
      <header className='max-w-3xl'>
        <p className='mb-2 text-sm font-bold tracking-wide text-kapwa-text-brand uppercase'>
          Public information
        </p>
        <h1 className='text-3xl font-extrabold tracking-tight text-kapwa-text-strong md:text-4xl'>
          Follow Meycauayan’s public money and projects
        </h1>
        <p className='mt-3 text-base leading-relaxed text-kapwa-text-support'>
          Explore financial reports, awarded contracts, and infrastructure
          records in a format designed to be easier to search and understand.
        </p>
      </header>

      <section aria-labelledby='transparency-sections-heading'>
        <h2 id='transparency-sections-heading' className='sr-only'>
          Transparency sections
        </h2>
        <div className='divide-y divide-kapwa-border-weak border-y border-kapwa-border-weak bg-kapwa-bg-surface'>
          {sections.map(section => (
            <Link
              key={section.href}
              to={section.href}
              className='group grid gap-4 px-1 py-6 transition-colors hover:bg-kapwa-bg-surface-raised md:grid-cols-[3rem_minmax(0,1fr)_13rem_1.5rem] md:items-center md:px-5'
            >
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-kapwa-bg-brand-weak text-kapwa-text-brand'>
                <section.icon className='h-5 w-5' />
              </div>
              <div>
                <h3 className='text-lg font-bold text-kapwa-text-strong group-hover:text-kapwa-text-brand'>
                  {section.title}
                </h3>
                <p className='mt-1 max-w-2xl text-sm leading-relaxed text-kapwa-text-support'>
                  {section.description}
                </p>
              </div>
              <span className='text-sm font-medium text-kapwa-text-support'>
                {section.detail}
              </span>
              <ArrowRight className='hidden h-5 w-5 text-kapwa-text-disabled transition-transform group-hover:translate-x-1 group-hover:text-kapwa-text-brand md:block' />
            </Link>
          ))}
        </div>
      </section>

      <aside className='grid gap-6 border-t border-kapwa-border-weak pt-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-start'>
        <div className='flex gap-3'>
          <FileText className='mt-0.5 h-5 w-5 shrink-0 text-kapwa-text-brand' />
          <div>
            <h2 className='font-bold text-kapwa-text-strong'>
              About this data
            </h2>
            <p className='mt-1 max-w-3xl text-sm leading-relaxed text-kapwa-text-support'>
              BetterMeycauayan is an independent civic project, not an official
              government portal. Records are presented from public government
              datasets and may have reporting delays or incomplete fields.
              Follow the source links on each page to verify a record.
            </p>
          </div>
        </div>
        <a
          href={`${config.portal.githubUrl}/issues`}
          target='_blank'
          rel='noreferrer'
          className='inline-flex items-center justify-center gap-2 rounded-lg border border-kapwa-border-weak bg-kapwa-bg-surface px-4 py-2.5 text-sm font-semibold text-kapwa-text-strong hover:border-kapwa-border-brand hover:text-kapwa-text-brand'
        >
          Report a data problem <ExternalLink className='h-4 w-4' />
        </a>
      </aside>
    </div>
  );
}
