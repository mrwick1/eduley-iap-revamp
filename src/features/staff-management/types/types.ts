export interface Staff {
    id: number;
    institute: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    profile_photo: string | null;
    groups: number[];
    is_active: boolean;
    instructor_id: number;
}

export interface StaffResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Staff[];
}
