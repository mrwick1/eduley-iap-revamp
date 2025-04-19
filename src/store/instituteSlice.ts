import { create, StateCreator } from 'zustand';

export interface Institute {
    id: number;
    preview_url: string;
    default_currency: Currency;
    country: Country;
    state: State;
    name: string;
    contact_name: string;
    email: string;
    tagline: string;
    timezone: string;
    address: string;
    phone: string;
    logo: string;
    footer_logo: string;
    favicon: string;
    certificate_signature: string;
    gamification_reward_icon: string;
    primary_color: string;
    secondary_color: string;
    school_type: string;
    filer_account_number: string;
    flying_club_school_type: string;
    payment_method: string;
    terms_and_condition_link: string;
    media_release: string;
    student_handbook: string;
    instagram_link: string | null;
    youtube_link: string | null;
    facebook_link: string | null;
    twitter_link: string | null;
    stripe_public_key: string;
    stripe_secret_key: string;
    ghl_sub_account_id: string;
    ghl_api_key: string;
    allowed_to_change_payment_method: boolean;
    show_institute_in_common_page: boolean;
    enable_cohort_attendance: boolean;
    live_session_enabled: boolean;
    enable_ai_features: boolean;
    enable_click2pay: boolean;
    allow_gamification: boolean;
    gamification_method: string;
    is_active: boolean;
    meta_pixel_code: string;
    apply_refund_policy: boolean;
    minimum_cohort_attendance_percentage: number;
}

export interface Currency {
    id: number;
    currency_name: string;
    currency_description: string;
    is_default: boolean;
    short_code: string;
    prefix: string;
    suffix: string | null;
}

export interface Country {
    id: number;
    name: string;
}

export interface State {
    id: number;
    name: string;
}

export interface InstituteState {
    institute: Institute | null;
    setInstitute: (institute: Institute | null) => void;
}

export const instituteSlice: StateCreator<InstituteState> = (set) => ({
    institute: null,
    setInstitute: (institute: Institute | null) => set({ institute }),
});

export const useInstituteStore = create<InstituteState>((...a) => ({
    ...instituteSlice(...a),
}));
