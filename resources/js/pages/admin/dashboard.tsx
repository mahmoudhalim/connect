import { Head } from '@inertiajs/react';
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';

export default function AdminDashboard() {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Moderation Queue</h1>
                        <p className="text-on-surface-variant mt-1 text-sm">Review pending job posts, employer profiles, and user reports requiring administrative action.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-surface-container border border-outline-variant rounded p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-on-surface-variant mb-4">
                            <span className="text-sm font-medium">Pending Jobs</span>
                            <span className="material-symbols-outlined text-[20px]">work</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-on-surface">42</span>
                        </div>
                    </div>
                    <div className="bg-surface-container border border-outline-variant rounded p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-on-surface-variant mb-4">
                            <span className="text-sm font-medium">Flagged Users</span>
                            <span className="material-symbols-outlined text-[20px]">flag</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-error">7</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
