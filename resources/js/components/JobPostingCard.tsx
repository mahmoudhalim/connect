import { Link } from '@inertiajs/react';
import { formatDate } from '@/lib/utils';

export interface JobPostingCardProps {
    id: number;
    title?: string;
    status?: 'Active' | 'Draft' | 'Closed';
    location?: string;
    type?: string;
    applicants?: number;
    daysActive?: number;
    isNew?: boolean;
    created_at?: string;
}

export default function JobPostingCard({
    id,
    title = 'Product Designer',
    status = 'Active',
    location = 'New York, NY',
    type = 'Contract',
    applicants = 5,
    daysActive = 2,
    isNew = true,
    created_at,
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
                    <button className="rounded p-1 text-on-secondary-container transition-colors hover:bg-surface-container-highest hover:text-on-surface">
                        <span
                            className="material-symbols-outlined text-[20px]"
                            data-icon="more_vert"
                        >
                            more_vert
                        </span>
                    </button>
                </div>

                {/* Title */}
                <h3 className="mb-1 text-xl font-semibold text-on-surface transition-colors group-hover:text-primary">
                    {title}
                </h3>

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

                {/* Stats Grid */}
                <div className="mt-auto mb-6 grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-center justify-center rounded border border-outline-variant/50 bg-surface-container-lowest p-3">
                        <span className="text-2xl font-bold text-on-surface">
                            {applicants}
                        </span>
                        <span className="text-xs tracking-wider text-on-secondary-container uppercase">
                            Applicants
                        </span>
                    </div>
                    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded border border-outline-variant/50 bg-surface-container-lowest p-3">
                        {isNew && (
                            <div className="absolute top-0 right-0 rounded-bl bg-primary px-1.5 py-0.5 text-[10px] font-bold text-on-primary">
                                NEW
                            </div>
                        )}
                        <span className="text-2xl font-bold text-on-surface">
                            {daysActive}
                        </span>
                        <span className="text-xs tracking-wider text-on-secondary-container uppercase">
                            Days Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-highest px-5 py-3">
                <div className="text-xs text-on-secondary-container">
                    Posted {postedDate}
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/employer/jobs/${id}/edit`}
                        className="rounded p-1.5 text-on-secondary-container transition-colors hover:bg-primary/10 hover:text-primary"
                        title="Edit"
                    >
                        <span
                            className="material-symbols-outlined mt-0.5 text-[18px]"
                            data-icon="edit"
                        >
                            edit_square
                        </span>
                    </Link>
                    <button className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-inverse-on-surface transition-colors duration-150 hover:bg-primary-fixed-dim active:scale-95">
                        View Applicants
                    </button>
                </div>
            </div>
        </div>
    );
}
