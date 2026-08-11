import TemplateClassic from "./TemplateClassic";
import TemplateModern from "./TemplateModern";

export const templateRegistry = {
  classic: TemplateClassic,
  modern: TemplateModern,
};

export const templateOptions = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
];