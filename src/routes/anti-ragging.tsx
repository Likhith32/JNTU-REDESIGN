import { createFileRoute } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import {
  ShieldAlert,
  AlertTriangle,
  FileText,
  Download,
  PhoneCall,
  Mail,
  Scale,
  Users,
  CheckCircle2,
  Lock,
  ExternalLink,
  Info,
  Clock,
  Building,
} from "lucide-react";

const heroImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/anti-ragging")({
  head: () => ({
    meta: [
      { title: "Anti-Ragging Committee & Policies — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Zero tolerance policy towards ragging. Mandatory AICTE & UGC Anti-Ragging Committee, regulations, proforma affidavits, and penalties at JNTU-GV CEV.",
      },
      { property: "og:title", content: "Anti-Ragging Committee — JNTU-GV CEV" },
      {
        property: "og:description",
        content:
          "Anti-Ragging Committee members, statutory notifications, precautions, and Act 26 of 1997 penalties.",
      },
    ],
  }),
  component: AntiRaggingPage,
});

const COMMITTEE_MEMBERS = [
  {
    sNo: 1,
    name: "Prof. R. Rajeswara Rao",
    designation: "Principal",
    role: "Chairman",
    roleBadge: "bg-red-500/10 text-red-700 border-red-200",
  },
  {
    sNo: 2,
    name: "Dr. G. J. Naga Raju",
    designation: "Vice-Principal",
    role: "Convenor",
    roleBadge: "bg-amber-500/10 text-amber-700 border-amber-200",
  },
  {
    sNo: 3,
    name: "Dr. K. Srinivasa Prasad",
    designation: "Head of Mechanical Engineering & HMETD",
    role: "Member",
    roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    sNo: 4,
    name: "Dr. V. S. Vakula",
    designation: "Head of EEE",
    role: "Member",
    roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    sNo: 5,
    name: "Dr. P. Aruna Kumari",
    designation: "Head of CSE",
    role: "Member",
    roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    sNo: 6,
    name: "Dr. G. Appala Naidu",
    designation: "Head of Civil Engineering",
    role: "Member",
    roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    sNo: 7,
    name: "Dr. T. S. N. Murthy",
    designation: "Head of ECE",
    role: "Member",
    roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    sNo: 8,
    name: "Dr. Ch. Bindu Madhuri",
    designation: "Head of IT & OIH",
    role: "Member",
    roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    sNo: 9,
    name: "Dr. M. Sowbhagya Lakshmi",
    designation: "Head of BS&HSS",
    role: "Member",
    roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    sNo: 10,
    name: "Dr. P. Sree Devi",
    designation: "Head of MBA",
    role: "Member",
    roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    sNo: 11,
    name: "Sri. D. D. V. Siva Ram Rolangi",
    designation: "Officer In-charge of Library",
    role: "Member",
    roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    sNo: 12,
    name: "Dr. A. V. Papa Rao",
    designation: "Sports Coordinator",
    role: "Member",
    roleBadge: "bg-slate-100 text-slate-700 border-slate-200",
  },
];

const PENALTIES = [
  {
    sNo: "1",
    nature: "Teasing, Embarrassing and Humiliating",
    punishment: "Imprisonment up to 6 months or fine up to Rs. 1,000/- or both.",
    severity: "bg-amber-500/10 text-amber-800 border-amber-200",
  },
  {
    sNo: "2",
    nature: "Assaulting or using Criminal Force or Criminal Intimidation",
    punishment: "Imprisonment up to 1 Year or fine up to Rs. 2,000/- or both.",
    severity: "bg-orange-500/10 text-orange-800 border-orange-200",
  },
  {
    sNo: "3",
    nature: "Wrongfully Restraining or Confining or Causing Hurt",
    punishment: "Imprisonment up to 2 years or fine up to Rs. 5,000/- or both.",
    severity: "bg-rose-500/10 text-rose-800 border-rose-200",
  },
  {
    sNo: "4",
    nature: "Causing grievous hurt, kidnapping or raping or committing unnatural offence",
    punishment: "Imprisonment up to 5 years and fine up to Rs. 10,000/-",
    severity: "bg-red-500/10 text-red-800 border-red-200",
  },
  {
    sNo: "5",
    nature: "Causing death or abetting suicide",
    punishment: "Imprisonment up to 10 years and fine up to Rs. 50,000/-",
    severity: "bg-red-600/15 text-red-900 border-red-300 font-semibold",
  },
];

