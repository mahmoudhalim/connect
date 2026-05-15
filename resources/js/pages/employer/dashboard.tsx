import { Head, Link } from '@inertiajs/react';
import React from 'react';
import EmployerLayout from '@/layouts/EmployerLayout';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    trend?: { value: string; up?: boolean };
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
    return (
        <div className="bg-surface-container border border-outline-variant rounded p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-on-surface-variant mb-4">
                <span className="text-sm font-medium">{title}</span>
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-on-surface">{value}</span>
                {trend && (
                    <span className={`${trend.up ? 'text-tertiary' : 'text-error'} text-sm flex items-center`}>
                        <span className="material-symbols-outlined text-[16px]">
                            {trend.up ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                        {trend.value}
                    </span>
                )}
            </div>
        </div>
    );
}

interface Application {
    id: number;
    candidate_name: string;
    candidate_headline: string | null;
    job_title: string;
    status: string;
    applied_at: string;
}

interface JobPosting {
    id: number;
    title: string;
    status: string;
    applications_count: number;
    created_at: string;
}

interface Props {
    stats: {
        activeJobs: number;
        totalJobs: number;
        totalApplications: number;
    };
    recentApplications: Application[];
    recentJobs: JobPosting[];
}

const statusColors: Record<string, string> = {
    pending: 'text-yellow-400',
    under_review: 'text-blue-400',
    shortlisted: 'text-violet-400',
    accepted: 'text-green-400',
    rejected: 'text-red-400',
};

export default function EmployerDashboard({ stats, recentApplications, recentJobs }: Props) {
    return (
        <>
            <Head title="Employer Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Dashboard Overview</h1>
                        <p className="text-on-surface-variant mt-1 text-sm">Manage your active postings and candidate pipeline.</p>
                    </div>
                    <Link
                        href="/employer/jobs/create"
                        className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-5 py-2.5 rounded font-medium text-sm transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Post a Job
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Active Jobs" value={stats.activeJobs} icon="work" />
                    <StatCard title="Total Jobs" value={stats.totalJobs} icon="layers" />
                    <StatCard title="Total Applications" value={stats.totalApplications} icon="description" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-surface-container border border-outline-variant rounded p-6">
                        <h2 className="text-lg font-semibold text-on-surface mb-4">Recent Applications</h2>
                        {recentApplications.length === 0 ? (
                            <p className="text-on-surface-variant text-sm">No applications yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentApplications.map((app) => (
                                    <Link
                                        key={app.id}
                                        href={`/employer/applicants/${app.id}`}
                                        className="flex items-center justify-between p-3 rounded border border-outline-variant hover:bg-surface transition-colors"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-on-surface">{app.candidate_name}</p>
                                            {app.candidate_headline && (
                                                <p className="text-xs text-on-surface-variant truncate max-w-xs">{app.candidate_headline}</p>
                                            )}
                                            <p className="text-xs text-on-surface-variant mt-0.5">Applied for: {app.job_title}</p>
                                        </div>
                                        <div className="text-right shrink-0 ml-4">
                                            <span className={`text-xs font-medium ${statusColors[app.status] || 'text-on-surface-variant'}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                            <p className="text-xs text-on-surface-variant mt-0.5">{app.applied_at}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-surface-container border border-outline-variant rounded p-6">
                        <h2 className="text-lg font-semibold text-on-surface mb-4">Recent Job Postings</h2>
                        {recentJobs.length === 0 ? (
                            <p className="text-on-surface-variant text-sm">No job postings yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentJobs.map((job) => (
                                    <Link
                                        key={job.id}
                                        href={`/employer/jobs/${job.id}`}
                                        className="flex items-center justify-between p-3 rounded border border-outline-variant hover:bg-surface transition-colors"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-on-surface">{job.title}</p>
                                            <p className="text-xs text-on-surface-variant mt-0.5">{job.applications_count} application{job.applications_count !== 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="text-right shrink-0 ml-4">
                                            <span className={`text-xs font-medium ${
                                                job.status === 'active' ? 'text-green-400' :
                                                job.status === 'pending' ? 'text-yellow-400' :
                                                'text-on-surface-variant'
                                            }`}>
                                                {job.status}
                                            </span>
                                            <p className="text-xs text-on-surface-variant mt-0.5">{job.created_at}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

EmployerDashboard.layout = (page: React.ReactNode) => <EmployerLayout>{page}</EmployerLayout>;
