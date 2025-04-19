import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { useFont } from '@/context/font-context';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fonts } from '@/config/fonts';
import { toast } from 'sonner';

const appearanceFormSchema = z.object({
    theme: z.enum(['light', 'dark'], {
        required_error: 'Please select a theme.',
    }),
    font: z.enum(fonts, {
        invalid_type_error: 'Select a font',
        required_error: 'Please select a font.',
    }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export function AppearanceForm() {
    const { font, setFont } = useFont();
    const { theme, setTheme } = useTheme();

    const defaultValues: Partial<AppearanceFormValues> = {
        theme: theme === 'system' ? 'light' : (theme as 'light' | 'dark'),
        font,
    };

    const form = useForm<AppearanceFormValues>({
        resolver: zodResolver(appearanceFormSchema),
        defaultValues,
    });

    function onSubmit(data: AppearanceFormValues) {
        if (data.font !== font) setFont(data.font);
        if (data.theme !== theme) setTheme(data.theme);
        toast.success('Preferences updated successfully');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="font"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Font</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select a font" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {fonts.map((font) => (
                                        <SelectItem key={font} value={font} className={cn(`font-${font}`)}>
                                            <span className="capitalize">{font}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>Set the font you want to use in the dashboard.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>Theme</FormLabel>
                            <FormDescription>Select the theme for the dashboard.</FormDescription>
                            <FormMessage />
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid max-w-md grid-cols-2 gap-8 pt-2"
                            >
                                <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="light" className="sr-only" />
                                        </FormControl>
                                        <div className="border-muted hover:border-accent items-center rounded-md border-2 p-1">
                                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                                <div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
                                                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                                                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                                                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">Light</span>
                                    </FormLabel>
                                </FormItem>
                                <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="dark" className="sr-only" />
                                        </FormControl>
                                        <div className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground items-center rounded-md border-2 p-1">
                                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-xs">
                                                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                                                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                                                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">Dark</span>
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormItem>
                    )}
                />

                <Button type="submit" variant="outline">
                    Update preferences
                </Button>
            </form>
        </Form>
    );
}
