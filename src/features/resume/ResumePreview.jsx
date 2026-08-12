import { forwardRef } from "react";
import { templateRegistry } from "./templates/templateRegistry";

const ResumePreview = forwardRef(({ resumeData }, ref) => {
  const Template = templateRegistry[resumeData.templateId] || templateRegistry.classic;

  return (
    <div ref={ref}>
      <Template data={resumeData} />
    </div>
  );
});

export default ResumePreview;