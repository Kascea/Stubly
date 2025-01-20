import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Input } from "@/Components/ui/input";
import InputError from '@/Components/InputError';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-orange-50">
            <Head title="Log in" />
            <div className="flex min-h-screen flex-col items-center pt-16 sm:pt-32">
                <Link href="/">
                    <img src="/images/CustomTicketsLogo.png" alt="CustomTickets" className="h-12 w-auto mb-8" />
                </Link>

                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-sky-900 text-center mb-6">Welcome back</h2>
                    
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email address"
                                value={data.email}
                                className="w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={data.password}
                                className="w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-sky-900 shadow-sm focus:ring-sky-500"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-sky-900 hover:text-sky-800"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button
                            className="w-full bg-sky-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-sky-800 transition-colors flex items-center justify-center group"
                            disabled={processing}
                        >
                            Sign in
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <Link
                            href={route('google.login')}
                            className="mt-6 w-full bg-white flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.27028 9.7049L1.28027 6.60986C0.470274 8.22986 0 10.0599 0 11.9999C0 13.9399 0.470274 15.7699 1.28027 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                                <path d="M12.0003 24C15.2353 24 17.9502 22.935 19.9452 21.095L16.0802 18.095C15.0152 18.82 13.6703 19.245 12.0003 19.245C8.87028 19.245 6.21525 17.135 5.26498 14.29L1.28027 17.385C3.25527 21.31 7.31028 24 12.0003 24Z" fill="#34A853"/>
                            </svg>
                            Sign in with Google
                        </Link>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href={route('register')} className="font-semibold text-orange-400 hover:text-orange-500">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}