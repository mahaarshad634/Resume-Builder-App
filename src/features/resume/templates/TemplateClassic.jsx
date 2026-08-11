export default function TemplateClassic({ data }) {
  const { personalInfo, summary, education, experience, skills, projects, certifications, languages, socialLinks } = data;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #dee2e6",
        borderRadius: "6px",
        padding: "2rem",
        minHeight: "600px",
      }}
    >
      <div className="mb-3">
        <h2 className="mb-0">{personalInfo.fullName || "Your Name"}</h2>
        <p className="text-muted mb-1">{personalInfo.jobTitle}</p>
        <p className="small text-muted mb-0">
          {[personalInfo.email, personalInfo.phone, personalInfo.address]
            .filter(Boolean)
            .join(" | ")}
        </p>
      </div>

      {summary && (
        <div className="mb-3">
          <h6 className="border-bottom pb-1">Summary</h6>
          <p className="mb-0">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-3">
          <h6 className="border-bottom pb-1">Experience</h6>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="d-flex justify-content-between">
                <strong>{exp.role} — {exp.company}</strong>
                <span className="small text-muted">
                  {exp.startDate} to {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="mb-0 small">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-3">
          <h6 className="border-bottom pb-1">Education</h6>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="d-flex justify-content-between">
                <strong>{edu.degree}{edu.field ? `, ${edu.field}` : ""} — {edu.institution}</strong>
                <span className="small text-muted">
                  {edu.startDate} to {edu.endDate}
                </span>
              </div>
              {edu.description && <p className="mb-0 small">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-3">
          <h6 className="border-bottom pb-1">Projects</h6>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <strong>{proj.name}</strong>
              {proj.link && <span className="small text-muted"> — {proj.link}</span>}
              <p className="mb-0 small">{proj.description}</p>
              {proj.techStack && <p className="mb-0 small fst-italic">{proj.techStack}</p>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-3">
          <h6 className="border-bottom pb-1">Skills</h6>
          <p className="mb-0 small">{skills.map((s) => s.name).join(", ")}</p>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="mb-3">
          <h6 className="border-bottom pb-1">Certifications</h6>
          {certifications.map((cert) => (
            <p key={cert.id} className="mb-1 small">
              {cert.name} — {cert.issuer} ({cert.date})
            </p>
          ))}
        </div>
      )}

      {languages.length > 0 && (
        <div className="mb-3">
          <h6 className="border-bottom pb-1">Languages</h6>
          <p className="mb-0 small">
            {languages.map((lang) => `${lang.name} (${lang.proficiency})`).join(", ")}
          </p>
        </div>
      )}

      {socialLinks.length > 0 && (
        <div className="mb-3">
          <h6 className="border-bottom pb-1">Links</h6>
          <p className="mb-0 small">
            {socialLinks.map((link) => `${link.platform}: ${link.url}`).join(" | ")}
          </p>
        </div>
      )}
    </div>
  );
}