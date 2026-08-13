export default function TemplateMinimal({ data }) {
  const { personalInfo, summary, education, experience, skills, projects, certifications, languages, socialLinks } = data;

  const ensureProtocol = (url) => (url && !/^https?:\/\//i.test(url) ? `https://${url}` : url);
  const displayLink = (url) => {
    try {
      const u = new URL(ensureProtocol(url));
      return u.hostname + (u.pathname && u.pathname !== "/" ? u.pathname : "");
    } catch {
      return url;
    }
  };

  return (
    <div style={{ background: "#fff", padding: "2.5rem", minHeight: "600px" }}>
      <div className="mb-4">
        <h2 className="mb-0" style={{ fontWeight: 300, letterSpacing: "0.02em" }}>
          {personalInfo.fullName || "Your Name"}
        </h2>
        <p className="text-muted mb-2">{personalInfo.jobTitle}</p>
        <p className="small text-muted">
          {[personalInfo.email, personalInfo.phone, personalInfo.address].filter(Boolean).join("  ·  ")}
        </p>
      </div>

      {summary && (
        <div className="mb-4">
          <p className="mb-0">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-4">
          <h6 className="text-uppercase small fw-bold mb-3" style={{ letterSpacing: "0.08em" }}>Experience</h6>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="d-flex justify-content-between">
                <strong>{exp.role}, {exp.company}</strong>
                <span className="small text-muted">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              <p className="mb-0 small text-muted">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* ...repeat the same minimal pattern for education, projects, skills, etc. */}
    </div>
  );
}
