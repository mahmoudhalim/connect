import { Form, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import type JobPosting from '@/types/jobPosting';

interface JobFormProps {
    job?: JobPosting;
    action: string;
    method: 'post' | 'put' | 'patch';
    submitText: string;
}

export default function JobForm({
    job,
    action,
    method,
    submitText,
}: JobFormProps) {
    const { errors } = usePage<any>().props;
    const [workplaceType, setWorkplaceType] = useState(
        job?.workPlaceType || 'hybrid',
    );
    const [employmentType, setEmploymentType] = useState(
        job?.employmentType || 'full-time',
    );

    return (
        <Form action={action} method={method} className="space-y-8">
            {/*  Section 1: Basic Information  */}
            <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                <div className="mb-6 flex items-center gap-2">
                    <span
                        className="material-symbols-outlined text-xl text-primary"
                        data-icon="info"
                    >
                        info
                    </span>
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                            Job Title
                        </label>
                        <input
                            name="title"
                            defaultValue={job?.title}
                            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            placeholder="e.g. Senior Software Engineer"
                            type="text"
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs font-medium text-error">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="tracring-wider text-xs font-bold text-secondary uppercase">
                            Employment Type
                        </label>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            {[
                                { label: 'Full-time', value: 'full-time' },
                                { label: 'Contract', value: 'contract' },
                                { label: 'Part-time', value: 'part-time' },
                                { label: 'Freelance', value: 'freelance' },
                            ].map((type) => (
                                <label
                                    key={type.value}
                                    className={`cursor-pointer rounded-lg border px-4 py-2.5 text-center text-xs font-semibold transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary ${
                                        employmentType !== type.value &&
                                        'border-outline-variant bg-surface-container-lowest hover:bg-surface-variant'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="employmentType"
                                        value={type.value}
                                        checked={employmentType === type.value}
                                        onChange={() =>
                                            setEmploymentType(type.value)
                                        }
                                        className="sr-only"
                                    />
                                    {type.label}
                                </label>
                            ))}
                        </div>
                        {errors.employmentType && (
                            <p className="mt-1 text-xs font-medium text-error">
                                {errors.employmentType}
                            </p>
                        )}
                    </div>
                </div>
            </section>
            {/*  Section 2: Location & Work Type  */}
            <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                <div className="mb-6 flex items-center gap-2">
                    <span
                        className="material-symbols-outlined text-xl text-primary"
                        data-icon="location_on"
                    >
                        location_on
                    </span>
                    <h3 className="text-lg font-semibold">
                        Location &amp; Work Type
                    </h3>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                            Workplace Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Remote', value: 'remote' },
                                { label: 'Hybrid', value: 'hybrid' },
                                { label: 'On-site', value: 'onsite' },
                            ].map((type) => (
                                <label
                                    key={type.value}
                                    className={`cursor-pointer rounded-lg border px-2 py-2.5 text-center text-xs font-semibold transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary ${
                                        workplaceType !== type.value &&
                                        'border-outline-variant bg-surface-container-lowest hover:bg-surface-variant'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="workPlaceType"
                                        value={type.value}
                                        checked={workplaceType === type.value}
                                        onChange={() =>
                                            setWorkplaceType(type.value)
                                        }
                                        className="sr-only"
                                    />
                                    {type.label}
                                </label>
                            ))}
                        </div>
                        {errors.workPlaceType && (
                            <p className="mt-1 text-xs font-medium text-error">
                                {errors.workPlaceType}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                            Specific Location
                        </label>
                        <div className="relative">
                            <span
                                className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-sm text-secondary"
                                data-icon="pin_drop"
                            >
                                pin_drop
                            </span>
                            <input
                                name="location"
                                defaultValue={job?.location}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-10 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                placeholder="San Francisco, CA"
                                type="text"
                            />
                        </div>
                        {errors.location && (
                            <p className="mt-1 text-xs font-medium text-error">
                                {errors.location}
                            </p>
                        )}
                    </div>
                </div>
            </section>
            {/*  Section 3: Compensation  */}
            <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                <div className="mb-6 flex items-center gap-2">
                    <span
                        className="material-symbols-outlined text-xl text-primary"
                        data-icon="payments"
                    >
                        payments
                    </span>
                    <h3 className="text-lg font-semibold">Compensation</h3>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                            Min Salary (USD)
                        </label>
                        <div className="relative">
                            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-secondary">
                                $
                            </span>
                            <input
                                name="minSalary"
                                defaultValue={job?.minSalary}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-8 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                placeholder="120,000"
                                type="number"
                            />
                        </div>
                        {errors.minSalary && (
                            <p className="mt-1 text-xs font-medium text-error">
                                {errors.minSalary}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                            Max Salary (USD)
                        </label>
                        <div className="relative">
                            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-secondary">
                                $
                            </span>
                            <input
                                name="maxSalary"
                                defaultValue={job?.maxSalary}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-8 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                placeholder="180,000"
                                type="number"
                            />
                        </div>
                        {errors.maxSalary && (
                            <p className="mt-1 text-xs font-medium text-error">
                                {errors.maxSalary}
                            </p>
                        )}
                    </div>
                </div>
            </section>
            {/*  Section 4: Job Details  */}
            <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                <div className="mb-6 flex items-center gap-2">
                    <span
                        className="material-symbols-outlined text-xl text-primary"
                        data-icon="description"
                    >
                        description
                    </span>
                    <h3 className="text-lg font-semibold">Job Details</h3>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                            Job Description
                        </label>
                        <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
                            <textarea
                                name="description"
                                defaultValue={job?.description}
                                className="w-full border-none bg-transparent p-4 text-sm text-on-surface-variant focus:ring-0"
                                placeholder="Describe the role, responsibilities, and team culture..."
                                rows={6}
                            ></textarea>
                        </div>
                        {errors.description && (
                            <p className="mt-1 text-xs font-medium text-error">
                                {errors.description}
                            </p>
                        )}
                    </div>
                </div>
            </section>
            {/*  Footer Actions  */}
            <footer className="flex items-center justify-end gap-4 pt-4 pb-20">
                <button
                    className="rounded-lg border border-transparent px-6 py-2.5 text-sm font-semibold text-secondary transition-colors transition-transform hover:border-outline-variant hover:text-on-surface active:scale-95"
                    type="button"
                >
                    Save as Draft
                </button>
                <button
                    className="rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95"
                    type="submit"
                >
                    {submitText}
                </button>
            </footer>
        </Form>
    );
}
