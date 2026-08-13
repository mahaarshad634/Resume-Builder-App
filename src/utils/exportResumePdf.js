import jsPDF from "jspdf";

const MARGIN = 15;
const PAGE_WIDTH = 210; // A4 mm
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const PRIMARY_COLOR = [31, 75, 76]; // matches your --color-primary in RGB
const MUTED_COLOR = [107, 114, 128];
const INK_COLOR = [26, 34, 51];

function ensureProtocol(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function exportResumeToPdf(resumeData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  const checkPageBreak = (neededSpace = 10) => {
    if (y + neededSpace > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const addSectionHeading = (text) => {
    checkPageBreak(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text(text.toUpperCase(), MARGIN, y);
    doc.setDrawColor(220, 220, 220);
    doc.line(MARGIN, y + 1.5, PAGE_WIDTH - MARGIN, y + 1.5);
    y += 7;
  };

  const addWrappedText = (text, fontSize = 10, color = INK_COLOR, indent = 0) => {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent);
    lines.forEach((line) => {
      checkPageBreak(6);
      doc.text(line, MARGIN + indent, y);
      y += 5;
    });
  };

  const { personalInfo, summary, education, experience, skills, projects, certifications, languages, socialLinks } = resumeData;

  // ---- Header ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...INK_COLOR);
  doc.text(personalInfo.fullName || "Your Name", MARGIN, y);
  y += 7;

  if (personalInfo.jobTitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...MUTED_COLOR);
    doc.text(personalInfo.jobTitle, MARGIN, y);
    y += 6;
  }

  const contactLine = [personalInfo.email, personalInfo.phone, personalInfo.address]
    .filter(Boolean)
    .join("   |   ");
  if (contactLine) {
    doc.setFontSize(9.5);
    doc.setTextColor(...MUTED_COLOR);
    doc.text(contactLine, MARGIN, y);
    y += 7;
  } else {
    y += 3;
  }

  // ---- Social Links (real clickable annotations) ----
  if (socialLinks?.length > 0) {
    doc.setFontSize(9.5);
    let x = MARGIN;
    socialLinks.forEach((link, idx) => {
      const label = `${link.platform}`;
      const url = ensureProtocol(link.url);
      doc.setTextColor(...PRIMARY_COLOR);
      const textWidth = doc.getTextWidth(label);
      doc.textWithLink(label, x, y, { url });
      x += textWidth + 3;
      if (idx < socialLinks.length - 1) {
        doc.setTextColor(...MUTED_COLOR);
        doc.text("|", x, y);
        x += 4;
      }
    });
    y += 7;
  }

  doc.setDrawColor(...PRIMARY_COLOR);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;

  // ---- Summary ----
  if (summary) {
    addSectionHeading("Summary");
    addWrappedText(summary);
    y += 4;
  }

  // ---- Experience ----
  if (experience?.length > 0) {
    addSectionHeading("Experience");
    experience.forEach((exp) => {
      checkPageBreak(14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...INK_COLOR);
      doc.text(`${exp.role} — ${exp.company}`, MARGIN, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...MUTED_COLOR);
      const dateText = `${exp.startDate || ""} to ${exp.current ? "Present" : exp.endDate || ""}`;
      doc.text(dateText, PAGE_WIDTH - MARGIN, y, { align: "right" });
      y += 5;

      addWrappedText(exp.description, 9.5);
      y += 3;
    });
    y += 2;
  }

  // ---- Education ----
  if (education?.length > 0) {
    addSectionHeading("Education");
    education.forEach((edu) => {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...INK_COLOR);
      const degreeLine = `${edu.degree}${edu.field ? `, ${edu.field}` : ""} — ${edu.institution}`;
      doc.text(degreeLine, MARGIN, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...MUTED_COLOR);
      doc.text(`${edu.startDate || ""} to ${edu.endDate || ""}`, PAGE_WIDTH - MARGIN, y, { align: "right" });
      y += 5;

      if (edu.description) {
        addWrappedText(edu.description, 9.5);
      }
      y += 3;
    });
    y += 2;
  }

  // ---- Projects (name as a real clickable link) ----
  if (projects?.length > 0) {
    addSectionHeading("Projects");
    projects.forEach((proj) => {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);

      if (proj.link) {
        doc.setTextColor(...PRIMARY_COLOR);
        doc.textWithLink(proj.name, MARGIN, y, { url: ensureProtocol(proj.link) });
      } else {
        doc.setTextColor(...INK_COLOR);
        doc.text(proj.name, MARGIN, y);
      }
      y += 5;

      addWrappedText(proj.description, 9.5);
      if (proj.techStack) {
        doc.setFont("helvetica", "italic");
        addWrappedText(proj.techStack, 9, MUTED_COLOR);
      }
      y += 3;
    });
    y += 2;
  }

  // ---- Skills ----
  if (skills?.length > 0) {
    addSectionHeading("Skills");
    addWrappedText(skills.map((s) => s.name).join(", "));
    y += 4;
  }

  // ---- Certifications ----
  if (certifications?.length > 0) {
    addSectionHeading("Certifications");
    certifications.forEach((cert) => {
      addWrappedText(`${cert.name} — ${cert.issuer} (${cert.date})`, 9.5);
    });
    y += 4;
  }

  // ---- Languages ----
  if (languages?.length > 0) {
    addSectionHeading("Languages");
    addWrappedText(languages.map((l) => `${l.name} (${l.proficiency})`).join(", "));
  }

  doc.save(`${resumeData.title || "resume"}.pdf`);
}