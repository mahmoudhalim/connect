import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import CandidateLayout from '@/layouts/CandidateLayout';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Application } from '@/types/application';

interface Props {
    application: Application;
}

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
        under_review: 'Under Review',
        shortlisted: 'Shortlisted',
        interviewing: 'Interviewing',
        offer_extended: 'Offer Extended',
        rejected: 'Rejected',
        withdrawn: 'Withdrawn',
    };
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
    return { class: baseClass + ' ' + (styles[status] || styles.under_review), label: labels[status] || status };
};

function EditApplicationDialog({
    application,
    open,
    onOpenChange,
}: {
    application: Application;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data, setData, patch, processing, errors } = useForm({
        contact_email: application.contact_email || application.candidate.email || '',
        contact_phone: application.contact_phone || '',
        portfolio_url: application.portfolio_url || '',
        resume: null as File | null,
    });
    const [isDragging, setIsDragging] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/candidate/applications/${application.id}`, {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Application</DialogTitle>
                        <DialogDescription className="text-on-surface-variant">
                            Update your application for <span className="font-medium text-on-surface">{application.job_posting.title}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="contact_email">Email Address <span className="text-error">*</span></Label>
                            <Input id="contact_email" type="email" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} placeholder="jane@example.com" className="bg-surface-container" />
                            {errors.contact_email && <p className="text-sm text-error">{errors.contact_email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contact_phone">Phone Number</Label>
                            <Input id="contact_phone" type="tel" value={data.contact_phone} onChange={(e) => setData('contact_phone', e.target.value)} placeholder="+1 (555) 000-0000" className="bg-surface-container" />
                            {errors.contact_phone && <p className="text-sm text-error">{errors.contact_phone}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="portfolio_url">Portfolio / LinkedIn URL</Label>
                            <Input id="portfolio_url" type="url" value={data.portfolio_url} onChange={(e) => setData('portfolio_url', e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="bg-surface-container" />
                            {errors.portfolio_url && <p className="text-sm text-error">{errors.portfolio_url}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="resume">Resume (optional)</Label>
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-outline-variant hover:border-primary/50'}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    const file = e.dataTransfer.files[0];
                                    if (file && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
                                        setData('resume', file);
                                    }
                                }}
                            >
                                <input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setData('resume', e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <div className="flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-3xl text-on-surface-variant">cloud_upload</span>
                                    <p className="text-sm text-on-surface font-medium">{data.resume ? data.resume.name : 'Drag and drop or click to upload'}</p>
                                    <p className="text-xs text-on-surface-variant">PDF, DOC, DOCX (max 5MB)</p>
                                </div>
                            </div>
                            {errors.resume && <p className="text-sm text-error">{errors.resume}</p>}
                            {application.resume_path && !data.resume && (
                                <p className="text-xs text-on-surface-variant">Current resume saved. Upload a new file to replace it.</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Changes'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function Show({ application }: Props) {
    const [cancelOpen, setCancelOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const statusBadge = getStatusBadge(application.status);
    const profile = application.candidate?.candidate_profile;
    const company = application.job_posting?.employer?.company_profile;

    const handleCancel = () => {
        setCancelling(true);
        router.delete(`/candidate/applications/${application.id}`, {
            preserveScroll: true,
            onFinish: () => setCancelling(false),
        });
    };

    const canEdit = application.status !== 'withdrawn' && application.status !== 'rejected';

    return (
        <>
            <CandidateLayout>
                <Head title={`Application - ${application.job_posting?.title ?? 'Job'}`} />
                <div className="mb-6">
                    <Link
                        href="/candidate/applications"
                        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-3 w-fit"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to applications
                    </Link>
                    <h1 className="text-2xl font-bold text-on-surface">Application Details</h1>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Info Card */}
                        <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-on-surface">
                                        {application.job_posting.title}
                                    </h2>
                                    <p className="text-on-surface-variant mt-1">
                                        {application.job_posting.employer?.name}
                                    </p>
                                </div>
                                <span className={statusBadge.class}>{statusBadge.label}</span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                                {application.job_posting.location && (
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">location_on</span>
                                        {application.job_posting.location}
                                    </span>
                                )}
                                {application.job_posting.employment_type && (
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">work</span>
                                        {application.job_posting.employment_type}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">calendar_today</span>
                                    Applied {formatDate(application.created_at)}
                                </span>
                            </div>
                        </div>

                        {/* Company Info Card */}
                        {company && (
                            <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">About the Company</h3>
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-lg font-bold text-on-surface-variant">
                                        {application.job_posting.employer?.name?.[0] || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-on-surface">{company.company_name || application.job_posting.employer?.name}</p>
                                        {company.company_description && (
                                            <p className="text-sm text-on-surface-variant mt-1">{company.company_description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-on-surface-variant">
                                    {company.website && (
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-base">public</span>
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{company.website.replace(/^https?:\/\//, '')}</a>
                                        </div>
                                    )}
                                    {company.industry && (
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-base">domain</span>
                                            <span>{company.industry}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Actions Card */}
                        <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Actions</h3>
                            {canEdit && (
                                <div className="space-y-3">
                                    <Button type="button" onClick={() => setEditOpen(true)} className="w-full">
                                        Edit Application
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setCancelOpen(true)} className="w-full text-error border-error/50 hover:bg-error/10">
                                        Cancel Application
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Application Info Card */}
                        <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Your Application</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base text-on-surface-variant">mail</span>
                                    <span className="text-on-surface">{application.contact_email || '—'}</span>
                                </div>
                                {application.contact_phone && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base text-on-surface-variant">call</span>
                                        <span className="text-on-surface">{application.contact_phone}</span>
                                    </div>
                                )}
                                {application.portfolio_url && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base text-on-surface-variant">language</span>
                                        <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{application.portfolio_url}</a>
                                    </div>
                                )}
                            </div>
                            {(application.resume_path || profile?.resume_path) && (
                                <a href={`/storage/${application.resume_path || profile?.resume_path}`} target="_blank" rel="noopener noreferrer" className="w-full mt-2 bg-transparent hover:bg-surface-variant text-on-surface border border-outline-variant font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    Download Resume
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </CandidateLayout>

            <EditApplicationDialog application={application} open={editOpen} onOpenChange={setEditOpen} />

            <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Cancel Application</DialogTitle>
                        <DialogDescription className="text-on-surface-variant">
                            Are you sure you want to withdraw your application for{' '}
                            <span className="font-medium text-on-surface">{application.job_posting.title}</span>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setCancelOpen(false)}>Keep Application</Button>
                        <Button type="button" variant="destructive" onClick={handleCancel} disabled={cancelling}>
                            {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
