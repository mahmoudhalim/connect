import { Form, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import EmployerLayout from '@/layouts/EmployerLayout';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CompanyProfileData {
    id?: number;
    user_id?: number;
    company_name?: string;
    company_logo?: string;
    company_description?: string;
    website?: string;
    industry?: string;
    company_size?: string;
    location?: string;
    founded_year?: number;
}

interface Props {
    profile?: CompanyProfileData;
}

const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'E-commerce',
    'Marketing',
    'Consulting',
    'Manufacturing',
    'Media',
    'Real Estate',
    'Transportation',
    'Energy',
    'Non-profit',
    'Government',
    'Other',
];

const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1,000 employees' },
    { value: '1000+', label: '1,000+ employees' },
];

export default function Index({ profile }: Props) {
    const { errors } = usePage<any>().props;
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [industry, setIndustry] = useState(profile?.industry ?? '');
    const [companySize, setCompanySize] = useState(profile?.company_size ?? '');

    const handleCancel = () => {
        if (isDirty) {
            setShowCancelConfirm(true);
        } else {
            router.visit('/dashboard');
        }
    };

    const existingLogoUrl = profile?.company_logo
        ? `/storage/${profile.company_logo}`
        : '';

    return (
        <EmployerLayout>
            <Head title="Company Profile" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-on-surface">
                    Company Profile
                </h1>
                <p className="text-on-surface-variant text-sm">
                    Manage your company information visible to candidates
                </p>
            </div>

            <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-8 max-w-2xl">
                <Form
                    method="patch"
                    action="/employer/company"
                    encType="multipart/form-data"
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                    onSubmit={() => setIsDirty(false)}
                >
                    <input type="hidden" name="industry" value={industry} />
                    <input type="hidden" name="company_size" value={companySize} />

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                            Company Name <span className="text-error">*</span>
                        </label>
                        <Input
                            name="company_name"
                            defaultValue={profile?.company_name}
                            placeholder="e.g. Acme Inc."
                            maxLength={255}
                            onChange={() => setIsDirty(true)}
                        />
                        {errors.company_name && <p className="mt-1 text-xs font-medium text-error">{errors.company_name}</p>}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Industry
                            </label>
                            <Select
                                value={industry}
                                onValueChange={(v) => { setIndustry(v); setIsDirty(true); }}
                            >
                                <SelectTrigger className="w-full bg-surface-container-lowest">
                                    <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((ind) => (
                                        <SelectItem key={ind} value={ind}>
                                            {ind}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.industry && <p className="mt-1 text-xs font-medium text-error">{errors.industry}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Company Size
                            </label>
                            <Select
                                value={companySize}
                                onValueChange={(v) => { setCompanySize(v); setIsDirty(true); }}
                            >
                                <SelectTrigger className="w-full bg-surface-container-lowest">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companySizes.map((size) => (
                                        <SelectItem
                                            key={size.value}
                                            value={size.value}
                                        >
                                            {size.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.company_size && <p className="mt-1 text-xs font-medium text-error">{errors.company_size}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                            Company Description
                        </label>
                        <Textarea
                            name="company_description"
                            defaultValue={profile?.company_description}
                            placeholder="Tell candidates about your company's mission, culture, and values..."
                            rows={5}
                            maxLength={2000}
                            className="resize-none"
                            onChange={() => setIsDirty(true)}
                        />
                        {errors.company_description && <p className="mt-1 text-xs font-medium text-error">{errors.company_description}</p>}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Website
                            </label>
                            <Input
                                name="website"
                                type="url"
                                defaultValue={profile?.website}
                                placeholder="https://example.com"
                                maxLength={500}
                                onChange={() => setIsDirty(true)}
                            />
                            {errors.website && <p className="mt-1 text-xs font-medium text-error">{errors.website}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Location
                            </label>
                            <Input
                                name="location"
                                defaultValue={profile?.location}
                                placeholder="e.g. San Francisco, CA"
                                maxLength={255}
                                onChange={() => setIsDirty(true)}
                            />
                            {errors.location && <p className="mt-1 text-xs font-medium text-error">{errors.location}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                            Founded Year
                        </label>
                        <Input
                            name="founded_year"
                            type="number"
                            defaultValue={profile?.founded_year}
                            placeholder="e.g. 2015"
                            min={1800}
                            max={new Date().getFullYear()}
                            onChange={() => setIsDirty(true)}
                        />
                        {errors.founded_year && <p className="mt-1 text-xs font-medium text-error">{errors.founded_year}</p>}
                    </div>

                    <div className="space-y-2">
                        <FileInput
                            name="logo"
                            accept="image/jpg,image/jpeg,image/png,image/webp"
                            label="Company Logo"
                            hint="Upload your company logo (max 2MB, jpg/png/webp)"
                            value={existingLogoUrl}
                            showPreview
                            onValueChange={() => setIsDirty(true)}
                        />
                        {errors.logo && <p className="mt-1 text-xs font-medium text-error">{errors.logo}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Company Profile</Button>
                    </div>
                </Form>
            </div>

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
                                onClick={() => router.visit('/dashboard')}
                            >
                                Discard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </EmployerLayout>
    );
}
