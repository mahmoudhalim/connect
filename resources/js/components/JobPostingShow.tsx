import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Job {
    id: number;
    title: string;
    location: string;
    employmentType: string;
    workPlaceType: string;
    minSalary: number;
    maxSalary: number;
    description: string;
    status: string;
    employer: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface JobPostingShowProps {
    job: Job;
    showApply?: boolean;
    showApplyButton?: boolean;
    showLoginPrompt?: boolean;
    user?: {
        name: string;
        email: string;
    };
}

const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
};

const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        'full-time': 'Full-time',
        'part-time': 'Part-time',
        'contract': 'Contract',
        'freelance': 'Freelance',
    };
    return labels[type] || type;
};

const getWorkPlaceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        'onsite': 'On-site',
        'remote': 'Remote',
        'hybrid': 'Hybrid',
    };
    return labels[type] || type;
};

export default function JobPostingShow({
    job,
    showApply = false,
    showApplyButton,
    showLoginPrompt = false,
    user,
}: JobPostingShowProps) {
    const shouldShowApplyButton = showApplyButton ?? showApply;
    const [showForm, setShowForm] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        job_posting_id: job.id,
        contact_email: user?.email || '',
        contact_phone: '',
        portfolio_url: '',
        resume: null as File | null,
    });

    transform((form) => ({
        ...form,
        resume: form.resume,
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/candidate/applications', {
            onSuccess: () => {
                setShowForm(false);
                reset();
            },
        });
    };

    const employmentLabel = getEmploymentTypeLabel(job.employmentType);
    const workplaceLabel = getWorkPlaceTypeLabel(job.workPlaceType);

    if (!showApply) {
        return (
            <div className="rounded-lg border border-outline-variant bg-surface-container p-6">
                <div className="mb-6 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 rounded-md bg-surface-container-lowest px-3 py-2 text-sm">
                        <span className="material-symbols-outlined text-[20px]" data-icon="location_on">
                            location_on
                        </span>
                        <span className="text-on-surface">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-surface-container-lowest px-3 py-2 text-sm">
                        <span className="material-symbols-outlined text-[20px]" data-icon="schedule">
                            schedule
                        </span>
                        <span className="text-on-surface">{employmentLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-surface-container-lowest px-3 py-2 text-sm">
                        <span className="material-symbols-outlined text-[20px]" data-icon="work">
                            work
                        </span>
                        <span className="text-on-surface">{workplaceLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-tertiary-container/20 px-3 py-2 text-sm font-medium text-tertiary">
                        <span className="material-symbols-outlined text-[20px]" data-icon="payments">
                            payments
                        </span>
                        <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="mb-4 text-lg font-semibold text-on-surface">Job Description</h2>
                    <div className="whitespace-pre-wrap text-on-surface-variant">{job.description}</div>
                </div>
                {showLoginPrompt && (
                    <div className="border-t border-outline-variant pt-6">
                        <p className="text-on-surface-variant">
                            Please{' '}
                            <a href="/login" className="text-primary hover:underline">login</a> to apply for this job.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    if (showForm) {
        return (
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="mb-8 pb-6 border-b border-outline-variant">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-xs font-semibold text-primary tracking-wide">
                            {employmentLabel}
                        </span>
                        <span className="text-xs text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]" data-icon="location_on">
                                location_on
                            </span>
                            {workplaceLabel}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-2">
                        {job.title}
                    </h1>
                    <p className="text-lg text-on-surface-variant flex items-center gap-2">
                        Applying to <span className="font-bold text-on-surface">{job.employer.name}</span>
                    </p>
                </div>

                <section className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-on-surface flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary" data-icon="person">person</span>
                            Personal Information
                        </h2>
                        <p className="text-sm text-on-surface-variant">Provide your basic contact details.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">
                                Email Address <span className="text-error">*</span>
                            </Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                placeholder="jane@example.com"
                                className="bg-surface-container"
                            />
                            {errors.contact_email && (
                                <p className="text-sm text-error">{errors.contact_email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_phone">Phone Number</Label>
                            <Input
                                id="contact_phone"
                                type="tel"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className="bg-surface-container"
                            />
                            {errors.contact_phone && (
                                <p className="text-sm text-error">{errors.contact_phone}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="portfolio_url">Portfolio / LinkedIn URL</Label>
                            <Input
                                id="portfolio_url"
                                type="url"
                                value={data.portfolio_url}
                                onChange={(e) => setData('portfolio_url', e.target.value)}
                                placeholder="https://linkedin.com/in/yourprofile"
                                className="bg-surface-container"
                            />
                            {errors.portfolio_url && (
                                <p className="text-sm text-error">{errors.portfolio_url}</p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-on-surface flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary" data-icon="upload_file">upload_file</span>
                            Resume / CV
                        </h2>
                        <p className="text-sm text-on-surface-variant">Upload your resume (PDF, DOC, or DOCX).</p>
                    </div>
                    <div
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            isDragging
                                ? 'border-primary bg-primary/10'
                                : 'border-outline-variant hover:border-primary/50'
                        }`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
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
                        <input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setData('resume', e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant" data-icon="cloud_upload">
                                cloud_upload
                            </span>
                            <div className="space-y-1">
                                <p className="text-on-surface font-medium">
                                    {data.resume ? data.resume.name : 'Drag and drop your resume here'}
                                </p>
                                <p className="text-sm text-on-surface-variant">
                                    {data.resume ? 'Click to change file' : 'or click to browse'}
                                </p>
                            </div>
                            {data.resume && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setData('resume', null);
                                    }}
                                    className="text-sm text-error hover:underline"
                                >
                                    Remove file
                                </button>
                            )}
                        </div>
                    </div>
                    {errors.resume && (
                        <p className="text-sm text-error">{errors.resume}</p>
                    )}
                </section>

                <div className="pt-8 border-t border-outline-variant flex flex-col-reverse md:flex-row justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setShowForm(false);
                            reset();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="flex items-center justify-center gap-2"
                    >
                        {processing ? 'Submitting...' : 'Submit Application'}
                        <span className="material-symbols-outlined text-[20px]" data-icon="send">send</span>
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div className="rounded-lg border border-outline-variant bg-surface-container p-6">
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-md bg-surface-container-lowest px-3 py-2 text-sm">
                    <span className="material-symbols-outlined text-[20px]" data-icon="location_on">
                        location_on
                    </span>
                    <span className="text-on-surface">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-surface-container-lowest px-3 py-2 text-sm">
                    <span className="material-symbols-outlined text-[20px]" data-icon="schedule">
                        schedule
                    </span>
                    <span className="text-on-surface">{employmentLabel}</span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-surface-container-lowest px-3 py-2 text-sm">
                    <span className="material-symbols-outlined text-[20px]" data-icon="work">
                        work
                    </span>
                    <span className="text-on-surface">{workplaceLabel}</span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-tertiary-container/20 px-3 py-2 text-sm font-medium text-tertiary">
                    <span className="material-symbols-outlined text-[20px]" data-icon="payments">
                        payments
                    </span>
                    <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="mb-4 text-lg font-semibold text-on-surface">Job Description</h2>
                <div className="whitespace-pre-wrap text-on-surface-variant">{job.description}</div>
            </div>

            {shouldShowApplyButton && (
                <div className="border-t border-outline-variant pt-6">
                    <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                        Apply Now
                        <span className="material-symbols-outlined text-[20px]" data-icon="arrow_forward">arrow_forward</span>
                    </Button>
                </div>
            )}
        </div>
    );
}