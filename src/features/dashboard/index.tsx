import { Search } from '@/components/search';
import { Head } from '@/components/seo';
import { Header } from '@/components/sidebar/Header';
import { Main } from '@/layout/main';

export default function Dashboard() {
    return (
        <div className="flex h-screen flex-col">
            <Head title="Dashboard" />
            <Header>
                <Search />
            </Header>

            <Main fixed>
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome to the dashboard</p>
                </div>
            </Main>
        </div>
    );
}
