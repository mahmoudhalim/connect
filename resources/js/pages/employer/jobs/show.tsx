import { Head, Link } from '@inertiajs/react';
import EmployerLayout from '@/layouts/EmployerLayout';
import { Button } from '@/components/ui/button';

interface JobPosting {
    id: number;
    title: string;
    description: string;
    location: string;
    employmentType: string;
    workPlaceType: string;
    minSalary: number;
    maxSalary: number;
    status: string;
    experience_level?: string;
    requirements?: string;
    benefits?: string;
    deadline?: string;
    company_logo?: string;
    category?: { id: number; name: string };
    employer: { id: number; name: string };
    created_at: string;
}

interface Props {
    jobPosting: JobPosting;
}

const formatSalary = (min: number, max: number) =>
    `$${min.toLocaleString()} - $${max.toLocaleString()}`;

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

const statusStyles: Record<string, string> = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    closed: 'bg-surface-variant text-on-surface-variant border-outline-variant',
};

export default function Show({ jobPosting }: Props) {
    const statusStyle = statusStyles[jobPosting.status] || statusStyles.pending;

    return (
        <EmployerLayout>
            <Head title={jobPosting.title} />
            <div className="mb-6">
                <Link
                    href="/employer/jobs"
                    className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-3 w-fit"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to my jobs
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-on-surface">{jobPosting.title}</h1>
                                <p className="text-on-surface-variant mt-1">{jobPosting.employer.name}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle}`}>
                                {jobPosting.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant">
                                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Salary</p>
                                <p className="text-sm font-semibold text-on-surface mt-1">{formatSalary(jobPosting.minSalary, jobPosting.maxSalary)}</p>
                            </div>
                            <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant">
                                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Type</p>
                                <p className="text-sm font-semibold text-on-surface mt-1">{jobPosting.employmentType}</p>
                            </div>
                            <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant">
                                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Workplace</p>
                                <p className="text-sm font-semibold text-on-surface mt-1">{jobPosting.workPlaceType}</p>
                            </div>
                            <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant">
                                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Location</p>
                                <p className="text-sm font-semibold text-on-surface mt-1">{jobPosting.location}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-on-surface">Description</h2>
                            <p className="text-on-surface-variant leading-relaxed">{jobPosting.description}</p>
                        </div>

                        {jobPosting.requirements && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-on-surface">Requirements</h2>
                                <div className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">{jobPosting.requirements}</div>
                            </div>
                        )}

                        {jobPosting.benefits && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-on-surface">Benefits</h2>
                                <div className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">{jobPosting.benefits}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Actions</h3>
                        <Link href={`/employer/jobs/${jobPosting.id}/edit`}>
                            <Button className="w-full">Edit Job</Button>
                        </Link>
                    </div>

                    <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-on-surface-variant">Category</span>
                                <span className="text-on-surface font-medium">{jobPosting.category?.name || '—'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-on-surface-variant">Experience</span>
                                <span className="text-on-surface font-medium">{jobPosting.experience_level || '—'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-on-surface-variant">Created</span>
                                <span className="text-on-surface font-medium">{formatDate(jobPosting.created_at)}</span>
                            </div>
                            {jobPosting.deadline && (
                                <div className="flex items-center justify-between">
                                    <span className="text-on-surface-variant">Deadline</span>
                                    <span className="text-on-surface font-medium">{formatDate(jobPosting.deadline)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </EmployerLayout>
    );
}
