import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Application } from '@/types/application';

const statusActions = [
    { value: 'shortlisted', label: 'Shortlist', icon: 'bookmark_add', color: 'text-primary' },
    { value: 'interviewing', label: 'Move to Interview', icon: 'video_call', color: 'text-cyan-500' },
    { value: 'offer_extended', label: 'Extend Offer', icon: 'verified', color: 'text-green-500' },
    { value: 'rejected', label: 'Reject Application', icon: 'close', color: 'text-error' },
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

export function StatusChangeDialog({
    application,
    open,
    onOpenChange,
}: {
    application: Application | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [selectedStatus, setSelectedStatus] = useState('');

    if (!application) return null;

    const statusBadge = getStatusBadge(application.status);

    const handleConfirm = () => {
        if (!selectedStatus) return;
        router.patch(`/employer/applicants/${application.id}/status`, {
            status: selectedStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Change Status</DialogTitle>
                    <DialogDescription className="text-on-surface-variant">
                        Update the status for{' '}
                        <span className="font-medium text-on-surface">{application.candidate.name}</span>
                        {' '}&mdash;{' '}
                        <span className="font-medium text-on-surface">{application.job_posting.title}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="text-sm text-on-surface-variant">
                        Current status: <span className={statusBadge.class}>{statusBadge.label}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {statusActions.map((action) => (
                            <button
                                key={action.value}
                                type="button"
                                onClick={() => setSelectedStatus(action.value)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                                    selectedStatus === action.value
                                        ? 'border-primary bg-primary/10 text-on-surface'
                                        : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary/50'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-xl ${action.color}`}>
                                    {action.icon}
                                </span>
                                <span className="font-medium">{action.label}</span>
                                {selectedStatus === action.value && (
                                    <span className="material-symbols-outlined text-primary ml-auto">
                                        check_circle
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleConfirm} disabled={!selectedStatus}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export { getStatusBadge };
