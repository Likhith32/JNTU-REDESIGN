import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { Lock, Mail, ExternalLink, GraduationCap, Shield } from "lucide-react";

export const Route = createFileRoute("/staff-2b9f6e3d")({
  component: FacultyLoginPage,
});

function FacultyLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useFaculty();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await login(email, password);
      if (res.success && res.deptSlug && res.facultyId) {
        navigate({
          to: "/departments/$id/faculty/$facultyId",
          params: { id: res.deptSlug, facultyId: String(res.facultyId) },
        });
      } else {
        setErrorMsg("Invalid email or password.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* ─── Left Branding Panel ─── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col items-center justify-center p-12 xl:p-16 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, oklch(0.22 0.06 180) 0%, oklch(0.18 0.1 175) 40%, oklch(0.15 0.08 190) 100%)" }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 20% 80%, oklch(0.5 0.15 175 / 0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, oklch(0.45 0.12 190 / 0.1) 0%, transparent 50%)"
        }} />

        {/* Floating decorative shapes */}
        <div className="login-floating-shape w-56 h-56 bg-teal-300/10 -top-16 -left-16" style={{ animation: "login-float 9s ease-in-out infinite" }} />
        <div className="login-floating-shape w-36 h-36 bg-cyan-300/10 bottom-28 -right-8" style={{ animation: "login-float-alt 11s ease-in-out infinite 1s" }} />
        <div className="login-floating-shape w-20 h-20 bg-emerald-300/10 top-1/4 right-20" style={{ animation: "login-float 13s ease-in-out infinite 2s" }} />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md" style={{ animation: "login-slide-right 0.8s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
          {/* Logo */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-full" style={{ animation: "login-glow 3s ease-in-out infinite", boxShadow: "0 0 30px oklch(0.55 0.15 175 / 0.2), 0 0 60px oklch(0.55 0.15 175 / 0.08)" }} />
            <img
              src="/logo.png"
              alt="JNTU-GV Logo"
              className="relative w-28 h-28 xl:w-32 xl:h-32 object-contain rounded-full border-2 border-white/20 bg-white p-1.5 shadow-2xl"
            />
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h1 className="text-2xl xl:text-[1.7rem] font-bold text-white leading-tight font-display tracking-wide">
              JNTU-GV CEV
              <span className="block text-teal-300/90 mt-1">Faculty Portal</span>
            </h1>
            <p className="text-sm text-teal-200/55 font-medium tracking-wider uppercase">
              College of Engineering Vizianagaram
            </p>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/8 border border-white/15 px-5 py-2.5 rounded-full backdrop-blur-sm">
            <GraduationCap className="w-4 h-4 text-teal-300/70" />
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-[0.18em]">
              Faculty Profile Management
            </span>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Shield className="w-4 h-4 text-teal-300/40" />
            <span className="text-[10px] text-teal-200/35 font-semibold uppercase tracking-widest">
              Secure Authenticated Access
            </span>
          </div>
        </div>
      </div>

      {/* ─── Right Login Panel ─── */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
        {/* Top bar */}
        <div className="w-full px-6 pt-5 flex justify-end">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-all duration-300 bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Main Site <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:py-12">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8 flex flex-col items-center" style={{ animation: "login-entrance 0.6s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
            <div className="relative group mb-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-cyan-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500" />
              <img
                src="/logo.png"
                alt="JNTU-GV Logo"
                className="relative h-20 w-20 object-contain rounded-full border border-slate-200 bg-white p-1 shadow-lg"
              />
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-wide uppercase font-display leading-snug">
              Faculty Portal
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
              JNTU-GV CEV
            </p>
          </div>

          {/* Login card */}
          <div className="w-full max-w-[420px] login-card rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-1.5">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Faculty Sign In</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Sign in to edit your profile page
                </p>
              </div>

              {/* Error */}
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs leading-relaxed flex items-start gap-3" style={{ animation: "login-entrance 0.3s ease-out both" }}>
                  <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="you@college.edu"
                      className="login-input"
                      style={{ ["--tw-ring-color" as any]: "oklch(0.55 0.15 175 / 0.1)" }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="login-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-teal-600/20 text-sm flex items-center justify-center cursor-pointer gap-2 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-600/25 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer inside card */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Secure Faculty Session</span>
            </div>
          </div>
        </div>

        {/* Page footer */}
        <footer className="w-full border-t border-slate-200/60 bg-white/80 py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <span>© 2026 JNTU-GV CEV. All Rights Reserved.</span>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-full text-slate-600 shadow-sm">
              <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
              <span>Faculty Profile Portal</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}