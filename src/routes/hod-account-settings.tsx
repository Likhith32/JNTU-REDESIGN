import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { changeHodCredentials } from "@/auth/hodAuth.server";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import {
  AccountSettingsLayout,
  PasswordInput,
  PasswordRulesChecklist,
  SettingsError,
  SettingsField,
  SettingsSection,
  SettingsSubmitButton,
} from "@/components/AccountSettingsLayout";

export const Route = createFileRoute("/hod-account-settings")({
  component: HodAccountSettingsPage,
});

function HodAccountSettingsPage() {
  const { hodDeptId } = useAdmin();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      await changeHodCredentials({ data: { currentPassword, newPassword } });
      toast.success("Department password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  if (!hodDeptId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-sm text-muted-foreground">
          Sign in as Head of Department to change your access password.
        </p>
        <a href="/dept-7e1c4d8a" className="text-sm font-semibold text-indigo-700 hover:underline">
          Go to HOD Login
        </a>
      </div>
    );
  }

  return (
    <AccountSettingsLayout
      accent="hod"
      icon={ShieldCheck}
      roleLabel="Head of Department"
      title="Account Settings"
      description="Change the password used to unlock and edit your department pages."
      back={{
        label: "Back to department dashboard",
        to: "/departments/$id",
        params: { id: hodDeptId },
      }}
    >
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-700 mb-1">
          Active department
        </p>
        <p className="text-sm font-bold text-ink uppercase">{hodDeptId}</p>
      </div>

      <SettingsError message={errorMsg} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SettingsSection
          title="Verify identity"
          description="Confirm your current HOD password before setting a new one."
        >
          <SettingsField label="Current password" required>
            <PasswordInput
              accent="hod"
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
          description="Choose a strong password. This protects department edit access."
        >
          <div className="space-y-4">
            <SettingsField label="New password" required>
              <PasswordInput
                accent="hod"
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
                accent="hod"
                value={confirmPassword}
                onChange={setConfirmPassword}
                disabled={loading}
                required
                placeholder="Re-enter new password"
              />
            </SettingsField>
          </div>
        </SettingsSection>

        <SettingsSubmitButton accent="hod" loading={loading}>
          Update password
        </SettingsSubmitButton>
      </form>
    </AccountSettingsLayout>
  );
}
