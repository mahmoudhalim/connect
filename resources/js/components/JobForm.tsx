import { Form, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import type JobPosting from '@/types/jobPosting';
import { Button } from '@/components/ui/button';
import { FileInput } from '@/components/ui/file-input';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
}

interface JobFormProps {
    job?: JobPosting & { category?: Category | null; experience_level?: string; requirements?: string; benefits?: string; deadline?: string; company_logo?: string };
    action: string;
    method: 'post' | 'put' | 'patch';
    submitText: string;
    categories?: Category[];
}

export default function JobForm({
    job,
    action,
    method,
    submitText,
    categories = [],
}: JobFormProps) {
    const { errors } = usePage<any>().props;
    const [workplaceType, setWorkplaceType] = useState<string>(
        job?.workPlaceType || 'hybrid',
    );
    const [employmentType, setEmploymentType] = useState<string>(
        job?.employmentType || 'full-time',
    );
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const experienceLevels = [
        { label: 'Entry', value: 'entry', desc: '0-2 years' },
        { label: 'Mid', value: 'mid', desc: '2-5 years' },
        { label: 'Senior', value: 'senior', desc: '5-10 years' },
        { label: 'Lead', value: 'lead', desc: '10+ years' },
        { label: 'Executive', value: 'executive', desc: 'Director+' },
    ];

    const handleCancel = () => {
        const form = document.querySelector('form');
        const inputs = form?.querySelectorAll('input, select, textarea');
        let hasChanges = false;
        inputs?.forEach((input) => {
            const el = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            if (el.value && el.value !== (el as HTMLInputElement).defaultValue) {
                hasChanges = true;
            }
        });
        if (hasChanges) {
            setShowCancelConfirm(true);
        } else {
            router.visit('/employer/jobs');
        }
    };

    return (
        <>
            <Form action={action} method={method} encType="multipart/form-data" className="space-y-8">
                <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary" data-icon="info">info</span>
                        <h3 className="text-lg font-semibold">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Job Title</label>
                            <input
                                name="title"
                                defaultValue={job?.title}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                placeholder="e.g. Senior Software Engineer"
                                type="text"
                            />
                            {errors.title && <p className="mt-1 text-xs font-medium text-error">{errors.title}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Category</label>
                            <select
                                name="category_id"
                                defaultValue={job?.category_id || ''}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <p className="mt-1 text-xs font-medium text-error">{errors.category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Employment Type</label>
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                {[
                                    { label: 'Full-time', value: 'full-time' },
                                    { label: 'Contract', value: 'contract' },
                                    { label: 'Part-time', value: 'part-time' },
                                    { label: 'Freelance', value: 'freelance' },
                                ].map((type) => (
                                    <label key={type.value} className={`cursor-pointer rounded-lg border px-4 py-2.5 text-center text-xs font-semibold transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary ${employmentType !== type.value ? 'border-outline-variant bg-surface-container-lowest hover:bg-surface-variant' : ''}`}>
                                        <input
                                            type="radio"
                                            name="employmentType"
                                            value={type.value}
                                            checked={employmentType === type.value}
                                            onChange={() => setEmploymentType(type.value)}
                                            className="sr-only"
                                        />
                                        {type.label}
                                    </label>
                                ))}
                            </div>
                            {errors.employmentType && <p className="mt-1 text-xs font-medium text-error">{errors.employmentType}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Experience Level</label>
                            <select
                                name="experience_level"
                                defaultValue={job?.experience_level || ''}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select experience level</option>
                                {experienceLevels.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label} ({level.desc})
                                    </option>
                                ))}
                            </select>
                            {errors.experience_level && <p className="mt-1 text-xs font-medium text-error">{errors.experience_level}</p>}
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary" data-icon="location_on">location_on</span>
                        <h3 className="text-lg font-semibold">Location &amp; Work Type</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Workplace Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Remote', value: 'remote' },
                                    { label: 'Hybrid', value: 'hybrid' },
                                    { label: 'On-site', value: 'onsite' },
                                ].map((type) => (
                                    <label key={type.value} className={`cursor-pointer rounded-lg border px-2 py-2.5 text-center text-xs font-semibold transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary ${workplaceType !== type.value ? 'border-outline-variant bg-surface-container-lowest hover:bg-surface-variant' : ''}`}>
                                        <input
                                            type="radio"
                                            name="workPlaceType"
                                            value={type.value}
                                            checked={workplaceType === type.value}
                                            onChange={() => setWorkplaceType(type.value)}
                                            className="sr-only"
                                        />
                                        {type.label}
                                    </label>
                                ))}
                            </div>
                            {errors.workPlaceType && <p className="mt-1 text-xs font-medium text-error">{errors.workPlaceType}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Specific Location</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-sm text-secondary" data-icon="pin_drop">pin_drop</span>
                                <input
                                    name="location"
                                    defaultValue={job?.location}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-10 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                    placeholder="San Francisco, CA"
                                    type="text"
                                />
                            </div>
                            {errors.location && <p className="mt-1 text-xs font-medium text-error">{errors.location}</p>}
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary" data-icon="payments">payments</span>
                        <h3 className="text-lg font-semibold">Compensation</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Min Salary (USD)</label>
                            <div className="relative">
                                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-secondary">$</span>
                                <input
                                    name="minSalary"
                                    defaultValue={job?.minSalary}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-8 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                    placeholder="120,000"
                                    type="number"
                                />
                            </div>
                            {errors.minSalary && <p className="mt-1 text-xs font-medium text-error">{errors.minSalary}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Max Salary (USD)</label>
                            <div className="relative">
                                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-secondary">$</span>
                                <input
                                    name="maxSalary"
                                    defaultValue={job?.maxSalary}
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-8 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                    placeholder="180,000"
                                    type="number"
                                />
                            </div>
                            {errors.maxSalary && <p className="mt-1 text-xs font-medium text-error">{errors.maxSalary}</p>}
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary" data-icon="description">description</span>
                        <h3 className="text-lg font-semibold">Job Details</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Job Description</label>
                            <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
                                <textarea
                                    name="description"
                                    defaultValue={job?.description}
                                    className="w-full border-none bg-transparent p-4 text-sm text-on-surface-variant focus:ring-0"
                                    placeholder="Describe the role, responsibilities, and team culture..."
                                    rows={6}
                                ></textarea>
                            </div>
                            {errors.description && <p className="mt-1 text-xs font-medium text-error">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Requirements (optional)</label>
                            <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
                                <textarea
                                    name="requirements"
                                    defaultValue={job?.requirements || ''}
                                    className="w-full border-none bg-transparent p-4 text-sm text-on-surface-variant focus:ring-0"
                                    placeholder="List required skills, qualifications, and experience..."
                                    rows={4}
                                ></textarea>
                            </div>
                            {errors.requirements && <p className="mt-1 text-xs font-medium text-error">{errors.requirements}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Benefits (optional)</label>
                            <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
                                <textarea
                                    name="benefits"
                                    defaultValue={job?.benefits || ''}
                                    className="w-full border-none bg-transparent p-4 text-sm text-on-surface-variant focus:ring-0"
                                    placeholder="Health insurance, 401k, remote work, etc."
                                    rows={4}
                                ></textarea>
                            </div>
                            {errors.benefits && <p className="mt-1 text-xs font-medium text-error">{errors.benefits}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">Application Deadline (optional)</label>
                            <input
                                name="deadline"
                                type="date"
                                defaultValue={job?.deadline || ''}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-primary text-on-surface-variant"
                            />
                            {errors.deadline && <p className="mt-1 text-xs font-medium text-error">{errors.deadline}</p>}
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary" data-icon="business">business</span>
                        <h3 className="text-lg font-semibold">Company Branding</h3>
                    </div>
                    <FileInput
                        name="company_logo"
                        label="Company Logo (optional)"
                        hint="Upload your company logo (max 2MB, jpg/png/webp)"
                        errors={errors}
                    />
                </section>

                <footer className="flex items-center justify-end gap-4 pt-4 pb-20">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {submitText}
                    </Button>
                </footer>
            </Form>

            {showCancelConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelConfirm(false)}>
                    <div className="mx-4 w-full max-w-sm rounded-xl border border-outline-variant bg-surface-container p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-on-surface mb-2">Discard Changes?</h3>
                        <p className="text-sm text-on-surface-variant mb-6">You have unsaved changes. Are you sure you want to leave?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                className="rounded px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                                onClick={() => setShowCancelConfirm(false)}
                            >
                                Stay
                            </button>
                            <button
                                type="button"
                                className="rounded bg-error px-4 py-2 text-sm text-white hover:bg-error/90 transition-colors"
                                onClick={() => router.visit('/employer/jobs')}
                            >
                                Discard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
