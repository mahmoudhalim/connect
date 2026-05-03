import { Head } from '@inertiajs/react';
import React from 'react';
import EmployerLayout from '@/layouts/EmployerLayout';
import JobForm from '@/components/JobForm';

export default function CreateJob() {
    return (
        <>
            <Head title="Post a Job" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                            Post a New Job
                        </h1>
                        <p className="mt-1 text-sm text-on-surface-variant">
                            Create a new job listing to find candidates.
                        </p>
                    </div>
                </div>
                
                <JobForm 
                    action="/employer/jobs"
                    method="post"
                    submitText="Publish Listing"
                />
            </div>
        </>
    );
}

CreateJob.layout = (page: React.ReactNode) => (
    <EmployerLayout>{page}</EmployerLayout>
);