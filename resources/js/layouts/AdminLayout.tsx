import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import type { Auth } from '@/types/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth?.user;
    const { url } = usePage();

    const isActive = (path: string) => url.startsWith(path);

    const navLinkClass = (path: string) => {
        const active = isActive(path);
        return `flex items-center gap-3 border-l-4 px-4 py-3 text-sm transition-transform active:scale-[0.98] ${
            active
                ? 'border-violet-400 bg-[#18181b] text-violet-400 font-medium'
                : 'border-transparent text-[#a1a1aa] hover:bg-[#0c0c0f] hover:text-[#fafafa]'
        }`;
    };

    const iconStyle = (path: string) => ({
        fontVariationSettings: isActive(path) ? "'FILL' 1" : "'FILL' 0",
    });

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { href: '/admin/moderation', label: 'Moderation Queue', icon: 'pending_actions' },
        { href: '/admin/categories', label: 'Categories', icon: 'category' },
        { href: '/admin/users', label: 'User Management', icon: 'manage_accounts' },
        { href: '/admin/employers', label: 'Employer Verifications', icon: 'fact_check' },
        { href: '/admin/analytics', label: 'Platform Analytics', icon: 'analytics' },
        { href: '/admin/config', label: 'System Config', icon: 'settings_suggest' },
    ];

    return (
        <div className="bg-background text-on-background font-body antialiased h-screen overflow-hidden flex dark">
            {/* SideNavBar */}
            <nav className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-outline-variant bg-[#09090b] text-sm transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col lg:flex-shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-outline-variant p-6">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface-container">
                        <div className="h-full w-full bg-primary/20"></div>
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tighter text-violet-400">{user?.name || 'Admin Portal'}</h1>
                        <p className="text-xs text-on-surface-variant">Administrator</p>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="flex-1 space-y-1 overflow-y-auto py-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={navLinkClass(item.href)}
                        >
                            <span className="material-symbols-outlined text-[20px]" style={iconStyle(item.href)}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Footer Navigation */}
                <div className="space-y-1 border-t border-outline-variant p-4">
                    <Link href="/logout" method="post" as="button" className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[#a1a1aa] transition-colors hover:bg-[#0c0c0f] hover:text-[#fafafa]">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span>Logout</span>
                    </Link>
                </div>
            </nav>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Main Content Wrapper */}
            <div className="flex h-full w-full flex-1 flex-col bg-surface-container-lowest">
                {/* TopNavBar (Mobile) */}
                <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#27272a] bg-[#09090b] px-6 text-[#fafafa] lg:hidden">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#fafafa] lg:hidden">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <span className="text-xl font-bold tracking-tighter text-[#fafafa]">Connect Admin</span>
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
