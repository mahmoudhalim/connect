import type { InertiaLinkProps } from '@inertiajs/react';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

dayjs.extend(relativeTime);

export function formatDate(dateString: string | Date): string {
    const targetDate = dayjs(dateString);
    const today = dayjs();

    const diffInDays = today.diff(targetDate, 'day');

    if (diffInDays > 7) {
        return targetDate.format('MMMM D, YYYY');
    }

    return targetDate.fromNow();
}
