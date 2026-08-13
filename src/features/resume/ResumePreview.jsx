import { forwardRef } from "react";
import { templateRegistry } from "./templates/templateRegistry";

const ResumePreview = forwardRef(({ resumeData }, ref) => {
  const Template = templateRegistry[resumeData.templateId] || templateRegistry.classic;

  const vars = resumeData?.themeColors || {};
  const style = {
    ...(vars.primary && { "--color-primary": vars.primary }),
    ...(vars.primaryHover && { "--color-primary-hover": vars.primaryHover }),
    ...(vars.accent && { "--color-accent": vars.accent }),
    ...(vars.bg && { "--color-bg": vars.bg }),
    ...(vars.surface && { "--color-surface": vars.surface }),
    ...(vars.border && { "--color-border": vars.border }),
  };

  return (
    <div ref={ref} style={style}>
      <Template data={resumeData} />
    </div>
  );
});

export default ResumePreview;