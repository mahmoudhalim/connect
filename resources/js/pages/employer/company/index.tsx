import { Form, Head, usePage } from '@inertiajs/react';
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
import type { Auth } from '@/types/auth';

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
    const [companyName, setCompanyName] = useState(profile?.company_name ?? '');
    const [companyLogo, setCompanyLogo] = useState(profile?.company_logo ?? '');
    const [companyDescription, setCompanyDescription] = useState(
        profile?.company_description ?? '',
    );
    const [website, setWebsite] = useState(profile?.website ?? '');
    const [industry, setIndustry] = useState(profile?.industry ?? '');
    const [companySize, setCompanySize] = useState(profile?.company_size ?? '');
    const [location, setLocation] = useState(profile?.location ?? '');
    const [foundedYear, setFoundedYear] = useState(
        profile?.founded_year ?? '',
    );

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
                >
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                            Company Name
                        </label>
                        <Input
                            name="company_name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Acme Inc."
                            maxLength={255}
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Industry
                            </label>
                            <Select
                                value={industry}
                                onValueChange={setIndustry}
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
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Company Size
                            </label>
                            <Select
                                value={companySize}
                                onValueChange={setCompanySize}
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
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                            Company Description
                        </label>
                        <Textarea
                            name="company_description"
                            value={companyDescription}
                            onChange={(e) =>
                                setCompanyDescription(e.target.value)
                            }
                            placeholder="Tell candidates about your company's mission, culture, and values..."
                            rows={5}
                            maxLength={2000}
                            className="resize-none"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Website
                            </label>
                            <Input
                                name="website"
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://example.com"
                                maxLength={500}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Location
                            </label>
                            <Input
                                name="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. San Francisco, CA"
                                maxLength={255}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                            Founded Year
                        </label>
                        <Input
                            name="founded_year"
                            type="number"
                            value={foundedYear}
                            onChange={(e) => setFoundedYear(e.target.value)}
                            placeholder="e.g. 2015"
                            min={1800}
                            max={new Date().getFullYear()}
                        />
                    </div>

                    <div className="space-y-2">
                        <FileInput
                            name="logo"
                            accept="image/jpg,image/jpeg,image/png,image/webp"
                            label="Company Logo"
                            hint="Upload your company logo (max 2MB, jpg/png/webp)"
                            value={companyLogo}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input type="hidden" name="_method" value="PATCH" />
                        <Button type="submit">Save Company Profile</Button>
                    </div>
                </Form>
            </div>
        </EmployerLayout>
    );
}
