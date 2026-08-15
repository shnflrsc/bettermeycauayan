import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  Clock,
  Edit3,
  ExternalLink,
  FileText,
  Users,
} from 'lucide-react';

import { useBreadcrumbs } from '@/components/layout';
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/navigation/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { getServiceBySlug } from '@/lib/services';
import { config } from '@/lib/lguConfig';
import { toTitleCase } from '@/lib/stringUtils';
import departmentsData from '@/data/directory/departments.json';
import executiveData from '@/data/directory/executive.json';
import legislativeData from '@/data/directory/legislative.json';
import { SupportingDocumentsDetail } from './components/SupportingDocumentsDetail';
import type { ClientStep, Service, Source } from '@/types/servicesTypes';

export default function ServiceDetail() {
  const { service: slug } = useParams<{ service: string }>();
  const breadcrumbs = useBreadcrumbs();
  if (!slug) return null;
  const service = getServiceBySlug(decodeURIComponent(slug));
  if (!service) return <NotFound />;

  const offices = getOffices(service);
  const related = (service.relatedServices || [])
    .map(getServiceBySlug)
    .filter(Boolean) as Service[];
  const requirementCount =
    service.detailedRequirements?.length || service.requirements?.length || 0;
  const who = service.quickInfo?.whoCanApply || service.whoMayAvail;
  const time = service.quickInfo?.processingTime || service.processingTime;
  const access = service.quickInfo?.appointmentType || service.deliveryChannel;
  const hasProcedure = Boolean(
    service.clientSteps?.length || service.steps?.length
  );

  return (
    <div className='animate-in fade-in mx-auto max-w-5xl space-y-5 duration-300'>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const last = index === breadcrumbs.length - 1;
            return (
              <div key={crumb.href} className='flex items-center gap-2'>
                {index === 0 ? (
                  <BreadcrumbItem>
                    <BreadcrumbHome href={crumb.href} />
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {last ? (
                        <BreadcrumbPage>
                          {service.plainLanguageName || service.service}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </>
                )}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <header className='border-kapwa-border-weak border-b pb-5'>
        <Link
          to='/services'
          className='text-kapwa-text-support hover:text-kapwa-text-brand mb-4 inline-flex items-center gap-2 text-sm font-semibold'
        >
          <ArrowLeft className='h-4 w-4' /> All city services
        </Link>
        <div className='mb-3 flex flex-wrap gap-2'>
          <Badge variant='primary'>{service.category.name}</Badge>
          {service.source === 'citizens-charter' && (
            <Badge variant='success'>Official information</Badge>
          )}
        </div>
        <h1 className='text-kapwa-text-strong max-w-4xl text-2xl leading-tight font-extrabold md:text-3xl'>
          {service.plainLanguageName || service.service}
        </h1>
        {service.description && (
          <p className='text-kapwa-text-support mt-3 max-w-3xl text-sm leading-6 md:text-base'>
            {service.description}
          </p>
        )}
        {service.officeDivision && (
          <p className='text-kapwa-text-support mt-3 flex items-start gap-2 text-sm'>
            <Building2 className='text-kapwa-text-brand mt-0.5 h-4 w-4 shrink-0' />
            <span>
              <b>Responsible office:</b> {service.officeDivision}
            </span>
          </p>
        )}
        {(service.website || service.url) && (
          <a
            href={service.website || service.url}
            target='_blank'
            rel='noreferrer'
            className='bg-kapwa-bg-brand-default text-kapwa-text-inverse mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg px-5 py-2.5 font-semibold hover:opacity-90'
          >
            {service.website
              ? 'Apply or access online'
              : 'View official document'}{' '}
            <ExternalLink className='h-4 w-4' />
          </a>
        )}
      </header>

      <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_13rem]'>
        <main className='min-w-0 space-y-7'>
          <Section id='before-you-apply' number='1' title='Before you apply'>
            <dl className='grid gap-x-8 gap-y-5 sm:grid-cols-2'>
              <Summary icon={Users} label='Who can apply' value={who} />
              <Summary icon={Banknote} label='Fee' value={feeText(service)} />
              <Summary icon={Clock} label='Processing time' value={time} />
              <Summary
                icon={FileText}
                label='Requirements'
                value={
                  requirementCount
                    ? `${requirementCount} listed ${requirementCount === 1 ? 'requirement' : 'requirements'}`
                    : 'No requirements listed'
                }
              />
              {access && (
                <Summary
                  icon={Building2}
                  label='How to access'
                  value={access}
                />
              )}
              {service.quickInfo?.validity && (
                <Summary
                  icon={Clock}
                  label='Validity'
                  value={service.quickInfo.validity}
                />
              )}
            </dl>
          </Section>

          <Section
            id='requirements'
            number='2'
            title='Prepare your requirements'
          >
            {service.detailedRequirements?.length ? (
              <ol className='divide-kapwa-border-weak divide-y'>
                {service.detailedRequirements.map((item, index) => (
                  <li
                    key={index}
                    className='flex gap-3 py-4 first:pt-0 last:pb-0'
                  >
                    <span className='bg-kapwa-bg-brand-weak text-kapwa-text-brand mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold'>
                      {index + 1}
                    </span>
                    <div>
                      <p className='text-kapwa-text-strong leading-6 font-semibold'>
                        {item.requirement}
                      </p>
                      {item.where_to_secure &&
                        item.where_to_secure !== 'None' && (
                          <p className='text-kapwa-text-support mt-1 text-sm'>
                            Get it from: {item.where_to_secure}
                          </p>
                        )}
                      {item.copies && (
                        <p className='text-kapwa-text-brand mt-1 text-sm font-medium'>
                          {item.copies}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : service.requirements?.length ? (
              <ol className='space-y-3'>
                {service.requirements.map((item, index) => (
                  <li key={index} className='flex gap-3'>
                    <Check className='text-kapwa-text-brand mt-1 h-4 w-4 shrink-0' />
                    <span className='text-kapwa-text-strong leading-6'>
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className='text-kapwa-text-support'>
                No documentary requirements are listed.
              </p>
            )}
            {service.supportingDocumentsDetail && (
              <div className='mt-5'>
                <SupportingDocumentsDetail
                  detail={service.supportingDocumentsDetail}
                />
              </div>
            )}
          </Section>

          {hasProcedure && (
            <Section id='procedure' number='3' title='Follow these steps'>
              {service.clientSteps?.length ? (
                <ol className='space-y-6'>
                  {service.clientSteps.map((step, index) => (
                    <Procedure key={index} step={step} index={index} />
                  ))}
                </ol>
              ) : (
                <ol className='space-y-5'>
                  {service.steps?.map((step, index) => (
                    <li key={index} className='flex gap-4'>
                      <StepNumber number={index + 1} />
                      <p className='text-kapwa-text-strong pt-0.5 leading-6'>
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </Section>
          )}

          {hasProcedure && (
            <Section id='outcome' number='4' title='What happens next'>
              <p className='text-kapwa-text-support leading-7'>
                After you complete the listed steps, the responsible office will
                finish the request, release the document or service when
                applicable, and advise you of any follow-up action.
              </p>
            </Section>
          )}

          {service.faqs?.length ? (
            <Section id='questions' title='Common questions'>
              <div className='divide-kapwa-border-weak divide-y'>
                {service.faqs.map((faq, index) => (
                  <details
                    key={index}
                    className='group py-4 first:pt-0 last:pb-0'
                  >
                    <summary className='text-kapwa-text-strong flex cursor-pointer list-none items-center justify-between gap-4 font-semibold'>
                      {faq.question}
                      <ChevronDown className='h-4 w-4 shrink-0 transition-transform group-open:rotate-180' />
                    </summary>
                    <p className='text-kapwa-text-support mt-3 leading-6'>
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </Section>
          ) : null}

          <References service={service} offices={offices} related={related} />
        </main>

        <aside className='hidden lg:block'>
          <nav className='sticky top-24 space-y-1 border-l border-kapwa-border-weak pl-4 text-sm'>
            <p className='text-kapwa-text-strong mb-2 font-bold'>
              On this page
            </p>
            <PageLink href='#before-you-apply'>Before you apply</PageLink>
            <PageLink href='#requirements'>Requirements</PageLink>
            {hasProcedure && <PageLink href='#procedure'>Steps</PageLink>}
            {hasProcedure && (
              <PageLink href='#outcome'>What happens next</PageLink>
            )}
            {service.faqs?.length ? (
              <PageLink href='#questions'>Questions</PageLink>
            ) : null}
            <PageLink href='#reference'>Official details</PageLink>
          </nav>
        </aside>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className='mx-auto max-w-3xl py-20 text-center'>
      <h1 className='text-kapwa-text-strong text-2xl font-bold'>
        Service not found
      </h1>
      <Link
        to='/services'
        className='text-kapwa-text-brand mt-4 inline-flex items-center gap-2 font-semibold hover:underline'
      >
        <ArrowLeft className='h-4 w-4' /> Return to city services
      </Link>
    </div>
  );
}

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className='border-kapwa-border-weak scroll-mt-24 rounded-xl border bg-kapwa-bg-surface p-5 md:p-6'
    >
      <h2 className='text-kapwa-text-strong mb-5 flex items-center gap-3 text-xl font-bold'>
        {number && (
          <span className='bg-kapwa-bg-brand-default text-kapwa-text-inverse flex h-7 w-7 items-center justify-center rounded-full text-sm'>
            {number}
          </span>
        )}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value?: string;
}) {
  return (
    <div className='flex gap-3'>
      <Icon className='text-kapwa-text-brand mt-0.5 h-5 w-5 shrink-0' />
      <div>
        <dt className='text-kapwa-text-support text-sm font-medium'>{label}</dt>
        <dd className='text-kapwa-text-strong mt-0.5 leading-6 font-semibold'>
          {value || 'Confirm with the responsible office'}
        </dd>
      </div>
    </div>
  );
}

function Procedure({ step, index }: { step: ClientStep; index: number }) {
  const residentAction =
    typeof step.step === 'string' ? step.step : step.action;
  const officeAction = typeof step.step === 'string' ? step.action : undefined;
  return (
    <li className='flex gap-4'>
      <StepNumber number={index + 1} />
      <div className='min-w-0 flex-1 border-b border-kapwa-border-weak pb-6 last:border-0 last:pb-0'>
        <p className='text-kapwa-text-support text-xs font-bold uppercase tracking-wide'>
          You do
        </p>
        <p className='text-kapwa-text-strong mt-1 leading-6 font-semibold'>
          {residentAction}
        </p>
        {officeAction && (
          <div className='mt-3 rounded-lg bg-kapwa-bg-surface-raised px-4 py-3'>
            <p className='text-kapwa-text-support text-xs font-bold uppercase tracking-wide'>
              The office does
            </p>
            <p className='text-kapwa-text-support mt-1 text-sm leading-6'>
              {officeAction}
            </p>
          </div>
        )}
        {step.sub_steps?.length ? (
          <ul className='text-kapwa-text-support mt-3 space-y-2 text-sm'>
            {step.sub_steps.map((sub, i) => (
              <li key={i} className='flex gap-2'>
                <b>{sub.letter}.</b>
                <span>{sub.action}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {step.processing_time && (
          <p className='text-kapwa-text-brand mt-3 inline-flex items-center gap-1.5 text-sm font-semibold'>
            <Clock className='h-4 w-4' />
            {step.processing_time}
          </p>
        )}
      </div>
    </li>
  );
}

function StepNumber({ number }: { number: number }) {
  return (
    <span className='border-kapwa-border-brand text-kapwa-text-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold'>
      {number}
    </span>
  );
}

function References({
  service,
  offices,
  related,
}: {
  service: Service;
  offices: ReturnType<typeof getOffices>;
  related: Service[];
}) {
  return (
    <section id='reference' className='scroll-mt-24 space-y-3'>
      <h2 className='text-kapwa-text-strong flex items-center gap-2 text-lg font-bold'>
        <BookOpen className='text-kapwa-text-brand h-5 w-5' />
        Official details and references
      </h2>
      <details className='group border-kapwa-border-weak rounded-xl border bg-kapwa-bg-surface'>
        <summary className='flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-semibold'>
          Responsible office and record details
          <ChevronDown className='h-4 w-4 transition-transform group-open:rotate-180' />
        </summary>
        <div className='border-kapwa-border-weak space-y-5 border-t p-4 text-sm'>
          {offices.length > 0 && (
            <div>
              <p className='text-kapwa-text-support mb-2 font-semibold'>
                Responsible office
              </p>
              {offices.map(office => (
                <Link
                  key={office.slug}
                  to={office.path}
                  className='text-kapwa-text-brand flex items-center gap-1 font-semibold hover:underline'
                >
                  {toTitleCase(office.name)}
                  <ArrowRight className='h-3 w-3' />
                </Link>
              ))}
            </div>
          )}
          <dl className='grid gap-3 sm:grid-cols-2'>
            {service.serviceNumber && (
              <Record label='Service number' value={service.serviceNumber} />
            )}
            {service.classification && (
              <Record label='Classification' value={service.classification} />
            )}
            {service.typeOfTransaction && (
              <Record
                label='Transaction type'
                value={service.typeOfTransaction}
              />
            )}
            {service.updatedAt && (
              <Record label='Last updated' value={service.updatedAt} />
            )}
          </dl>
          {service.sources?.length ? (
            <Sources sources={service.sources} />
          ) : null}
        </div>
      </details>
      {related.length > 0 && (
        <details className='group border-kapwa-border-weak rounded-xl border bg-kapwa-bg-surface'>
          <summary className='flex cursor-pointer list-none items-center justify-between p-4 font-semibold'>
            Related services
            <ChevronDown className='h-4 w-4 transition-transform group-open:rotate-180' />
          </summary>
          <div className='border-kapwa-border-weak space-y-2 border-t p-4'>
            {related.map(item => (
              <Link
                key={item.slug}
                to={`/services/${item.slug}`}
                className='text-kapwa-text-brand block font-semibold hover:underline'
              >
                {item.plainLanguageName || item.service}
              </Link>
            ))}
          </div>
        </details>
      )}
      <a
        href={`${config.portal.githubUrl}/issues/new?template=contribution.yml&title=${encodeURIComponent(`[Edit] ${service.service}`)}`}
        target='_blank'
        rel='noopener noreferrer'
        className='text-kapwa-text-support hover:text-kapwa-text-brand inline-flex items-center gap-2 py-2 text-sm font-semibold'
      >
        <Edit3 className='h-4 w-4' />
        Report incorrect or outdated information
      </a>
    </section>
  );
}

function Record({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className='text-kapwa-text-support'>{label}</dt>
      <dd className='text-kapwa-text-strong mt-0.5 font-semibold'>{value}</dd>
    </div>
  );
}
function Sources({ sources }: { sources: Source[] }) {
  return (
    <div>
      <p className='text-kapwa-text-support mb-2 font-semibold'>Sources</p>
      {sources.map((source, index) =>
        source.url ? (
          <a
            key={index}
            href={source.url}
            target='_blank'
            rel='noreferrer'
            className='text-kapwa-text-brand flex items-start gap-1 font-semibold hover:underline'
          >
            {source.name}
            <ExternalLink className='mt-0.5 h-3 w-3' />
          </a>
        ) : (
          <p key={index}>{source.name}</p>
        )
      )}
    </div>
  );
}
function PageLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className='text-kapwa-text-support hover:text-kapwa-text-brand block rounded px-2 py-1.5'
    >
      {children}
    </a>
  );
}

function feeText(service: Service) {
  if (service.quickInfo?.fee) return service.quickInfo.fee;
  if (service.fees) {
    const { amount, description } = service.fees;
    if (amount === 0 || amount === '0') return 'Free';
    if (amount !== null && amount !== '')
      return `${amount}${description ? ` — ${description}` : ''}`;
    if (description) return description;
  }
  return service.feeSchedule?.length
    ? 'Varies — see the official fee schedule'
    : 'No fee listed';
}
function getOffices(service: Service) {
  const slugs = Array.isArray(service.officeSlug)
    ? service.officeSlug
    : [service.officeSlug].filter(Boolean);
  return [
    ...departmentsData
      .filter(x => slugs.includes(x.slug))
      .map(x => ({
        slug: x.slug,
        name: x.office_name,
        path: `/government/departments/${x.slug}`,
      })),
    ...executiveData
      .filter(x => slugs.includes(x.slug))
      .map(x => ({
        slug: x.slug,
        name: x.role,
        path: `/government/executive/${x.slug}`,
      })),
    ...legislativeData
      .filter(x => slugs.includes(x.slug))
      .map(x => ({
        slug: x.slug,
        name: x.chamber,
        path: `/government/legislative/${x.slug}`,
      })),
  ];
}
