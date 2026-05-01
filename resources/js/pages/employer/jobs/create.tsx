import { Head, Form, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import EmployerLayout from '@/layouts/EmployerLayout';

export default function CreateJob() {
    const { errors } = usePage<any>().props;
    const [workplaceType, setWorkplaceType] = useState('Hybrid');
    const [employmentType, setEmploymentType] = useState('Full-time');
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');

    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim() !== '') {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) {
                setSkills([...skills, skillInput.trim()]);
            }
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    return (
        <>
            <Head title="Post a Job" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                            Post a New Job
                        </h1>
                        <p className="mt-1 text-sm text-on-surface-variant">
                            Create a new job listing to find candidates.
                        </p>
                    </div>
                </div>
                <Form
                    action="/employer/jobs"
                    method="post"
                    className="space-y-8"
                >
                    {/*  Section 1: Basic Information  */}
                    <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                        <div className="mb-6 flex items-center gap-2">
                            <span
                                className="material-symbols-outlined text-xl text-primary"
                                data-icon="info"
                            >
                                info
                            </span>
                            <h3 className="text-lg font-semibold">
                                Basic Information
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                                    Job Title
                                </label>
                                <input
                                    name="title"
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Senior Software Engineer"
                                    type="text"
                                />
                                {errors.title && <p className="mt-1 text-xs font-medium text-error">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                                    Department
                                </label>
                                <select
                                    name="department"
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                >
                                    <option>Engineering</option>
                                    <option>Design</option>
                                    <option>Product</option>
                                    <option>Marketing</option>
                                    <option>Operations</option>
                                </select>
                                {errors.department && <p className="mt-1 text-xs font-medium text-error">{errors.department}</p>}
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                                    Employment Type
                                </label>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                    {[
                                        'Full-time',
                                        'Contract',
                                        'Part-time',
                                        'Freelance',
                                    ].map((type) => (
                                        <label
                                            key={type}
                                            className={`cursor-pointer rounded-lg border px-4 py-2.5 text-center text-xs font-semibold transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary ${
                                                employmentType !== type &&
                                                'border-outline-variant bg-surface-container-lowest hover:bg-surface-variant'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="employmentType"
                                                value={type}
                                                checked={
                                                    employmentType === type
                                                }
                                                onChange={() =>
                                                    setEmploymentType(type)
                                                }
                                                className="sr-only"
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                                {errors.employmentType && <p className="mt-1 text-xs font-medium text-error">{errors.employmentType}</p>}
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
                                    {['Remote', 'Hybrid', 'On-site'].map(
                                        (type) => (
                                            <label
                                                key={type}
                                                className={`cursor-pointer rounded-lg border px-2 py-2.5 text-center text-xs font-semibold transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary ${
                                                    workplaceType !== type &&
                                                    'border-outline-variant bg-surface-container-lowest hover:bg-surface-variant'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="workplaceType"
                                                    value={type}
                                                    checked={
                                                        workplaceType === type
                                                    }
                                                    onChange={() =>
                                                        setWorkplaceType(type)
                                                    }
                                                    className="sr-only"
                                                />
                                                {type}
                                            </label>
                                        ),
                                    )}
                                </div>
                                {errors.workplaceType && <p className="mt-1 text-xs font-medium text-error">{errors.workplaceType}</p>}
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
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-10 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                        placeholder="San Francisco, CA"
                                        type="text"
                                    />
                                </div>
                                {errors.location && <p className="mt-1 text-xs font-medium text-error">{errors.location}</p>}
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
                            <h3 className="text-lg font-semibold">
                                Compensation
                            </h3>
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
                                        name="min_salary"
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-8 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                        placeholder="120,000"
                                        type="number"
                                    />
                                </div>
                                {errors.min_salary && <p className="mt-1 text-xs font-medium text-error">{errors.min_salary}</p>}
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
                                        name="max_salary"
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-8 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                        placeholder="180,000"
                                        type="number"
                                    />
                                </div>
                                {errors.max_salary && <p className="mt-1 text-xs font-medium text-error">{errors.max_salary}</p>}
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
                            <h3 className="text-lg font-semibold">
                                Job Details
                            </h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                                    Job Description
                                </label>
                                <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
                                    <textarea
                                        name="description"
                                        className="w-full border-none bg-transparent p-4 text-sm text-on-surface-variant focus:ring-0"
                                        placeholder="Describe the role, responsibilities, and team culture..."
                                        rows={6}
                                    ></textarea>
                                </div>
                                {errors.description && <p className="mt-1 text-xs font-medium text-error">{errors.description}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                                    Required Skills
                                </label>
                                <div className="flex flex-wrap gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest p-2 transition-all focus-within:ring-2 focus-within:ring-primary">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                                        >
                                            {skill}
                                            <button
                                                className="material-symbols-outlined text-[14px]"
                                                data-icon="close"
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveSkill(skill)
                                                }
                                            >
                                                close
                                            </button>
                                            <input
                                                type="hidden"
                                                name="skills[]"
                                                value={skill}
                                            />
                                        </span>
                                    ))}
                                    <input
                                        className="min-w-[120px] flex-1 border-none bg-transparent py-1 text-sm focus:ring-0"
                                        placeholder="Add more... (press Enter to add)"
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) =>
                                            setSkillInput(e.target.value)
                                        }
                                        onKeyDown={handleAddSkill}
                                    />
                                </div>
                                {errors.skills && <p className="mt-1 text-xs font-medium text-error">{errors.skills}</p>}
                            </div>
                        </div>
                    </section>
                    {/*  Section 5: Company Branding  */}
                    <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                        <div className="mb-6 flex items-center gap-2">
                            <span
                                className="material-symbols-outlined text-xl text-primary"
                                data-icon="image"
                            >
                                image
                            </span>
                            <h3 className="text-lg font-semibold">
                                Company Branding
                            </h3>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-secondary uppercase">
                                Company Logo
                            </label>
                            <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant p-10 transition-all hover:border-primary/50 hover:bg-primary/5">
                                <span
                                    className="material-symbols-outlined mb-4 text-4xl text-outline transition-colors group-hover:text-primary"
                                    data-icon="cloud_upload"
                                >
                                    cloud_upload
                                </span>
                                <p className="text-sm font-medium text-on-surface">
                                    Drag and drop your logo here
                                </p>
                                <p className="mt-1 text-xs text-secondary">
                                    SVG, PNG, JPG (max. 2MB)
                                </p>
                                <input
                                    name="logo"
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                    type="file"
                                />
                            </div>
                            {errors.logo && <p className="mt-1 text-xs font-medium text-error">{errors.logo}</p>}
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
                            Publish Listing
                        </button>
                    </footer>
                </Form>
            </div>
        </>
    );
}

CreateJob.layout = (page: React.ReactNode) => (
    <EmployerLayout>{page}</EmployerLayout>
);
