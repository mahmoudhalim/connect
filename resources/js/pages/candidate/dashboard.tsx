import { Head } from '@inertiajs/react';
import React from 'react';
import CandidateLayout from '@/layouts/CandidateLayout';

export default function CandidateDashboard() {
    return (
        <>
            <Head title="Candidate Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Welcome back</h1>
                        <p className="text-on-surface-variant mt-1 text-sm">Here is what is happening with your job applications.</p>
                    </div>
                    <button className="bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-bright px-5 py-2.5 rounded font-medium text-sm transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                        Find Jobs
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-surface-container border border-outline-variant rounded p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-on-surface-variant mb-4">
                            <span className="text-sm font-medium">Active Applications</span>
                            <span className="material-symbols-outlined text-[20px]">description</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-on-surface">5</span>
                        </div>
                    </div>
                    <div className="bg-surface-container border border-outline-variant rounded p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-on-surface-variant mb-4">
                            <span className="text-sm font-medium">Saved Jobs</span>
                            <span className="material-symbols-outlined text-[20px]">bookmark</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-on-surface">12</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

CandidateDashboard.layout = (page: React.ReactNode) => <CandidateLayout>{page}</CandidateLayout>;
