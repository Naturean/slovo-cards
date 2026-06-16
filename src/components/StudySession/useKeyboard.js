import { useEffect } from "react";

export function useKeyboard(handlers) {
  useEffect(() => {

    const handleKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase() ?? "";
      if (tag === "input" || tag === "textarea" || tag === "select") {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          handlers.onPrev?.();
          break;

        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          handlers.onNext?.();
          break;

        case " ":
        case "Enter":
          e.preventDefault();
          handlers.onToggle?.();
          break;

        case "Escape":
          handlers.onBack?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlers]);
}
