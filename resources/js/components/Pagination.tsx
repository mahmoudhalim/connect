import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types';

export default function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) return null; // Only Previous, 1, Next

    return (
        <div className="mt-8 flex flex-wrap justify-center gap-1">
            {links.map((link, index) => {
                // Laravel returns "&laquo; Previous" and "Next &raquo;" for labels
                // We'll clean them up or leave them as is
                const label = link.label
                    .replace('&laquo;', '«')
                    .replace('&raquo;', '»')
                    .replace('Previous', '')
                    .replace('Next', '')
                    .trim() || link.label.replace('&laquo;', '«').replace('&raquo;', '»');

                const isPreviousOrNext = link.label.includes('Previous') || link.label.includes('Next');

                if (link.url === null) {
                    return (
                        <div
                            key={index}
                            className="mr-1 mb-1 rounded border border-outline-variant px-4 py-3 text-sm leading-4 text-on-surface-variant opacity-50"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        className={`mr-1 mb-1 rounded border px-4 py-3 text-sm leading-4 transition-colors hover:bg-surface-variant focus:border-primary focus:text-primary ${
                            link.active
                                ? 'border-primary bg-primary/10 text-primary font-bold'
                                : 'border-outline-variant bg-surface-container-lowest text-on-surface'
                        }`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </div>
    );
}
