import { templateRegistry } from "./templates/templateRegistry";


export default function ResumePreview({ resumeData }) {
  const Template = templateRegistry[resumeData.templateId] || templateRegistry.classic;

  return <Template data={resumeData} />
};