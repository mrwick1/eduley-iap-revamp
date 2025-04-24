import { Badge } from './badge';

export function Status({ text, status }: { text: string; status: 'success' | 'warning' | 'error' }) {
    if (status === 'success') {
        return (
            <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" /> {text}
            </Badge>
        );
    }
    if (status === 'warning') {
        return (
            <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />
                {text}
            </Badge>
        );
    }
    if (status === 'error') {
        return (
            <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" />
                {text}{' '}
            </Badge>
        );
    }
}
