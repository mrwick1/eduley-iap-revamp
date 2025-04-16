import ContentSection from '@/components/content-section';
import ProfileForm from './components/profile-form';
import { Head } from '@/components/seo';

export default function Profile() {
    return (
        <>
            <Head title="Profile" />
            <ContentSection title="Profile" desc="This is how others will see you on the site.">
                <ProfileForm />
            </ContentSection>
        </>
    );
}
