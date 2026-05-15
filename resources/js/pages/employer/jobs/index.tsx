import { Head, router } from '@inertiajs/react';
import JobPostingCard from '@/components/JobPostingCard';
import type { JobPostingCardProps } from '@/components/JobPostingCard';
import Pagination from '@/components/Pagination';
import EmployerLayout from '@/layouts/EmployerLayout';
import type { PaginatedData } from '@/types';
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

interface Filters {
    search?: string;
    location?: string;
    employmentType?: string;
    workPlaceType?: string;
    minSalary?: number | string;
    status?: string;
}

export default function index({
    jobs,
    filters,
}: {
    jobs: PaginatedData<JobPostingCardProps>;
    filters?: Filters;
}) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [location, setLocation] = useState(filters?.location ?? '');
    const [employmentType, setEmploymentType] = useState(
        filters?.employmentType ?? 'all',
    );
    const [workPlaceType, setWorkPlaceType] = useState(
        filters?.workPlaceType ?? 'all',
    );
    const [minSalary, setMinSalary] = useState(filters?.minSalary ?? '');
    const [status, setStatus] = useState(filters?.status ?? 'all');

    const activeFilterCount = useMemo(() => {
        return [
            search,
            location,
            employmentType !== 'all' ? employmentType : '',
            workPlaceType !== 'all' ? workPlaceType : '',
            minSalary,
            status !== 'all' ? status : '',
        ].filter((value) => String(value || '').trim().length > 0).length;
    }, [
        search,
        location,
        employmentType,
        workPlaceType,
        minSalary,
        status,
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
        if (status !== 'all') {
            params.status = status;
        }

        router.get('/employer/jobs', params, {
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
        setStatus('all');
        router.get(
            '/employer/jobs',
            {},
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="My Postings" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-on-surface">
                    My Postings
                </h1>
            </div>
            <div className="mb-8 rounded-2xl border border-outline-variant bg-surface-container p-5 shadow-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-on-surface">
                                Filter postings
                            </p>
                            <p className="text-xs text-on-surface-variant">
                                Track and manage your active pipeline
                            </p>
                        </div>
                        {activeFilterCount > 0 && (
                            <div className="rounded-full bg-secondary-container/20 px-3 py-1 text-xs font-semibold text-secondary">
                                {activeFilterCount} active
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
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
                                Status
                            </label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full bg-surface-container-lowest">
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any</SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="closed">
                                        Closed
                                    </SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
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
                                    <SelectItem value="full-time">
                                        Full-time
                                    </SelectItem>
                                    <SelectItem value="part-time">
                                        Part-time
                                    </SelectItem>
                                    <SelectItem value="contract">
                                        Contract
                                    </SelectItem>
                                    <SelectItem value="freelance">
                                        Freelance
                                    </SelectItem>
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
                                    <SelectItem value="remote">
                                        Remote
                                    </SelectItem>
                                    <SelectItem value="hybrid">
                                        Hybrid
                                    </SelectItem>
                                    <SelectItem value="onsite">
                                        On-site
                                    </SelectItem>
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
                        No jobs posted yet.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.data.map(
                            (job: JobPostingCardProps & { id?: number; employmentType?: string }) => (
                                <JobPostingCard {...job} type={job.employmentType} canEdit={true} key={job.id} />
                            ),
                        )}
                    </div>
                    <Pagination links={jobs.links} />
                </>
            )}
        </>
    );
}

index.layout = (page: React.ReactNode) => (
    <EmployerLayout>{page}</EmployerLayout>
);
