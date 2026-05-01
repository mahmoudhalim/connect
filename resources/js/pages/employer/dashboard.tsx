import { Head } from '@inertiajs/react';
import React from 'react';
import EmployerLayout from '@/layouts/EmployerLayout';

export default function EmployerDashboard() {
    return (
        <>
            <Head title="Employer Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Dashboard Overview</h1>
                        <p className="text-on-surface-variant mt-1 text-sm">Manage your active postings and candidate pipeline.</p>
                    </div>
                    <button className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-5 py-2.5 rounded font-medium text-sm transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Post a Job
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-surface-container border border-outline-variant rounded p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-on-surface-variant mb-4">
                            <span className="text-sm font-medium">Active Jobs</span>
                            <span className="material-symbols-outlined text-[20px]">work</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-on-surface">12</span>
                            <span className="text-tertiary text-sm flex items-center"><span className="material-symbols-outlined text-[16px]">arrow_upward</span> 2</span>
                        </div>
                    </div>
                    <div className="bg-surface-container border border-outline-variant rounded p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-on-surface-variant mb-4">
                            <span className="text-sm font-medium">Total Applications</span>
                            <span className="material-symbols-outlined text-[20px]">description</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-on-surface">148</span>
                            <span className="text-tertiary text-sm flex items-center"><span className="material-symbols-outlined text-[16px]">arrow_upward</span> 14%</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

EmployerDashboard.layout = (page: React.ReactNode) => <EmployerLayout>{page}</EmployerLayout>;
