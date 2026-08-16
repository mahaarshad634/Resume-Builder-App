import jsPDF from "jspdf";

const MARGIN = 15;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function ensureProtocol(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// Read the currently active theme colors straight from CSS variables
function getActiveColors() {
  const styles = getComputedStyle(document.documentElement);
  const hexToRgb = (hex) => {
    const clean = hex.trim().replace("#", "");
    const full = clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
    const num = parseInt(full, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const readVar = (name, fallbackHex) => {
    const val = styles.getPropertyValue(name)?.trim();
    if (!val) return hexToRgb(fallbackHex);
    if (val.startsWith("#")) return hexToRgb(val);
    // rgb(r, g, b) fallback parsing
    const match = val.match(/\d+/g);
    if (match && match.length >= 3) return match.slice(0, 3).map(Number);
    return hexToRgb(fallbackHex);
  };

  return {
    primary: readVar("--color-primary", "#1f4b4c"),
    accent: readVar("--color-accent", "#c98a3e"),
    ink: readVar("--color-ink", "#1a2233"),
    muted: readVar("--color-muted", "#6b7280"),
  };
}

function checkPageBreak(doc, y, needed = 10) {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function addSectionHeading(doc, y, text, colors) {
  y = checkPageBreak(doc, y, 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...colors.primary);
  doc.text(text.toUpperCase(), MARGIN, y);
  doc.setDrawColor(220, 220, 220);
  doc.line(MARGIN, y + 1.5, PAGE_WIDTH - MARGIN, y + 1.5);
  return y + 7;
}

function addWrappedText(doc, y, text, colors, fontSize = 10, indent = 0, maxWidthOverride = null) {
  if (!text) return y;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(...colors.ink);
  const width = maxWidthOverride ?? CONTENT_WIDTH - indent;
  const lines = doc.splitTextToSize(text, width);
  lines.forEach((line) => {
    y = checkPageBreak(doc, y, 6);
    doc.text(line, MARGIN + indent, y);
    y += 5;
  });
  return y;
}

// ---------------------------------------------------------
// CLASSIC — single column
// ---------------------------------------------------------
function drawClassic(doc, data, colors) {
  let y = MARGIN;
  const { personalInfo, summary, education, experience, skills, projects, certifications, languages, socialLinks } = data;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...colors.ink);
  doc.text(personalInfo.fullName || "Your Name", MARGIN, y);
  y += 7;

  if (personalInfo.jobTitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...colors.muted);
    doc.text(personalInfo.jobTitle, MARGIN, y);
    y += 6;
  }

  const contactLine = [personalInfo.email, personalInfo.phone, personalInfo.address].filter(Boolean).join("   |   ");
  if (contactLine) {
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.muted);
    doc.text(contactLine, MARGIN, y);
    y += 7;
  } else {
    y += 3;
  }

  if (socialLinks?.length > 0) {
    doc.setFontSize(9.5);
    let x = MARGIN;
    socialLinks.forEach((link, idx) => {
      doc.setTextColor(...colors.primary);
      doc.textWithLink(link.platform, x, y, { url: ensureProtocol(link.url) });
      x += doc.getTextWidth(link.platform) + 3;
      if (idx < socialLinks.length - 1) {
        doc.setTextColor(...colors.muted);
        doc.text("|", x, y);
        x += 4;
      }
    });
    y += 7;
  }

  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;

  if (summary) {
    y = addSectionHeading(doc, y, "Summary", colors);
    y = addWrappedText(doc, y, summary, colors);
    y += 4;
  }

  if (experience?.length > 0) {
    y = addSectionHeading(doc, y, "Experience", colors);
    experience.forEach((exp) => {
      y = checkPageBreak(doc, y, 14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...colors.ink);
      doc.text(`${exp.role} — ${exp.company}`, MARGIN, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...colors.muted);
      doc.text(`${exp.startDate || ""} to ${exp.current ? "Present" : exp.endDate || ""}`, PAGE_WIDTH - MARGIN, y, { align: "right" });
      y += 5;
      y = addWrappedText(doc, y, exp.description, colors, 9.5);
      y += 3;
    });
    y += 2;
  }

  if (education?.length > 0) {
    y = addSectionHeading(doc, y, "Education", colors);
    education.forEach((edu) => {
      y = checkPageBreak(doc, y, 12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...colors.ink);
      doc.text(`${edu.degree}${edu.field ? `, ${edu.field}` : ""} — ${edu.institution}`, MARGIN, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...colors.muted);
      doc.text(`${edu.startDate || ""} to ${edu.endDate || ""}`, PAGE_WIDTH - MARGIN, y, { align: "right" });
      y += 5;
      if (edu.description) y = addWrappedText(doc, y, edu.description, colors, 9.5);
      y += 3;
    });
    y += 2;
  }

  if (projects?.length > 0) {
    y = addSectionHeading(doc, y, "Projects", colors);
    projects.forEach((proj) => {
      y = checkPageBreak(doc, y, 12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      if (proj.link) {
        doc.setTextColor(...colors.primary);
        doc.textWithLink(proj.name, MARGIN, y, { url: ensureProtocol(proj.link) });
      } else {
        doc.setTextColor(...colors.ink);
        doc.text(proj.name, MARGIN, y);
      }
      y += 5;
      y = addWrappedText(doc, y, proj.description, colors, 9.5);
      if (proj.techStack) y = addWrappedText(doc, y, proj.techStack, colors, 9);
      y += 3;
    });
    y += 2;
  }

  if (skills?.length > 0) {
    y = addSectionHeading(doc, y, "Skills", colors);
    y = addWrappedText(doc, y, skills.map((s) => s.name).join(", "), colors);
    y += 4;
  }

  if (certifications?.length > 0) {
    y = addSectionHeading(doc, y, "Certifications", colors);
    certifications.forEach((cert) => {
      y = addWrappedText(doc, y, `${cert.name} — ${cert.issuer} (${cert.date})`, colors, 9.5);
    });
    y += 4;
  }

  if (languages?.length > 0) {
    y = addSectionHeading(doc, y, "Languages", colors);
    y = addWrappedText(doc, y, languages.map((l) => `${l.name} (${l.proficiency})`).join(", "), colors);
  }
}

// ---------------------------------------------------------
// MODERN — dark sidebar + main column
// ---------------------------------------------------------
function drawModern(doc, data, colors) {
  const { personalInfo, summary, education, experience, skills, projects, certifications, languages, socialLinks } = data;
  const sidebarWidth = 65;
  const mainX = MARGIN + sidebarWidth + 8;
  const mainWidth = PAGE_WIDTH - mainX - MARGIN;

  // Sidebar background (dark)
  doc.setFillColor(...colors.ink);
  doc.rect(0, 0, sidebarWidth + MARGIN, PAGE_HEIGHT, "F");

  let sy = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  const nameLines = doc.splitTextToSize(personalInfo.fullName || "Your Name", sidebarWidth - 5);
  nameLines.forEach((line) => { doc.text(line, MARGIN, sy); sy += 6; });

  if (personalInfo.jobTitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(200, 210, 210);
    sy += 1;
    doc.text(personalInfo.jobTitle, MARGIN, sy);
    sy += 8;
  }

  doc.setFontSize(8.5);
  [personalInfo.email, personalInfo.phone, personalInfo.address].filter(Boolean).forEach((line) => {
    const wrapped = doc.splitTextToSize(line, sidebarWidth - 5);
    wrapped.forEach((l) => { doc.text(l, MARGIN, sy); sy += 4.5; });
  });
  sy += 5;

  const sidebarSection = (title, items) => {
    if (!items?.length) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), MARGIN, sy);
    sy += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(200, 210, 210);
    items.forEach((item) => {
      const wrapped = doc.splitTextToSize(item, sidebarWidth - 5);
      wrapped.forEach((l) => { doc.text(l, MARGIN, sy); sy += 4.2; });
    });
    sy += 4;
  };

  sidebarSection("Skills", skills?.map((s) => s.name));
  sidebarSection("Languages", languages?.map((l) => `${l.name} — ${l.proficiency}`));
  sidebarSection("Links", socialLinks?.map((l) => `${l.platform}: ${l.url}`));

  // Main column
  let y = MARGIN;
  const addMainHeading = (text) => {
    y = checkPageBreak(doc, y, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...colors.primary);
    doc.text(text.toUpperCase(), mainX, y);
    y += 6;
  };
  const addMainText = (text, size = 9.5) => {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...colors.ink);
    const lines = doc.splitTextToSize(text, mainWidth);
    lines.forEach((line) => {
      y = checkPageBreak(doc, y, 6);
      doc.text(line, mainX, y);
      y += 4.8;
    });
  };

  if (summary) {
    addMainHeading("Summary");
    addMainText(summary);
    y += 3;
  }

  if (experience?.length > 0) {
    addMainHeading("Experience");
    experience.forEach((exp) => {
      y = checkPageBreak(doc, y, 12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.ink);
      doc.text(exp.role, mainX, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.muted);
      doc.text(`${exp.company} • ${exp.startDate || ""} to ${exp.current ? "Present" : exp.endDate || ""}`, mainX, y);
      y += 4.5;
      addMainText(exp.description);
      y += 3;
    });
  }

  if (education?.length > 0) {
    addMainHeading("Education");
    education.forEach((edu) => {
      y = checkPageBreak(doc, y, 10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.ink);
      doc.text(`${edu.degree}${edu.field ? `, ${edu.field}` : ""}`, mainX, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.muted);
      doc.text(`${edu.institution} • ${edu.startDate || ""} to ${edu.endDate || ""}`, mainX, y);
      y += 5;
    });
  }

  if (projects?.length > 0) {
    addMainHeading("Projects");
    projects.forEach((proj) => {
      y = checkPageBreak(doc, y, 10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      if (proj.link) {
        doc.setTextColor(...colors.primary);
        doc.textWithLink(proj.name, mainX, y, { url: ensureProtocol(proj.link) });
      } else {
        doc.setTextColor(...colors.ink);
        doc.text(proj.name, mainX, y);
      }
      y += 4.5;
      addMainText(proj.description);
      y += 3;
    });
  }

  if (certifications?.length > 0) {
    addMainHeading("Certifications");
    certifications.forEach((cert) => {
      addMainText(`${cert.name} — ${cert.issuer} (${cert.date})`);
    });
  }
}

