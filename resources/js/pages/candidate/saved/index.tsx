import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CandidateLayout from '@/layouts/CandidateLayout';
import Pagination from '@/components/Pagination';
import type { PaginatedData } from '@/types/pagination';
import type { Auth } from '@/types/auth';
import { Button } from '@/components/ui/button';

interface SavedJob {
    id: number;
    title: string;
    location: string;
    employmentType: string;
    workPlaceType: string;
    minSalary: number;
    maxSalary: number;
    employer: {
        id: number;
        name: string;
    };
    category?: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Props {
    savedJobs: PaginatedData<SavedJob>;
}

export default function Saved({ savedJobs }: Props) {
    const [removing, setRemoving] = useState<number | null>(null);

    const handleUnsave = (id: number) => {
        setRemoving(id);
        router.delete(`/candidate/saved/${id}`, {
            preserveScroll: true,
            onFinish: () => setRemoving(null),
        });
    };

    return (
        <CandidateLayout>
            <Head title="Saved Jobs" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-on-surface">
                    Saved Jobs
                </h1>
                <p className="text-on-surface-variant text-sm">
                    Jobs you've bookmarked for later review
                </p>
            </div>

            {savedJobs.data.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-outline-variant bg-surface-container">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">
                            bookmark
                        </span>
                        <p className="text-on-surface-variant">
                            No saved jobs yet. Browse jobs and bookmark the ones
                            you like.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {savedJobs.data.map((job) => (
                            <div
                                key={job.id}
                                className="group relative flex flex-col rounded-xl border border-outline-variant bg-surface-container p-5 transition-colors duration-200 hover:border-primary/50"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-on-surface truncate">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm text-on-surface-variant truncate mt-0.5">
                                            {job.employer?.name || 'Unknown'}
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-primary text-[20px] ml-2">
                                        bookmark
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3 text-xs text-on-surface-variant">
                                    {job.location && (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">
                                                location_on
                                            </span>
                                            {job.location}
                                        </span>
                                    )}
                                    {job.employmentType && (
                                        <span className="px-2 py-0.5 bg-surface-container-lowest border border-outline-variant rounded">
                                            {job.employmentType}
                                        </span>
                                    )}
                                    {job.workPlaceType && (
                                        <span className="px-2 py-0.5 bg-surface-container-lowest border border-outline-variant rounded">
                                            {job.workPlaceType}
                                        </span>
                                    )}
                                </div>

                                {(job.minSalary || job.maxSalary) && (
                                    <p className="text-sm text-on-surface font-medium mb-3">
                                        {job.minSalary
                                            ? `$${job.minSalary.toLocaleString()}`
                                            : ''}
                                        {job.minSalary && job.maxSalary
                                            ? ' - '
                                            : ''}
                                        {job.maxSalary
                                            ? `$${job.maxSalary.toLocaleString()}`
                                            : ''}
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant">
                                    <a
                                        href={`/jobs/${job.id}`}
                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                        View details
                                        <span className="material-symbols-outlined text-base">
                                            arrow_forward
                                        </span>
                                    </a>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleUnsave(job.id)}
                                        disabled={removing === job.id}
                                        className="text-xs text-on-surface-variant hover:text-error"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination links={savedJobs.links} />
                </>
            )}
        </CandidateLayout>
    );
}
