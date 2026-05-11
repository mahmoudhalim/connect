interface JobPosting {
    id?: number;
    title: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance';
    workPlaceType: 'hybrid' | 'remote' | 'onsite';
    location: string;
    minSalary: string;
    maxSalary: string;
    description: string;
    status?: 'pending' | 'active' | 'closed' | 'draft';
    category_id?: number | string;
    experience_level?: string;
    requirements?: string;
    benefits?: string;
    deadline?: string;
    company_logo?: string;
}

export default JobPosting;
