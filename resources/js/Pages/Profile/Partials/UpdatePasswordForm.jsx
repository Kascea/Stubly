import { Alert, AlertDescription } from "@/Components/ui/alert";
import InputError from "@/Components/InputError";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";

export default function UpdatePasswordForm({
  className = "",
  hasPassword = false,
}) {
  if (!hasPassword) {
    return (
      <section className={className}>
        <header>
          <h2 className="text-lg font-medium text-sky-900">Password</h2>
        </header>

        <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path
              d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
              fill="#EA4335"
            />
            <path
              d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
              fill="#4285F4"
            />
            <path
              d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.27028 9.7049L1.28027 6.60986C0.470274 8.22986 0 10.0599 0 11.9999C0 13.9399 0.470274 15.7699 1.28027 17.3899L5.26498 14.2949Z"
              fill="#FBBC05"
            />
            <path
              d="M12.0003 24C15.2353 24 17.9502 22.935 19.9452 21.095L16.0802 18.095C15.0152 18.82 13.6703 19.245 12.0003 19.245C8.87028 19.245 6.21525 17.135 5.26498 14.29L1.28027 17.385C3.25527 21.31 7.31028 24 12.0003 24Z"
              fill="#34A853"
            />
          </svg>
          <div className="text-sm text-sky-900/70">
            You're signed in with Google. Continue using Google to sign in to
            your account.
          </div>
        </div>
      </section>
    );
  }

  const passwordInput = useRef();
  const currentPasswordInput = useRef();

  const { data, setData, errors, put, reset, processing, recentlySuccessful } =
    useForm({
      current_password: "",
      password: "",
      password_confirmation: "",
    });

  const updatePassword = (e) => {
    e.preventDefault();

    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset("password", "password_confirmation");
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          reset("current_password");
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-sky-900">Update Password</h2>

        <p className="mt-1 text-sm text-sky-900/70">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </header>

      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="current_password">Current Password</Label>
          <Input
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) => setData("current_password", e.target.value)}
            type="password"
            className="mt-1"
            autoComplete="current-password"
          />
          <InputError message={errors.current_password} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            type="password"
            className="mt-1"
            autoComplete="new-password"
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <Input
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData("password_confirmation", e.target.value)}
            type="password"
            className="mt-1"
            autoComplete="new-password"
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="flex items-center gap-4">
          <Button variant="primary" disabled={processing}>
            Save
          </Button>

          <Transition
            show={recentlySuccessful}
            enterFrom="opacity-0"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-sky-900/70">Saved.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
