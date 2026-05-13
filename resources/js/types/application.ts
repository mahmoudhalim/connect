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
        company_profile?: {
            company_name?: string;
            company_description?: string;
            website?: string;
            industry?: string;
            company_size?: string;
            location?: string;
            company_logo?: string;
        } | null;
    };
    created_at?: string;
}

export interface CandidateProfile {
    id?: number;
    headline?: string;
    bio?: string;
    location?: string;
    phone?: string;
    portfolio_url?: string;
    linkedin_url?: string;
    resume_path?: string;
    experience_years?: number;
    education?: string;
    skills?: string[];
}

export interface Candidate {
    id: number;
    name: string;
    email: string;
    candidate_profile?: CandidateProfile | null;
}

export interface Application {
    id: number;
    status: string;
    resume_path?: string;
    contact_email?: string;
    contact_phone?: string;
    portfolio_url?: string;
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