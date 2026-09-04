import { createFileRoute } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import {
  FileText,
  Download,
  Phone,
  Mail,
  UserCheck,
  Building2,
  Clock,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  FileSpreadsheet,
  ExternalLink,
} from "lucide-react";

const heroImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/rti")({
  head: () => ({
    meta: [
      { title: "Right to Information (RTI) Act, 2005 — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Statutory RTI disclosures, designated Public Information Officers (PIO), Appellate Authority, and application procedures at JNTU-GV College of Engineering Vizianagaram.",
      },
      { property: "og:title", content: "RTI Act 2005 — JNTU-GV CEV" },
      {
        property: "og:description",
        content:
          "Public Information Officers, First Appellate Authority, RTI Act PDF, and guidelines under Right to Information Act 2005.",
      },
    ],
  }),
  component: RTIPage,
});

const RTI_OFFICERS = [
  {
    sNo: 1,
    roleTitle: "First Appellate Authority",
    name: "Prof. Ch. Satya Narayana",
    designation: "Registrar",
    phone: "9177790000",
    email: "registrar@jntuk.edu.in",
    badge: "bg-blue-500/10 text-blue-800 border-blue-200",
    scope: "Entertains appeals against orders/decisions of the Public Information Officer within 30 days.",
  },
  {
    sNo: 2,
    roleTitle: "Public Information Officer (PIO)",
    name: "Prof. G. Swami Naidu",
    designation: "Principal",
    phone: "8374185959",
    email: "principal@jntukucev.ac.in",
    badge: "bg-emerald-500/10 text-emerald-800 border-emerald-200",
    scope: "Deals with all requests for information submitted to the College of Engineering, Vizianagaram.",
  },
  {
    sNo: 3,
    roleTitle: "Assistant Public Information Officer (APIO)",
    name: "Prof. R. Rajeswara Rao",
    designation: "Vice-Principal",
    phone: "9959559456",
    email: "viceprincipal@jntukucev.ac.in",
    badge: "bg-amber-500/10 text-amber-800 border-amber-200",
    scope: "Receives applications for information and forward them to the Public Information Officer.",
  },
];

const STATUTORY_DOWNLOADS = [
  {
    title: "Right to Information Act, 2005 (Official)",
    desc: "Complete statutory notification and guidelines for citizen information requests.",
    link: "http://89.116.134.182/local-assets/uploads/2021/02/rti-act.pdf",
    category: "RTI Act",
  },
  {
    title: "JNTU Act (Act No. 30 of 2008)",
    desc: "The legislative foundation establishing Jawaharlal Nehru Technological University.",
    link: "http://89.116.134.182/local-assets/uploads/2021/03/JNTUACT-compressed.pdf",
    category: "University Act",
  },
  {
    title: "Government Order (GO MS. No. 14 HE)",
    desc: "Higher Education establishment order for the university college.",
    link: "http://89.116.134.182/local-assets/uploads/2021/03/13022019HE_MS14.pdf",
    category: "Government Order",
  },
];

const RTI_STEPS = [
  {
    step: "01",
    title: "Draft Written Application",
    desc: "Prepare a written application in English or Telugu clearly specifying the particulars of the information sought. Mention your complete postal address and contact details.",
  },
  {
    step: "02",
    title: "Address to the Public Information Officer",
    desc: "Address the request to the Public Information Officer (PIO) or Assistant Public Information Officer (APIO), JNTU-GV College of Engineering Vizianagaram.",
  },
  {
    step: "03",
    title: "Pay Prescribed RTI Fee",
    desc: "Submit the prescribed application fee as per government norms via Demand Draft / Bankers Cheque / Postal Order in favor of the Principal / Registrar.",
  },
  {
    step: "04",
    title: "Timely Redressal & Disposal",
    desc: "The PIO shall provide the required information within 30 days of receipt. If the matter pertains to life and liberty of an individual, response will be furnished within 48 hours.",
  },
];

