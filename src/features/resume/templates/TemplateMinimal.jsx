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

      {education.length > 0 && (
        <div className="mb-4">
          <h6 className="text-uppercase small fw-bold mb-3" style={{ letterSpacing: "0.08em" }}>Education</h6>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="d-flex justify-content-between">
                <strong>{edu.degree}{edu.field ? `, ${edu.field}` : ""}, {edu.institution}</strong>
                <span className="small text-muted">{edu.startDate} – {edu.endDate}</span>
              </div>
              {edu.description && <p className="mb-0 small text-muted">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-4">
          <h6 className="text-uppercase small fw-bold mb-3" style={{ letterSpacing: "0.08em" }}>Projects</h6>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="d-flex justify-content-between">
                <strong>{proj.name}</strong>
                {proj.techStack && <span className="small text-muted">{proj.techStack}</span>}
              </div>
              {proj.description && <p className="mb-0 small text-muted">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-4">
          <h6 className="text-uppercase small fw-bold mb-3" style={{ letterSpacing: "0.08em" }}>Skills</h6>
          <p className="mb-0 small text-muted">{skills.map((s) => s.name).join(", ")}</p>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="mb-4">
          <h6 className="text-uppercase small fw-bold mb-3" style={{ letterSpacing: "0.08em" }}>Certifications</h6>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2 d-flex justify-content-between">
              <span>{cert.name}{cert.issuer ? `, ${cert.issuer}` : ""}</span>
              {cert.date && <span className="small text-muted">{cert.date}</span>}
            </div>
          ))}
        </div>
      )}

      {languages.length > 0 && (
        <div className="mb-4">
          <h6 className="text-uppercase small fw-bold mb-3" style={{ letterSpacing: "0.08em" }}>Languages</h6>
          <p className="mb-0 small text-muted">
            {languages.map((lang) => `${lang.name} (${lang.proficiency})`).join(", ")}
          </p>
        </div>
      )}

      {socialLinks.length > 0 && (
        <div className="mb-4">
          <h6 className="text-uppercase small fw-bold mb-3" style={{ letterSpacing: "0.08em" }}>Links</h6>
          <p className="mb-0 small text-muted">
            {socialLinks.map((link) => (
              
             <a   key={link.id}
                href={ensureProtocol(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
              >
                {displayLink(link.url)}
              </a>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