const DOWNLOADS = [
  {
    title: "AICTE Anti-Ragging Notification (2009)",
    desc: "AICTE (Prevention and Prohibition of Ragging in Technical Institutions) Regulations.",
    link: "http://89.116.134.182/local-assets/uploads/2026/08/AICTE_Antiragging_2009.pdf",
    tag: "AICTE Regulation",
  },
  {
    title: "UGC Regulations on Curbing the Menace of Ragging",
    desc: "UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions.",
    link: "http://89.116.134.182/local-assets/uploads/2020/08/2_ugc_Anti_Ragging_2009.pdf",
    tag: "UGC Notification",
  },
  {
    title: "Anti-Ragging Affidavit (Proforma)",
    desc: "Mandatory undertaking proforma to be submitted by every student and parent/guardian.",
    link: "http://89.116.134.182/local-assets/uploads/2020/08/Anti_Ragging_Affidavitproforma.pdf",
    tag: "Affidavit Proforma",
  },
];

const PRECAUTIONS = [
  {
    title: "Constitution of Anti-Ragging Committee",
    desc: "Formed a dedicated Anti-Ragging Committee comprising the Principal, Vice-Principal, Heads of Departments, and key administrative officers.",
  },
  {
    title: "Strategic Staff Deployment & Area Vigilance",
    desc: "Committee has taken proactive steps and allotted monitoring duties to faculty/staff across all critical zones (Departmental Buildings, Canteens, Library, Parking areas, Playgrounds, and Hostels).",
  },
  {
    title: "Multi-Channel Awareness & Signages",
    desc: "Wide canvassing about anti-ragging policies through prominent display of flexi banners, statutory boards, and cautionary notices in college, canteen, hostel premises, and surrounding areas.",
  },
  {
    title: "Student Orientation & Awareness Meetings",
    desc: "Conducting regular interactive meetings, seminars, and counseling sessions for freshers and senior students to foster a disciplined, supportive, and harmonious campus atmosphere.",
  },
];

const CAMPUS_RULES = [
  "Ragging is strictly prohibited as per Act 26 of A.P. Legislative Assembly, 1997. Ragging entails heavy fines and/or rigorous imprisonment.",
  "Any act of ragging invokes immediate suspension and permanent dismissal from the College.",
  "Outsiders and unauthorized persons are strictly prohibited from entering student hostels without prior written permission from authorities.",
  "Girl students must strictly be inside their hostel rooms by 9:00 PM.",
  "All students must carry their valid College Identity Cards at all times and present them whenever demanded by campus security or faculty.",
  "The Principal and Hostel Wardens hold the authority to visit and inspect hostel rooms at any hour of the day or night.",
  "Suspended students are strictly debarred from entering the Campus, except when summoned to attend formal disciplinary inquiries.",
];

