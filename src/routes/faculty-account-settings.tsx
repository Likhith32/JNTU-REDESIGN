import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { KeyRound, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { createServerFn } from "@tanstack/react-start";
import {
  AccountSettingsLayout,
  PasswordInput,
  PasswordRulesChecklist,
  SettingsError,
  SettingsField,
  SettingsSection,
  SettingsSubmitButton,
  TextInput,
} from "@/components/AccountSettingsLayout";

export const getFacultyAccountInfo = createServerFn({ method: "GET" }).handler(async () => {
  const { getCookie } = await import("@tanstack/react-start/server");
  const { db } = await import("@/db");
  const { faculty, departments } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const id = getCookie("faculty_session_id");
  if (!id) return null;

  const [record] = await db
    .select({
      id: faculty.id,
      name: faculty.name,
      email: faculty.faculty_email,
      designation: faculty.designation,
      deptSlug: departments.slug,
    })
    .from(faculty)
    .leftJoin(departments, eq(faculty.dept_id, departments.id))
    .where(eq(faculty.id, Number(id)))
    .limit(1);

  return record || null;
});

export const Route = createFileRoute("/faculty-account-settings")({
  component: FacultyAccountSettingsPage,
});

function FacultyAccountSettingsPage() {
  const { isFacultyLoggedIn, changeCredentials } = useFaculty();
  const navigate = useNavigate();

  const [account, setAccount] = useState<{
    id: number;
    name: string;
    email: string | null;
    designation: string | null;
    deptSlug: string | null;
  } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isFacultyLoggedIn) return;
    getFacultyAccountInfo()
      .then(setAccount)
      .catch(() => setAccount(null));
  }, [isFacultyLoggedIn]);

  if (!isFacultyLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-sm text-muted-foreground">
          Sign in with your faculty account to manage credentials.
        </p>
        <button
          onClick={() => navigate({ to: "/staff-2b9f6e3d" })}
          className="text-sm font-semibold text-teal-700 hover:underline"
        >
          Go to Faculty Login
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters.");
      return;
    }
    if (!newEmail && !newPassword) {
      setErrorMsg("Enter a new email or a new password to update.");
      return;
    }

    setLoading(true);
    try {
      await changeCredentials(
        currentPassword,
        newEmail.trim() || undefined,
        newPassword.trim() || undefined,
      );
      toast.success("Your account details were updated.");
      setCurrentPassword("");
      setNewEmail("");
      setNewPassword("");
      setConfirmPassword("");
      const refreshed = await getFacultyAccountInfo();
      setAccount(refreshed);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update credentials.");
    } finally {
      setLoading(false);
    }
  };

  const backLink = account?.deptSlug && account?.id
    ? {
      label: "Back to profile",
      to: "/departments/$id/faculty/$facultyId" as const,
      params: { id: account.deptSlug, facultyId: String(account.id) },
    }
    : {
      label: "Back to login",
      href: "/staff-2b9f6e3d",
    };

  return (
    <AccountSettingsLayout
      accent="faculty"
      icon={KeyRound}
      roleLabel="Faculty Portal"
      title="Account Settings"
      description="Update the email and password you use to sign in to your faculty profile."
      back={backLink}
    >
      {account && (
        <div className="rounded-2xl border border-border bg-sand/50 px-4 py-3.5 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <Shield size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink truncate">{account.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {account.designation || "Faculty"} · {account.email || "No login email set"}
            </p>
          </div>
        </div>
      )}

      <SettingsError message={errorMsg} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SettingsSection
          title="Verify identity"
          description="Enter your current password before making any changes."
        >
          <SettingsField label="Current password" required>
            <PasswordInput
              accent="faculty"
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
          title="Login email"
          description="Leave blank to keep your current email address."
        >
          <SettingsField
            label="New email"
            hint={account?.email ? `Currently: ${account.email}` : "No email on file yet."}
          >
            <TextInput
              accent="faculty"
              type="email"
              icon={Mail}
              value={newEmail}
              onChange={setNewEmail}
              disabled={loading}
              placeholder="name@jntugv.edu.in"
            />
          </SettingsField>
        </SettingsSection>

        <div className="h-px bg-border" />

        <SettingsSection
          title="Password"
          description="Optional. Use at least 8 characters for a stronger account."
        >
          <div className="space-y-4">
            <SettingsField label="New password">
              <PasswordInput
                accent="faculty"
                value={newPassword}
                onChange={setNewPassword}
                disabled={loading}
                showStrength
                placeholder="Leave blank to keep current"
              />
            </SettingsField>

            {newPassword && (
              <>
                <PasswordRulesChecklist password={newPassword} minLength={8} />
                <SettingsField label="Confirm new password" required>
                  <PasswordInput
                    accent="faculty"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    disabled={loading}
                    required
                    placeholder="Re-enter new password"
                  />
                </SettingsField>
              </>
            )}
          </div>
        </SettingsSection>

        <SettingsSubmitButton accent="faculty" loading={loading}>
          Save account changes
        </SettingsSubmitButton>
      </form>
    </AccountSettingsLayout>
  );
}
