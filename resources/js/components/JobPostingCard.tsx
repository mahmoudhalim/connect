import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { formatDate } from '@/lib/utils';

function DeleteButton({ id, onClose }: { id: number; onClose: () => void }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/employer/jobs/${id}`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors"
            onClick={handleDelete}
            disabled={processing}
        >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Delete
        </button>
    );
}

function CloseButton({ id, onClose }: { id: number; onClose: () => void }) {
    const { patch, processing } = useForm();

    const handleClose = () => {
        patch(`/employer/jobs/${id}/close`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-warning hover:bg-warning/10 transition-colors"
            onClick={handleClose}
            disabled={processing}
        >
            <span className="material-symbols-outlined text-[18px]">cancel</span>
            Close
        </button>
    );
}

function EmployerActions({ id, status }: { id: number; status: string }) {
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [closeOpen, setCloseOpen] = useState(false);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        className="rounded p-1 text-on-secondary-container transition-colors hover:bg-surface-container-highest"
                        title="Actions"
                    >
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="min-w-[180px]" style={{ position: 'absolute', right: 0, top: '100%' }}>
                    <div className="p-1">
                        <Link
                            href={`/employer/jobs/${id}/edit`}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            <span className="material-symbols-outlined text-[18px]">edit_square</span>
                            Edit
                        </Link>
                        {status !== 'closed' && (
                            <CloseButton id={id} onClose={() => { setCloseOpen(false); setOpen(false); }} />
                        )}
                        <DeleteButton id={id} onClose={() => { setDeleteOpen(false); setOpen(false); }} />
                    </div>
                </PopoverContent>
            </Popover>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Job Posting</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this job posting? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button
                            className="rounded px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                            onClick={() => setDeleteOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="rounded bg-error px-4 py-2 text-sm text-white hover:bg-error/90 transition-colors"
                            onClick={() => {
                                router.delete(`/employer/jobs/${id}`, {
                                    onSuccess: () => setDeleteOpen(false),
                                });
                            }}
                        >
                            Delete
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
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
                        <button
                            onClick={() => router.visit(`/employer/applicants?job_id=${id}`)}
                            className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-inverse-on-surface transition-colors duration-150 hover:bg-primary-fixed-dim active:scale-95"
                            data-no-nav="true"
                        >
                            View Applicants
                        </button>
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
