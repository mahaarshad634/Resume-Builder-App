import TemplateClassic from "./TemplateClassic";
import TemplateModern from "./TemplateModern";
import TemplateMinimal from "./TemplateMinimal";
import TemplateBold from "./TemplateBold";

export const templateRegistry = {
  classic: TemplateClassic,
  modern: TemplateModern,
  minimal: TemplateMinimal,
  bold: TemplateBold,
};

export const templateOptions = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
];