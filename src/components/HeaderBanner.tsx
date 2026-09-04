import { Link } from "@tanstack/react-router";
import { uploadUrl } from "@/lib/assets";

export function HeaderBanner() {
  return (
    <div className="w-full bg-white text-slate-900 border-b border-slate-200/80 shadow-xs relative z-40">
      {/* Top Navy Blue Stripe */}
      <div className="h-1 w-full bg-[#0F387A]" />

      {/* MOBILE COMPACT BANNER (< 768px) */}
      <div className="md:hidden px-3 py-2 max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        {/* Left: Official College Emblem */}
        <Link to="/" className="shrink-0 flex items-center group">
          <img
            src="/logo.png"
            alt="JNTU-GV Logo"
            className="h-11 w-11 object-contain drop-shadow-xs"
            decoding="async"
            fetchPriority="high"
          />
        </Link>

        {/* Center: College Name & Essential Badges */}
        <div className="flex-1 min-w-0 text-center flex flex-col justify-center">
          <h1 className="text-[11.5px] sm:text-xs font-black tracking-tight text-[#0F387A] leading-tight font-display uppercase truncate">
            JNTU-GV College of Engineering
          </h1>
          
          <h2 className="text-[9.5px] sm:text-[10px] font-extrabold tracking-tight text-[#CE1126] leading-none mt-0.5 uppercase">
            Vizianagaram (Autonomous)
          </h2>

          <p className="text-[8.5px] font-semibold text-slate-500 tracking-tight leading-none mt-0.5 truncate">
            Constituent College of JNTU-GV • AICTE & UGC 2(f) & 12(B)
          </p>
        </div>

        {/* Right: NBA Accreditation Logo */}
        <div className="shrink-0 flex items-center">
          <img
            src={uploadUrl("2024/07/NBA-2.jpg")}
            alt="NBA Accredited"
            className="h-8.5 w-auto object-contain drop-shadow-xs"
            decoding="async"
          />
        </div>
      </div>

      {/* DESKTOP FULL BANNER (>= 768px) */}
      <div className="hidden md:block w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-2">
        <div className="flex flex-row items-center justify-between gap-4 text-left">
          
          {/* Left: Official College Emblem */}
          <Link to="/" className="shrink-0 flex items-center justify-center group transition-transform duration-300 hover:scale-105">
            <img
              src="/logo.png"
              alt="JNTU-GV Logo"
              className="h-16 w-16 lg:h-20 lg:w-20 object-contain drop-shadow-sm"
              decoding="async"
              fetchPriority="high"
            />
          </Link>

          {/* Center: College Name & Details */}
          <div className="flex-1 flex flex-col items-center text-center">
            <h1 className="text-base md:text-lg lg:text-xl font-black tracking-tight text-[#0F387A] leading-tight font-display">
              JNTU-GV COLLEGE OF ENGINEERING, VIZIANAGARAM(A)
            </h1>
            
            <h2 className="text-xs md:text-sm font-extrabold tracking-tight text-[#CE1126] leading-tight mt-0.5 uppercase">
              JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY-GURAJADA VIZIANAGARAM
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 mt-0.5">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 tracking-wide uppercase">
                DWARAPUDI, VIZIANAGARAM, ANDHRA PRADESH - 535 003.
              </p>
              <span className="hidden sm:inline text-slate-400 text-[10px]">•</span>
              <p className="text-[9px] sm:text-[10px] font-semibold text-emerald-800 italic">
                ( A constituent college of JNTU-GV & Approved by AICTE, New Delhi ) ( Recognised by UGC under section 2(f) & 12(B) of UGC Act 1956 )
              </p>
            </div>
          </div>

          {/* Right: NBA Accreditation Logo */}
          <div className="shrink-0 flex items-center justify-center">
            <img
              src={uploadUrl("2024/07/NBA-2.jpg")}
              alt="NBA Accredited - National Board of Accreditation"
              className="h-16 lg:h-20 w-auto object-contain drop-shadow-sm"
              decoding="async"
            />
          </div>

        </div>
      </div>

      {/* Bottom Crimson Red Stripe */}
      <div className="h-0.5 w-full bg-[#CE1126]" />
    </div>
  );
}
