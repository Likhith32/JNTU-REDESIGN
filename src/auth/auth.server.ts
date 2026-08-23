import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

async function getRequestContext() {
  const { getRequestHeader, getRequestIP } = await import("@tanstack/react-start/server");
  const userAgent = getRequestHeader("user-agent") || null;
  const ipAddress = getRequestIP({ xForwardedFor: true }) || null;
  return { userAgent, ipAddress };
}

/**
 * Controller endpoint for Email/Password Authentication
 */
export const loginWithEmail = createServerFn({
  method: "POST",
})
  .validator((data: any) => {
    if (!data.email || typeof data.email !== "string" || !data.email.includes("@")) {
      throw new Error("Invalid email format");
    }
    if (!data.password || typeof data.password !== "string" || data.password.trim() === "") {
      throw new Error("Password is required");
    }
    return data as { email: string; password: string };
  })
  .handler(async ({ data }) => {
    const { email, password } = data;
    const { userAgent, ipAddress } = await getRequestContext();
    const { authService } = await import("./auth.service");
    const { authRepository } = await import("./auth.repository");
    const { setCookie } = await import("@tanstack/react-start/server");

    try {
      const admin = await authRepository.findAdminByEmail(email);

      if (!admin) {
        await authService.logAction({
          action: "LOGIN_FAILED",
          ipAddress,
          userAgent,
          details: `Non-existent email attempt: ${email}`,
        });
        throw new Error("Invalid email or password");
      }

      if (admin.authProvider !== "email" || !admin.passwordHash) {
        await authService.logAction({
          adminId: admin.adminId,
          action: "LOGIN_FAILED",
          ipAddress,
          userAgent,
          details: `Attempted password login on account registered with ${admin.authProvider}`,
        });
        throw new Error("Invalid email or password");
      }

      const isValid = await authService.verifyPassword(password, admin.passwordHash);
      if (!isValid) {
        await authService.logAction({
          adminId: admin.adminId,
          action: "LOGIN_FAILED",
          ipAddress,
          userAgent,
          details: "Incorrect password attempt",
        });
        throw new Error("Invalid email or password");
      }

      // Create session
      const { token, expiresAt } = await authService.createSession(admin.adminId, ipAddress, userAgent);

      // Set cookie securely
      setCookie("admin_session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        expires: expiresAt,
      });

      await authService.logAction({
        adminId: admin.adminId,
        action: "LOGIN_EMAIL",
        ipAddress,
        userAgent,
        details: `Successful password authentication for ${email}`,
      });

      return {
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        authorizedDepts: admin.authorizedDepts,
      };
    } catch (err: any) {
      console.error("Login Error:", err.message);
      throw new Error(err.message || "Authentication failed");
    }
  });

/**
 * Controller endpoint to retrieve the current active Admin session details
 */
export const getCurrentAdmin = createServerFn({
  method: "GET",
}).handler(async () => {
  const { userAgent, ipAddress } = await getRequestContext();
  const { authService } = await import("./auth.service");
  const { getCookie, deleteCookie } = await import("@tanstack/react-start/server");
  const token = getCookie("admin_session_token");

  if (!token) {
    return null;
  }

  try {
    const admin = await authService.validateSession(token, ipAddress, userAgent);
    if (!admin) {
      // Clean up invalid session cookie
      deleteCookie("admin_session_token", { path: "/" });
      return null;
    }

    return {
      adminId: admin.adminId,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      authProvider: admin.authProvider,
      authorizedDepts: admin.authorizedDepts,
    };
  } catch (err) {
    console.error("Session verification failed:", err);
    deleteCookie("admin_session_token", { path: "/" });
    return null;
  }
});

/**
 * Self-service password change for email/password admins.
 */
export const changeAdminCredentials = createServerFn({
  method: "POST",
})
  .inputValidator((d: { currentPassword: string; newPassword: string }) => d)
  .handler(async ({ data }) => {
    const { currentPassword, newPassword } = data;
    const { userAgent, ipAddress } = await getRequestContext();
    const { authService } = await import("./auth.service");
    const { authRepository } = await import("./auth.repository");
    const { getCookie } = await import("@tanstack/react-start/server");

    const token = getCookie("admin_session_token");
    if (!token) throw new Error("Not authenticated");

    const admin = await authService.validateSession(token, ipAddress, userAgent);
    if (!admin) throw new Error("Not authenticated");

    if (admin.authProvider !== "email" || !admin.passwordHash) {
      throw new Error("This account uses Google sign-in. Password cannot be changed here.");
    }

    if (!currentPassword) throw new Error("Current password is required");
    if (newPassword.length < 12) {
      throw new Error("New password must be at least 12 characters");
    }
    if (
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      throw new Error(
        "New password must include an uppercase letter, a lowercase letter, a digit, and a symbol",
      );
    }

    const isValid = await authService.verifyPassword(currentPassword, admin.passwordHash);
    if (!isValid) throw new Error("Current password is incorrect");

    const passwordHash = await authService.hashPassword(newPassword);
    await authRepository.updateAdminPassword(admin.adminId, passwordHash);

    await authService.logAction({
      adminId: admin.adminId,
      action: "PASSWORD_CHANGED",
      ipAddress,
      userAgent,
      details: "Admin changed their own password",
    });

    return { success: true };
  });

