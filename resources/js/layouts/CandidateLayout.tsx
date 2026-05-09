import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import type { Auth } from '@/types/auth';

export default function CandidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { auth } = usePage<{ auth: Auth }>().props;
    const { url } = usePage();
    const user = auth?.user;

    const isActive = (path: string, isExact: boolean = false) => {
        if (isExact) {
            return path === url;
        }

        return url.startsWith(path);
    };

    const getLinkClasses = (path: string, isExact: boolean = false) => {
        const activeClasses =
            'border-violet-400 bg-[#18181b] text-violet-400 font-medium';
        const inactiveClasses =
            'border-transparent text-[#a1a1aa] hover:bg-[#0c0c0f] hover:text-[#fafafa]';

        return `flex items-center gap-3 border-l-4 px-4 py-3 transition-transform active:scale-[0.98] ${
            isActive(path, isExact) ? activeClasses : inactiveClasses
        }`;
    };

    return (
        <div className="dark flex h-screen overflow-hidden bg-background font-body text-on-background antialiased">
            {/* SideNavBar */}
            <nav
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-outline-variant bg-[#09090b] text-sm transition-transform duration-300 ease-in-out lg:static lg:flex lg:flex-shrink-0 lg:translate-x-0 lg:flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-outline-variant p-6">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface-container">
                        <div className="h-full w-full bg-primary/20"></div>
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-violet-400">
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
                        href="/candidate/applications"
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
                            person
                        </span>
                        <span>Profile</span>
                    </Link>
                    <Link
                        href="/settings"
                        className={getLinkClasses('/settings', true)}
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{
                                fontVariationSettings: isActive(
                                    '/settings',
                                    true,
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
                    <Link
                        href="/help"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-[#a1a1aa] transition-colors hover:bg-[#0c0c0f] hover:text-[#fafafa]"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            help
                        </span>
                        <span>Help Center</span>
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[#a1a1aa] transition-colors hover:bg-[#0c0c0f] hover:text-[#fafafa]"
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
                <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#27272a] bg-[#09090b] px-6 text-[#fafafa] lg:hidden">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-[#fafafa] lg:hidden"
                        >
                            <span className="material-symbols-outlined">
                                menu
                            </span>
                        </button>
                        <Link
                            href="/candidate/dashboard"
                            className="text-xl font-bold tracking-tighter text-[#fafafa]"
                        >
                            Obsidian Jobs
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
