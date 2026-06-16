import "./index.css";
import { cn } from "../../utils/cn.js";

export default function CardDisplay({ frontText, backText, isRevealed, onToggle }) {
  // Keyboard toggle is handled globally by useKeyboard;
  // keeping the onKeyDown handler here would double-fire (bug).
  return (
    <div
      className="card"
      onClick={onToggle}
      role="button"
      tabIndex={0}
    >
      <span className="card_front">{frontText}</span>

      <div className="card_body">
        <span className={cn("card_hint", isRevealed && "card_hint_hidden")}>
          点击或按空格查看释义
        </span>

        <span
          className={cn("card_back", isRevealed ? "card_back_visible" : "card_back_hidden")}
        >
          {backText}
        </span>
      </div>
    </div>
  );
}
