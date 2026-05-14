import { Head, usePage } from '@inertiajs/react';
import JobsLayout from '@/layouts/JobsLayout';
import CandidateLayout from '@/layouts/CandidateLayout';
import EmployerLayout from '@/layouts/EmployerLayout';
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
    requirements?: string;
    benefits?: string;
    deadline?: string;
    status: string;
    experience_level?: string;
    company_logo?: string;
    category?: { name: string } | null;
    employer: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Props {
    job: Job;
    isSaved?: boolean;
    hasApplied?: boolean;
}

export default function Show({ job, isSaved = false, hasApplied = false }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isCandidateUser = auth?.user?.role === 'candidate';
    const isEmployerUser = auth?.user?.role === 'employer';
    const isAuthenticated = auth?.user !== null && auth?.user !== undefined;

    const content = (
        <>
            <Head title={job.title} />
            <JobPostingShow
                job={job}
                isSaved={isSaved}
                hasApplied={hasApplied}
                showApply={isAuthenticated && !isEmployerUser && !hasApplied}
                showApplyButton={isAuthenticated && !isEmployerUser && !hasApplied}
                showLoginPrompt={!isAuthenticated}
                user={auth?.user}
            />
        </>
    );

    if (isCandidateUser) {
        return <CandidateLayout>{content}</CandidateLayout>;
    }

    if (isEmployerUser) {
        return <EmployerLayout>{content}</EmployerLayout>;
    }

    return <JobsLayout>{content}</JobsLayout>;
}
