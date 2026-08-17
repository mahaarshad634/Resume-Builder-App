import { Linkedin, Github, Twitter, Globe, Link as LinkIcon, ExternalLink } from "lucide-react";

export default function TemplateModern({ data }) {
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

  const iconFor = (platform) => {
    if (!platform) return <LinkIcon size={14} />;
    const p = platform.toLowerCase();
    if (p.includes("linkedin")) return <Linkedin size={14} />;
    if (p.includes("github")) return <Github size={14} />;
    if (p.includes("twitter")) return <Twitter size={14} />;
    if (p.includes("web") || p.includes("portfolio") || p.includes("website")) return <Globe size={14} />;
    return <ExternalLink size={14} />;
  };

  const initials = (personalInfo.fullName || "Y N")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="resume-template resume-template-modern">
      {/* Sidebar */}
      <div className="resume-template-sidebar">
        <div className="modern-sidebar-content">
          <div className="modern-avatar">{initials}</div>

          <h4 className="mb-0">{personalInfo.fullName || "Your Name"}</h4>
          <p className="mb-3 text-muted-light">{personalInfo.jobTitle}</p>

          <div className="modern-sidebar-divider" />

          <div className="mb-3 small modern-contact">
            {personalInfo.email && <p className="mb-1">{personalInfo.email}</p>}
            {personalInfo.phone && <p className="mb-1">{personalInfo.phone}</p>}
            {personalInfo.address && <p className="mb-1">{personalInfo.address}</p>}
          </div>

          {skills.length > 0 && (
            <>
              <div className="modern-sidebar-divider" />
              <div className="mb-3">
                <h6 className="section-heading">Skills</h6>
                <div className="modern-tag-group">
                  {skills.map((skill) => (
                    <span key={skill.id} className="modern-tag">{skill.name}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {languages.length > 0 && (
            <>
              <div className="modern-sidebar-divider" />
              <div className="mb-3">
                <h6 className="section-heading">Languages</h6>
                {languages.map((lang) => (
                  <div key={lang.id} className="modern-language-row">
                    <span className="small">{lang.name}</span>
                    <span className="modern-language-level">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {socialLinks.length > 0 && (
            <>
              <div className="modern-sidebar-divider" />
              <div className="mb-3">
                <h6 className="section-heading">Links</h6>
                {socialLinks.map((link) => (
                  <div key={link.id} className="d-flex align-items-center gap-2 mb-2">
                    <span className="modern-link-icon">{iconFor(link.platform)}</span>
                    
                     <a href={ensureProtocol(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="small text-muted-light modern-link-text"
                    >
                      {displayLink(link.url)}
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Decorative footer — absorbs leftover height instead of leaving blank space */}
        <div className="modern-sidebar-footer">
          <div className="modern-sidebar-footer-line" />
          <div className="modern-sidebar-footer-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>

      {/* Main column */}
      <div className="resume-template-main">
        {summary && (
          <div className="section-block">
            <h6 className="section-heading">Summary</h6>
            <p className="mb-0 small">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="section-block">
            <h6 className="section-heading">Experience</h6>
            <div className="modern-timeline">
              {experience.map((exp) => (
                <div key={exp.id} className="modern-timeline-item">
                  <div className="modern-timeline-dot" />
                  <strong>{exp.role}</strong>
                  <p className="mb-0 small text-muted">
                    {exp.company} • {exp.startDate} to {exp.current ? "Present" : exp.endDate}
                  </p>
                  <p className="mb-0 small">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="section-block">
            <h6 className="section-heading">Education</h6>
            <div className="modern-timeline">
              {education.map((edu) => (
                <div key={edu.id} className="modern-timeline-item">
                  <div className="modern-timeline-dot" />
                  <strong>{edu.degree}{edu.field ? `, ${edu.field}` : ""}</strong>
                  <p className="mb-0 small text-muted">
                    {edu.institution} • {edu.startDate} to {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="section-block">
            <h6 className="section-heading">Projects</h6>
            {projects.map((proj) => (
              <div key={proj.id} className="modern-project-card">
                <div className="d-flex align-items-center gap-2">
                  <strong>{proj.name}</strong>
                  {proj.link && (
                    <a href={ensureProtocol(proj.link)} target="_blank" rel="noopener noreferrer" title="Project link" className="modern-link-icon">
                      {iconFor("website")}
                    </a>
                  )}
                </div>
                <p className="mb-0 small">{proj.description}</p>
                {proj.techStack && <p className="mb-0 small fst-italic text-muted">{proj.techStack}</p>}
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className="section-block">
            <h6 className="section-heading">Certifications</h6>
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