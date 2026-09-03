import { motion } from "framer-motion";
import { Bell, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { getAssetUrl } from "@/lib/assets";

const NOTICES = [
  {
    title: "Academic Calendar for I B.Tech (2026–2027)",
    date: "August 21, 2026",
    url: "https://jntugvcev.edu.in/wp-content/uploads/2026/08/academic-calendar-for-i-b-tech-2026-27.pdf",
  },
  {
    title: "Academic Calendar for II B.Tech (2026–2027)",
    date: "August 12, 2026",
    url: "https://jntugvcev.edu.in/wp-content/uploads/2026/08/ii-b-tech-academic-calendar-2026-2027.pdf",
  },
  {
    title: "SCCI Semiconductor Design – Parikalpak Technical Program at JNTU-GV Vizianagaram (August 6, 2026)",
    date: "August 6, 2026",
    url: "https://jntugvcev.edu.in/wp-content/uploads/2026/08/scci-semiconductor-design-parikalpak-2026.pdf",
  },
  {
    title: "Academic Calendar for II M.Tech (2026–2027)",
    date: "August 4, 2026",
    url: "https://jntugvcev.edu.in/wp-content/uploads/2026/08/academic-calendar-for-ii-m-tech-2026-27.pdf",
  },
  {
    title: "Timetable for M.Tech II-Semester (R19) Supplementary End Examinations, July/August-2026",
    date: "July 20, 2026",
    url: getAssetUrl("uploads/2026/07/m-tech-ii-sem-r19-supplementary-end-time-table-july-august-2026.pdf"),
  },
  {
    title: "Timetable for M.Tech II-Semester (R25) End Examinations, July/August-2026",
    date: "July 20, 2026",
    url: getAssetUrl("uploads/2026/07/m-tech-ii-sem-r25-end-time-table-july-august-2026.pdf"),
  },
  {
    title: "Revised Timetable for M.Tech II-Semester (R25) II-Mid Examinations, July-2026",
    date: "July 20, 2026",
    url: getAssetUrl("uploads/2026/07/revised-m-tech-ii-sem-r25-ii-mid-time-table-july-2026.pdf"),
  },
  {
    title: "Timetable for M.Tech II-Semester (R23) II-Mid Examinations, July-2026",
    date: "July 20, 2026",
    url: getAssetUrl("uploads/2026/07/m-tech-ii-sem-r23-ii-mid-time-table-july-2026.pdf"),
  },
  {
    title: "Academic Calendar for II MCA (2026-2027)",
    date: "July 7, 2026",
    url: getAssetUrl("uploads/2026/07/ii-mca-academic-calendar-2026-2027.pdf"),
  },
  {
    title: "Academic Calendar for II MBA (2026-2027)",
    date: "July 7, 2026",
    url: getAssetUrl("uploads/2026/07/ii-mba-academic-calendar-2026-2027.pdf"),
  },
  {
    title: "Academic Calendar for II B.Tech (2026-2027)",
    date: "June 18, 2026",
    url: getAssetUrl("uploads/2026/06/ii-b-tech-academic-calendar-june-2026.pdf"),
  },
  {
    title: "Timetable for I-MCA II-Semester (R25) End Examinations, June-2026",
    date: "June 16, 2026",
    url: getAssetUrl("uploads/2026/06/i-mca-ii-semester-r25-end-examinations-june-2026.pdf"),
  },
  {
    title: "Notification for M.Tech II-Semester (R25/R19) Regular/Supplementary Examinations, June-2026",
    date: "June 16, 2026",
    url: getAssetUrl("uploads/2026/06/mtech-ii-sem-r25-r19-examination-notification-june-2026.pdf"),
  },
  {
    title: "Timetable for I-II R23 End Examinations, June-2026",
    date: "June 12, 2026",
    url: getAssetUrl("uploads/2026/06/i-ii-r23-end-time-table-june-2026.pdf"),
  },
];

export function NoticeTicker() {
  return (
    <div className="w-full bg-[#0A192F] border-b border-blue-900/40 text-white relative z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center h-10 overflow-hidden marquee-container">
        
        {/* UPDATES Pill Button */}
        <Link
          to="/notices"
          className="h-7 px-3 sm:px-3.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white flex items-center gap-1.5 rounded-full shrink-0 z-20 shadow-md transition-all cursor-pointer border border-blue-400/30 mr-3"
        >
          <Bell className="h-3 w-3 text-cyan-300 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap">
            UPDATES
          </span>
        </Link>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="flex items-center whitespace-nowrap gap-8 h-full">
            <div className="flex items-center gap-10 animate-marquee">
              {[...NOTICES, ...NOTICES].map((notice, i) => (
                <Link
                  key={i}
                  to="/notices"
                  className="flex items-center gap-2.5 shrink-0 group/item cursor-pointer text-slate-200 hover:text-white transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                  <span className="text-xs font-medium tracking-tight group-hover/item:text-cyan-200 group-hover/item:underline">
                    {notice.title}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {notice.date}
                  </span>
                  <ArrowRight className="h-3 w-3 text-cyan-400 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Fades */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#0A192F] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0A192F] to-transparent pointer-events-none z-10" />
        </div>
      </div>


      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 85s linear infinite;
        }
        .marquee-container:hover .animate-marquee,
        .animate-marquee:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}