function RTIPage() {
  return (
    <>
      <PageHero
        eyebrow="Transparency & Open Governance"
        title="Right to Information (RTI) Act, 2005"
        subtitle="UNIVERSITY COLLEGE OF ENGINEERING, VIZIANAGARAM — Empowering citizens with transparent access to institutional information as mandated by the RTI Act, 2005."
        image={heroImg}
      />

      <div className="container-narrow py-20 space-y-24">
        {/* Objectives Section */}
        <RevealOnScroll>
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <SectionLabel
                eyebrow="Mandatory Disclosure"
                title="Commitment to Transparency"
                subtitle="Promoting transparency and accountability in the functioning of public educational authorities."
              />
              <div className="prose prose-slate max-w-none text-slate-700 space-y-4 leading-relaxed">
                <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                  The Right to Information Act, 2005 mandates timely response to citizen requests for government and public institutional information. JNTU-GV College of Engineering Vizianagaram strictly complies with all statutory obligations under the Act.
                </p>
                <p className="text-sm sm:text-base">
                  Citizens can obtain information regarding institutional policies, academic administration, admissions, development activities, and financial allocations in accordance with the provisions prescribed under the RTI Act, 2005.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 text-white p-8 rounded-[32px] border border-white/10 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary-light grid place-items-center">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">Standard Timelines</h3>
              </div>
              <div className="space-y-3 text-xs text-white/80">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-0.5">30 Calendar Days</div>
                  <div className="text-white/60">Standard turnaround time for general information requests.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-0.5">48 Hours</div>
                  <div className="text-white/60">For matters concerning the life and personal liberty of an individual.</div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* RTI Officers / Authorities Table */}
        <RevealOnScroll>
          <div className="space-y-6">
            <SectionLabel
              eyebrow="Statutory Authorities"
              title="Designated Officers under RTI Act, 2005"
              subtitle="Officials designated for receiving, processing, and addressing Right to Information queries."
            />

            <div className="grid md:grid-cols-3 gap-6">
              {RTI_OFFICERS.map((officer) => (
                <div
                  key={officer.sNo}
                  className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-elegant transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${officer.badge}`}
                    >
                      {officer.roleTitle}
                    </span>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{officer.name}</h3>
                      <p className="text-sm font-medium text-primary mt-0.5">
                        {officer.designation}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {officer.scope}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-6 border-t border-slate-100 mt-6 text-xs">
                    <a
                      href={`tel:${officer.phone}`}
                      className="flex items-center gap-2.5 text-slate-700 hover:text-primary font-medium transition-colors"
                    >
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span>{officer.phone}</span>
                    </a>
                    <a
                      href={`mailto:${officer.email}`}
                      className="flex items-center gap-2.5 text-slate-700 hover:text-primary font-medium transition-colors"
                    >
                      <Mail className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{officer.email}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Step-by-Step Procedure */}
        <RevealOnScroll>
          <div className="space-y-8">
            <SectionLabel
              eyebrow="Application Workflow"
              title="How to File an RTI Application"
              subtitle="Step-by-step guidance for citizens submitting requests under the RTI Act, 2005."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {RTI_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="p-6 rounded-[28px] bg-slate-50 border border-slate-200/90 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="text-2xl font-extrabold font-mono text-primary/40">
                      {s.step}
                    </div>
                    <h4 className="font-bold text-base text-slate-900">{s.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Statutory Documents & Downloads */}
        <RevealOnScroll>
          <div className="space-y-6">
            <SectionLabel
              eyebrow="Official Documents"
              title="Statutory Gazettes & Acts"
              subtitle="Direct access to verified official PDFs of the RTI Act, JNTU Act, and Government Orders."
            />

            <div className="grid md:grid-cols-3 gap-6">
              {STATUTORY_DOWNLOADS.map((doc, idx) => (
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
                        {doc.category}
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
          </div>
        </RevealOnScroll>
      </div>
    </>
  );
}
