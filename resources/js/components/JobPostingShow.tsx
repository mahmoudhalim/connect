import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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
    showLoginPrompt?: boolean;
}

const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
};

const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        'full-time': 'Full Time',
        'part-time': 'Part Time',
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
    showLoginPrompt = false,
}: JobPostingShowProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        job_posting_id: job.id,
        resume_path: '',
        contact_email: '',
        contact_phone: '',
        cover_letter: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/candidate/applications', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface">
                        {job.title}
                    </h1>
                    <p className="text-on-surface-variant">{job.employer.name}</p>
                </div>
                {showApply && (
                    <Button onClick={() => setOpen(true)}>Apply Now</Button>
                )}
            </div>

            <div className="rounded-lg border border-outline-variant bg-surface-container p-6">
                {/* Job Details */}
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
                        <span className="text-on-surface">
                            {getEmploymentTypeLabel(job.employmentType)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-md bg-surface-container-lowest px-3 py-2 text-sm">
                        <span className="material-symbols-outlined text-[20px]" data-icon="work">
                            work
                        </span>
                        <span className="text-on-surface">
                            {getWorkPlaceTypeLabel(job.workPlaceType)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-md bg-tertiary-container/20 px-3 py-2 text-sm font-medium text-tertiary">
                        <span className="material-symbols-outlined text-[20px]" data-icon="payments">
                            payments
                        </span>
                        <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h2 className="mb-4 text-lg font-semibold text-on-surface">
                        Job Description
                    </h2>
                    <div className="whitespace-pre-wrap text-on-surface-variant">
                        {job.description}
                    </div>
                </div>

                {showLoginPrompt && (
                    <div className="border-t border-outline-variant pt-6">
                        <p className="text-on-surface-variant">
                            Please{' '}
                            <a href="/login" className="text-primary hover:underline">
                                login
                            </a>{' '}
                            to apply for this job.
                        </p>
                    </div>
                )}
            </div>

            {showApply && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Apply for {job.title}</DialogTitle>
                            <DialogDescription>
                                Fill in your details to submit your application.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="job_posting_id" value={data.job_posting_id} />

                            <div className="space-y-4 py-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-on-surface">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface"
                                        placeholder="your@email.com"
                                    />
                                    {errors.contact_email && (
                                        <p className="mt-1 text-sm text-error">
                                            {errors.contact_email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-on-surface">
                                        Contact Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-on-surface">
                                        Resume Path / URL
                                    </label>
                                    <input
                                        type="text"
                                        value={data.resume_path}
                                        onChange={(e) => setData('resume_path', e.target.value)}
                                        className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface"
                                        placeholder="Link to your resume or path"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-on-surface">
                                        Cover Letter (Optional)
                                    </label>
                                    <textarea
                                        value={data.cover_letter}
                                        onChange={(e) => setData('cover_letter', e.target.value)}
                                        rows={4}
                                        className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface"
                                        placeholder="Tell us why you're a great fit..."
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Submitting...' : 'Submit Application'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
