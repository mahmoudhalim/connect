import { Head, router, usePage } from '@inertiajs/react';
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
    };
    created_at: string;
}

interface Filters {
    search?: string;
    location?: string;
    employmentType?: string;
    workPlaceType?: string;
    minSalary?: number | string;
}

interface Props {
    jobs: PaginatedData<JobData>;
    filters?: Filters;
}

function mapJobToCardProps(job: JobData): JobPostingCardProps {
    return {
        id: job.id,
        title: job.title,
        location: job.location,
        type: job.employmentType,
        status: job.status === 'active' ? 'Active' : 'Closed',
        created_at: job.created_at,
    };
}

export default function Index({ jobs, filters }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isCandidateUser = auth?.user?.role === 'candidate';
    const [search, setSearch] = useState(filters?.search ?? '');
    const [location, setLocation] = useState(filters?.location ?? '');
    const [employmentType, setEmploymentType] = useState(
        filters?.employmentType ?? 'all',
    );
    const [workPlaceType, setWorkPlaceType] = useState(
        filters?.workPlaceType ?? 'all',
    );
    const [minSalary, setMinSalary] = useState(filters?.minSalary ?? '');

    const activeFilterCount = useMemo(() => {
        return [
            search,
            location,
            employmentType !== 'all' ? employmentType : '',
            workPlaceType !== 'all' ? workPlaceType : '',
            minSalary,
        ].filter((value) => String(value || '').trim().length > 0).length;
    }, [
        search,
        location,
        employmentType,
        workPlaceType,
        minSalary,
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                                {...mapJobToCardProps(job)}
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