// ---------------------------------------------------------
// BOLD — colored header banner
// ---------------------------------------------------------
function drawBold(doc, data, colors) {
  const { personalInfo, summary, education, experience, skills, projects, certifications, languages, socialLinks } = data;

  // Header banner
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, PAGE_WIDTH, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(255, 255, 255);
  doc.text(personalInfo.fullName || "Your Name", MARGIN, 16);

  if (personalInfo.jobTitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(220, 230, 230);
    doc.text(personalInfo.jobTitle, MARGIN, 23);
  }

  const contactLine = [personalInfo.email, personalInfo.phone, personalInfo.address].filter(Boolean).join("   |   ");
  if (contactLine) {
    doc.setFontSize(8.5);
    doc.setTextColor(200, 215, 215);
    doc.text(contactLine, MARGIN, 30);
  }

  let y = 48;

  const addHeading = (text) => {
    y = checkPageBreak(doc, y, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...colors.primary);
    doc.text(text.toUpperCase(), MARGIN, y);
    y += 6;
  };
  const addText = (text, size = 9.5, indent = 4) => {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...colors.ink);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent);
    lines.forEach((line) => {
      y = checkPageBreak(doc, y, 6);
      doc.text(line, MARGIN + indent, y);
      y += 5;
    });
  };
  const accentBar = (topY, height) => {
    doc.setFillColor(...colors.accent);
    doc.rect(MARGIN, topY - 3.5, 1, height, "F");
  };

  if (summary) {
    addHeading("Summary");
    addText(summary, 10, 0);
    y += 3;
  }

  if (experience?.length > 0) {
    addHeading("Experience");
    experience.forEach((exp) => {
      const startY = y;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.ink);
      doc.text(exp.role, MARGIN + 4, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.muted);
      doc.text(`${exp.startDate || ""} to ${exp.current ? "Present" : exp.endDate || ""}`, PAGE_WIDTH - MARGIN, y, { align: "right" });
      y += 4.5;
      doc.setFontSize(9);
      doc.setTextColor(...colors.muted);
      doc.text(exp.company, MARGIN + 4, y);
      y += 4.5;
      addText(exp.description);
      accentBar(startY, y - startY + 2);
      y += 3;
    });
  }

  if (education?.length > 0) {
    addHeading("Education");
    education.forEach((edu) => {
      const startY = y;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.ink);
      doc.text(`${edu.degree}${edu.field ? `, ${edu.field}` : ""}`, MARGIN + 4, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.muted);
      doc.text(`${edu.institution} • ${edu.startDate || ""} to ${edu.endDate || ""}`, MARGIN + 4, y);
      y += 5;
      accentBar(startY, y - startY + 2);
    });
  }

  if (projects?.length > 0) {
    addHeading("Projects");
    projects.forEach((proj) => {
      const startY = y;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      if (proj.link) {
        doc.setTextColor(...colors.primary);
        doc.textWithLink(proj.name, MARGIN + 4, y, { url: ensureProtocol(proj.link) });
      } else {
        doc.setTextColor(...colors.ink);
        doc.text(proj.name, MARGIN + 4, y);
      }
      y += 4.5;
      addText(proj.description);
      accentBar(startY, y - startY + 2);
      y += 3;
    });
  }

  const twoCol = (title, items) => {
    if (!items?.length) return;
    addHeading(title);
    addText(items.join(", "), 9.5, 4);
    y += 3;
  };
  twoCol("Skills", skills?.map((s) => s.name));
  twoCol("Languages", languages?.map((l) => `${l.name} — ${l.proficiency}`));
  twoCol("Certifications", certifications?.map((c) => `${c.name} — ${c.issuer} (${c.date})`));
  twoCol("Links", socialLinks?.map((l) => `${l.platform}: ${l.url}`));
}

// ---------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------
export function exportResumeToPdf(resumeData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const colors = getActiveColors();

  switch (resumeData.templateId) {
    case "modern":
      drawModern(doc, resumeData, colors);
      break;
    case "bold":
      drawBold(doc, resumeData, colors);
      break;
    case "classic":
    default:
      drawClassic(doc, resumeData, colors);
      break;
  }

  doc.save(`${resumeData.title || "resume"}.pdf`);
}