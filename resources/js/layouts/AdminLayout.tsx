import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import type { Auth } from '@/types/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth?.user;

    return (
        <div className="bg-background text-on-background font-body antialiased h-screen overflow-hidden flex dark">
            {/* SideNavBar (Web Only) */}
            <nav className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-outline-variant bg-[#09090b] text-sm transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col lg:flex-shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-outline-variant p-6">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface-container">
                        {/* Placeholder Logo */}
                        <div className="h-full w-full bg-primary/20"></div>
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tighter text-violet-400">{user?.name || 'Admin Portal'}</h1>
                        <p className="text-xs text-on-surface-variant">Unified Role View</p>
                    </div>
                </div>

                {/* CTA Area */}
                <div className="border-b border-outline-variant p-4">
                    <button className="flex w-full items-center justify-center gap-2 rounded border border-outline-variant bg-surface-container px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-bright">
                        <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                        Switch Role
                    </button>
                </div>

                {/* Main Navigation */}
                <div className="flex-1 space-y-1 overflow-y-auto py-4">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 border-l-4 border-violet-400 bg-[#18181b] px-4 py-3 text-violet-400 transition-transform active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/admin/moderation" className="flex items-center gap-3 border-l-4 border-transparent px-4 py-3 text-[#a1a1aa] transition-transform hover:bg-[#0c0c0f] hover:text-[#fafafa] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                        <span>Moderation Queue</span>
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 border-l-4 border-transparent px-4 py-3 text-[#a1a1aa] transition-transform hover:bg-[#0c0c0f] hover:text-[#fafafa] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                        <span>User Management</span>
                    </Link>
                    <Link href="/admin/employers" className="flex items-center gap-3 border-l-4 border-transparent px-4 py-3 text-[#a1a1aa] transition-transform hover:bg-[#0c0c0f] hover:text-[#fafafa] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]">fact_check</span>
                        <span>Employer Verifications</span>
                    </Link>
                    <Link href="/admin/analytics" className="flex items-center gap-3 border-l-4 border-transparent px-4 py-3 text-[#a1a1aa] transition-transform hover:bg-[#0c0c0f] hover:text-[#fafafa] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]">analytics</span>
                        <span>Platform Analytics</span>
                    </Link>
                    <Link href="/admin/config" className="flex items-center gap-3 border-l-4 border-transparent px-4 py-3 text-[#a1a1aa] transition-transform hover:bg-[#0c0c0f] hover:text-[#fafafa] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
                        <span>System Config</span>
                    </Link>
                </div>

                {/* Footer Navigation */}
                <div className="space-y-1 border-t border-outline-variant p-4">
                    <Link href="/help" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[#a1a1aa] transition-colors hover:bg-[#0c0c0f] hover:text-[#fafafa]">
                        <span className="material-symbols-outlined text-[20px]">help</span>
                        <span>Help Center</span>
                    </Link>
                    <Link href="/logout" method="post" as="button" className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[#a1a1aa] transition-colors hover:bg-[#0c0c0f] hover:text-[#fafafa]">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
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
                        <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#fafafa] lg:hidden">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <span className="text-xl font-bold tracking-tighter text-[#fafafa]">Obsidian Jobs</span>
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
