import { Head, useForm } from '@inertiajs/react';
import { Input } from "@/Components/ui/input";
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { ChevronRight } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <h2 className="text-2xl font-bold text-sky-900 text-center mb-4">Confirm Password</h2>

            <p className="mb-6 text-gray-600">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </p>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={data.password}
                        className="w-full"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <button
                    className="w-full bg-sky-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-sky-800 transition-colors flex items-center justify-center group"
                    disabled={processing}
                >
                    Confirm Password
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </GuestLayout>
    );
}