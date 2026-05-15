import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import EmployerLayout from '@/layouts/EmployerLayout';
import Pagination from '@/components/Pagination';
import type { CandidateProfile } from '@/types/candidate';
import type { PaginatedData } from '@/types/pagination';
import type { Auth } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useMemo } from 'react';

interface Filters {
    search?: string;
    location?: string;
    experienceMin?: string;
}

interface Props {
    candidates: PaginatedData<CandidateProfile>;
    filters?: Filters;
}

const experienceOptions = [
    { value: 'all', label: 'Any Level' },
    { value: '0', label: 'Entry (0-2 yrs)' },
    { value: '2', label: 'Mid (2-5 yrs)' },
    { value: '5', label: 'Senior (5-10 yrs)' },
    { value: '10', label: 'Lead (10+ yrs)' },
];

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function getExperienceLevel(years?: number): { label: string; class: string } {
    if (!years) return { label: 'Not specified', class: 'bg-surface-container text-on-surface-variant border-outline-variant' };
    if (years <= 2) return { label: 'Entry', class: 'bg-green-500/10 text-green-400 border-green-500/20' };
    if (years <= 5) return { label: 'Mid', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    if (years <= 10) return { label: 'Senior', class: 'bg-primary/10 text-primary border-primary/20' };
    return { label: 'Lead', class: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
}

export default function Index({ candidates, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [location, setLocation] = useState(filters?.location ?? '');
    const [experienceMin, setExperienceMin] = useState(
        filters?.experienceMin ?? 'all',
    );

    const activeFilterCount = useMemo(() => {
        return [
            search,
            location,
            experienceMin !== 'all' ? experienceMin : '',
        ].filter((v) => String(v || '').trim()).length;
    }, [search, location, experienceMin]);

    const applyFilters = () => {
        const params: Record<string, string> = { page: '1' };
        if (search) params.search = search;
        if (location) params.location = location;
        if (experienceMin !== 'all') params.experienceMin = experienceMin;
        router.get('/employer/candidates', params, {
            preserveScroll: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setLocation('');
        setExperienceMin('all');
        router.get('/employer/candidates', {}, {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <EmployerLayout>
            <Head title="Candidate Search" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-on-surface">
                    Candidate Search
                </h1>
                <p className="text-on-surface-variant text-sm">
                    Find and connect with talented professionals
                </p>
            </div>

            <div className="mb-8 rounded-xl border border-outline-variant bg-surface-container p-5 shadow-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-on-surface">
                                Search candidates
                            </p>
                            <p className="text-xs text-on-surface-variant">
                                Filter by keywords, location, and experience
                            </p>
                        </div>
                        {activeFilterCount > 0 && (
                            <div className="rounded-full bg-secondary-container/20 px-3 py-1 text-xs font-semibold text-secondary">
                                {activeFilterCount} active
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="lg:col-span-2">
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Keywords
                            </label>
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by headline, skills, or bio..."
                                className="bg-surface-container-lowest"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Location
                            </label>
                            <Input
                                value={location}
                                onChange={(e) =>
                                    setLocation(e.target.value)
                                }
                                placeholder="City or region"
                                className="bg-surface-container-lowest"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-secondary">
                                Min Experience
                            </label>
                            <Select
                                value={experienceMin}
                                onValueChange={setExperienceMin}
                            >
                                <SelectTrigger className="w-full bg-surface-container-lowest">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {experienceOptions.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" onClick={applyFilters}>
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetFilters}
                        >
                            Reset
                        </Button>
                        <span className="ml-auto text-sm text-on-surface-variant">
                            {candidates.total} candidate
                            {candidates.total !== 1 ? 's' : ''} found
                        </span>
                    </div>
                </div>
            </div>

            {candidates.data.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-outline-variant bg-surface-container">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">
                            person_search
                        </span>
                        <p className="text-on-surface-variant">
                            No candidates found. Try adjusting your filters.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {candidates.data.map((candidate) => {
                            const exp = getExperienceLevel(
                                candidate.experience_years,
                            );
                            return (
                                <Link
                                    key={candidate.id}
                                    href={`/employer/candidates/${candidate.id}`}
                                    className="group flex flex-col rounded-xl border border-outline-variant bg-surface-container p-5 transition-colors duration-200 hover:border-primary/50"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-highest border border-outline-variant text-on-surface-variant font-bold text-lg">
                                            {getInitials(
                                                candidate.user?.name ||
                                                    'Unknown',
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-on-surface truncate">
                                                {candidate.user?.name ||
                                                    'Unknown'}
                                            </p>
                                            {candidate.headline && (
                                                <p className="text-sm text-on-surface-variant truncate mt-0.5">
                                                    {candidate.headline}
                                                </p>
                                            )}
                                            {candidate.location && (
                                                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                                                    <span className="material-symbols-outlined text-xs">
                                                        location_on
                                                    </span>
                                                    {candidate.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {candidate.bio && (
                                        <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">
                                            {candidate.bio}
                                        </p>
                                    )}

                                    {(() => {
                                        const skillsArr = Array.isArray(candidate.skills)
                                            ? candidate.skills
                                            : typeof candidate.skills === 'string'
                                              ? candidate.skills.split(',').map((s: string) => s.trim())
                                              : [];
                                        if (!skillsArr.length) return null;
                                        return (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {skillsArr.slice(0, 5).map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 bg-surface-container-lowest border border-outline-variant rounded text-xs text-on-surface font-mono"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {skillsArr.length > 5 && (
                                                    <span className="px-2 py-0.5 bg-surface-container-lowest border border-outline-variant rounded text-xs text-on-surface-variant">
                                                        +{skillsArr.length - 5}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${exp.class}`}
                                        >
                                            {candidate.experience_years
                                                ? `${candidate.experience_years} yrs`
                                                : exp.label}
                                        </span>
                                        <span className="text-xs text-on-surface-variant flex items-center gap-1">
                                            View profile
                                            <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:translate-x-1">
                                                arrow_forward
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    <Pagination links={candidates.links} />
                </>
            )}
        </EmployerLayout>
    );
}
