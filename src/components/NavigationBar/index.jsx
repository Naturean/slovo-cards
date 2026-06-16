import { ArrowLeft, ArrowRight } from "../Icons/index.jsx";
import "./index.css";

export default function NavigationBar({ currentIndex, total, onPrev, onNext }) {
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < total - 1;

  return (
    <div className="nav_bar">
      <button
        className="nav_btn"
        disabled={!canGoPrev}
        onClick={onPrev}
        aria-label="上一个"
      >
        <ArrowLeft />
      </button>

      <span className="nav_index">
        {currentIndex + 1} / {total}
      </span>

      <button
        className="nav_btn"
        disabled={!canGoNext}
        onClick={onNext}
        aria-label="下一个"
      >
        <ArrowRight />
      </button>
    </div>
  );
}
