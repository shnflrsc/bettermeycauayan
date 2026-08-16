import { Link } from 'react-router-dom';
import { ArrowRight, Landmark, TrendingUp, Trophy, Users } from 'lucide-react';

import { formatPesoAdaptive } from '@/lib/format';

import ariData from '@/data/statistics/ari.json';
import cmciData from '@/data/statistics/cmci.json';
import populationData from '@/data/statistics/population.json';

export default function StatisticsIndex() {
  const latestPopulation =
    populationData.municipality.history[
      populationData.municipality.history.length - 1
    ];
  const growth = populationData.municipality.growthRates.find(
    item => item.period === '2020-2024'
  )?.rate;
  const finance = ariData[0];
  const latestCmciIndex = cmciData.meta.years.length - 1;

  const facts = [
    {
      label: 'Population',
      value: latestPopulation.population.toLocaleString(),
      note: `${latestPopulation.year} estimate`,
    },
    {
      label: 'Annual growth',
      value: `${growth ?? 0}%`,
      note: '2020–2024',
    },
    {
      label: 'Barangays',
      value: populationData.barangays.length.toString(),
      note: 'Administrative units',
    },
    {
      label: 'Annual city income',
      value: formatPesoAdaptive(
        finance.summary_indicators.annual_regular_income * 1_000_000
      ).fullString,
      note: finance.period,
    },
    {
      label: 'CMCI score',
      value: cmciData.overall_score[latestCmciIndex].toFixed(2),
      note: cmciData.meta.years[latestCmciIndex].toString(),
    },
  ];

  const sections = [
    {
      title: 'Demographics',
      description:
        'See how Meycauayan’s population has changed and compare its barangays.',
      to: '/statistics/population',
      icon: Users,
    },
    {
      title: 'City finances',
      description:
        'Understand where city income comes from and how locally raised revenue compares.',
      to: '/statistics/municipal-income',
      icon: Landmark,
    },
    {
      title: 'Competitiveness',
      description:
        'Explore Meycauayan’s CMCI score, rank, development pillars, and trends.',
      to: '/statistics/competitiveness',
      icon: Trophy,
    },
  ];

  return (
    <div>
      <header className='max-w-3xl'>
        <p className='text-sm font-bold uppercase tracking-wide text-kapwa-text-brand'>
          Meycauayan at a glance
        </p>
        <h1 className='mt-2 text-3xl font-black tracking-tight text-kapwa-text-strong md:text-4xl'>
          Understand the city through its data
        </h1>
        <p className='mt-3 max-w-2xl leading-7 text-kapwa-text-support'>
          Explore population, city finances, and competitiveness indicators in
          clear, resident-friendly summaries sourced from public datasets.
        </p>
      </header>

      <section aria-labelledby='key-city-facts' className='mt-8'>
        <h2 id='key-city-facts' className='sr-only'>
          Key city facts
        </h2>
        <dl className='grid gap-px overflow-hidden rounded-xl border border-kapwa-border-weak bg-kapwa-border-weak sm:grid-cols-2 lg:grid-cols-5'>
          {facts.map(fact => (
            <div key={fact.label} className='bg-kapwa-bg-surface p-5'>
              <dt className='text-xs font-bold uppercase tracking-wide text-kapwa-text-support'>
                {fact.label}
              </dt>
              <dd className='mt-2 text-2xl font-black text-kapwa-text-strong'>
                {fact.value}
              </dd>
              <p className='mt-1 text-xs text-kapwa-text-disabled'>
                {fact.note}
              </p>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby='explore-city-data' className='mt-10'>
        <div className='flex items-center gap-2'>
          <TrendingUp className='h-5 w-5 text-kapwa-text-brand' />
          <h2
            id='explore-city-data'
            className='text-xl font-bold text-kapwa-text-strong'
          >
            Explore city data
          </h2>
        </div>
        <div className='mt-4 grid gap-3 md:grid-cols-3'>
          {sections.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className='group flex gap-4 rounded-xl border border-kapwa-border-weak bg-kapwa-bg-surface p-5 transition hover:border-kapwa-border-brand hover:shadow-sm'
              >
                <Icon className='mt-0.5 h-5 w-5 shrink-0 text-kapwa-text-brand' />
                <span className='min-w-0'>
                  <span className='flex items-center justify-between gap-2 font-bold text-kapwa-text-strong group-hover:text-kapwa-text-brand'>
                    {item.title}
                    <ArrowRight className='h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1' />
                  </span>
                  <span className='mt-1.5 block text-sm leading-6 text-kapwa-text-support'>
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <p className='mt-10 border-t border-kapwa-border-weak pt-6 text-sm leading-6 text-kapwa-text-support'>
        Reporting years vary by dataset. Each section identifies its source and
        latest available reporting period.
      </p>
    </div>
  );
}
