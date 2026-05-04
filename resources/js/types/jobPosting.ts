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
}

export default JobPosting;
