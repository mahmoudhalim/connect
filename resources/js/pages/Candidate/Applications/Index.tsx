import { Head, Link } from '@inertiajs/react';
import Pagination from '@/components/Pagination';
import CandidateLayout from '@/layouts/CandidateLayout';
import { formatDate } from '@/lib/utils';
import type { Application, ApplicationStats } from '@/types/application';
import type { PaginatedData } from '@/types/pagination';

interface Props {
    applications: PaginatedData<Application>;
    stats: ApplicationStats;
}

const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        under_review:
            'bg-surface-variant text-on-surface-variant border-outline-variant',
        interviewing: 'bg-tertiary/10 text-tertiary border-tertiary/20',
        offer_extended: 'bg-primary/20 text-primary-fixed border-primary/30',
        rejected: 'bg-error/10 text-error border-error/20',
        withdrawn:
            'bg-surface-variant text-on-surface-variant border-outline-variant',
    };

    const labels: Record<string, string> = {
        under_review: 'Under Review',
        interviewing: 'Interviewing',
        offer_extended: 'Offer Extended',
        rejected: 'Rejected',
        withdrawn: 'Withdrawn',
    };

    const baseClass =
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
    return {
        class: baseClass + ' ' + (styles[status] || styles.under_review),
        label: labels[status] || status,
    };
};

const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
        under_review: 'description',
        interviewing: 'forum',
        offer_extended: 'celebration',
        rejected: 'cancel',
        withdrawn: 'logout',
    };
    return icons[status] || 'description';
};

export default function Index({ applications, stats }: Props) {
    const statsData = [
        {
            label: 'Total Applications',
            value: stats.total,
            color: 'on-surface',
            icon: 'description',
        },
        {
            label: 'Interviewing',
            value: stats.interviewing,
            color: 'text-tertiary',
            icon: 'forum',
        },
        {
            label: 'Offers Extended',
            value: stats.offers,
            color: 'text-primary',
            icon: 'celebration',
        },
    ];

    return (
        <CandidateLayout>
            <Head title="My Applications" />
            <div className="mb-12">
                <h2 className="mb-6 font-headline text-3xl font-bold tracking-tight">
                    My Applications
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {statsData.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container p-6"
                        >
                            <div
                                className={`absolute -top-4 -right-4 h-24 w-24 ${index === 0 ? 'bg-primary/5' : index === 1 ? 'bg-tertiary/5' : 'bg-primary/5'} rounded-full blur-2xl transition-all duration-500 group-hover:bg-primary/10`}
                            ></div>
                            <span className="mb-2 text-sm font-medium text-on-surface-variant">
                                {stat.label}
                            </span>
                            <span
                                className={`font-display text-4xl font-bold ${stat.color}`}
                            >
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {applications.data.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-outline-variant bg-surface-container">
                    <p className="text-on-surface-variant">
                        No applications yet. Start applying to jobs to see them
                        here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {applications.data.map((application) => {
                        console.log(application);
                        const statusBadge = getStatusBadge(application.status);
                        const statusIcon = getStatusIcon(application.status);
                        const isOfferExtended =
                            application.status === 'offer_extended';

                        const jobTitle =
                            application.job_posting?.title ||
                            'Unknown Position';
                        const employerName =
                            application.job_posting?.employer?.name ||
                            'Unknown Company';

                        return (
                            <div
                                key={application.id}
                                className={`group flex flex-col rounded-lg border bg-surface-container p-6 transition-colors hover:border-outline ${
                                    isOfferExtended
                                        ? 'relative overflow-hidden border-primary/30 hover:border-primary/50'
                                        : 'border-outline-variant'
                                }`}
                            >
                                {isOfferExtended && (
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                                )}
                                <div className="relative z-10 mb-4 flex items-start justify-between">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded border ${
                                            isOfferExtended
                                                ? 'border-primary/20 bg-primary/10'
                                                : 'border-outline-variant bg-surface-variant'
                                        }`}
                                    >
                                        <span
                                            className={`material-symbols-outlined ${isOfferExtended ? 'text-primary' : 'text-on-surface-variant'}`}
                                        >
                                            {statusIcon}
                                        </span>
                                    </div>
                                    <span className={statusBadge.class}>
                                        {statusBadge.label}
                                    </span>
                                </div>
                                <h3 className="relative z-10 mb-1 font-headline text-lg font-bold text-on-surface transition-colors group-hover:text-primary">
                                    {jobTitle}
                                </h3>
                                <p className="relative z-10 mb-4 text-sm text-on-surface-variant">
                                    {employerName}
                                </p>
                                <div className="relative z-10 mt-auto flex items-center justify-between border-t border-outline-variant pt-4">
                                    <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[14px]">
                                            calendar_today
                                        </span>
                                        {formatDate(application.created_at)}
                                    </span>
                                    {isOfferExtended ? (
                                        <button className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-fixed">
                                            Review Offer
                                        </button>
                                    ) : application.status === 'rejected' ? (
                                        <button className="flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface">
                                            Archive{' '}
                                            <span className="material-symbols-outlined text-[16px]">
                                                archive
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            href={`/candidate/applications/${application.id}`}
                                            className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary-fixed"
                                        >
                                            View Details{' '}
                                            <span className="material-symbols-outlined text-[16px]">
                                                arrow_forward
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {applications.last_page > 1 && (
                <div className="mt-8">
                    <Pagination {...applications} />
                </div>
            )}
        </CandidateLayout>
    );
}
