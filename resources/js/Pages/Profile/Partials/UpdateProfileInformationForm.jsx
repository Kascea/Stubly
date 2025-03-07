import InputError from "@/Components/InputError";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = "",
  isGoogleUser = false,
}) {
  const user = usePage().props.auth.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      name: user.name,
      email: user.email,
    });

  const submit = (e) => {
    e.preventDefault();

    patch(route("profile.update"));
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-sky-900">
          Profile Information
        </h2>

        <p className="mt-1 text-sm text-sky-900/70">
          Update your account's profile information.
        </p>
      </header>

      {isGoogleUser && (
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
            You're signed in with Google. Some profile information is managed
            through your Google account.
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            className="mt-1"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            autoComplete="name"
          />

          <InputError className="mt-2" message={errors.name} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>

          {isGoogleUser ? (
            <div className="mt-1">
              <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                <span>{data.email}</span>
                <InfoIcon className="h-4 w-4 text-gray-400" />
                <span className="text-xs">Managed by Google</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                To change your email, please update it in your Google account
                settings.
              </p>
            </div>
          ) : (
            <>
              <Input
                id="email"
                type="email"
                className="mt-1"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
                autoComplete="username"
              />
              <InputError className="mt-2" message={errors.email} />
            </>
          )}
        </div>

        {mustVerifyEmail &&
          user.email_verified_at === null &&
          !isGoogleUser && (
            <div>
              <p className="mt-2 text-sm text-gray-800">
                Your email address is unverified.
                <Link
                  href={route("verification.send")}
                  method="post"
                  as="button"
                  className="rounded-md text-sm text-sky-900/70 underline hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  Click here to re-send the verification email.
                </Link>
              </p>

              {status === "verification-link-sent" && (
                <div className="mt-2 text-sm font-medium text-green-600">
                  A new verification link has been sent to your email address.
                </div>
              )}
            </div>
          )}

        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            disabled={processing || (isGoogleUser && true)}
          >
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
