import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';

interface NavItem {
    title: string;
    href: string;
    icon: string;
}

const sidebarNavItems: NavItem[] = [
    { title: 'Profile', href: '/settings/profile', icon: 'person' },
    { title: 'Security', href: '/settings/security', icon: 'lock' },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="px-4 py-6">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-4 w-fit"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <Heading
                    title="Settings"
                    description="Manage your profile and account settings"
                />
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-12">
                <aside className="w-full shrink-0 lg:w-64">
                    <nav className="flex flex-col gap-1">
                        {sidebarNavItems.map((item) => {
                            const active = isCurrentOrParentUrl(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 border-l-4 px-4 py-3 text-sm transition-transform active:scale-[0.98]',
                                        active
                                            ? 'border-violet-400 bg-[#18181b] text-violet-400 font-medium'
                                            : 'border-transparent text-[#a1a1aa] hover:bg-[#0c0c0f] hover:text-[#fafafa]',
                                    )}
                                >
                                    <span
                                        className="material-symbols-outlined text-[20px]"
                                        style={{
                                            fontVariationSettings: active
                                                ? "'FILL' 1"
                                                : "'FILL' 0",
                                        }}
                                    >
                                        {item.icon}
                                    </span>
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <div className="h-px bg-outline-variant my-6 lg:hidden" />

                <div className="flex-1 min-w-0">
                    <section className="max-w-xl space-y-10">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}