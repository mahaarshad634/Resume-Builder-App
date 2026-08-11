export default function TemplateModern({ data }) {
  const { personalInfo, summary, education, experience, skills, projects, certifications, languages, socialLinks } = data;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #dee2e6",
        borderRadius: "6px",
        minHeight: "600px",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "35%",
          background: "#2c3e50",
          color: "#fff",
          padding: "1.5rem",
        }}
      >
        <h4 className="mb-0">{personalInfo.fullName || "Your Name"}</h4>
        <p className="mb-3" style={{ color: "#bdc3c7" }}>{personalInfo.jobTitle}</p>

        <div className="mb-3 small">
          {personalInfo.email && <p className="mb-1">{personalInfo.email}</p>}
          {personalInfo.phone && <p className="mb-1">{personalInfo.phone}</p>}
          {personalInfo.address && <p className="mb-1">{personalInfo.address}</p>}
        </div>

        {skills.length > 0 && (
          <div className="mb-3">
            <h6 style={{ color: "#ecf0f1" }} className="border-bottom pb-1">Skills</h6>
            {skills.map((skill) => (
              <p key={skill.id} className="mb-1 small">{skill.name}</p>
            ))}
          </div>
        )}

        {languages.length > 0 && (
          <div className="mb-3">
            <h6 style={{ color: "#ecf0f1" }} className="border-bottom pb-1">Languages</h6>
            {languages.map((lang) => (
              <p key={lang.id} className="mb-1 small">{lang.name} — {lang.proficiency}</p>
            ))}
          </div>
        )}

        {socialLinks.length > 0 && (
          <div className="mb-3">
            <h6 style={{ color: "#ecf0f1" }} className="border-bottom pb-1">Links</h6>
            {socialLinks.map((link) => (
              <p key={link.id} className="mb-1 small">{link.platform}: {link.url}</p>
            ))}
          </div>
        )}
      </div>

      {/* Main column */}
      <div style={{ width: "65%", padding: "1.5rem" }}>
        {summary && (
          <div className="mb-3">
            <h6 className="text-uppercase" style={{ color: "#2c3e50" }}>Summary</h6>
            <p className="mb-0 small">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="mb-3">
            <h6 className="text-uppercase" style={{ color: "#2c3e50" }}>Experience</h6>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-2">
                <strong>{exp.role}</strong>
                <p className="mb-0 small text-muted">
                  {exp.company} • {exp.startDate} to {exp.current ? "Present" : exp.endDate}
                </p>
                <p className="mb-0 small">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className="mb-3">
            <h6 className="text-uppercase" style={{ color: "#2c3e50" }}>Education</h6>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <strong>{edu.degree}{edu.field ? `, ${edu.field}` : ""}</strong>
                <p className="mb-0 small text-muted">
                  {edu.institution} • {edu.startDate} to {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="mb-3">
            <h6 className="text-uppercase" style={{ color: "#2c3e50" }}>Projects</h6>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <strong>{proj.name}</strong>
                <p className="mb-0 small">{proj.description}</p>
                {proj.techStack && <p className="mb-0 small fst-italic text-muted">{proj.techStack}</p>}
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className="mb-3">
            <h6 className="text-uppercase" style={{ color: "#2c3e50" }}>Certifications</h6>
            {certifications.map((cert) => (
              <p key={cert.id} className="mb-1 small">
                {cert.name} — {cert.issuer} ({cert.date})
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}