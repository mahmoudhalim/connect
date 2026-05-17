import { Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import type { Auth } from '@/types/auth';

export default function CandidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const { auth } = usePage<{ auth: Auth }>().props;
    const { url } = usePage();
    const user = auth?.user;

    useEffect(() => {
        const stored = localStorage.getItem('appearance');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(stored === 'dark' || (stored === 'system' && prefersDark));
    }, []);

    const toggleTheme = () => {
        const newMode = isDark ? 'light' : 'dark';
        localStorage.setItem('appearance', newMode);
        document.documentElement.classList.toggle('dark', newMode === 'dark');
        setIsDark(newMode === 'dark');
    };

    const isActive = (path: string, isExact: boolean = false) => {
        if (isExact) {
            return path === url;
        }

        return url.startsWith(path);
    };

    const getLinkClasses = (path: string, isExact: boolean = false) => {
        const activeClasses =
            'border-primary bg-surface-container text-primary font-medium';
        const inactiveClasses =
            'border-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface';

        return `flex items-center gap-3 border-l-4 px-4 py-3 transition-transform active:scale-[0.98] ${
            isActive(path, isExact) ? activeClasses : inactiveClasses
        }`;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background font-body text-on-background antialiased">
            {/* SideNavBar */}
            <nav
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-outline-variant bg-surface-container-lowest text-sm transition-transform duration-300 ease-in-out lg:static lg:flex lg:flex-shrink-0 lg:translate-x-0 lg:flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-outline-variant p-6">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface-container">
                        <div className="h-full w-full bg-primary/20"></div>
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-primary">
                            {user?.name || 'Candidate Portal'}
                        </h1>
                        <p className="text-xs text-on-surface-variant">
                            Job Seeker Profile
                        </p>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
                    <Link
                        href="/candidate/dashboard"
                        className={getLinkClasses('/candidate/dashboard')}
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{
                                fontVariationSettings: isActive(
                                    '/candidate/dashboard',
                                )
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                            }}
                        >
                            dashboard
                        </span>
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/jobs"
                        className={getLinkClasses('/jobs', true)}
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{
                                fontVariationSettings: isActive('/jobs', true)
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                            }}
                        >
                            work
                        </span>
                        <span>Job Search</span>
                    </Link>
                    <Link
                        href="/candidate/applications"
                        className={getLinkClasses('/candidate/applications')}
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{
                                fontVariationSettings: isActive(
                                    '/candidate/applications',
                                )
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                            }}
                        >
                            description
                        </span>
                        <span>My Applications</span>
                    </Link>
                    <Link
                        href="/candidate/saved"
                        className={getLinkClasses('/candidate/saved')}
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{
                                fontVariationSettings: isActive(
                                    '/candidate/saved',
                                )
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                            }}
                        >
                            bookmark
                        </span>
                        <span>Saved Jobs</span>
                    </Link>
                    <Link
                        href="/candidate/profile"
                        className={getLinkClasses('/candidate/profile', true)}
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{
                                fontVariationSettings: isActive(
                                    '/candidate/profile',
                                    true,
                                )
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                            }}
                        >
                            person
                        </span>
                        <span>Profile</span>
                    </Link>
                    <Link
                        href="/candidate/profile/view"
                        className={getLinkClasses('/candidate/profile/view', true)}
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{
                                fontVariationSettings: isActive(
                                    '/candidate/profile/view',
                                    true,
                                )
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                            }}
                        >
                            visibility
                        </span>
                        <span>View Profile</span>
                    </Link>
                    <Link
                        href="/settings/profile"
                        className={getLinkClasses('/settings/profile')}
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{
                                fontVariationSettings: isActive(
                                    '/settings/profile',
                                )
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                            }}
                        >
                            settings
                        </span>
                        <span>Settings</span>
                    </Link>
                </div>

                {/* Footer Navigation */}
                <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant p-4">
                    <button
                        onClick={toggleTheme}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {isDark ? 'light_mode' : 'dark_mode'}
                        </span>
                        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            logout
                        </span>
                        <span>Logout</span>
                    </Link>
                </div>
            </nav>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Wrapper */}
            <div className="flex h-full w-full flex-1 flex-col bg-surface-container-lowest">
                {/* TopNavBar (Mobile mainly) */}
                <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6 text-on-surface lg:hidden">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-on-surface lg:hidden"
                        >
                            <span className="material-symbols-outlined">
                                menu
                            </span>
                        </button>
                        <Link
                            href="/candidate/dashboard"
                            className="text-xl font-bold tracking-tighter text-on-surface"
                        >
                            Obsidian Jobs
                        </Link>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="text-on-surface"
                    >
                        <span className="material-symbols-outlined">
                            {isDark ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
