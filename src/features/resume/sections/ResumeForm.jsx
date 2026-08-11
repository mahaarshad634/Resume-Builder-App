import PersonalInfo from "./sections/PersonalInfo";
import ProfessionalSummary from "./sections/ProfessionalSummary";
import Education from "./sections/Education";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Certifications from "./sections/Certifications";
import Languages from "./sections/Languages";
import SocialLinks from "./sections/SocialLinks";

export default function ResumeForm({ resumeData, updateSection }) {
  return (
    <div>
      <PersonalInfo
        data={resumeData.personalInfo}
        onChange={(v) => updateSection("personalInfo", v)}
      />
      <ProfessionalSummary
        data={resumeData.summary}
        onChange={(v) => updateSection("summary", v)}
      />
      <Education
        data={resumeData.education}
        onChange={(v) => updateSection("education", v)}
      />
      <Experience
        data={resumeData.experience}
        onChange={(v) => updateSection("experience", v)}
      />
      <Skills
        data={resumeData.skills}
        onChange={(v) => updateSection("skills", v)}
      />
      <Projects
        data={resumeData.projects}
        onChange={(v) => updateSection("projects", v)}
      />
      <Certifications
        data={resumeData.certifications}
        onChange={(v) => updateSection("certifications", v)}
      />
      <Languages
        data={resumeData.languages}
        onChange={(v) => updateSection("languages", v)}
      />
      <SocialLinks
        data={resumeData.socialLinks}
        onChange={(v) => updateSection("socialLinks", v)}
      />
    </div>
  );
}