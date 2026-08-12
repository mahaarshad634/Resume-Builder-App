export default function TemplateBold({ data }) {
  const {
    personalInfo,
    summary,
    education,
    experience,
    skills,
    projects,
    certifications,
    languages,
    socialLinks,
  } = data;

  return (
    <div style={{ background: "#fff", minHeight: "600px", overflow: "hidden" }}>
      {/* Header banner */}
      <div
        style={{
          background: "var(--color-primary, #1f4b4c)",
          color: "#fff",
          padding: "2rem",
        }}
      >
        <h1 className="mb-1" style={{ color: "#fff", fontWeight: 700 }}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        <p className="mb-2" style={{ color: "#d8e6e6", fontSize: "1.1rem" }}>
          {personalInfo.jobTitle}
        </p>
        <p className="small mb-0" style={{ color: "#c3d6d6" }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.address]
            .filter(Boolean)
            .join("   |   ")}
        </p>
      </div>

      <div style={{ padding: "2rem" }}>
        {summary && (
          <div className="mb-4">
            <h6
              className="text-uppercase fw-bold mb-2"
              style={{ color: "var(--color-primary, #1f4b4c)", letterSpacing: "0.06em" }}
            >
              Summary
            </h6>
            <p className="mb-0">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="mb-4">
            <h6
              className="text-uppercase fw-bold mb-3"
              style={{ color: "var(--color-primary, #1f4b4c)", letterSpacing: "0.06em" }}
            >
              Experience
            </h6>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3 ps-3" style={{ borderLeft: "3px solid var(--color-accent, #c98a3e)" }}>
                <div className="d-flex justify-content-between">
                  <strong>{exp.role}</strong>
                  <span className="small text-muted">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="mb-1 small text-muted">{exp.company}</p>
                <p className="mb-0 small">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className="mb-4">
            <h6
              className="text-uppercase fw-bold mb-3"
              style={{ color: "var(--color-primary, #1f4b4c)", letterSpacing: "0.06em" }}
            >
              Education
            </h6>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 ps-3" style={{ borderLeft: "3px solid var(--color-accent, #c98a3e)" }}>
                <div className="d-flex justify-content-between">
                  <strong>
                    {edu.degree}
                    {edu.field ? `, ${edu.field}` : ""}
                  </strong>
                  <span className="small text-muted">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <p className="mb-0 small text-muted">{edu.institution}</p>
                {edu.description && <p className="mb-0 small">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="mb-4">
            <h6
              className="text-uppercase fw-bold mb-3"
              style={{ color: "var(--color-primary, #1f4b4c)", letterSpacing: "0.06em" }}
            >
              Projects
            </h6>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3 ps-3" style={{ borderLeft: "3px solid var(--color-accent, #c98a3e)" }}>
                <strong>{proj.name}</strong>
                {proj.link && <span className="small text-muted"> — {proj.link}</span>}
                <p className="mb-0 small">{proj.description}</p>
                {proj.techStack && <p className="mb-0 small fst-italic text-muted">{proj.techStack}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Two-column row for shorter sections */}
        <div className="row">
          {skills.length > 0 && (
            <div className="col-md-6 mb-4">
              <h6
                className="text-uppercase fw-bold mb-2"
                style={{ color: "var(--color-primary, #1f4b4c)", letterSpacing: "0.06em" }}
              >
                Skills
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="small px-2 py-1"
                    style={{
                      background: "var(--color-bg, #f6f7f9)",
                      border: "1px solid var(--color-border, #e2e5ea)",
                      borderRadius: "4px",
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className="col-md-6 mb-4">
              <h6
                className="text-uppercase fw-bold mb-2"
                style={{ color: "var(--color-primary, #1f4b4c)", letterSpacing: "0.06em" }}
              >
                Languages
              </h6>
              {languages.map((lang) => (
                <p key={lang.id} className="mb-1 small">
                  {lang.name} — {lang.proficiency}
                </p>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div className="col-md-6 mb-4">
              <h6
                className="text-uppercase fw-bold mb-2"
                style={{ color: "var(--color-primary, #1f4b4c)", letterSpacing: "0.06em" }}
              >
                Certifications
              </h6>
              {certifications.map((cert) => (
                <p key={cert.id} className="mb-1 small">
                  {cert.name} — {cert.issuer} ({cert.date})
                </p>
              ))}
            </div>
          )}

          {socialLinks.length > 0 && (
            <div className="col-md-6 mb-4">
              <h6
                className="text-uppercase fw-bold mb-2"
                style={{ color: "var(--color-primary, #1f4b4c)", letterSpacing: "0.06em" }}
              >
                Links
              </h6>
              {socialLinks.map((link) => (
                <p key={link.id} className="mb-1 small">
                  {link.platform}: {link.url}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}