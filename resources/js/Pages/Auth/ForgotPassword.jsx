import { Head, useForm, Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import AuthLayout from "@/Layouts/AuthLayout";

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post(route("password.email"));
  };

  return (
    <AuthLayout title="Forgot Password">
      <Head title="Forgot Password" />

      <div className="mb-4 text-sm text-sky-900/70">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </div>

      {status && (
        <div className="mb-4 font-medium text-sm text-green-600">{status}</div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <div>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Email address"
            value={data.email}
            className="w-full"
            autoComplete="username"
            onChange={(e) => setData("email", e.target.value)}
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <button
          className="w-full bg-sky-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-sky-800 transition-colors flex items-center justify-center group"
          disabled={processing}
        >
          Email Password Reset Link
          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-sky-900/70">
        Remember your password?{" "}
        <Link
          href={route("login")}
          className="font-semibold text-orange-400 hover:text-orange-500"
        >
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
