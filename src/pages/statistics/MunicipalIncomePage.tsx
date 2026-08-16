import { useMemo } from 'react';

import { Coins, Landmark, Wallet } from 'lucide-react';

import { StatGrid } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { DetailSection } from '@/components/layout/PageLayouts';

import FinancialPieChart from '@/pages/transparency/components/FinancialPieChart';

import { formatPesoAdaptive } from '@/lib/format';

import ariData from '@/data/statistics/ari.json';

const COLORS = {
  national: '#4f772d',
  local: '#cc3e00',
  special: '#059669',
  other: '#64748b',
};

export default function MunicipalIncomePage() {
  const data = ariData[0];

  const drillDownIncomeData = useMemo(
    () => [
      {
        name: 'National Tax Allotment',
        value: data.other_income_sources.national_tax_allotment,
        color: COLORS.national,
      },
      {
        name: 'Locally Sourced Revenue',
        value: data.locally_sourced_revenue.total_locally_sourced_revenue,
        color: COLORS.local,
        details: [
          {
            name: 'Tax Revenue',
            value: data.locally_sourced_revenue.tax_revenue.total_tax_revenue,
          },
          {
            name: 'Non-Tax Revenue',
            value:
              data.locally_sourced_revenue.non_tax_revenue
                .total_non_tax_revenue,
          },
        ],
      },
      {
        name: 'Other National Shares',
        value:
          data.other_shares_from_national_tax_collection.total_other_shares,
        color: COLORS.special,
      },
      {
        name: 'Interest Income',
        value: data.other_income_sources.interest_income,
        color: COLORS.other,
      },
    ],
    [data]
  );

  return (
    <>
      <header className='mb-7 border-b border-kapwa-border-weak pb-6'>
        <h1 className='text-3xl font-black tracking-tight text-kapwa-text-strong'>
          City finances
        </h1>
        <p className='mt-2 max-w-2xl text-sm leading-6 text-kapwa-text-support md:text-base'>
          Where Meycauayan’s income comes from and how much is raised locally.
        </p>
        <div className='mt-3 flex flex-wrap gap-2'>
          <Badge variant='primary' dot>
            {data.period}
          </Badge>
          <Badge variant='slate'>BLGF Data</Badge>
        </div>
      </header>

      {/* KPI Cards - using StatGrid with StatCard */}
      <div className='mb-kapwa-lg'>
        <StatGrid
          columns={3}
          stats={[
            {
              label: 'Total Income',
              value: formatPesoAdaptive(
                data.summary_indicators.annual_regular_income * 1_000_000
              ).fullString,
              subtext: 'Annual Revenue',
              variant: 'primary',
            },
            {
              label: 'Locally Sourced Revenue Share',
              value: `${data.summary_indicators.dependency_rates.lsr_dependency}`,
              subtext: 'Share raised by the city',
              variant: 'secondary',
            },
            {
              label: 'National Allotment Share',
              value: `${data.summary_indicators.dependency_rates.nta_dependency}`,
              subtext: 'Share received through NTA',
              variant: 'slate',
              icon: Wallet,
            },
          ]}
        />
      </div>

      {/* Chart wrapped in DetailSection */}
      <div className='mb-kapwa-lg'>
        <DetailSection title='Revenue Composition' icon={Landmark}>
          <div className='flex justify-center'>
            <FinancialPieChart
              title='Overview'
              icon={Landmark}
              data={drillDownIncomeData}
              colors={[
                COLORS.national,
                COLORS.local,
                COLORS.special,
                COLORS.other,
              ]}
            />
          </div>
        </DetailSection>
      </div>

      {/* Full Financial Itemization */}
      <DetailSection title='Full Financial Itemization' icon={Coins}>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='space-y-4'>
            <h4 className='text-kapwa-text-accent-orange border-b pb-2 text-[10px] font-black tracking-widest uppercase'>
              Local Tax
            </h4>
            <div className='text-kapwa-text-support space-y-2 text-sm font-bold'>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Real Property</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.locally_sourced_revenue.tax_revenue
                        .real_property_tax_general_fund
                    ).fullString
                  }
                </span>
              </div>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Business Tax</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.locally_sourced_revenue.tax_revenue.tax_on_business
                    ).fullString
                  }
                </span>
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <h4 className='text-kapwa-text-brand border-b pb-2 text-[10px] font-black tracking-widest uppercase'>
              Non-Tax
            </h4>
            <div className='text-kapwa-text-support space-y-2 text-sm font-bold'>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Fees</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.locally_sourced_revenue.non_tax_revenue
                        .regulatory_fees
                    ).fullString
                  }
                </span>
              </div>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Enterprises</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.locally_sourced_revenue.non_tax_revenue
                        .receipts_from_economic_enterprises
                    ).fullString
                  }
                </span>
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <h4 className='border-b pb-2 text-[10px] font-black tracking-widest text-kapwa-text-success uppercase'>
              External
            </h4>
            <div className='text-kapwa-text-support space-y-2 text-sm font-bold'>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Allotment</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.other_income_sources.national_tax_allotment
                    ).fullString
                  }
                </span>
              </div>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Other Shares</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.other_shares_from_national_tax_collection
                        .total_other_shares
                    ).fullString
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </DetailSection>

      <p className='mt-8 border-t border-kapwa-border-weak pt-5 text-sm text-kapwa-text-support'>
        Source:{' '}
        <a
          href='https://data.bettergov.ph/datasets/9/resources/31'
          target='_blank'
          rel='noreferrer'
          className='hover:text-kapwa-text-brand underline'
        >
          Bureau of Local Government Finance (BLGF)
        </a>
      </p>
    </>
  );
}
