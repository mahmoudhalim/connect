import { Head, router, usePage } from '@inertiajs/react';
import EmployerLayout from '@/layouts/EmployerLayout';
import Pagination from '@/components/Pagination';
import { formatDate } from '@/lib/utils';
import type { Application, ApplicationStats, JobPostingOption } from '@/types/application';
import type { PaginatedData } from '@/types/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface Filters {
    search?: string;
    status?: string;
    job_posting_id?: string;
}

interface Props {
    applications: PaginatedData<Application>;
    stats: ApplicationStats;
    jobPostings: JobPostingOption[];
    filters?: Filters;
}

const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'under_review', label: 'Pending Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'offer_extended', label: 'Offer Extended' },
    { value: 'rejected', label: 'Rejected' },
];

const statusActions = [
    { value: 'shortlisted', label: 'Shortlist' },
    { value: 'interviewing', label: 'Move to Interview' },
    { value: 'offer_extended', label: 'Extend Offer' },
    { value: 'rejected', label: 'Reject' },
];

const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        under_review: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        shortlisted: 'bg-primary/10 text-primary border-primary/20',
        interviewing: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
        offer_extended: 'bg-green-500/10 text-green-500 border-green-500/20',
        rejected: 'bg-error/10 text-error border-error/20',
        withdrawn: 'bg-surface-variant text-on-surface-variant border-outline-variant',
    };

    const labels: Record<string, string> = {
        under_review: 'Pending Review',
        shortlisted: 'Shortlisted',
        interviewing: 'Interviewing',
        offer_extended: 'Offer Extended',
        rejected: 'Rejected',
        withdrawn: 'Withdrawn',
    };

    const baseClass = 'inline-flex items-center px-2 py-1 rounded text-xs font-medium border';
    return { class: baseClass + ' ' + (styles[status] || styles.under_review), label: labels[status] || status };
};

export default function Index({ applications, stats, jobPostings, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');
    const [jobPostingId, setJobPostingId] = useState(filters?.job_posting_id || 'all');

    const applyFilters = () => {
        const params: Record<string, string> = {};

        if (search) params.search = search;
        if (status !== 'all') params.status = status;
        if (jobPostingId !== 'all') params.job_posting_id = jobPostingId;

        router.get('/employer/applicants', params, {
            preserveState: true,
            replace: true,
        });
    };

    const statsData = [
        { label: 'Total Applicants', value: stats.total, icon: 'groups', color: 'text-on-surface' },
        { label: 'Pending Review', value: stats.pending, icon: 'hourglass_empty', color: 'text-yellow-500', highlight: true },
        { label: 'Shortlisted', value: stats.shortlisted, icon: 'bookmark_added', color: 'text-primary', highlight: true },
    ];

    return (
        <EmployerLayout>
            <Head title="Applicants" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Applicants</h1>
                <p className="text-on-surface-variant">Review and manage candidates across all your active postings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {statsData.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-surface-container border border-outline-variant rounded-lg p-5 flex flex-col hover:border-outline transition-colors relative overflow-hidden"
                    >
                        {stat.highlight && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-current"></div>
                        )}
                        <span className={`text-sm font-medium text-on-surface-variant mb-1 flex items-center gap-2 ${stat.highlight ? 'pl-2' : ''}`}>
                            <span className={`material-symbols-outlined text-sm ${stat.color}`}>{stat.icon}</span>
                            {stat.label}
                        </span>
                        <span className={`text-3xl font-bold text-on-surface ${stat.highlight ? 'pl-2' : ''}`}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-surface border border-outline-variant rounded-t-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96 flex items-center h-10 rounded bg-surface-container-lowest border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                    <div className="grid place-items-center h-full w-10 text-on-surface-variant">
                        <span className="material-symbols-outlined text-lg">search</span>
                    </div>
                    <input
                        className="peer h-full w-full outline-none text-sm text-on-surface bg-transparent pr-2"
                        placeholder="Search candidates by name..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full md:w-48 bg-surface-container-lowest">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={jobPostingId} onValueChange={setJobPostingId}>
                        <SelectTrigger className="w-full md:w-48 bg-surface-container-lowest">
                            <SelectValue placeholder="All Postings" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Postings</SelectItem>
                            {jobPostings.map((job) => (
                                <SelectItem key={job.id} value={String(job.id)}>
                                    {job.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="button" onClick={applyFilters}>
                        Apply
                    </Button>
                </div>
            </div>

            <div className="bg-surface border-x border-b border-outline-variant rounded-b-lg overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-outline-variant text-xs text-on-surface-variant uppercase tracking-wider bg-surface-container-low">
                            <th className="px-6 py-4 font-medium">Candidate</th>
                            <th className="px-6 py-4 font-medium">Applied Role</th>
                            <th className="px-6 py-4 font-medium">Applied Date</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-outline-variant">
                        {applications.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                                    No applicants found.
                                </td>
                            </tr>
                        ) : (
                            applications.data.map((application) => {
                                const statusBadge = getStatusBadge(application.status);
                                const initials = application.candidate.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2);

                                return (
                                    <tr key={application.id} className="hover:bg-surface-container transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant flex-shrink-0 flex items-center justify-center text-on-surface-variant font-bold text-lg">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-on-surface">{application.candidate.name}</p>
                                                    <p className="text-xs text-on-surface-variant">{application.candidate.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-on-surface">{application.job_posting.title}</td>
                                        <td className="px-6 py-4 text-on-surface-variant">{formatDate(application.created_at)}</td>
                                        <td className="px-6 py-4">
                                            <span className={statusBadge.class}>{statusBadge.label}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Select
                                                    value={application.status}
                                                    onValueChange={(newStatus) => {
                                                        router.patch(`/employer/applicants/${application.id}/status`, {
                                                            status: newStatus,
                                                        }, { preserveScroll: true });
                                                    }}
                                                >
                                                    <SelectTrigger className="w-36 h-8 bg-surface-container-lowest text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusActions.map((action) => (
                                                            <SelectItem key={action.value} value={action.value}>
                                                                {action.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
                {applications.last_page > 1 && (
                    <div className="p-4 border-t border-outline-variant flex items-center justify-between text-sm text-on-surface-variant bg-surface-container-low">
                        <span>Showing {applications.data.length} of {applications.total} candidates</span>
                        <Pagination {...applications} />
                    </div>
                )}
            </div>
        </EmployerLayout>
    );
}