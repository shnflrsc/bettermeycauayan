import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

export default function OpenLGUSection() {
  return (
    <section className='bg-kapwa-bg-surface py-14 md:py-16'>
      <div className='container mx-auto px-4'>
        <div className='grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center'>
          <div className='max-w-2xl'>
            <p className='mb-2 text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
              OpenLGU public records
            </p>
            <h2 className='text-2xl font-bold text-kapwa-text-strong md:text-3xl'>
              Read Meycauayan’s local laws and decisions
            </h2>
            <p className='mt-3 leading-relaxed text-kapwa-text-support'>
              Search ordinances, resolutions, and executive orders without
              opening dozens of separate documents.
            </p>
          </div>
          <Link
            to='/openlgu'
            className='inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-kapwa-bg-brand-default px-5 py-3 font-semibold text-kapwa-text-inverse hover:bg-kapwa-bg-brand-hover'
          >
            <Search className='h-5 w-5' /> Search public documents{' '}
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </section>
  );
}
