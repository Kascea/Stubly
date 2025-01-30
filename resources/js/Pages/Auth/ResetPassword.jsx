import { Head, useForm } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Link } from "@inertiajs/react";

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors } = useForm({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post(route("password.store"));
  };

  return (
    <GuestLayout>
      <Head title="Reset Password" />

      <h2 className="text-2xl font-bold text-sky-900 text-center mb-6">
        Reset Password
      </h2>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={data.email}
            className="w-full"
            autoComplete="username"
            onChange={(e) => setData("email", e.target.value)}
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <div>
          <Input
            id="password"
            type="password"
            placeholder="New password"
            value={data.password}
            className="w-full"
            autoComplete="new-password"
            onChange={(e) => setData("password", e.target.value)}
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <Input
            id="password_confirmation"
            type="password"
            placeholder="Confirm new password"
            value={data.password_confirmation}
            className="w-full"
            autoComplete="new-password"
            onChange={(e) => setData("password_confirmation", e.target.value)}
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <button
          className="w-full bg-sky-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-sky-800 transition-colors flex items-center justify-center group"
          disabled={processing}
        >
          Reset Password
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
    </GuestLayout>
  );
}
