import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { formatDate } from '@/lib/utils';

function EmployerActions({ id, status }: { id: number; status: string }) {
    const [open, setOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'delete' | 'close' | 'reopen' | null>(null);
    const [processing, setProcessing] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const handleConfirm = () => {
        if (processing) return;
        setProcessing(true);
        if (confirmAction === 'delete') {
            router.delete(`/employer/jobs/${id}`, {
                onFinish: () => { setConfirmAction(null); setOpen(false); setProcessing(false); },
            });
        } else if (confirmAction === 'close') {
            router.patch(`/employer/jobs/${id}/close`, {
                onFinish: () => { setConfirmAction(null); setOpen(false); setProcessing(false); },
            });
        } else if (confirmAction === 'reopen') {
            router.patch(`/employer/jobs/${id}/reopen`, {
                onFinish: () => { setConfirmAction(null); setOpen(false); setProcessing(false); },
            });
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="rounded p-1 text-on-secondary-container transition-colors hover:bg-surface-container-highest"
                title="Actions"
            >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-outline-variant bg-surface-container shadow-xl">
                    <div className="p-1">
                        <Link
                            href={`/employer/jobs/${id}/edit`}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            <span className="material-symbols-outlined text-[18px]">edit_square</span>
                            Edit
                        </Link>
                        {status === 'closed' ? (
                            <button
                                type="button"
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-tertiary hover:bg-tertiary/10 transition-colors"
                                onClick={() => setConfirmAction('reopen')}
                            >
                                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                                Reopen
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-warning hover:bg-warning/10 transition-colors"
                                onClick={() => setConfirmAction('close')}
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                                Close
                            </button>
                        )}
                        <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                            onClick={() => setConfirmAction('delete')}
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {confirmAction && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => { if (!processing) setConfirmAction(null); }}>
                    <div className="mx-4 w-full max-w-sm rounded-xl border border-outline-variant bg-surface-container p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-on-surface mb-2">
                            {confirmAction === 'delete' ? 'Delete Job Posting' : confirmAction === 'close' ? 'Close Job Posting' : 'Reopen Job Posting'}
                        </h3>
                        <p className="text-sm text-on-surface-variant mb-6">
                            {confirmAction === 'delete'
                                ? 'Are you sure you want to delete this job posting? This action cannot be undone.'
                                : confirmAction === 'close'
                                ? 'Are you sure you want to close this job posting? Candidates will no longer be able to apply.'
                                : 'Are you sure you want to reopen this job posting? It will be set to pending for admin review.'}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                className="rounded px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                                onClick={() => setConfirmAction(null)}
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`rounded px-4 py-2 text-sm text-white transition-colors disabled:opacity-50 ${
                                    confirmAction === 'delete' ? 'bg-error hover:bg-error/90' :
                                    confirmAction === 'close' ? 'bg-warning hover:bg-warning/90' :
                                    'bg-tertiary hover:bg-tertiary/90'
                                }`}
                                onClick={handleConfirm}
                                disabled={processing}
                            >
                                {processing ? 'Processing...' : confirmAction === 'delete' ? 'Delete' : confirmAction === 'close' ? 'Close' : 'Reopen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export interface JobPostingCardProps {
    id: number;
    title?: string;
    companyName?: string;
    status?: 'active' | 'draft' | 'closed' | 'pending';
    location?: string;
    type?: string;
    isNew?: boolean;
    created_at?: string;
    canEdit?: boolean;
    isSaved?: boolean;
    onToggleSave?: (id: number) => void;
}

export default function JobPostingCard({
    id,
    title = 'Product Designer',
    companyName,
    status = 'active',
    location = 'New York, NY',
    type = 'Contract',
    isNew = true,
    created_at,
    canEdit = false,
    isSaved = false,
    onToggleSave,
}: JobPostingCardProps) {
    const postedDate = created_at ? formatDate(created_at) : 'Oct 22, 2023';

    const getStatusColors = () => {
        switch (status) {
            case 'active':
                return 'bg-tertiary-container/20 text-tertiary border-tertiary/20';
            case 'draft':
                return 'bg-surface-variant text-on-surface-variant border-outline-variant';
            case 'closed':
                return 'bg-error-container/20 text-error border-error/20';
            case 'pending':
                return 'bg-warning-container/20 text-warning border-warning/20';
            default:
                return 'bg-tertiary-container/20 text-tertiary border-tertiary/20';
        }
    };

    const getStatusDotColor = () => {
        switch (status) {
            case 'active':
                return 'bg-tertiary';
            case 'draft':
                return 'bg-outline';
            case 'closed':
                return 'bg-error';
            case 'pending':
                return 'bg-warning';
            default:
                return 'bg-tertiary';
        }
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container transition-colors duration-200 hover:border-primary/50">
            <div className={`h-1 w-full ${getStatusDotColor()}`}></div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start justify-between">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColors()}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor()}`}
                        ></span>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <div className="flex items-center gap-1">
                        {onToggleSave && (
                            <button
                                className={`rounded p-1 transition-colors hover:bg-surface-container-highest ${isSaved ? 'text-[#a78bfa]' : 'text-on-secondary-container hover:text-primary'}`}
                                onClick={() => onToggleSave(id)}
                                title={isSaved ? 'Unsave' : 'Save job'}
                            >
                                <span
                                    className={`material-symbols-outlined text-[20px] ${isSaved ? "[font-variation-settings:'FILL'_1]" : ''}`}
                                    data-icon={isSaved ? 'bookmark' : 'bookmark_add'}
                                >
                                    {isSaved ? 'bookmark' : 'bookmark_add'}
                                </span>
                            </button>
                        )}
                        {canEdit && <EmployerActions id={id} status={status} />}
                    </div>
                </div>

                <h3 className="mb-1 text-xl font-semibold text-on-surface transition-colors group-hover:text-primary">
                    {title}
                </h3>
                {companyName && (
                    <p className="text-sm text-on-secondary-container mb-2">
                        {companyName}
                    </p>
                )}

                <div className="mt-2 mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-on-secondary-container">
                    <div className="flex items-center gap-1">
                        <span
                            className="material-symbols-outlined text-[16px]"
                            data-icon="location_on"
                        >
                            location_on
                        </span>
                        {location}
                    </div>
                    <div className="flex items-center gap-1">
                        <span
                            className="material-symbols-outlined text-[16px]"
                            data-icon="schedule"
                        >
                            schedule
                        </span>
                        {type}
                    </div>
                </div>

                <div className="mt-auto"></div>
            </div>

            <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-highest px-5 py-3">
                <div className="text-xs text-on-secondary-container">
                    Posted {postedDate}
                </div>
                <div className="flex gap-2">
                    {canEdit ? (
                        <>
                            <button
                                onClick={() => router.visit(`/employer/jobs/${id}`)}
                                className="rounded border border-outline-variant px-3 py-1.5 text-sm font-medium text-on-surface transition-colors duration-150 hover:bg-surface-container-highest active:scale-95"
                                data-no-nav="true"
                            >
                                View Job
                            </button>
                            <button
                                onClick={() => router.visit(`/employer/applicants?job_id=${id}`)}
                                className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-inverse-on-surface transition-colors duration-150 hover:bg-primary-fixed-dim active:scale-95"
                                data-no-nav="true"
                            >
                                View Applicants
                            </button>
                        </>
                    ) : (
                        <button
                            className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-inverse-on-surface transition-colors duration-150 hover:bg-primary-fixed-dim active:scale-95"
                            onClick={() => router.visit(`/jobs/${id}`)}
                        >
                            View Job
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
