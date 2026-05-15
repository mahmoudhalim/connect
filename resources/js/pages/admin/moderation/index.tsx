import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/Pagination';
import type { PaginatedData } from '@/types';

interface JobPosting {
    id: number;
    title: string;
    location: string;
    employmentType: string;
    workPlaceType: string;
    minSalary: string;
    maxSalary: string;
    status: string;
    created_at: string;
    employer: { id: number; name: string; email: string };
    category: { id: number; name: string } | null;
}

interface Counts {
    pending: number;
    active: number;
    rejected: number;
}

export default function ModerationIndex({
    jobs,
    counts,
    filter,
}: {
    jobs: PaginatedData<JobPosting>;
    counts: Counts;
    filter: string;
}) {
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const tabs = [
        { key: 'pending', label: 'Pending', count: counts.pending },
        { key: 'approved', label: 'Approved', count: counts.active },
        { key: 'rejected', label: 'Rejected', count: counts.rejected },
        { key: 'all', label: 'All', count: null },
    ] as const;

    const setFilter = (f: string) => {
        router.get('/admin/moderation', { filter: f, page: 1 }, { preserveState: true });
    };

    const handleApprove = (job: JobPosting) => {
        router.patch(
            `/admin/moderation/${job.id}/approve`,
            {},
            { onSuccess: () => {} },
        );
    };

    const canReject = (status: string) => {
        return status === 'pending' || status === 'active';
    };

    const openRejectDialog = (job: JobPosting) => {
        setSelectedJob(job);
        setRejectionReason('');
        setRejectDialogOpen(true);
    };

    const handleReject = () => {
        if (!selectedJob) return;
        router.patch(
            `/admin/moderation/${selectedJob.id}/reject`,
            { rejection_reason: rejectionReason },
            {
                onSuccess: () => {
                    setRejectDialogOpen(false);
                    setSelectedJob(null);
                },
            },
        );
    };

    return (
        <>
            <Head title="Moderation Queue" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Moderation Queue</h1>
                        <p className="text-on-surface-variant mt-1 text-sm">
                            Review and approve job postings submitted by employers.
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-outline-variant">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                filter === tab.key
                                    ? 'border-violet-400 text-violet-400'
                                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            {tab.label}
                            {tab.count !== null && (
                                <span className={`rounded-full px-2 py-0.5 text-xs ${
                                    filter === tab.key
                                        ? 'bg-violet-400/20 text-violet-400'
                                        : 'bg-surface-container text-on-surface-variant'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Job List */}
                {jobs.data.length === 0 ? (
                    <div className="flex h-48 items-center justify-center rounded-xl border border-outline-variant bg-surface-container">
                        <p className="text-on-surface-variant">No jobs found.</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {jobs.data.map((job) => (
                                <div
                                    key={job.id}
                                    className="rounded-xl border border-outline-variant bg-surface-container p-6"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-on-surface">{job.title}</h3>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    job.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    job.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {job.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant mb-3">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                    {job.location}
                                                </span>
                                                <span>{job.employmentType}</span>
                                                <span>{job.workPlaceType}</span>
                                                <span>${Number(job.minSalary).toLocaleString()} - ${Number(job.maxSalary).toLocaleString()}</span>
                                                {job.category && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[16px]">category</span>
                                                        {job.category.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-on-surface-variant">
                                                Posted by <span className="font-medium text-on-surface">{job.employer.name}</span> ({job.employer.email})
                                                &nbsp;&bull;&nbsp; {new Date(job.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleApprove(job)}
                                                disabled={job.status !== 'pending'}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openRejectDialog(job)}
                                                disabled={!canReject(job.status)}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination links={jobs.links} />
                    </>
                )}
            </div>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Job Posting</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject "{selectedJob?.title}"?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium text-on-surface mb-2 block">Rejection reason (optional)</label>
                        <Input
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g., Incomplete information, duplicate post..."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject}>Reject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

ModerationIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
