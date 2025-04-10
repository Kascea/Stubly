import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({ auth, mustVerifyEmail, status }) {
  const isGoogleUser = !auth.user.has_password;

  return (
    <AppLayout>
      <Head title="Profile" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-xl"
              isGoogleUser={isGoogleUser}
            />
          </div>

          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <UpdatePasswordForm
              className="max-w-xl"
              hasPassword={auth.user.has_password}
            />
          </div>

          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <DeleteUserForm className="max-w-xl" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
