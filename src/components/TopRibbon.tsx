import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  MessageSquare,
  Mail,
  Image as ImageIcon,
  ShieldBan,
  Phone,
  Scale,
  FileCheck,
  Building,
  X,
  Send,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PushNotificationToggle } from "./PushNotificationBanner";

export function TopRibbon() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    role: "Student",
    category: "General Feedback",
    message: "",
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.message.trim()) {
      toast.error("Please enter your feedback message.");
      return;
    }
    setFeedbackSubmitted(true);
    toast.success("Thank you! Your feedback has been recorded.");
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackOpen(false);
      setFeedbackForm({
        name: "",
        email: "",
        role: "Student",
        category: "General Feedback",
        message: "",
      });
    }, 1800);
  };

  return (
    <>
      <div className="w-full bg-[#0B254E] text-white/90 text-[10.5px] font-medium border-b border-blue-900/50 shadow-inner relative z-50 select-none">
        <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 min-h-[30px] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
          {/* Left: Social Media Icons & Push Toggle */}
          <div className="flex items-center gap-2 shrink-0 pl-0.5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-0.5 text-white/80 hover:text-white hover:bg-white/10 rounded transition-all"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-0.5 text-white/80 hover:text-white hover:bg-white/10 rounded transition-all"
              aria-label="Twitter / X"
              title="Twitter / X"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <div className="ml-1.5 hidden xs:block">
              <PushNotificationToggle />
            </div>
          </div>

          {/* Right: Quick Links matching Ribbon */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 whitespace-nowrap pr-0.5">
            {/* 1. UGC Recognition */}
            <Link
              to="/about/norms"
              className="flex items-center gap-1 px-1 py-0.5 rounded text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              title="UGC 2(f) & 12(B) Recognition"
            >
              <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
              <span className="hidden sm:inline">UGC Recognition</span>
              <span className="sm:hidden">UGC</span>
            </Link>

            <span className="text-white/20">|</span>

            {/* 2. Feedback */}
            <button
              onClick={() => setFeedbackOpen(true)}
              className="flex items-center gap-1 px-1 py-0.5 rounded text-white/85 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Give Portal Feedback"
            >
              <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
              <span>Feedback</span>
            </button>

            <span className="text-white/20">|</span>

            {/* 3. UCEV Mail */}
            <a
              href="https://mail.google.com/a/jntukcev.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-1 py-0.5 rounded text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              title="Official Institutional Webmail"
            >
              <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
              <span>UCEV Mail</span>
            </a>

            <span className="text-white/20">|</span>

            {/* 4. Photo Gallery */}
            <Link
              to="/gallery"
              className="flex items-center gap-1 px-1 py-0.5 rounded text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              title="Campus Photo Gallery"
            >
              <ImageIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
              <span className="hidden sm:inline">Photo Gallery</span>
              <span className="sm:hidden">Gallery</span>
            </Link>

            <span className="text-white/20">|</span>

            {/* 5. Anti Ragging */}
            <Link
              to="/anti-ragging"
              className="flex items-center gap-1 px-1 py-0.5 rounded text-white/85 hover:text-amber-300 hover:bg-white/10 transition-colors"
              title="Anti Ragging Cell & Helpline"
            >
              <ShieldBan className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
              <span>Anti Ragging</span>
            </Link>

            <span className="text-white/20">|</span>

            {/* 6. Contact Us */}
            <Link
              to="/contact"
              className="flex items-center gap-1 px-1 py-0.5 rounded text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              title="Contact College Administration"
            >
              <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
              <span className="hidden sm:inline">Contact Us</span>
              <span className="sm:hidden">Contact</span>
            </Link>

            <span className="text-white/20">|</span>

            {/* 8. RTI Act */}
            <Link
              to="/rti"
              className="flex items-center gap-1 px-1 py-0.5 rounded text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              title="Right to Information Act"
            >
              <Scale className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
              <span>RTI Act</span>
            </Link>

            <span className="text-white/20">|</span>

            {/* 9. GO.M.S.14 */}
            <a
              href="https://jntugvcev.edu.in//wp-content/uploads/2021/03/13022019HE_MS14.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-1 py-0.5 rounded text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              title="Government Order MS No. 14"
            >
              <FileCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
              <span>GO.M.S.14</span>
            </a>

            <span className="text-white/20">|</span>

            {/* 10. JNTU Act */}
            <a
              href="https://jntugvcev.edu.in//wp-content/uploads/2021/03/JNTUACT-compressed.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-1 py-0.5 rounded text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              title="JNTU Act (Act No. 30 of 2008)"
            >
              <Building className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
              <span>JNTU Act</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Feedback Modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setFeedbackOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {feedbackSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-xl font-bold text-white">Feedback Submitted!</h3>
                <p className="text-sm text-white/70">
                  Thank you for helping us improve JNTU-GV College of Engineering portal.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-cyan-300 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">University Feedback</h3>
                    <p className="text-xs text-white/60">Share your thoughts, questions, or suggestions</p>
                  </div>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-white/70 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
                        value={feedbackForm.name}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-white/70 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="user@example.com"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
                        value={feedbackForm.email}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-white/70 mb-1">
                        I am a
                      </label>
                      <select
                        className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        value={feedbackForm.role}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, role: e.target.value })}
                      >
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Parent">Parent</option>
                        <option value="Visitor">Visitor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-white/70 mb-1">
                        Category
                      </label>
                      <select
                        className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        value={feedbackForm.category}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                      >
                        <option value="General Feedback">General Feedback</option>
                        <option value="Academics">Academics</option>
                        <option value="Website & Portal">Website & Portal</option>
                        <option value="Facilities / Campus">Facilities / Campus</option>
                        <option value="Placements">Placements</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-white/70 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write your feedback or query here..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setFeedbackOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#1E40AF] hover:bg-[#1D4ED8] text-white rounded-xl shadow-lg transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Feedback
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
