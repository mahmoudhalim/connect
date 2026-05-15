export interface CandidateProfile {
    id: number;
    user_id: number;
    avatar_path?: string;
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
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}
