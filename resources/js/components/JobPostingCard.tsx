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
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

function DeleteButton({ id, onClick }: { id: number; onClick?: () => void }) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/employer/jobs/${id}`, {
            onSuccess: () => {
                setOpen(false);
                onClick?.();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="rounded p-1.5 text-on-secondary-container transition-colors hover:bg-error/10 hover:text-error"
                    title="Delete"
                >
                    <span
                        className="material-symbols-outlined mt-0.5 text-[18px]"
                        data-icon="delete"
                    >
                        delete
                    </span>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Job Posting</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this job posting? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export interface JobPostingCardProps {
    id: number;
    title?: string;
    companyName?: string;
    status?: 'Active' | 'Draft' | 'Closed';
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
    status = 'Active',
    location = 'New York, NY',
    type = 'Contract',
    isNew = true,
    created_at,
    canEdit = false,
    isSaved = false,
    onToggleSave,
}: JobPostingCardProps) {
    const postedDate = created_at ? formatDate(created_at) : 'Oct 22, 2023';
    // Helper to determine status color styling
    const getStatusColors = () => {
        switch (status) {
            case 'Active':
                return 'bg-tertiary-container/20 text-tertiary border-tertiary/20';
            case 'Draft':
                return 'bg-surface-variant text-on-surface-variant border-outline-variant';
            case 'Closed':
                return 'bg-error-container/20 text-error border-error/20';
            default:
                return 'bg-tertiary-container/20 text-tertiary border-tertiary/20';
        }
    };

    const getStatusDotColor = () => {
        switch (status) {
            case 'Active':
                return 'bg-tertiary';
            case 'Draft':
                return 'bg-outline';
            case 'Closed':
                return 'bg-error';
            default:
                return 'bg-tertiary';
        }
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container transition-colors duration-200 hover:border-primary/50">
            {/* Top Indicator Bar */}
            <div className={`h-1 w-full ${getStatusDotColor()}`}></div>

            <div className="flex flex-1 flex-col p-5">
                {/* Header Row */}
                <div className="mb-3 flex items-start justify-between">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColors()}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor()}`}
                        ></span>
                        {status}
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
                    </div>
                </div>

                {/* Title */}
                <h3 className="mb-1 text-xl font-semibold text-on-surface transition-colors group-hover:text-primary">
                    {title}
                </h3>
                {companyName && (
                    <p className="text-sm text-on-secondary-container mb-2">
                        {companyName}
                    </p>
                )}

                {/* Meta Info */}
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

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-highest px-5 py-3">
                <div className="text-xs text-on-secondary-container">
                    Posted {postedDate}
                </div>
                    <div className="flex gap-2">
                        {canEdit && (
                            <>
                            <button
                                onClick={() => router.visit(`/employer/jobs/${id}/edit`)}
                                className="rounded p-1.5 text-on-secondary-container transition-colors hover:bg-primary/10 hover:text-primary"
                                title="Edit"
                            >
                                <span
                                    className="material-symbols-outlined mt-0.5 text-[18px]"
                                    data-icon="edit"
                                >
                                    edit_square
                                </span>
                            </button>
                            <DeleteButton id={id} />
                            </>
                        )}
                    {canEdit ? (
                        <button
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
