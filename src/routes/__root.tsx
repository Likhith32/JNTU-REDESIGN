import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
  useMatch,
} from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import appCss from "../styles.css?url";
import { TopRibbon } from "@/components/TopRibbon";
import { MegaMenu } from "@/components/MegaMenu";
import { Footer } from "@/components/Footer";
import { HeaderBanner } from "@/components/HeaderBanner";
import { NoticeTicker } from "@/components/NoticeTicker";
import { getQueryClient } from "@/lib/query-client";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import { FacultyProvider } from "@/context/FacultyContext";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { PageProgressBar } from "@/components/PageProgressBar";
import { lazy, Suspense, useState, useEffect } from "react";

const Chatbot = lazy(() =>
  import("@/components/Chatbot").then((m) => ({ default: m.Chatbot }))
);

import { Toaster } from "@/components/ui/sonner";
import { ActionFeedbackOverlay } from "@/components/ActionFeedbackOverlay";
import { NotFound } from "@/components/NotFound";
import { PushNotificationBanner } from "@/components/PushNotificationBanner";

function NotFoundComponent() {
  return <NotFound />;
}

interface MyRootContext {
  queryClient: import("@tanstack/react-query").QueryClient;
}

function GlobalSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4 animate-[fade-in_0.2s_ease-out]">
      <div className="relative flex items-center justify-center">
        <div className="spinner scale-125"></div>
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping pointer-events-none" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground tracking-wide">Loading JNTU-GV CEV</p>
        <p className="text-xs text-muted-foreground">Preparing campus content...</p>
      </div>
    </div>
  );
}

