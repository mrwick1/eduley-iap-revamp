import ContentSection from '@/components/content-section';
import { AppearanceForm } from './components/appearance-form';

export default function AppearancePage() {
    return (
        <ContentSection
            title="Appearance"
            desc="Customize the appearance of the app. Automatically switch between day
          and night themes."
        >
            <AppearanceForm />
        </ContentSection>
    );
}
