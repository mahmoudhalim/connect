import { Head, usePage } from '@inertiajs/react';
import JobPostingCard from '@/components/JobPostingCard';
import type { JobPostingCardProps } from '@/components/JobPostingCard';
import Pagination from '@/components/Pagination';
import JobsLayout from '@/layouts/JobsLayout';
import CandidateLayout from '@/layouts/CandidateLayout';
import type { PaginatedData, Auth } from '@/types';

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

interface Props {
    jobs: PaginatedData<JobData>;
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

export default function Index({ jobs }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isCandidateUser = auth?.user?.role === 'candidate';

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