export const listAdminsForManagement = createServerFn({
  method: "GET",
}).handler(async () => {
  const { userAgent, ipAddress } = await getRequestContext();
  const { authService } = await import("./auth.service");
  const { authRepository } = await import("./auth.repository");
  const { getCookie } = await import("@tanstack/react-start/server");

  const token = getCookie("admin_session_token");
  if (!token) throw new Error("Unauthorized");

  const admin = await authService.validateSession(token, ipAddress, userAgent);
  if (!admin || admin.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  return authRepository.listAdmins();
});

/**
 * Controller endpoint to log out the active Admin
 */
export const logoutAdmin = createServerFn({
  method: "POST",
}).handler(async () => {
  const { userAgent, ipAddress } = await getRequestContext();
  const { authService } = await import("./auth.service");
  const { getCookie, deleteCookie } = await import("@tanstack/react-start/server");
  const token = getCookie("admin_session_token");

  if (token) {
    try {
      const admin = await authService.validateSession(token, ipAddress, userAgent);
      await authService.revokeSession(token, admin?.adminId || null, ipAddress, userAgent);
    } catch (err) {
      console.error("Error revoking session on logout:", err);
    }
  }

  // Clear cookie
  deleteCookie("admin_session_token", { path: "/" });
  return { success: true };
});

export const loginHod = createServerFn({ method: "POST" })
  .validator((data: any) => data as { deptId: string; deptSlug: string; password: string })
  .handler(async ({ data }) => {
    const { deptId, deptSlug, password } = data;
    const { verifyDepartmentAccess } = await import("../lib/departments");
    const { setCookie } = await import("@tanstack/react-start/server");

    const result = await verifyDepartmentAccess({ data: { deptId, password } } as any);

    if (!result.valid || result.role !== "hod") {
      throw new Error("Invalid HOD credentials");
    }

    // Store the SLUG in the cookie, not the UUID — this is what DepartmentLayout compares against
    setCookie("hod_session_dept", deptSlug, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
    });

    return { success: true, deptSlug };
  });

export const getCurrentHodDept = createServerFn({ method: "GET" }).handler(async () => {
  const { getCookie } = await import("@tanstack/react-start/server");
  const deptId = getCookie("hod_session_dept");
  return deptId || null;
});

export const logoutHod = createServerFn({ method: "POST" }).handler(async () => {
  const { deleteCookie } = await import("@tanstack/react-start/server");
  deleteCookie("hod_session_dept", { path: "/" });
  return { success: true };
});

/**
 * Initiates the Google OAuth consent redirect
 */
export const initiateGoogleLogin = createServerFn({
  method: "GET",
}).handler(async () => {
  const state = crypto.randomUUID();
  const maxAge = 300; // 5 minutes
  const secure = process.env.NODE_ENV === "production";
  const { setCookie } = await import("@tanstack/react-start/server");
  const { authService } = await import("./auth.service");

  // Store state in an HTTP-only secure cookie
  setCookie("google_oauth_state", state, {
    httpOnly: true,
    secure,
    path: "/",
    maxAge,
    sameSite: "lax",
  });

  // Generate OAuth redirect URL
  const googleUrl = authService.getGoogleAuthUrl(state);

  throw redirect({
    href: googleUrl,
  });
});

export const handleGoogleCallback = createServerFn({ method: "POST" })
  .validator((data: any) => data as { code: string; state: string })
  .handler(async ({ data }) => {
    const { code, state } = data;
    const { getCookie, deleteCookie, setCookie } = await import("@tanstack/react-start/server");
    const { userAgent, ipAddress } = await getRequestContext();
    const { authService } = await import("./auth.service");
    const { authRepository } = await import("./auth.repository");

    const savedState = getCookie("google_oauth_state");
    deleteCookie("google_oauth_state", { path: "/" });

    if (!savedState || savedState !== state) {
      throw redirect({
        to: "/mgmt-9f3a2b1c",
        search: { tab: "login" } as any,
      });
    }

    try {
      const email = await authService.verifyGoogleCodeAndGetEmail(code, ipAddress, userAgent);
      const admin = await authRepository.findAdminByEmail(email);
      if (!admin) {
        throw redirect({
          to: "/mgmt-9f3a2b1c",
          search: { tab: "login" } as any,
        });
      }

      const { token, expiresAt } = await authService.createSession(admin.adminId, ipAddress, userAgent);

      setCookie("admin_session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        expires: expiresAt,
      });

      throw redirect({
        to: "/mgmt-9f3a2b1c",
      });
    } catch (err: any) {
      if (err?.to) throw err;
      throw redirect({
        to: "/mgmt-9f3a2b1c",
        search: { tab: "login" } as any,
      });
    }
  });
