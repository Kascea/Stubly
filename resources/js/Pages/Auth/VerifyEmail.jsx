import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import AuthLayout from "@/Layouts/AuthLayout";
import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, MailCheck } from "lucide-react";

export default function VerifyEmail({ status, auth }) {
  const { post, processing } = useForm({});
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Add a countdown timer for resending verification emails
  useEffect(() => {
    if (status === "verification-link-sent") {
      setCanResend(false);
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((current) => {
          if (current <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return current - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status]);

  const submit = (e) => {
    e.preventDefault();
    post(route("verification.send"));
  };

  return (
    <AuthLayout title="Email Verification">
      <Head title="Email Verification" />

      <div className="mb-6 flex flex-col items-center text-center">
        <MailCheck className="h-12 w-12 text-sky-600 mb-4" />
        <h1 className="text-xl font-semibold text-sky-900 mb-2">
          Verify Your Email Address
        </h1>
        <p className="text-sm text-sky-900/70">
          Thanks for signing up! Before getting started, we need to verify your
          email address.{" "}
          {status === "verification-link-sent"
            ? "We've just sent"
            : "We've sent"}{" "}
          a verification link to{" "}
          <span className="font-medium">{auth.user.email}</span>.
        </p>
      </div>

      {status === "verification-link-sent" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 flex items-start">
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Verification email sent!</p>
            <p>
              A verification link has been sent to your email address. Please
              check your inbox and spam folder.
            </p>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6 text-sm text-yellow-800">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Email verification required</p>
            <p>
              You won't be able to access all features until you verify your
              email address.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submit}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            If you didn't receive the email, check your spam folder or click
            below to send another verification email.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              disabled={processing || !canResend}
              className="w-full sm:w-auto bg-sky-800 hover:bg-sky-700 text-white"
              type="submit"
            >
              {processing
                ? "Sending..."
                : countdown > 0
                ? `Send another in ${countdown}s`
                : "Send Another Email"}
            </Button>

            <Link
              href={route("logout")}
              method="post"
              as="button"
              className="text-sm text-sky-800 underline hover:text-sky-700"
            >
              Log Out
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
