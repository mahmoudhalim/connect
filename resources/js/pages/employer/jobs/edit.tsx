import { Head } from '@inertiajs/react';
import React from 'react';
import JobForm from '@/components/JobForm';
import EmployerLayout from '@/layouts/EmployerLayout';

interface EditJobProps {
    jobPosting: any;
}

export default function EditJob({ jobPosting }: EditJobProps) {
    return (
        <>
            <Head title={`Edit Job: ${jobPosting.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                            Edit Job
                        </h1>
                        <p className="mt-1 text-sm text-on-surface-variant">
                            Update the details of your job listing.
                        </p>
                    </div>
                </div>

                <JobForm
                    job={jobPosting}
                    action={`/employer/jobs/${jobPosting.id}`}
                    method="put"
                    submitText="Update Listing"
                />
            </div>
        </>
    );
}

EditJob.layout = (page: React.ReactNode) => (
    <EmployerLayout>{page}</EmployerLayout>
);
