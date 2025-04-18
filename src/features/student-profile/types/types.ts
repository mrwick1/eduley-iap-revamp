export interface GamificationDetails {
    by: string | null;
    points: number | null;
    institute: number | null;
}

export interface StudentProfile {
    id: number;
    gamification_details: GamificationDetails;
    number_of_subscribed_course: number;
    email: string;
    profile_verified: string;
    full_name: string | null;
    created_date: string;
    modified_date: string;
    profile_photo: string | null;
    sin_number: string | null;
    student_no: string | null;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    nick_name: string | null;
    pronoun: string | null;
    gender: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    province: string | null;
    country: string | null;
    phone: string | null;
    date_of_birth: string | null;
    emergency_contact_full_name: string | null;
    emergency_contact_email: string | null;
    emergency_contact_relation: string | null;
    emergency_contact_phone: string | null;
    terms_condition: boolean;
    media_release: boolean;
    student_handbook: boolean;
    is_dummy: boolean;
    user: number;
    institute: number;
}

export interface ReportResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: StudentProfile[];
}
