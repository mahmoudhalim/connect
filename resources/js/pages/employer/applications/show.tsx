import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import React from 'react';
import EmployerLayout from '@/layouts/EmployerLayout';
import { formatDate } from '@/lib/utils';
import { StatusChangeDialog, getStatusBadge } from '@/components/employer/status-change-dialog';
import type { Application } from '@/types/application';

interface Props {
    application: Application;
}

function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function Show({ application }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const statusBadge = getStatusBadge(application.status);
    const profile = application.candidate?.candidate_profile;

    const skillsArr = Array.isArray(profile?.skills)
        ? profile.skills
        : typeof profile?.skills === 'string'
            ? profile.skills.split(',').map((s: string) => s.trim())
            : [];

    return (
        <>
            <EmployerLayout>
                <Head title={`Application - ${application.candidate.name}`} />
                <div className="mb-6">
                    <Link
                        href="/employer/applicants"
                        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-3 w-fit"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to applicants
                    </Link>
                    <h1 className="text-2xl font-bold text-on-surface">Application Details</h1>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Candidate Info Card */}
                        <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-highest border border-outline-variant text-on-surface-variant font-bold text-lg">
                                    {getInitials(application.candidate.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold text-on-surface">
                                        {application.candidate.name}
                                    </h2>
                                    <p className="text-on-surface-variant">{application.candidate.email}</p>
                                    {profile?.headline && (
                                        <p className="text-sm text-primary mt-1">{profile.headline}</p>
                                    )}
                                </div>
                                <span className={statusBadge.class}>{statusBadge.label}</span>
                            </div>

                            {profile?.bio && (
                                <>
                                    <hr className="border-outline-variant" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">About</h3>
                                        <p className="text-on-surface whitespace-pre-wrap">{profile.bio}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Skills Card */}
                        {skillsArr.length > 0 && (
                            <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skillsArr.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-surface-container-lowest border border-outline-variant rounded text-sm text-on-surface font-mono">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Job Details Card */}
                        <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Applied For</h3>
                            <div>
                                <h4 className="text-lg font-bold text-on-surface">{application.job_posting.title}</h4>
                                <p className="text-sm text-on-surface-variant">{application.job_posting.employer?.name}</p>
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
                    </div>

                    <div className="space-y-6">
                        {/* Status Actions Card */}
                        <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Manage</h3>
                            <button
                                onClick={() => setDialogOpen(true)}
                                className="w-full bg-primary hover:bg-primary-fixed text-on-primary font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                            >
                                Change Status
                            </button>
                        </div>

                        {/* Contact Info Card */}
                        <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Contact</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="material-symbols-outlined text-base text-on-surface-variant">mail</span>
                                    <span className="text-on-surface">{application.contact_email || application.candidate.email}</span>
                                </div>
                                {application.contact_phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-base text-on-surface-variant">call</span>
                                        <span className="text-on-surface">{application.contact_phone}</span>
                                    </div>
                                )}
                                {application.portfolio_url && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-base text-on-surface-variant">language</span>
                                        <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{application.portfolio_url}</a>
                                    </div>
                                )}
                                {profile?.linkedin_url && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-base text-on-surface-variant">link</span>
                                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">LinkedIn</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resume Card */}
                        {(application.resume_path || profile?.resume_path) && (
                            <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Resume</h3>
                                <a
                                    href={`/storage/${application.resume_path || profile?.resume_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-transparent hover:bg-surface-variant text-on-surface border border-outline-variant font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    Download Resume
                                </a>
                            </div>
                        )}

                        {/* Quick Info Card */}
                        <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Quick Info</h3>
                            <div className="space-y-3 text-sm">
                                {profile?.experience_years && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-on-surface-variant">Experience</span>
                                        <span className="text-on-surface font-medium">{profile.experience_years} years</span>
                                    </div>
                                )}
                                {profile?.education && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-on-surface-variant">Education</span>
                                        <span className="text-on-surface font-medium text-right max-w-[180px] truncate">{profile.education}</span>
                                    </div>
                                )}
                                {profile?.location && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-on-surface-variant">Location</span>
                                        <span className="text-on-surface font-medium">{profile.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </EmployerLayout>

            <StatusChangeDialog
                application={application}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </>
    );
}
