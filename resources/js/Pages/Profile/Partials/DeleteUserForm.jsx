import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import Modal from "@/Components/Modal";
import { Input } from "@/Components/ui/input";
import { useForm, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function DeleteUserForm({ className = "" }) {
  const { auth } = usePage().props;
  const isSocialUser = auth.user.has_password === false;
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef();

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors,
  } = useForm({
    password: "",
    confirm_deletion: isSocialUser ? false : undefined,
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser = (e) => {
    e.preventDefault();
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => (isSocialUser ? null : passwordInput.current?.focus()),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);
    clearErrors();
    reset();
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-sky-900">Delete Account</h2>
        <p className="mt-1 text-sm text-sky-900/70">
          Once your account is deleted, all of its resources and data will be
          permanently deleted. Before deleting your account, please download any
          data or information that you wish to retain.
        </p>
      </header>

      <Button variant="destructive" onClick={confirmUserDeletion}>
        Delete Account
      </Button>

      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <form onSubmit={deleteUser} className="p-6">
          <h2 className="text-lg font-medium text-sky-900">
            Are you sure you want to delete your account?
          </h2>

          <p className="mt-1 text-sm text-sky-900/70">
            Once your account is deleted, all of its resources and data will be
            permanently deleted.
            {!isSocialUser
              ? " Please enter your password to confirm you would like to permanently delete your account."
              : " This action cannot be undone."}
          </p>

          {!isSocialUser ? (
            <div className="mt-6">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                name="password"
                ref={passwordInput}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="mt-1"
                placeholder="Password"
              />

              <InputError message={errors.password} className="mt-2" />
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center">
                <input
                  id="confirm_deletion"
                  name="confirm_deletion"
                  type="checkbox"
                  className="h-4 w-4 text-sky-800 border-gray-300 rounded focus:ring-sky-600"
                  checked={data.confirm_deletion}
                  onChange={(e) =>
                    setData("confirm_deletion", e.target.checked)
                  }
                />
                <label
                  htmlFor="confirm_deletion"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I confirm that I want to delete my account
                </label>
              </div>
              <InputError message={errors.confirm_deletion} className="mt-2" />
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="ml-3"
              disabled={processing || (isSocialUser && !data.confirm_deletion)}
            >
              Delete Account
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
