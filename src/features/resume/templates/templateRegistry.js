import TemplateClassic from "./TemplateClassic";
import TemplateModern from "./TemplateModern";
import TemplateMinimal from "./TemplateMinimal";

export const templateRegistry = {
  classic: TemplateClassic,
  modern: TemplateModern,
  minimal: TemplateMinimal,
};

export const templateOptions = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
];