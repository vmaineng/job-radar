export type Contact = { 
    full_name: string | null;
    title: string | null;
    email: string | null;
    linkedin_search_url: string | null;
    source:string;
}

export type Job = {
    id: string;
    title: string;
    company: string;
    location: string;
    is_remote: boolean;
    apply_url: string;
    relevance_score: number; 
    relevance_reason: string;
    status: string;
    contacts: Contact[];
}