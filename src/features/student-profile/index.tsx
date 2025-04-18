import { Search } from '@/components/search';
import { Head } from '@/components/seo';
import { Header } from '@/components/sidebar/Header';
import { Separator } from '@/components/ui/separator';
import { Main } from '@/layout/main';
import { StudentProfilePrimaryButtons } from './components/primary-button';

export default function StudentProfile() {
    return (
        <div className="flex h-screen flex-col">
            <Head title="Student Profile" />
            <Header>
                <Search />
            </Header>

            <Main fixed>
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Student Profile</h1>
                        <p className=" text-muted-foreground ">
                            See all students here. Check their profile status, courses taken, and points. Filter by
                            status, search names, and download the list as an Excel file.
                        </p>
                    </div>
                    <StudentProfilePrimaryButtons />
                </div>
                <Separator className="my-4 lg:my-6" />
            </Main>
        </div>
    );
}
