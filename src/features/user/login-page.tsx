import { LoginForm } from './components/login-form';
import { Head } from '@/components/seo';

export default function LoginPage() {
    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <LoginForm />
                </div>
            </div>
        </>
    );
}
