import { Agentation } from "agentation";
import type { Annotation } from "agentation";

export default function AgentationOverlay() {
  const handleAnnotationAdd = (annotation: Annotation) => {
    // Dispatch a custom event so the DrawOverlay (vanilla JS) can listen
    if (annotation.boundingBox) {
      window.dispatchEvent(
        new CustomEvent("agentation:select", {
          detail: {
            selector: annotation.element,
            boundingBox: annotation.boundingBox,
            comment: annotation.comment,
          },
        })
      );
    }
  };

  return (
    <Agentation
      onAnnotationAdd={handleAnnotationAdd}
    />
  );
}
