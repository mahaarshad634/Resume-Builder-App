import jsPDF from "jspdf";

const MARGIN = 15;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function ensureProtocol(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function getActiveColors() {
  const styles = getComputedStyle(document.documentElement);
  const hexToRgb = (hex) => {
    const clean = hex.trim().replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
    const num = parseInt(full, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };
  const readVar = (name, fallbackHex) => {
    const val = styles.getPropertyValue(name)?.trim();
    if (!val) return hexToRgb(fallbackHex);
    if (val.startsWith("#")) return hexToRgb(val);
    const match = val.match(/\d+/g);
    if (match && match.length >= 3) return match.slice(0, 3).map(Number);
    return hexToRgb(fallbackHex);
  };
  return {
    primary: readVar("--color-primary", "#235a7e"),
    accent: readVar("--color-accent", "#f0a845"),
    ink: readVar("--color-ink", "#1f2d3d"),
    muted: readVar("--color-muted", "#6e7b8c"),
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

function addWrappedText(doc, y, text, colors, fontSize = 10, indent = 0) {
  if (!text) return y;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(...colors.ink);
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent);
  lines.forEach((line) => {
    y = checkPageBreak(doc, y, 6);
    doc.text(line, MARGIN + indent, y);
    y += 5;
  });
  return y;
}

// ---- Icon badges (rasterized, embedded as PNG) ----
const iconCache = new Map();

function getPlatformAbbrev(platform) {
  if (!platform) return "?";
  const p = platform.toLowerCase();
  if (p.includes("linkedin")) return "in";
  if (p.includes("github")) return "gh";
  if (p.includes("twitter") || p.includes("x.com")) return "tw";
  if (p.includes("web") || p.includes("portfolio") || p.includes("site")) return "www";
  if (p.includes("instagram")) return "ig";
  if (p.includes("facebook")) return "fb";
  return platform.slice(0, 2).toUpperCase();
}

function makeIconDataUrl(label, colorRgb) {
  const cacheKey = `${label}-${colorRgb.join(",")}`;
  if (iconCache.has(cacheKey)) return iconCache.get(cacheKey);
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `rgb(${colorRgb.join(",")})`;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, size / 2, size / 2 + 1);
  const dataUrl = canvas.toDataURL("image/png");
  iconCache.set(cacheKey, dataUrl);
  return dataUrl;
}

function makeInitialsAvatarDataUrl(initials, bgRgba, textColor = "#ffffff") {
  const cacheKey = `avatar-${initials}-${bgRgba}`;
  if (iconCache.has(cacheKey)) return iconCache.get(cacheKey);
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bgRgba;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = textColor;
  ctx.font = "bold 46px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, size / 2, size / 2 + 2);
  const dataUrl = canvas.toDataURL("image/png");
  iconCache.set(cacheKey, dataUrl);
  return dataUrl;
}

function drawSocialLinkRow(doc, x, y, link, iconColor, textColor, iconSize = 4.5) {
  const label = getPlatformAbbrev(link.platform);
  const iconUrl = makeIconDataUrl(label, iconColor);
  doc.addImage(iconUrl, "PNG", x, y - iconSize + 1.1, iconSize, iconSize);
  doc.link(x, y - iconSize + 1.1, iconSize, iconSize, { url: ensureProtocol(link.url) });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  const textX = x + iconSize + 2;
  doc.textWithLink(link.platform, textX, y, { url: ensureProtocol(link.url) });
  return textX + doc.getTextWidth(link.platform);
}

// ---------------------------------------------------------
// CLASSIC
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
    let x = MARGIN;
    socialLinks.forEach((link) => {
      x = drawSocialLinkRow(doc, x, y, link, colors.primary, colors.primary, 4.5) + 6;
    });
    y += 8;
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
// MODERN — matches the new sidebar design: colored bg, avatar, tag pills, timeline
// ---------------------------------------------------------
function drawModern(doc, data, colors) {
  const { personalInfo, summary, education, experience, skills, projects, certifications, languages, socialLinks } = data;
  const sidebarWidth = 65;
  const sidebarFullWidth = sidebarWidth + MARGIN;
  const mainX = sidebarFullWidth + 8;
  const mainWidth = PAGE_WIDTH - mainX - MARGIN;

  // Sidebar background — follows the active palette color
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, sidebarFullWidth, PAGE_HEIGHT, "F");

  let sy = MARGIN;

  // Avatar circle with initials
  const initials = (personalInfo.fullName || "Y N")
    .split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  const avatarUrl = makeInitialsAvatarDataUrl(initials, "rgba(255,255,255,0.18)", "#ffffff");
  const avatarSize = 18;
  doc.addImage(avatarUrl, "PNG", MARGIN, sy, avatarSize, avatarSize);
  sy += avatarSize + 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  const nameLines = doc.splitTextToSize(personalInfo.fullName || "Your Name", sidebarWidth - 5);
  nameLines.forEach((line) => { sy = checkPageBreak(doc, sy, 6); doc.text(line, MARGIN, sy); sy += 5.5; });

  if (personalInfo.jobTitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(215, 225, 225);
    sy += 0.5;
    doc.text(personalInfo.jobTitle, MARGIN, sy);
    sy += 7;
  }

  const sidebarDivider = () => {
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, sy, sidebarWidth + MARGIN - 5, sy);
    sy += 5;
  };

  sidebarDivider();

  doc.setFontSize(8.5);
  doc.setTextColor(215, 225, 225);
  [personalInfo.email, personalInfo.phone, personalInfo.address].filter(Boolean).forEach((line) => {
    const wrapped = doc.splitTextToSize(line, sidebarWidth - 5);
    wrapped.forEach((l) => { sy = checkPageBreak(doc, sy, 5); doc.text(l, MARGIN, sy); sy += 4.5; });
  });
  sy += 3;

  // Skills as tag "pills"
  if (skills?.length > 0) {
    sidebarDivider();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text("SKILLS", MARGIN, sy);
    sy += 5;

    let px = MARGIN;
    let rowStartY = sy;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    skills.forEach((skill) => {
      const label = skill.name;
      const textW = doc.getTextWidth(label);
      const pillW = textW + 4;
      const pillH = 4.6;

      if (px + pillW > sidebarFullWidth - 4) {
        px = MARGIN;
        rowStartY += pillH + 1.6;
      }
      sy = checkPageBreak(doc, rowStartY, pillH + 2);
      if (sy !== rowStartY) rowStartY = sy;

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(255, 255, 255);
      doc.roundedRect(px, rowStartY - 3.3, pillW, pillH, 2, 2, "S");
      doc.setTextColor(255, 255, 255);
      doc.text(label, px + 2, rowStartY);
      px += pillW + 1.6;
    });
    sy = rowStartY + 7;
  }

  // Languages
  if (languages?.length > 0) {
    sidebarDivider();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text("LANGUAGES", MARGIN, sy);
    sy += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    languages.forEach((lang) => {
      sy = checkPageBreak(doc, sy, 5);
      doc.setTextColor(255, 255, 255);
      doc.text(lang.name, MARGIN, sy);
      doc.setTextColor(190, 210, 210);
      doc.text(lang.proficiency, sidebarWidth + MARGIN - 5, sy, { align: "right" });
      sy += 4.6;
    });
    sy += 3;
  }

  // Links with icon badges
  if (socialLinks?.length > 0) {
    sidebarDivider();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text("LINKS", MARGIN, sy);
    sy += 5.5;
    socialLinks.forEach((link) => {
      sy = checkPageBreak(doc, sy, 6);
      const label = getPlatformAbbrev(link.platform);
      const iconUrl = makeIconDataUrl(label, [255, 255, 255]);
      doc.addImage(iconUrl, "PNG", MARGIN, sy - 3.2, 4, 4);
      doc.link(MARGIN, sy - 3.2, 4, 4, { url: ensureProtocol(link.url) });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(215, 225, 225);
      doc.textWithLink(link.platform, MARGIN + 6, sy, { url: ensureProtocol(link.url) });
      sy += 5.5;
    });
  }

  // ---- Main column ----
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
  // Timeline dot beside an entry
  const timelineDot = (dotY) => {
    doc.setFillColor(...colors.primary);
    doc.circle(mainX - 3, dotY - 1.3, 1.1, "F");
  };
  const timelineLine = (fromY, toY) => {
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(mainX - 3, fromY, mainX - 3, toY);
  };

  if (summary) {
    addMainHeading("Summary");
    addMainText(summary);
    y += 3;
  }

  if (experience?.length > 0) {
    addMainHeading("Experience");
    const sectionStartY = y - 2;
    experience.forEach((exp) => {
      y = checkPageBreak(doc, y, 14);
      timelineDot(y);
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
      y += 4;
    });
    timelineLine(sectionStartY, y - 4);
  }

  if (education?.length > 0) {
    addMainHeading("Education");
    const sectionStartY = y - 2;
    education.forEach((edu) => {
      y = checkPageBreak(doc, y, 10);
      timelineDot(y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.ink);
      doc.text(`${edu.degree}${edu.field ? `, ${edu.field}` : ""}`, mainX, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.muted);
      doc.text(`${edu.institution} • ${edu.startDate || ""} to ${edu.endDate || ""}`, mainX, y);
      y += 6;
    });
    timelineLine(sectionStartY, y - 6);
  }

  if (projects?.length > 0) {
    addMainHeading("Projects");
    projects.forEach((proj) => {
      y = checkPageBreak(doc, y, 12);
      // left accent bar
      const startY = y - 3.5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      if (proj.link) {
        doc.setTextColor(...colors.primary);
        doc.textWithLink(proj.name, mainX + 3, y, { url: ensureProtocol(proj.link) });
      } else {
        doc.setTextColor(...colors.ink);
        doc.text(proj.name, mainX + 3, y);
      }
      y += 4.5;
      const beforeDescY = y;
      addMainText(proj.description);
      // shift text indent for description too
      doc.setFillColor(...colors.accent);
      doc.rect(mainX - 1, startY, 0.8, y - startY + 1, "F");
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
// BOLD
// ---------------------------------------------------------
function drawBold(doc, data, colors) {
  const { personalInfo, summary, education, experience, skills, projects, certifications, languages, socialLinks } = data;

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

  if (socialLinks?.length > 0) {
    addHeading("Links");
    let x = MARGIN + 4;
    socialLinks.forEach((link) => {
      x = drawSocialLinkRow(doc, x, y, link, colors.primary, colors.primary, 4.5) + 6;
    });
    y += 8;
  }
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