function AntiRaggingPage() {
  return (
    <>
      <PageHero
        eyebrow="Statutory Compliance & Student Safety"
        title="Anti-Ragging Committee & Policies"
        subtitle="Zero tolerance policy towards ragging. Fostering a safe, dignified, and inclusive learning atmosphere in and around our campus, classrooms, hostels, and amenities."
        image={heroImg}
      />

      {/* Emergency Helpline Strip */}
      <section className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-y border-red-500/30 text-white py-6 shadow-xl">
        <div className="container-narrow flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-red-600/30 border border-red-500/40 grid place-items-center shrink-0">
              <ShieldAlert className="h-7 w-7 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-red-300 font-bold">
                24x7 Anti-Ragging National Helpline (Toll-Free)
              </div>
              <div className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
                <span>1800-180-5522</span>
                <span className="text-xs font-normal text-white/60">or</span>
                <span className="text-lg font-bold text-red-200">155222</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:helpline@antiragging.in"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-red-300" />
              helpline@antiragging.in
            </a>
            <a
              href="https://www.antiragging.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              National Portal (antiragging.in)
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-narrow py-20 space-y-24">
        {/* Overview & Commitment */}
        <RevealOnScroll>
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <SectionLabel
                eyebrow="Zero Tolerance"
                title="Safe Campus Commitment"
                subtitle="A collegiate environment where mutual respect, dignity, and academic passion thrive."
              />
              <div className="prose prose-slate max-w-none text-slate-700 space-y-4 leading-relaxed">
                <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                  Ragging in any form inside or outside the college is strictly banned. In order to maintain a peaceful, secure, and conducive atmosphere in and around the College, Canteen, Library, and Hostels, an Anti-Ragging Committee comprising senior faculty and administrative heads has been duly constituted.
                </p>
                <p className="text-sm sm:text-base">
                  As mandated by the Hon'ble Supreme Court of India, AICTE Regulations (2009), and UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions, JNTU-GV College of Engineering Vizianagaram enforces 100% strict compliance and preventive vigilance.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 rounded-[32px] border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/30 grid place-items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="text-lg font-bold">Important Notice</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Submission of online Anti-Ragging Undertaking / Affidavit at{" "}
                <a
                  href="https://www.antiragging.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-300 underline font-semibold hover:text-white"
                >
                  antiragging.in
                </a>{" "}
                is mandatory for every student at the time of admission and annual registration.
              </p>
              <div className="pt-4 border-t border-white/10 text-xs text-white/60 flex items-center gap-2">
                <Lock className="h-4 w-4 text-red-400 shrink-0" />
                <span>Confidentiality of complainant identity is strictly guaranteed.</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Committee Members Table */}
        <RevealOnScroll>
          <div className="space-y-6">
            <SectionLabel
              eyebrow="Statutory Body"
              title="College Anti-Ragging Committee (ARC)"
              subtitle="The executive body entrusted with vigilance, discipline, inquiry, and prompt redressal."
            />

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6 font-semibold w-16 text-center">S.No</th>
                      <th className="py-4 px-6 font-semibold">Name of the Member</th>
                      <th className="py-4 px-6 font-semibold">Institutional Designation</th>
                      <th className="py-4 px-6 font-semibold text-center">Committee Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {COMMITTEE_MEMBERS.map((member) => (
                      <tr
                        key={member.sNo}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-center text-slate-500 font-semibold">
                          {member.sNo}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2.5">
                          <div className="h-2 w-2 rounded-full bg-primary/60 shrink-0" />
                          {member.name}
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {member.designation}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${member.roleBadge}`}
                          >
                            {member.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Precautionary Measures & Campus Rules */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Precautions */}
          <RevealOnScroll>
            <div className="bg-slate-50/80 rounded-[32px] border border-slate-200 p-8 sm:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Precautions & Preventive Actions
                </h3>
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Measures taken as per AICTE / UGC Norms to ensure 100% No-Ragging:
              </p>

              <div className="space-y-4">
                {PRECAUTIONS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5"
                  >
                    <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-emerald-200">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Rules & Directives */}
          <RevealOnScroll delay={100}>
            <div className="bg-slate-900 text-white rounded-[32px] border border-slate-800 p-8 sm:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 grid place-items-center">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Prohibition & Campus Directives</h3>
              </div>
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                Mandatory rules enforced across all campus and hostel premises:
              </p>

              <ul className="space-y-3.5 text-xs sm:text-sm text-white/80">
                {CAMPUS_RULES.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-white/10 text-amber-300 grid place-items-center text-xs font-bold shrink-0 mt-0.5 border border-white/10">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </div>

        {/* Penalties Matrix (Act 26 of 1997) */}
        <RevealOnScroll>
          <div className="space-y-6">
            <SectionLabel
              eyebrow="Legislative Framework"
              title="Prohibition of Ragging in Educational Institutions Act 26 of 1997"
              subtitle="Promulgated by the Legislative Assembly of Andhra Pradesh — Salient Features and Statutory Penalties."
            />

            {/* Definition Box */}
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-slate-800 text-sm leading-relaxed space-y-2">
              <div className="font-bold text-amber-900 flex items-center gap-2">
                <Scale className="h-4 w-4" /> Legal Definition of Ragging (Act 26):
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                <strong>“Ragging within or outside any Educational Institution is prohibited.”</strong> Ragging means doing an act which causes or is likely to cause insult or annoy or fear or apprehension or threat, intimidation or outrage or injury to a student.
              </p>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6 font-semibold w-16 text-center">S.No</th>
                      <th className="py-4 px-6 font-semibold w-1/2">Nature of Ragging Offence</th>
                      <th className="py-4 px-6 font-semibold">Statutory Punishment under Law</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {PENALTIES.map((pen) => (
                      <tr key={pen.sNo} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-mono text-center text-slate-500 font-bold">
                          {pen.sNo}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          {pen.nature}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-xl text-xs border ${pen.severity}`}
                          >
                            {pen.punishment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Crucial Notes */}
            <div className="grid md:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-950">
                <div className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Immediate Suspension
                </div>
                <p className="text-xs leading-relaxed text-red-900/90">
                  A student against whom there is prima-facie evidence of ragging in any form will be suspended from the college immediately.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-950">
                <div className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" /> Permanent Dismissal
                </div>
                <p className="text-xs leading-relaxed text-red-900/90">
                  A student convicted of any of the above statutory offences will be dismissed from the college forthwith.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-950">
                <div className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1 flex items-center gap-1.5">
                  <Scale className="h-4 w-4" /> Nationwide Debarment
                </div>
                <p className="text-xs leading-relaxed text-red-900/90">
                  A student imprisoned for more than six months will not be admitted in any other colleges across the country.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Regulatory Documents & Downloads */}
        <RevealOnScroll>
          <div className="space-y-6">
            <SectionLabel
              eyebrow="Downloads & Regulations"
              title="Official Notifications & Proformas"
              subtitle="Download official gazettes, AICTE regulations, and mandatory affidavits."
            />

            <div className="grid md:grid-cols-3 gap-6">
              {DOWNLOADS.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm hover:shadow-elegant hover:border-primary/30 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary grid place-items-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {doc.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-primary transition-colors leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{doc.desc}</p>
                  </div>

                  <a
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide hover:bg-primary transition-colors shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </a>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 text-slate-600 text-xs flex items-center justify-between gap-4">
              <span>
                <strong>Note:</strong> The full printed text of Act 26 of 1997 is placed in the College Central Library and Department Notice Boards for open student reference.
              </span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </>
  );
}
