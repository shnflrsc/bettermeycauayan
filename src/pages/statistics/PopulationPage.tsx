import { useMemo, useState } from 'react';

import { CHART_THEME, standardAxisProps } from '@/constants/charts';
import { Info, LineChart as LineIcon, TrendingUp, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import {
  ChartTooltip,
  ResponsiveChart,
} from '@/components/data-display/ChartContainer';
import { DetailSection } from '@/components/layout/PageLayouts';

import { cn } from '@/lib/utils';

// Data Import
import populationData from '@/data/statistics/population.json';

export default function PopulationPage() {
  const [activeTab, setActiveTab] = useState<'municipality' | 'barangays'>(
    'municipality'
  );
  const { municipality, barangays, meta } = populationData;

  const latestMuni = municipality.history[municipality.history.length - 1];
  const growth = municipality.growthRates.find(
    r => r.period === '2020-2024'
  )?.rate;
  const rankedBarangays = useMemo(
    () =>
      [...barangays]
        .map(barangay => ({
          name: barangay.name,
          population: barangay.history[barangay.history.length - 1].population,
        }))
        .sort((a, b) => b.population - a.population),
    [barangays]
  );

  return (
    <>
      <header className='mb-7 border-b border-kapwa-border-weak pb-6'>
        <h1 className='text-3xl font-black tracking-tight text-kapwa-text-strong'>
          Demographics
        </h1>
        <p className='mt-2 max-w-2xl text-sm leading-6 text-kapwa-text-support md:text-base'>
          Population changes across Meycauayan and its barangays.
        </p>
        <div className='mt-3 flex flex-wrap gap-2'>
          <Badge variant='primary' dot>
            Census {latestMuni.year}
          </Badge>
          <Badge variant='slate'>{barangays.length} Barangays</Badge>
        </div>
      </header>

      {/* KPI Cards - using new StatCard component */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 mb-kapwa-lg'>
        <StatCard
          label='Total Population'
          value={latestMuni.population.toLocaleString()}
          subtext='Actual Resident Count'
          variant='primary'
          trend={{ value: growth || 0, positive: true }}
        />
        <StatCard
          label='Growth Rate'
          value={`${growth}%`}
          subtext='Annual (2020-2024)'
          variant='secondary'
        />
        <StatCard
          label='Admin Units'
          value={barangays.length}
          subtext='Official Barangays'
          variant='slate'
          icon={Users}
        />
      </div>

      {/* Unified Tab Switcher */}
      <div className='mb-kapwa-lg bg-kapwa-bg-hover flex gap-1.5 rounded-2xl p-1.5'>
        <button
          onClick={() => setActiveTab('municipality')}
          className={cn(
            'flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-widest uppercase transition-all',
            activeTab === 'municipality'
              ? 'text-kapwa-text-brand-bold bg-kapwa-bg-surface shadow-md'
              : 'hover:text-kapwa-text-support text-kapwa-text-strong0'
          )}
        >
          <TrendingUp className='h-4 w-4' /> City population
        </button>
        <button
          onClick={() => setActiveTab('barangays')}
          className={cn(
            'flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-widest uppercase transition-all',
            activeTab === 'barangays'
              ? 'text-kapwa-text-brand-bold bg-kapwa-bg-surface shadow-md'
              : 'hover:text-kapwa-text-support text-kapwa-text-strong0'
          )}
        >
          <LineIcon className='h-4 w-4' /> Barangay ranking
        </button>
      </div>

      {/* Chart wrapped in DetailSection - documented pattern */}
      <DetailSection
        title={
          activeTab === 'municipality'
            ? 'City population over time'
            : `Population by barangay (${latestMuni.year})`
        }
        icon={TrendingUp}
      >
        <ResponsiveChart height={activeTab === 'barangays' ? 600 : 400}>
          {activeTab === 'municipality' ? (
            <LineChart
              data={municipality.history}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke={CHART_THEME.grid}
                strokeDasharray='3 3'
              />
              <XAxis dataKey='year' {...standardAxisProps} dy={10} />
              <YAxis
                {...standardAxisProps}
                tickFormatter={val => `${val / 1000}k`}
              />
              <Tooltip
                content={<ChartTooltip formatter={v => v.toLocaleString()} />}
              />
              <Line
                type='monotone'
                dataKey='population'
                name='Total Residents'
                stroke='var(--color-kapwa-brand-600)'
                strokeWidth={5}
                dot={{
                  fill: 'var(--color-kapwa-brand-600)',
                  r: 4,
                  strokeWidth: 2,
                  stroke: '#fff',
                }}
                activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff' }}
              />
            </LineChart>
          ) : (
            <BarChart
              data={rankedBarangays}
              layout='vertical'
              margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke={CHART_THEME.grid}
                strokeDasharray='3 3'
              />
              <XAxis
                type='number'
                {...standardAxisProps}
                tickFormatter={value => `${Math.round(value / 1000)}k`}
              />
              <YAxis
                type='category'
                dataKey='name'
                width={110}
                {...standardAxisProps}
              />
              <Tooltip
                content={<ChartTooltip formatter={v => v.toLocaleString()} />}
              />
              <Bar
                dataKey='population'
                name='Residents'
                fill='var(--color-kapwa-brand-600)'
                radius={[0, 5, 5, 0]}
              />
            </BarChart>
          )}
        </ResponsiveChart>
      </DetailSection>

      {/* Info box using DetailSection for consistency */}
      <DetailSection title='How to read this data' icon={Info}>
        <p className='text-xs italic leading-relaxed text-kapwa-text-disabled'>
          {activeTab === 'municipality'
            ? 'The citywide growth chart tracks long-term population change from 1903 to the latest available estimate.'
            : 'Barangays are ordered by their latest available population, making differences easier to compare than a multi-line chart.'}
        </p>
      </DetailSection>

      <p className='mt-8 border-t border-kapwa-border-weak pt-5 text-sm text-kapwa-text-support'>
        Source: <span className='font-semibold'>{meta.source}</span>
      </p>
    </>
  );
}
