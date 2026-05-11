export interface JobPosting {
    id: number;
    title: string;
    location: string;
    employment_type?: string;
    work_place_type?: string;
    min_salary?: number;
    max_salary?: number;
    description?: string;
    status?: string;
    employer: {
        id: number;
        name: string;
    };
    created_at?: string;
}

export interface Candidate {
    id: number;
    name: string;
    email: string;
}

export interface Application {
    id: number;
    status: string;
    created_at: string;
    job_posting: JobPosting;
    candidate: Candidate;
}

export interface ApplicationStats {
    total: number;
    pending?: number;
    shortlisted?: number;
    interviewing?: number;
    offers?: number;
}

export interface JobPostingOption {
    id: number;
    title: string;
}