import { ConfirmDialog } from '@/components/confirm-dialog';
import { authClient } from '@/services/auth.http-service';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type { SignOutDialogProps } from './sign-out-dialog.d';

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const { setProfile } = useAuthenticationStore();

  const handleSignOut = () => {
    void authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setProfile(undefined);
        },
      },
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  );
}
