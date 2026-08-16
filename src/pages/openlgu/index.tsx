import { useEffect, useMemo } from 'react';
import { ArrowRight, BookOpen, ChevronDown } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { parseAsInteger, parseAsStringEnum, useQueryState } from 'nuqs';
import { Badge } from '@/components/ui/Badge';
import SearchInput from '@/components/ui/SearchInput';
import { CardSkeleton } from '@/components/ui/Skeletons';
import type {
  Committee,
  DocumentItem,
  Person,
  Session,
  Term,
} from '@/lib/openlgu';
import { getDocTypeBadgeVariant, getPersonName } from '@/lib/openlgu';
import { cn } from '@/lib/utils';
import DocumentFilters from './components/DocumentFilters';
import type { FilterType } from './layout';

interface LegislationContext {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  authorIds: string[];
  setAuthorIds: (ids: string[]) => void;
  year: string;
  setYear: (year: string) => void;
  documents: DocumentItem[];
  persons: Person[];
  terms: Term[];
  sessions: Session[];
  committees: Committee[];
  isLoading: boolean;
}

type SortOption = 'newest' | 'oldest' | 'number' | 'title';
const documentTypes: Array<{ value: FilterType; label: string }> = [
  { value: 'all', label: 'All documents' },
  { value: 'ordinance', label: 'Ordinances' },
  { value: 'resolution', label: 'Resolutions' },
  { value: 'executive_order', label: 'Executive orders' },
];
const typeLabels = {
  ordinance: 'Ordinance',
  resolution: 'Resolution',
  executive_order: 'Executive order',
} as const;

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-PH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function LegislationIndex() {
  const context = useOutletContext<LegislationContext>();
  const {
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    authorIds,
    setAuthorIds,
    year,
    setYear,
    documents,
    persons,
    isLoading,
  } = context;
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true })
  );
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsStringEnum<SortOption>(['newest', 'oldest', 'number', 'title'])
      .withDefault('newest')
      .withOptions({ clearOnDefault: true })
  );
  const itemsPerPage = 20;

  const authorOptions = useMemo(
    () =>
      persons
        .filter(person =>
          person.roles.some(role =>
            ['councilor', 'vice_mayor', 'mayor'].includes(role)
          )
        )
        .map(person => ({ label: getPersonName(person), value: person.id }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [persons]
  );
  const yearOptions = useMemo(
    () =>
      [
        ...new Set(
          documents
            .map(doc => new Date(doc.date_enacted).getFullYear())
            .filter(Number.isFinite)
            .map(String)
        ),
      ]
        .sort((a, b) => b.localeCompare(a))
        .map(value => ({ label: value, value })),
    [documents]
  );
  const typeCounts = useMemo(
    () => ({
      all: documents.length,
      ordinance: documents.filter(doc => doc.type === 'ordinance').length,
      resolution: documents.filter(doc => doc.type === 'resolution').length,
      executive_order: documents.filter(doc => doc.type === 'executive_order')
        .length,
    }),
    [documents]
  );

  const filteredDocs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return documents
      .filter(doc => {
        const authorNames = doc.author_ids
          .map(id => persons.find(person => person.id === id))
          .filter((person): person is Person => Boolean(person))
          .map(getPersonName)
          .join(' ')
          .toLowerCase();
        const matchesSearch =
          !query ||
          doc.title.toLowerCase().includes(query) ||
          doc.number.toLowerCase().includes(query) ||
          authorNames.includes(query);
        const docYear = new Date(doc.date_enacted).getFullYear().toString();
        return (
          matchesSearch &&
          (filterType === 'all' || doc.type === filterType) &&
          (authorIds.length === 0 ||
            doc.author_ids.some(id => authorIds.includes(id))) &&
          (!year || docYear === year)
        );
      })
      .sort((a, b) => {
        if (sort === 'oldest')
          return a.date_enacted.localeCompare(b.date_enacted);
        if (sort === 'number')
          return a.number.localeCompare(b.number, undefined, { numeric: true });
        if (sort === 'title') return a.title.localeCompare(b.title);
        return b.date_enacted.localeCompare(a.date_enacted);
      });
  }, [authorIds, documents, filterType, persons, searchQuery, sort, year]);

  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / itemsPerPage));
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    if (currentPage !== 1) void setCurrentPage(1);
  }, [authorIds, filterType, searchQuery, sort, year]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (currentPage > totalPages) void setCurrentPage(totalPages);
  }, [currentPage, setCurrentPage, totalPages]);

  const documentLink = (id: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (filterType !== 'all') params.set('type', filterType);
    if (authorIds.length) params.set('authors', authorIds.join(','));
    if (year) params.set('year', year);
    if (sort !== 'newest') params.set('sort', sort);
    if (currentPage > 1) params.set('page', String(currentPage));
    return `documents/${id}${params.size ? `?${params}` : ''}`;
  };

  return (
    <div className='mx-auto max-w-6xl space-y-6'>
      <header className='max-w-3xl'>
        <p className='mb-2 text-sm font-bold tracking-wide text-kapwa-text-brand uppercase'>
          OpenLGU
        </p>
        <h1 className='text-3xl font-extrabold tracking-tight text-kapwa-text-strong md:text-4xl'>
          Local laws and public records
        </h1>
        <p className='mt-3 text-base leading-relaxed text-kapwa-text-support'>
          Find ordinances, resolutions, and executive orders issued by the City
          Government of Meycauayan.
        </p>
      </header>

      <section aria-label='Search and filter documents' className='space-y-4'>
        <SearchInput
          value={searchQuery}
          onChangeValue={setSearchQuery}
          placeholder='Search by title, document number, or author'
          size='lg'
        />
        <div className='flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {documentTypes.map(type => (
            <button
              key={type.value}
              type='button'
              onClick={() => setFilterType(type.value)}
              aria-pressed={filterType === type.value}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                filterType === type.value
                  ? 'border-kapwa-border-brand bg-kapwa-bg-brand-weak text-kapwa-text-brand'
                  : 'border-kapwa-border-weak bg-kapwa-bg-surface text-kapwa-text-support hover:border-kapwa-border-brand hover:text-kapwa-text-strong'
              )}
            >
              {type.label}
              <span className='text-xs tabular-nums opacity-70'>
                {typeCounts[type.value]}
              </span>
            </button>
          ))}
        </div>
        <div className='flex flex-col gap-3 border-y border-kapwa-border-weak py-4 lg:flex-row lg:items-start lg:justify-between'>
          <DocumentFilters
            filterType={filterType}
            setFilterType={setFilterType}
            authorIds={authorIds}
            setAuthorIds={setAuthorIds}
            year={year}
            setYear={setYear}
            authorOptions={authorOptions}
            yearOptions={yearOptions}
          />
          <label className='flex shrink-0 items-center gap-2 text-sm font-medium text-kapwa-text-support'>
            Sort by
            <select
              value={sort}
              onChange={event => setSort(event.target.value as SortOption)}
              className='h-10 rounded-lg border border-kapwa-border-weak bg-kapwa-bg-surface px-3 text-sm font-semibold text-kapwa-text-strong outline-none focus:border-kapwa-border-brand'
            >
              <option value='newest'>Newest first</option>
              <option value='oldest'>Oldest first</option>
              <option value='number'>Document number</option>
              <option value='title'>Title A–Z</option>
            </select>
          </label>
        </div>
      </section>

      <details className='group border-b border-kapwa-border-weak pb-5'>
        <summary className='flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-kapwa-text-support hover:text-kapwa-text-strong'>
          <BookOpen className='h-4 w-4 text-kapwa-text-brand' />
          What is the difference between these documents?
          <ChevronDown className='h-4 w-4 transition-transform group-open:rotate-180' />
        </summary>
        <div className='mt-3 grid gap-3 text-sm leading-relaxed text-kapwa-text-support md:grid-cols-3'>
          <p>
            <strong className='text-kapwa-text-strong'>Ordinances</strong>{' '}
            create local rules and policies.
          </p>
          <p>
            <strong className='text-kapwa-text-strong'>Resolutions</strong>{' '}
            express decisions or positions of the city council.
          </p>
          <p>
            <strong className='text-kapwa-text-strong'>Executive orders</strong>{' '}
            are directives issued by the city mayor.
          </p>
        </div>
      </details>

      <section aria-labelledby='document-results-heading'>
        <div className='mb-3 flex items-end justify-between gap-4'>
          <div>
            <h2
              id='document-results-heading'
              className='text-lg font-bold text-kapwa-text-strong'
            >
              {filterType === 'all' ? 'Public records' : typeLabels[filterType]}
            </h2>
            <p className='text-sm text-kapwa-text-support'>
              {filteredDocs.length.toLocaleString()}{' '}
              {filteredDocs.length === 1 ? 'document' : 'documents'} found
            </p>
          </div>
          {totalPages > 1 && (
            <span className='hidden text-sm text-kapwa-text-disabled sm:block'>
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 8 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : paginatedDocs.length === 0 ? (
          <div className='border-y border-kapwa-border-weak py-16 text-center'>
            <h3 className='text-lg font-bold text-kapwa-text-strong'>
              No documents found
            </h3>
            <p className='mt-2 text-sm text-kapwa-text-support'>
              Try a broader search or clear one of the filters above.
            </p>
          </div>
        ) : (
          <div className='divide-y divide-kapwa-border-weak border-y border-kapwa-border-weak bg-kapwa-bg-surface'>
            {paginatedDocs.map(doc => {
              const authors = doc.author_ids
                .map(id => persons.find(person => person.id === id))
                .filter((person): person is Person => Boolean(person));
              if (
                doc.type === 'executive_order' &&
                !authors.length &&
                doc.mayor_id
              ) {
                const mayor = persons.find(
                  person => person.id === doc.mayor_id
                );
                if (mayor) authors.push(mayor);
              }
              const authorLabel = authors.length
                ? authors.map(getPersonName).join(', ')
                : doc.type === 'executive_order'
                  ? 'Office of the City Mayor'
                  : 'City Government of Meycauayan';
              return (
                <Link
                  key={doc.id}
                  to={documentLink(doc.id)}
                  className='group grid gap-3 px-1 py-5 transition-colors hover:bg-kapwa-bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kapwa-border-focus md:grid-cols-[minmax(0,1fr)_10rem_1.5rem] md:items-center md:px-4'
                >
                  <div className='min-w-0'>
                    <div className='mb-2 flex flex-wrap items-center gap-2'>
                      <Badge variant={getDocTypeBadgeVariant(doc.type)}>
                        {typeLabels[doc.type]}
                      </Badge>
                      <span className='font-mono text-xs font-semibold text-kapwa-text-support'>
                        {doc.number || 'Document record'}
                      </span>
                    </div>
                    <h3 className='line-clamp-3 text-base font-bold leading-snug text-kapwa-text-strong transition-colors group-hover:text-kapwa-text-brand md:text-lg'>
                      {doc.title}
                    </h3>
                    <p className='mt-2 truncate text-sm text-kapwa-text-support'>
                      {authorLabel}
                    </p>
                  </div>
                  <time
                    dateTime={doc.date_enacted}
                    className='text-sm font-medium text-kapwa-text-support md:text-right'
                  >
                    {formatDate(doc.date_enacted)}
                  </time>
                  <ArrowRight className='hidden h-5 w-5 text-kapwa-text-disabled transition-transform group-hover:translate-x-1 group-hover:text-kapwa-text-brand md:block' />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <nav
          aria-label='Document pages'
          className='flex flex-wrap items-center justify-between gap-4 pt-2'
        >
          <p className='text-sm text-kapwa-text-support'>
            Showing {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, filteredDocs.length)} of{' '}
            {filteredDocs.length}
          </p>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className='rounded-lg border border-kapwa-border-weak bg-kapwa-bg-surface px-4 py-2 text-sm font-semibold text-kapwa-text-strong disabled:opacity-40'
            >
              Previous
            </button>
            <span className='px-2 text-sm font-medium text-kapwa-text-support'>
              {currentPage} / {totalPages}
            </span>
            <button
              type='button'
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className='rounded-lg border border-kapwa-border-weak bg-kapwa-bg-surface px-4 py-2 text-sm font-semibold text-kapwa-text-strong disabled:opacity-40'
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
