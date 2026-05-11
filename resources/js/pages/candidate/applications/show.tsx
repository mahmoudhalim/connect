import { Head, Link } from '@inertiajs/react';
import CandidateLayout from '@/layouts/CandidateLayout';
import { formatDate } from '@/lib/utils';
import type { Application } from '@/types/application';

interface Props {
    application: Application;
}

const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        under_review: 'bg-surface-variant text-on-surface-variant border-outline-variant',
        shortlisted: 'bg-primary/10 text-primary border-primary/20',
        interviewing: 'bg-tertiary/10 text-tertiary border-tertiary/20',
        offer_extended: 'bg-primary/20 text-primary-fixed border-primary/30',
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

export default function Show({ application }: Props) {
    const statusBadge = getStatusBadge(application.status);

    return (
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
                <h1 className="text-2xl font-bold text-on-surface">{application.job_posting?.title}</h1>
                <p className="text-on-surface-variant text-sm">{application.job_posting?.employer?.name}</p>
            </div>

            <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-6 max-w-2xl">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Status</span>
                    <span className={statusBadge.class}>{statusBadge.label}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Applied</span>
                    <span className="text-sm text-on-surface">{formatDate(application.created_at)}</span>
                </div>
                {application.resume_path && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-on-surface-variant">Resume</span>
                        <a
                            href={`/storage/${application.resume_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                        >
                            Download
                        </a>
                    </div>
                )}
            </div>
        </CandidateLayout>
    );
}
