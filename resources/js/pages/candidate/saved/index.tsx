import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import CandidateLayout from '@/layouts/CandidateLayout';
import Pagination from '@/components/Pagination';
import JobPostingCard from '@/components/JobPostingCard';
import type { PaginatedData } from '@/types/pagination';

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
        company_profile?: {
            location?: string;
        } | null;
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

    const getDaysActive = (createdAt?: string) => {
        if (!createdAt) return 0;
        const created = new Date(createdAt);
        if (Number.isNaN(created.getTime())) return 0;
        const diffMs = Date.now() - created.getTime();
        return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    };

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
                                className={removing === job.id ? 'pointer-events-none opacity-60' : ''}
                            >
                                <JobPostingCard
                                    id={job.id}
                                    title={job.title}
                                    companyName={job.employer?.name}
                                    location={job.employer?.company_profile?.location || job.location}
                                    type={job.employmentType || job.workPlaceType || 'Full Time'}
                                    applicants={0}
                                    daysActive={getDaysActive(job.created_at)}
                                    isNew={getDaysActive(job.created_at) <= 3}
                                    created_at={job.created_at}
                                    isSaved
                                    onToggleSave={handleUnsave}
                                />
                            </div>
                        ))}
                    </div>
                    <Pagination links={savedJobs.links} />
                </>
            )}
        </CandidateLayout>
    );
}
