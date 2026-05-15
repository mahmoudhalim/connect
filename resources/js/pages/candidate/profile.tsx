import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { Auth } from '@/types';
import CandidateLayout from '@/layouts/CandidateLayout';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CandidateProfile {
    id?: number;
    user_id: number;
    headline?: string;
    bio?: string;
    location?: string;
    phone?: string;
    portfolio_url?: string;
    linkedin_url?: string;
    resume_path?: string;
    experience_years?: number;
    education?: string;
    skills?: string;
}

interface Props {
    profile?: CandidateProfile;
}

export default function Profile({ profile }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const existingResumePath = profile?.resume_path ?? '';
    const initialSkills = Array.isArray(profile?.skills)
        ? profile.skills.join(', ')
        : (profile?.skills ?? '');

    const [headline, setHeadline] = useState(profile?.headline ?? '');
    const [bio, setBio] = useState(profile?.bio ?? '');
    const [location, setLocation] = useState(profile?.location ?? '');
    const [phone, setPhone] = useState(profile?.phone ?? '');
    const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolio_url ?? '');
    const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url ?? '');
    const [experienceYears, setExperienceYears] = useState(
        profile?.experience_years ?? '',
    );
    const [education, setEducation] = useState(profile?.education ?? '');
    const [skills, setSkills] = useState(initialSkills);
    const [resumePath, setResumePath] = useState(existingResumePath);
    const [resumeRemoved, setResumeRemoved] = useState(false);

    return (
        <CandidateLayout>
            <Head title="My Profile" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-on-surface">My Profile</h1>
                <p className="text-on-surface-variant text-sm">
                    Build your candidate profile to stand out to employers
                </p>
            </div>

            <div className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-8 max-w-2xl">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                            person
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-on-surface">{auth.user.name}</p>
                        <p className="text-sm text-on-surface-variant">{auth.user.email}</p>
                    </div>
                </div>

                <div className="h-px bg-outline-variant" />

                <Form
                    method="patch"
                    encType="multipart/form-data"
                    options={{ preserveScroll: true }}
                >
                    {({ errors, processing }) => (
                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                        Professional Headline
                                    </label>
                                    <Input
                                        name="headline"
                                        value={headline}
                                        onChange={(e) => setHeadline(e.target.value)}
                                        placeholder="e.g. Senior Full-Stack Developer"
                                        maxLength={255}
                                    />
                                    {errors.headline && (
                                        <p className="text-sm text-error">{errors.headline}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                        Location
                                    </label>
                                    <Input
                                        name="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Cairo, Egypt"
                                        maxLength={255}
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-error">{errors.location}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                    Bio / Summary
                                </label>
                                <Textarea
                                    name="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell employers about yourself, your experience, and what makes you unique..."
                                    rows={5}
                                    maxLength={2000}
                                    className="resize-none"
                                />
                                {errors.bio && (
                                    <p className="text-sm text-error">{errors.bio}</p>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                        Phone
                                    </label>
                                    <Input
                                        name="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="e.g. +20 1XX XXX XXXX"
                                        maxLength={30}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-error">{errors.phone}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                        Years of Experience
                                    </label>
                                    <Input
                                        name="experience_years"
                                        type="number"
                                        value={experienceYears}
                                        onChange={(e) => setExperienceYears(e.target.value)}
                                        placeholder="e.g. 5"
                                        min={0}
                                        max={50}
                                        step={0.5}
                                    />
                                    {errors.experience_years && (
                                        <p className="text-sm text-error">{errors.experience_years}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                    Education
                                </label>
                                <Input
                                    name="education"
                                    value={education}
                                    onChange={(e) => setEducation(e.target.value)}
                                    placeholder="e.g. B.Sc. Computer Science, Cairo University"
                                    maxLength={500}
                                />
                                {errors.education && (
                                    <p className="text-sm text-error">{errors.education}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                    Skills
                                </label>
                                <Input
                                    name="skills"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    placeholder="e.g. React, Laravel, TypeScript, PostgreSQL"
                                    maxLength={1000}
                                />
                                <p className="text-xs text-on-surface-variant">
                                    Separate skills with commas
                                </p>
                                {errors.skills && (
                                    <p className="text-sm text-error">{errors.skills}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                    Portfolio URL
                                </label>
                                <Input
                                    name="portfolio_url"
                                    type="url"
                                    value={portfolioUrl}
                                    onChange={(e) => setPortfolioUrl(e.target.value)}
                                    placeholder="https://yourportfolio.com"
                                    maxLength={500}
                                />
                                {errors.portfolio_url && (
                                    <p className="text-sm text-error">{errors.portfolio_url}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                    LinkedIn URL
                                </label>
                                <Input
                                    name="linkedin_url"
                                    type="url"
                                    value={linkedinUrl}
                                    onChange={(e) => setLinkedinUrl(e.target.value)}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    maxLength={500}
                                />
                                {errors.linkedin_url && (
                                    <p className="text-sm text-error">{errors.linkedin_url}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <FileInput
                                    name="resume"
                                    accept=".pdf,.doc,.docx"
                                    label="Resume"
                                    hint="PDF or Word document, max 5MB"
                                    showPreview={false}
                                    value={resumePath}
                                    onValueChange={(val) => {
                                        if (val) {
                                            setResumeRemoved(false);
                                            setResumePath(val);
                                        }
                                    }}
                                />
                                {existingResumePath && (
                                    <div className="flex items-center justify-between gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2">
                                        <p className="text-xs text-on-surface-variant truncate">
                                            {resumeRemoved
                                                ? 'Existing resume will be removed on save.'
                                                : `Current: ${existingResumePath.split('/').pop()}`}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {!resumeRemoved && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={`/storage/${existingResumePath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Preview
                                                    </a>
                                                </Button>
                                            )}
                                            {resumeRemoved ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setResumeRemoved(false)}
                                                >
                                                    Undo
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setResumeRemoved(true)}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {resumeRemoved && (
                                    <input type="hidden" name="remove_resume" value="1" />
                                )}
                                {errors.resume && (
                                    <p className="text-sm text-error">{errors.resume}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </CandidateLayout>
    );
}