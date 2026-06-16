import { useState, useEffect } from "react";
import useWords from "../../hooks/useWords.js";
import ChapterDropdown from "../ChapterDropdown/index.jsx";
import { cn } from "../../utils/cn.js";
import "./index.css";

const STORAGE_KEY = "slovo-cards-config";

const MODES = [
  {
    value: "chapter-ordered",
    label: "本章顺序",
    hint: "在选定章节中按单词原始顺序依次学习",
  },
  {
    value: "chapter-random",
    label: "本章随机",
    hint: "在选定章节中将单词随机打乱后学习",
  },
  {
    value: "random-chapter-ordered",
    label: "乱章顺序",
    hint: "所有章节随机排列，每个章节内按原始顺序学习",
  },
  {
    value: "fully-random",
    label: "完全随机",
    hint: "将所有单词完全随机打乱后学习",
  },
];

const DIRECTIONS = [
  { value: "ru-zh", label: "俄译汉" },
  { value: "zh-ru", label: "汉译俄" },
];

function loadConfig() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("slovo-cards: failed to load config from sessionStorage", e);
  }
  return null;
}
function saveConfig(c) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch (e) {
    console.warn("slovo-cards: failed to save config to sessionStorage", e);
  }
}

export default function HomePage({ onStart }) {
  const { chapters, loading, error } = useWords();
  const saved = loadConfig();

  const [mode, setMode] = useState(saved?.mode ?? "chapter-ordered");
  const [chapterId, setChapterId] = useState(saved?.chapterId ?? "all");
  const [direction, setDirection] = useState(saved?.direction ?? "ru-zh");

  useEffect(() => {
    saveConfig({ mode, chapterId, direction });
  }, [mode, chapterId, direction]);

  const activeHint = MODES.find((m) => m.value === mode)?.hint ?? "";
  const isCrossChapter = mode === "random-chapter-ordered" || mode === "fully-random";
  const disabled = loading || !!error || chapters.length === 0;

  return (
    <div className="home_page">
      <h1 className="home_title">Slovo Cards</h1>

      <div className="home_sections">
        <div className="home_section">
          <span className="home_label">章节</span>

          <ChapterDropdown
            chapters={chapters}
            value={chapterId}
            onChange={setChapterId}
            disabled={disabled || isCrossChapter}
            loading={loading}
          />
        </div>

        <div className="home_section">
          <span className="home_label">模式</span>
          <div className="toggle_group">
            {MODES.map((m) => (
              <button
                key={m.value}
                className={cn(
                  "toggle_btn",
                  mode === m.value && "toggle_btn_active",
                )}
                onClick={() => setMode(m.value)}
                aria-pressed={mode === m.value}
                title={m.hint}
              >
                {m.label}
              </button>
            ))}
          </div>
          {activeHint && <p className="home_hint">{activeHint}</p>}
        </div>

        <div className="home_section">
          <span className="home_label">方向</span>
          <div className="toggle_group">
            {DIRECTIONS.map((d) => (
              <button
                key={d.value}
                className={cn(
                  "toggle_btn",
                  direction === d.value && "toggle_btn_active",
                )}
                onClick={() => setDirection(d.value)}
                aria-pressed={direction === d.value}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        className="btn btn_primary"
        disabled={disabled}
        onClick={() => onStart({ mode, chapterId, direction })}
      >
        开始学习
      </button>
    </div>
  );
}
