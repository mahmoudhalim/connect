import { Head, Link } from '@inertiajs/react';
import CandidateLayout from '@/layouts/CandidateLayout';
import type { CandidateProfile } from '@/types/candidate';
import { Button } from '@/components/ui/button';

interface Props {
    candidate?: CandidateProfile | null;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function getExperienceLevel(years?: number): string {
    if (!years) return 'Not specified';
    if (years <= 2) return 'Entry Level';
    if (years <= 5) return 'Mid Level';
    if (years <= 10) return 'Senior Level';
    return 'Lead / Executive';
}

export default function Show({ candidate }: Props) {
    if (!candidate) {
        return (
            <CandidateLayout>
                <Head title="My Profile" />
                <div className="flex h-64 items-center justify-center rounded-xl border border-outline-variant bg-surface-container">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">
                            person
                        </span>
                        <p className="text-on-surface-variant mb-4">
                            You haven't created your profile yet.
                        </p>
                        <Link href="/candidate/profile">
                            <Button>Create Profile</Button>
                        </Link>
                    </div>
                </div>
            </CandidateLayout>
        );
    }

    const skillsArr = Array.isArray(candidate.skills)
        ? candidate.skills
        : typeof candidate.skills === 'string'
            ? candidate.skills.split(',').map((s: string) => s.trim())
            : [];

    return (
        <CandidateLayout>
            <Head title={`${candidate.user?.name ?? 'My'} - Profile`} />
            <div className="mb-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-on-surface">
                            My Profile
                        </h1>
                        <p className="text-on-surface-variant text-sm">
                            Your public candidate profile
                        </p>
                    </div>
                    <Link href="/candidate/profile">
                        <Button className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Edit Profile
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container-highest border border-outline-variant">
                                {candidate.avatar_path ? (
                                    <img
                                        src={`/storage/${candidate.avatar_path}`}
                                        alt={candidate.user?.name ?? 'Avatar'}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-on-surface-variant font-bold text-xl">
                                        {getInitials(candidate.user?.name ?? 'U')}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-on-surface">
                                    {candidate.user?.name ?? 'Unknown'}
                                </h2>
                                {candidate.headline && (
                                    <p className="text-on-surface-variant mt-1">
                                        {candidate.headline}
                                    </p>
                                )}
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-on-surface-variant">
                                    {candidate.location && (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">
                                                location_on
                                            </span>
                                            {candidate.location}
                                        </span>
                                    )}
                                    {candidate.experience_years && (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">
                                                work_history
                                            </span>
                                            {candidate.experience_years} years
                                        </span>
                                    )}
                                    {candidate.education && (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">
                                                school
                                            </span>
                                            {candidate.education}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {candidate.bio && (
                            <>
                                <hr className="border-outline-variant" />
                                <div>
                                    <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                                        About
                                    </h3>
                                    <p className="text-on-surface whitespace-pre-wrap">
                                        {candidate.bio}
                                    </p>
                                </div>
                            </>
                        )}

                        {skillsArr.length > 0 && (
                            <>
                                <hr className="border-outline-variant" />
                                <div>
                                    <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
                                        Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skillsArr.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-surface-container-lowest border border-outline-variant rounded text-sm text-on-surface font-mono"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">
                            Contact Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-base text-on-surface-variant">
                                    mail
                                </span>
                                <span className="text-sm text-on-surface">
                                    {candidate.user?.email ?? '—'}
                                </span>
                            </div>
                            {candidate.phone && (
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-base text-on-surface-variant">
                                        call
                                    </span>
                                    <span className="text-sm text-on-surface">
                                        {candidate.phone}
                                    </span>
                                </div>
                            )}
                            {candidate.portfolio_url && (
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-base text-on-surface-variant">
                                        language
                                    </span>
                                    <a
                                        href={candidate.portfolio_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline break-all"
                                    >
                                        Portfolio
                                    </a>
                                </div>
                            )}
                            {candidate.linkedin_url && (
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-base text-on-surface-variant">
                                        link
                                    </span>
                                    <a
                                        href={candidate.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline break-all"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">
                            Quick Info
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-on-surface-variant">
                                    Experience
                                </span>
                                <span className="text-sm font-medium text-on-surface">
                                    {getExperienceLevel(candidate.experience_years)}
                                </span>
                            </div>
                            {candidate.education && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-on-surface-variant">
                                        Education
                                    </span>
                                    <span className="text-sm font-medium text-on-surface text-right max-w-[160px] truncate">
                                        {candidate.education}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {candidate.resume_path && (
                        <div className="rounded-xl border border-outline-variant bg-surface-container p-6">
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
                                Resume
                            </h3>
                            <a
                                href={`/storage/${candidate.resume_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button className="w-full flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">
                                        download
                                    </span>
                                    Download Resume
                                </Button>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </CandidateLayout>
    );
}