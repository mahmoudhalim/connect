import { Head, usePage } from '@inertiajs/react';
import JobsLayout from '@/layouts/JobsLayout';
import CandidateLayout from '@/layouts/CandidateLayout';
import JobPostingShow from '@/components/JobPostingShow';
import type { Auth } from '@/types';

interface Job {
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
    job: Job;
}

export default function Show({ job }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isCandidateUser = auth?.user?.role === 'candidate';
    const isAuthenticated = auth?.user !== null && auth?.user !== undefined;

    const content = (
        <>
            <Head title={job.title} />
            <JobPostingShow
                job={job}
                showApply={isAuthenticated}
                showLoginPrompt={!isAuthenticated}
            />
        </>
    );

    if (isCandidateUser) {
        return <CandidateLayout>{content}</CandidateLayout>;
    }

    return <JobsLayout>{content}</JobsLayout>;
}
