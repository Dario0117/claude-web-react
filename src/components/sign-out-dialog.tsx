import { ConfirmDialog } from '@/components/confirm-dialog';
import { useLogoutMutation } from '@/services/users.http-service';
import type { SignOutDialogProps } from './sign-out-dialog.d';

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const logout = useLogoutMutation();

  const handleSignOut = () => {
    logout.mutate({});
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
