import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function AboutPortalSection() {
  return (
    <section className='bg-kapwa-bg-surface py-12 md:py-14'>
      <div className='container mx-auto px-4'>
        <div className='grid gap-6 md:grid-cols-[1fr_auto] md:items-center'>
          <div className='flex max-w-3xl gap-4'>
            <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#dfe9d3] text-kapwa-text-brand'>
              <ShieldCheck className='h-6 w-6' />
            </span>
            <div>
              <h2 className='text-xl font-bold text-kapwa-text-strong'>
                About BetterMeycauayan
              </h2>
              <p className='mt-2 leading-relaxed text-kapwa-text-support'>
                A civic information portal that organizes city services and
                public records so residents can find and understand them more
                easily. Official sources are identified throughout the site.
              </p>
            </div>
          </div>
          <div className='flex flex-wrap gap-3 md:justify-end'>
            <Link
              to='/about'
              className='inline-flex items-center gap-2 rounded-lg border border-kapwa-border-weak bg-kapwa-bg-surface px-4 py-2.5 font-semibold text-kapwa-text-strong hover:border-stone-400'
            >
              About the project <ArrowRight className='h-4 w-4' />
            </Link>
            <Link
              to='/contribute'
              className='inline-flex items-center gap-2 px-3 py-2.5 font-semibold text-kapwa-text-brand hover:underline'
            >
              <HeartHandshake className='h-5 w-5' /> Help improve it
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
