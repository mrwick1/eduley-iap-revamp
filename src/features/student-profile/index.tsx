import { Search } from '@/components/search';
import { Head } from '@/components/seo';
import { Header } from '@/components/sidebar/Header';
import { Main } from '@/layout/main';
import { StudentProfilePrimaryButtons } from './components/primary-button';
import { DataTable } from './components/data-table';
import { StudentProfileProvider } from './context/student-profile-context';

export default function StudentProfile() {
    return (
        <StudentProfileProvider>
            <div className="flex h-screen flex-col">
                <Head title="Student Profile" />
                <Header>
                    <Search />
                </Header>

                <Main>
                    <div className="mb-2 flex flex-wrap items-end justify-between space-y-2 gap-y-2.5">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight md:text-2xl">Student Profile</h1>
                            <p className=" text-muted-foreground text-sm md:text-base">
                                See all students here. Check their profile status, courses taken, and points. Filter by
                                status, search names, and download the list as an Excel file.
                            </p>
                        </div>
                        <StudentProfilePrimaryButtons />
                    </div>

                    <DataTable />
                </Main>
            </div>
        </StudentProfileProvider>
    );
}
