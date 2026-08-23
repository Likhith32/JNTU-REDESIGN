import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { changeAdminCredentials, getCurrentAdmin } from "@/auth/auth.server";
import { toast } from "sonner";
import { KeyRound, Shield } from "lucide-react";
import {
  AccountSettingsLayout,
  PasswordInput,
  PasswordRulesChecklist,
  SettingsError,
  SettingsField,
  SettingsSection,
  SettingsSubmitButton,
} from "@/components/AccountSettingsLayout";

export const Route = createFileRoute("/admin-account-settings")({
  component: AdminAccountSettingsPage,
});

function AdminAccountSettingsPage() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    role: string;
    authProvider: string;
  } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    getCurrentAdmin()
      .then((admin) => {
        if (!admin) {
          setProfile(null);
          return;
        }
        setProfile({
          name: admin.name,
          email: admin.email,
          role: admin.role,
          authProvider: admin.authProvider || "email",
        });
      })
      .catch(() => setProfile(null));
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-sm text-muted-foreground">
          Sign in as an administrator to manage your account.
        </p>
        <button
          onClick={() => navigate({ to: "/mgmt-9f3a2b1c" })}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      await changeAdminCredentials({ data: { currentPassword, newPassword } });
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountSettingsLayout
      accent="admin"
      icon={KeyRound}
      roleLabel="Administrator"
      title="Account Settings"
      description="Manage the credentials for your university administration account."
      back={{ label: "Back to site", href: "/" }}
    >
      {profile && (
        <div className="rounded-2xl border border-border bg-sand/50 px-4 py-3.5 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Shield size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink truncate">{profile.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {profile.email} · {profile.role.replace("_", " ")}
            </p>
          </div>
        </div>
      )}

      <SettingsError message={errorMsg} />

      {profile?.authProvider === "google" ? (
        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-4 text-sm text-sky-900 leading-relaxed">
          This account signs in with Google. Password changes are not available here — manage
          access through your Google account instead.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <SettingsSection
            title="Verify identity"
            description="Confirm your current password before setting a new one."
          >
            <SettingsField label="Current password" required>
              <PasswordInput
                accent="admin"
                value={currentPassword}
                onChange={setCurrentPassword}
                disabled={loading}
                required
                autoFocus
                placeholder="Current password"
              />
            </SettingsField>
          </SettingsSection>

          <div className="h-px bg-border" />

          <SettingsSection
            title="New password"
            description="Use a strong unique password for administrative access."
          >
            <div className="space-y-4">
              <SettingsField label="New password" required>
                <PasswordInput
                  accent="admin"
                  value={newPassword}
                  onChange={setNewPassword}
                  disabled={loading}
                  required
                  showStrength
                  placeholder="Create a strong password"
                />
              </SettingsField>

              <PasswordRulesChecklist password={newPassword} minLength={12} />

              <SettingsField label="Confirm new password" required>
                <PasswordInput
                  accent="admin"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  disabled={loading}
                  required
                  placeholder="Re-enter new password"
                />
              </SettingsField>
            </div>
          </SettingsSection>

          <SettingsSubmitButton accent="admin" loading={loading}>
            Update password
          </SettingsSubmitButton>
        </form>
      )}
    </AccountSettingsLayout>
  );
}
