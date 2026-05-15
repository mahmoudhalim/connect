import { Head, router, usePage } from '@inertiajs/react';
import { useCallback } from 'react';
import JobPostingCard from '@/components/JobPostingCard';
import type { JobPostingCardProps } from '@/components/JobPostingCard';
import Pagination from '@/components/Pagination';
import JobsLayout from '@/layouts/JobsLayout';
import CandidateLayout from '@/layouts/CandidateLayout';
import type { PaginatedData, Auth } from '@/types';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';

interface JobData {
    id: number;
    title: string;
    location: string;
    employmentType: string;
    workPlaceType: string;
    minSalary: number;
    maxSalary: number;
    description: string;
    status: string;
    employer: {
        id: number;
        name: string;
        company_profile?: {
            location?: string;
        } | null;
    };
    created_at: string;
    category?: {
        id: number;
        name: string;
        icon: string;
    };
    experience_level?: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

interface Filters {
    search?: string;
    location?: string;
    employmentType?: string;
    workPlaceType?: string;
    minSalary?: number | string;
    maxSalary?: number | string;
    category_id?: number | string;
    experience_level?: string;
    datePosted?: string;
    status?: string;
}

interface Props {
    jobs: PaginatedData<JobData>;
    filters?: Filters;
    categories?: Category[];
    savedIds?: number[];
}

function mapJobToCardProps(job: JobData, isSaved: boolean): JobPostingCardProps {
    return {
        id: job.id,
        title: job.title,
        companyName: job.employer?.name,
        location: job.employer?.company_profile?.location || job.location,
        type: job.employmentType,
        status: job.status as JobPostingCardProps['status'],
        created_at: job.created_at,
        isSaved,
    };
}

export default function Index({ jobs, filters, categories, savedIds: initialSavedIds = [] }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isCandidateUser = auth?.user?.role === 'candidate';
    const [savedIds, setSavedIds] = useState(initialSavedIds);

    const handleToggleSave = useCallback(async (id: number) => {
        const isSaved = savedIds.includes(id);
        setSavedIds(prev => isSaved ? prev.filter(sid => sid !== id) : [...prev, id]);
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await fetch(`/candidate/saved/${id}`, {
                method: isSaved ? 'DELETE' : 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                },
                body: isSaved ? undefined : '{}',
            });
        } catch { }
    }, [savedIds]);

    const [search, setSearch] = useState(filters?.search ?? '');
    const [location, setLocation] = useState(filters?.location ?? '');
    const [employmentType, setEmploymentType] = useState(
        filters?.employmentType ?? 'all',
    );
    const [workPlaceType, setWorkPlaceType] = useState(
        filters?.workPlaceType ?? 'all',
    );
    const [minSalary, setMinSalary] = useState(filters?.minSalary ?? '');
    const [maxSalary, setMaxSalary] = useState(filters?.maxSalary ?? '');
    const [categoryId, setCategoryId] = useState<number | string>(
        filters?.category_id ?? 'all',
    );
    const [experienceLevel, setExperienceLevel] = useState(
        filters?.experience_level ?? 'all',
    );
    const [datePosted, setDatePosted] = useState(
        filters?.datePosted ?? 'all',
    );

    const activeFilterCount = useMemo(() => {
        return [
            search,
            location,
            employmentType !== 'all' ? employmentType : '',
            workPlaceType !== 'all' ? workPlaceType : '',
            minSalary,
            maxSalary,
            categoryId !== 'all' ? categoryId : '',
            experienceLevel !== 'all' ? experienceLevel : '',
            datePosted !== 'all' ? datePosted : '',
        ].filter((value) => String(value || '').trim().length > 0).length;
    }, [
        search,
        location,
        employmentType,
        workPlaceType,
        minSalary,
        maxSalary,
        categoryId,
        experienceLevel,
        datePosted,
    ]);

    const applyFilters = () => {
        const params: Record<string, string> = {};

        if (search) {
            params.search = search;
        }
        if (location) {
            params.location = location;
        }
        if (employmentType !== 'all') {
            params.employmentType = employmentType;
        }
        if (workPlaceType !== 'all') {
            params.workPlaceType = workPlaceType;
        }
        if (minSalary) {
            params.minSalary = String(minSalary);
        }
        if (maxSalary) {
            params.maxSalary = String(maxSalary);
        }
        if (categoryId !== 'all') {
            params.category_id = String(categoryId);
        }
        if (experienceLevel !== 'all') {
            params.experience_level = experienceLevel;
        }
        if (datePosted !== 'all') {
            params.datePosted = datePosted;
        }

        router.get('/jobs', params, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setLocation('');
        setEmploymentType('all');
        setWorkPlaceType('all');
        setMinSalary('');
        setMaxSalary('');
        setCategoryId('all');
        setExperienceLevel('all');
        setDatePosted('all');
        router.get('/jobs', {}, { preserveState: true, replace: true });
    };

    const content = (
        <>
            <Head title="Browse Jobs" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-on-surface">
                    Browse Jobs
                </h1>
                <p className="text-on-surface-variant">
                    Find your next opportunity from our active job listings
                </p>
            </div>
            <div className="mb-8 rounded-2xl border border-outline-variant bg-surface-container p-5 shadow-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-on-surface">
                                Search filters
                            </p>
                            <p className="text-xs text-on-surface-variant">
                                Narrow down by role, location, and more
                            </p>
                        </div>
                        {activeFilterCount > 0 && (
                            <div className="rounded-full bg-secondary-container/20 px-3 py-1 text-xs font-semibold text-secondary">
                                {activeFilterCount} active
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="lg:col-span-2">
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Role or keywords
                            </label>
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search titles or descriptions"
                                className="bg-surface-container-lowest"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Location
                            </label>
                            <Input
                                value={location}
                                onChange={(event) =>
                                    setLocation(event.target.value)
                                }
                                placeholder="City or country"
                                className="bg-surface-container-lowest"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Category
                            </label>
                            <Select
                                value={String(categoryId)}
                                onValueChange={setCategoryId}
                            >
                                <SelectTrigger className="w-full bg-surface-container-lowest">
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {categories?.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Employment type
                            </label>
                            <Select
                                value={employmentType}
                                onValueChange={setEmploymentType}
                            >
                                <SelectTrigger className="w-full bg-surface-container-lowest">
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any</SelectItem>
                                    <SelectItem value="full-time">Full-time</SelectItem>
                                    <SelectItem value="part-time">Part-time</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="freelance">Freelance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Workplace
                            </label>
                            <Select
                                value={workPlaceType}
                                onValueChange={setWorkPlaceType}
                            >
                                <SelectTrigger className="w-full bg-surface-container-lowest">
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any</SelectItem>
                                    <SelectItem value="remote">Remote</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                    <SelectItem value="onsite">On-site</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Experience level
                            </label>
                            <Select
                                value={experienceLevel}
                                onValueChange={setExperienceLevel}
                            >
                                <SelectTrigger className="w-full bg-surface-container-lowest">
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any</SelectItem>
                                    <SelectItem value="entry">Entry</SelectItem>
                                    <SelectItem value="mid">Mid</SelectItem>
                                    <SelectItem value="senior">Senior</SelectItem>
                                    <SelectItem value="lead">Lead</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Date posted
                            </label>
                            <Select
                                value={datePosted}
                                onValueChange={setDatePosted}
                            >
                                <SelectTrigger className="w-full bg-surface-container-lowest">
                                    <SelectValue placeholder="Any time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any time</SelectItem>
                                    <SelectItem value="1">Last 24 hours</SelectItem>
                                    <SelectItem value="7">Last 7 days</SelectItem>
                                    <SelectItem value="14">Last 14 days</SelectItem>
                                    <SelectItem value="30">Last 30 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Min salary
                            </label>
                            <Input
                                type="number"
                                value={minSalary}
                                onChange={(event) =>
                                    setMinSalary(event.target.value)
                                }
                                placeholder="e.g. 60000"
                                className="bg-surface-container-lowest"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Max salary
                            </label>
                            <Input
                                type="number"
                                value={maxSalary}
                                onChange={(event) =>
                                    setMaxSalary(event.target.value)
                                }
                                placeholder="e.g. 150000"
                                className="bg-surface-container-lowest"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" onClick={applyFilters}>
                            Apply filters
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetFilters}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
            {jobs.data.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-outline-variant bg-surface-container">
                    <p className="text-on-surface-variant">
                        No jobs available at the moment. Check back later!
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.data.map((job: JobData) => (
                            <JobPostingCard
                                {...mapJobToCardProps(job, savedIds.includes(job.id))}
                                onToggleSave={isCandidateUser ? handleToggleSave : undefined}
                                key={job.id}
                            />
                        ))}
                    </div>
                    <Pagination links={jobs.links} />
                </>
            )}
        </>
    );

    if (isCandidateUser) {
        return <CandidateLayout>{content}</CandidateLayout>;
    }

    return <JobsLayout>{content}</JobsLayout>;
}
