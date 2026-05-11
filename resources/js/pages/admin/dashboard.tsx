import { Head } from '@inertiajs/react';
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Stats {
    pendingJobs: number;
    activeJobs: number;
    totalUsers: number;
    totalEmployers: number;
    totalCandidates: number;
}

export default function AdminDashboard({ stats }: { stats: Stats }) {
    const statsData = [
        { label: 'Pending Jobs', value: stats.pendingJobs, icon: 'pending_actions', color: 'text-yellow-500' },
        { label: 'Active Jobs', value: stats.activeJobs, icon: 'work', color: 'text-primary' },
        { label: 'Total Users', value: stats.totalUsers, icon: 'people', color: 'text-on-surface' },
        { label: 'Employers', value: stats.totalEmployers, icon: 'badge', color: 'text-cyan-500' },
        { label: 'Candidates', value: stats.totalCandidates, icon: 'person_search', color: 'text-violet-500' },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Admin Dashboard</h1>
                        <p className="text-on-surface-variant mt-1 text-sm">Overview of platform statistics and pending actions.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statsData.map((stat, i) => (
                        <div key={i} className="bg-surface-container border border-outline-variant rounded-lg p-5 flex flex-col hover:border-outline transition-colors relative overflow-hidden">
                            <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
                                <span className={`material-symbols-outlined text-lg ${stat.color}`}>{stat.icon}</span>
                                {stat.label}
                            </div>
                            <span className="text-3xl font-bold text-on-surface">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
