import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />
            
            <h2 className="text-2xl font-bold text-sky-900 text-center mb-4">Reset Password</h2>
            
            <p className="mb-6 text-gray-600">
                Enter your email address and we'll send you a password reset link.
            </p>

            {status && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        placeholder="Email address"
                        className="w-full"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <Button 
                    disabled={processing}
                    className="w-full bg-sky-900 hover:bg-sky-800 text-white flex items-center justify-center gap-2"
                >
                    Send Reset Link
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </form>
        </GuestLayout>
    );
}