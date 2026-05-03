import { Head } from '@inertiajs/react';
import JobPostingCard from '@/components/JobPostingCard';
import type { JobPostingCardProps } from '@/components/JobPostingCard';
import Pagination from '@/components/Pagination';
import EmployerLayout from '@/layouts/EmployerLayout';
import type { PaginatedData } from '@/types';

export default function index({
    jobs,
}: {
    jobs: PaginatedData<JobPostingCardProps>;
}) {
    return (
        <>
            <Head title="My Postings" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-on-surface">
                    My Postings
                </h1>
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
                            (job: JobPostingCardProps & { id?: number }) => (
                                <JobPostingCard {...job} key={job.id} />
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
