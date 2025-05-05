import { useParams } from '@tanstack/react-router';
import { Search } from '@/components/search';
import { Head } from '@/components/seo';
import { Header } from '@/components/sidebar/Header';
import { studentDetailsRoute } from '@/app/routes/student-profile-route';
import { Main } from '@/layout/main';

export default function StudentDetails() {
    const { id } = useParams({ from: studentDetailsRoute.id });

    console.log('Student ID:', id);

    return (
        <div className="flex h-screen flex-col">
            <Head title={`Student Details - ${id}`} />
            <Header>
                <Search />
            </Header>
            <Main>
                <div className="mb-2 flex flex-wrap items-end justify-between space-y-2 gap-y-2.5">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Student Details</h1>
                        <p className=" text-muted-foreground text-sm md:text-base">
                            Overview of key information related to an individual student, including their personal and
                            academic details
                        </p>
                    </div>
                </div>
            </Main>
        </div>
    );
}
