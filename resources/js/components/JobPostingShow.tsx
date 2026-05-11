import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Job {
    id: number;
    title: string;
    location: string;
    employmentType: string;
    workPlaceType: string;
    minSalary: number;
    maxSalary: number;
    description: string;
    requirements?: string;
    benefits?: string;
    deadline?: string;
    status: string;
    experience_level?: string;
    company_logo?: string;
    category?: { name: string } | null;
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
    user?: { name: string; email: string };
}

const formatSalary = (min: number, max: number) => `$${min.toLocaleString()} - $${max.toLocaleString()}`;
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
};
const getExperienceLabel = (level: string) => {
    const labels: Record<string, string> = { entry: '0-2 Years', mid: '2-5 Years', senior: '5-10 Years', lead: '10+ Years', executive: 'Director+' };
    return labels[level] || level || 'Any';
};

export default function JobPostingShow({ job, showApply = false, showApplyButton, showLoginPrompt = false, user }: JobPostingShowProps) {
    const shouldShowApplyButton = showApplyButton ?? showApply;
    const [showForm, setShowForm] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        job_posting_id: job.id,
        contact_email: user?.email || '',
        contact_phone: '',
        portfolio_url: '',
        resume: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/candidate/applications', {
            onSuccess: () => { setShowForm(false); reset(); },
        });
    };

    if (showForm) {
        return (
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="mb-8 pb-6 border-b border-outline-variant">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-xs font-semibold text-primary tracking-wide">{job.employmentType}</span>
                        <span className="text-xs text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {job.workPlaceType}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-2">{job.title}</h1>
                    <p className="text-lg text-on-surface-variant flex items-center gap-2">Applying to <span className="font-bold text-on-surface">{job.employer.name}</span></p>
                </div>

                <section className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-on-surface flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary">person</span> Personal Information
                        </h2>
                        <p className="text-sm text-on-surface-variant">Provide your basic contact details.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">Email Address <span className="text-error">*</span></Label>
                            <Input id="contact_email" type="email" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} placeholder="jane@example.com" className="bg-surface-container" />
                            {errors.contact_email && <p className="text-sm text-error">{errors.contact_email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_phone">Phone Number</Label>
                            <Input id="contact_phone" type="tel" value={data.contact_phone} onChange={(e) => setData('contact_phone', e.target.value)} placeholder="+1 (555) 000-0000" className="bg-surface-container" />
                            {errors.contact_phone && <p className="text-sm text-error">{errors.contact_phone}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="portfolio_url">Portfolio / LinkedIn URL</Label>
                            <Input id="portfolio_url" type="url" value={data.portfolio_url} onChange={(e) => setData('portfolio_url', e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="bg-surface-container" />
                            {errors.portfolio_url && <p className="text-sm text-error">{errors.portfolio_url}</p>}
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-on-surface flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary">upload_file</span> Resume / CV
                        </h2>
                        <p className="text-sm text-on-surface-variant">Upload your resume (PDF, DOC, or DOCX).</p>
                    </div>
                    <div
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-outline-variant hover:border-primary/50'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
                        <input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setData('resume', e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant">cloud_upload</span>
                            <div className="space-y-1">
                                <p className="text-on-surface font-medium">{data.resume ? data.resume.name : 'Drag and drop your resume here'}</p>
                                <p className="text-sm text-on-surface-variant">{data.resume ? 'Click to change file' : 'or click to browse'}</p>
                            </div>
                            {data.resume && (
                                <button type="button" onClick={(e) => { e.stopPropagation(); setData('resume', null); }} className="text-sm text-error hover:underline">Remove file</button>
                            )}
                        </div>
                    </div>
                    {errors.resume && <p className="text-sm text-error">{errors.resume}</p>}
                </section>

                <div className="pt-8 border-t border-outline-variant flex flex-col-reverse md:flex-row justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); reset(); }}>Cancel</Button>
                    <Button type="submit" disabled={processing} className="flex items-center justify-center gap-2">{processing ? 'Submitting...' : 'Submit Application'}<span className="material-symbols-outlined text-[20px]">send</span></Button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <header className="space-y-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-2">{job.title}</h1>
                            <div className="flex items-center gap-2 text-on-surface-variant text-base">
                                <span className="font-medium text-on-surface">{job.employer.name}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                    {job.location}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-on-surface border border-outline-variant">{job.employmentType}</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-tertiary border border-outline-variant">
                                <span className="material-symbols-outlined text-[14px] mr-1">bolt</span> {job.status === 'active' ? 'Active' : job.status}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-surface-container p-4 rounded-lg border border-outline-variant flex flex-col gap-1">
                            <span className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Salary</span>
                            <span className="text-on-surface font-semibold text-lg">{formatSalary(job.minSalary, job.maxSalary)}</span>
                        </div>
                        
                        <div className="bg-surface-container p-4 rounded-lg border border-outline-variant flex flex-col gap-1">
                            <span className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Experience</span>
                            <span className="text-on-surface font-semibold text-lg">{getExperienceLabel(job.experience_level || '')}</span>
                        </div>
                        <div className="bg-surface-container p-4 rounded-lg border border-outline-variant flex flex-col gap-1">
                            <span className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Posted</span>
                            <span className="text-on-surface font-semibold text-lg">{formatDate(job.created_at)}</span>
                        </div>
                    </div>
                </header>
                <hr className="border-outline-variant" />

                <section className="space-y-8 text-on-surface-variant leading-relaxed text-base">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-on-surface tracking-tight">About the Role</h2>
                        <p>{job.description}</p>
                    </div>
                    {job.requirements && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-on-surface tracking-tight">Requirements</h2>
                            <div className="whitespace-pre-wrap">{job.requirements}</div>
                        </div>
                    )}
                    {job.benefits && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-on-surface tracking-tight">Benefits</h2>
                            <div className="whitespace-pre-wrap">{job.benefits}</div>
                        </div>
                    )}
                </section>
                
            </div>

            <div className="lg:col-span-1 space-y-6">
                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant space-y-4">
                    <div className="space-y-3">
                        {shouldShowApplyButton && (
                            <Button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2">
                                Apply Now <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </Button>
                        )}
                        <button className="w-full bg-transparent hover:bg-surface-variant text-on-surface border border-outline-variant font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">bookmark_add</span> Save for Later
                        </button>
                    </div>
                    <p className="text-xs text-on-surface-variant text-center font-medium">Over 100 applicants. Apply soon.</p>
                </div>

                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-surface-container-lowest rounded-lg border border-outline-variant flex items-center justify-center p-2 overflow-hidden">
                            {job.company_logo ? (
                                <img src={`/storage/${job.company_logo}`} alt={job.employer.name} className="w-full h-full object-contain" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 rounded flex items-center justify-center text-on-surface font-bold text-xl">{job.employer.name[0]}</div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-on-surface">{job.employer.name}</h3>
                            <button className="text-primary hover:text-primary-container text-sm font-medium flex items-center gap-1 transition-colors">
                                View Profile <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">A leading tech company building the future of web development.</p>
                    <div className="space-y-2 pt-2 border-t border-outline-variant">
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-[16px]">public</span>
                            <a className="hover:text-primary transition-colors" href="#">vercel.com</a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-[16px]">group</span>
                            <span>500 - 1,000 Employees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-[16px]">domain</span>
                            <span>{job.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            

            {showLoginPrompt && (
                <div className="border-t border-outline-variant pt-6">
                    <p className="text-on-surface-variant">
                        Please <a href="/login" className="text-primary hover:underline">login</a> to apply for this job.
                    </p>
                </div>
            )}
        </div>
    );
}