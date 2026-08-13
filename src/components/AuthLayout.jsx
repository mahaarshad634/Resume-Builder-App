import { FileText, ShieldCheck, LayoutTemplate, Sparkles } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Left hero panel — hidden on small screens */}
      <div
        className="d-none d-lg-flex flex-column justify-content-between"
        style={{
          width: "45%",
          background: "var(--color-primary)",
          color: "#fff",
          padding: "3rem",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <FileText size={28} />
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.4rem" }}>
            Resume Builder
          </span>
        </div>

        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", color: "#fff", fontSize: "2.2rem" }}>
            Build a resume that gets noticed.
          </h1>
          <p style={{ color: "#c3d6d6" }}>
            Create, customize, and manage multiple resumes with live preview and
            professional templates — all in one place.
          </p>

          <div className="mt-4 d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-2">
              <LayoutTemplate size={20} />
              <span className="small">Multiple templates, one dataset</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={20} />
              <span className="small">Live preview as you type</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <ShieldCheck size={20} />
              <span className="small">Your resumes, securely yours</span>
            </div>
          </div>
        </div>

        <p className="small mb-0" style={{ color: "#8fa8a8" }}>
          © {new Date().getFullYear()} Resume Builder
        </p>
      </div>

      {/* Right form panel */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ width: "100%", background: "var(--color-bg)", padding: "2rem" }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>{children}</div>
      </div>
    </div>
  );
}