// 2. The most stable way to define the route with types
export const Route = createRootRoute({
  pendingComponent: GlobalSpinner,
  context: () => ({}) as MyRootContext,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JNTU-GV College of Engineering Vizianagaram" },
      {
        name: "description",
        content:
          "JNTU-GV College of Engineering Vizianagaram - Academics, departments, facilities, admissions, placements, research and campus information.",
      },
      { name: "author", content: "JNTU-GV CEV" },
      { property: "og:title", content: "JNTU-GV College of Engineering Vizianagaram" },
      {
        property: "og:description",
        content:
          "JNTU-GV College of Engineering Vizianagaram - Academics, departments, facilities, admissions, placements, research and campus information.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://jntugvcev.edu.in/" },
      { property: "og:site_name", content: "JNTU-GV CEV" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "JNTU-GV College of Engineering Vizianagaram" },
      {
        name: "twitter:description",
        content:
          "JNTU-GV College of Engineering Vizianagaram - Academics, departments, facilities, admissions, placements, research and campus information.",
      },
      {
        property: "og:image",
        content: "https://jntugvcev.edu.in/logo-circle.png",
      },
      {
        name: "twitter:image",
        content: "https://jntugvcev.edu.in/logo-circle.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://api.jntugv.edu.in" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev" },
      { rel: "preconnect", href: "http://89.116.134.182" },
      { rel: "dns-prefetch", href: "https://api.jntugv.edu.in" },
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev" },
      { rel: "dns-prefetch", href: "http://89.116.134.182" },
      { rel: "dns-prefetch", href: "https://ui-avatars.com" },
      { rel: "canonical", href: "https://jntugvcev.edu.in/" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon.ico" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

declare module "@tanstack/react-router" {
  interface StaticDataRouteContext extends MyRootContext { }
}

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext() as MyRootContext;

  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <FacultyProvider>
          <PageProgressBar />
          <OfflineIndicator />
          <AdminContent />
          <PushNotificationBanner />
          <Toaster richColors position="top-right" />
          <ActionFeedbackOverlay />
        </FacultyProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
}

function AdminContent() {
  // 1. Safely pull the active pathname string
  const path = useRouterState({ select: (s) => s.location.pathname });

  // 2. Defer Chatbot mount until the browser is idle — prevents the lazy
  //    bundle from being requested or rendered during initial paint.
  const [chatbotReady, setChatbotReady] = useState(false);

  const {
    isAdmin,
    isEditMode,
    setGlobalEditMode,
    isDeptEditing,
    setDeptEditing,
    hasEditPermission,
    logout
  } = useAdmin();

  // Entry and account-settings routes where full site chrome (Navbar, Footer, Chatbot) is hidden
  const HIDE_CHROME_ROUTES = new Set([
    "/mgmt-9f3a2b1c",
    "/mgmt-9f3a2b1c/",
    "/staff-2b9f6e3d",
    "/dept-7e1c4d8a",
    "/hod-account-settings",
    "/hod-account-settings/",
    "/faculty-account-settings",
    "/faculty-account-settings/",
    "/admin-account-settings",
    "/admin-account-settings/",
  ]);
  const isLoginPage = HIDE_CHROME_ROUTES.has(path.replace(/\/$/, "") || "/") || HIDE_CHROME_ROUTES.has(path);

  useEffect(() => {
    if (isLoginPage) return;
    const cb = () => setChatbotReady(true);
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(cb, { timeout: 3000 });
      return () => (window as any).cancelIdleCallback(id);
    } else {
      // Safari fallback — mount after 1.5 s
      const t = setTimeout(cb, 1500);
      return () => clearTimeout(t);
    }
  }, [isLoginPage]);

  // 2. Identify if the user is actively viewing a department sub-route
  const pathSegments = path.split("/").filter(Boolean); // e.g., ["departments", "cse"]
  const isDepartmentPage = pathSegments[0] === "departments" && pathSegments[1];

  // The unique identifier for our department matching lookup maps (e.g., "cse", "it")
  const activeDepartmentId = isDepartmentPage ? pathSegments[1] : undefined;

  // 3. Compute edit permissions based on the active path parameters string
  const currentEditActive = (isDepartmentPage && activeDepartmentId)
    ? isDeptEditing(activeDepartmentId)
    : isEditMode;

  const handleEditToggleClick = () => {
    if (isDepartmentPage && activeDepartmentId) {
      if (!hasEditPermission(activeDepartmentId)) return;
      setDeptEditing(activeDepartmentId, !currentEditActive);
    } else {
      setGlobalEditMode(!currentEditActive);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isAdmin ? "pt-12" : ""} w-full max-w-full`}>
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 h-12 bg-black text-white px-4 md:px-6 flex items-center justify-between z-[100] shadow-lg overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Admin</span>
              <span className="text-xs font-medium hidden sm:inline">Dashboard</span>
            </div>

            <button
              onClick={handleEditToggleClick}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 ${currentEditActive
                ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${currentEditActive ? "bg-primary animate-pulse" : "bg-zinc-600"}`} />
              <span>{currentEditActive ? "Editing Active" : "Edit Mode"}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-5 shrink-0 ml-4">
            <Link to="/admin/departments" className="text-[10px] md:text-[11px] font-semibold hover:text-primary transition-colors shrink-0">Departments</Link>
            <Link to="/admin/users" className="text-[10px] md:text-[11px] font-semibold hover:text-primary transition-colors shrink-0">Users</Link>
            <Link to="/admin/placements" className="text-[10px] md:text-[11px] font-semibold hover:text-primary transition-colors shrink-0">Placements</Link>
            <Link to="/admin-account-settings" className="text-[10px] md:text-[11px] font-semibold hover:text-primary transition-colors shrink-0">Account</Link>

            <Link
              to="/"
              onClick={() => logout()}
              className="text-[10px] md:text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors shrink-0"
            >
              Logout
            </Link>
          </div>
        </div>
      )}

      {/* Unified Persistent Sticky Header Suite — hidden on login pages */}
      {!isLoginPage && (
        <div className={`sticky ${isAdmin ? "top-12" : "top-0"} z-50 w-full pointer-events-none transition-all duration-200`}>
          <div className="pointer-events-auto shadow-md">
            {/* Top Navy Blue Ribbon with Quick Links & Social */}
            <TopRibbon />

            {/* Official College Header Banner */}
            <HeaderBanner />

            {/* Updates / Notice Marquee Ticker */}
            <NoticeTicker />
          </div>

          {/* Floating Dynamic Capsule Navigation Bar (Overlays directly on hero carousel / page hero with zero background) */}
          <MegaMenu />
        </div>
      )}

      <main className="flex-1 w-full max-w-full">
        <Outlet />
      </main>

      {!isLoginPage && <Footer />}
      {!isLoginPage && chatbotReady && (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      )}
    </div>
  );
}


