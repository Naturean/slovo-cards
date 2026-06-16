import { useState, useCallback } from "react";
import useWords from "../../hooks/useWords.js";
import useStudyQueue from "./useStudyQueue.js";
import { useKeyboard } from "./useKeyboard.js";
import { HomeIcon, LoaderIcon, AlertIcon, CheckIcon } from "../Icons/index.jsx";
import ThemeToggle from "../ThemeToggle/index.jsx";
import CardDisplay from "../CardDisplay/index.jsx";
import NavigationBar from "../NavigationBar/index.jsx";
import "./index.css";

const MODE_LABELS = {
  "chapter-ordered": "本章顺序",
  "chapter-random": "本章随机",
  "random-chapter-ordered": "乱章顺序",
  "fully-random": "完全随机",
};

export default function StudySession({ config, onBack }) {
  const { chapters, loading, error } = useWords();
  const queue = useStudyQueue(config, chapters);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);

  const total = queue.length;

  const goTo = useCallback(
    (index) => {
      if (index >= 0 && index < total) {
        setCurrentIndex(index);
        setIsRevealed(false);
        setCompleted(false);
      }
    },
    [total],
  );

  const goPrev = useCallback(
    () => goTo(currentIndex - 1),
    [goTo, currentIndex],
  );

  const goNext = useCallback(() => {
    if (currentIndex >= total - 1) {
      setCompleted(true);
    } else {
      goTo(currentIndex + 1);
    }
  }, [goTo, currentIndex, total]);

  const toggleReveal = useCallback(() => {
    setIsRevealed((prev) => !prev);
  }, []);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setCompleted(false);
  }, []);

  useKeyboard({
    onPrev: completed ? undefined : goPrev,
    onNext: completed ? undefined : goNext,
    onToggle: completed ? undefined : toggleReveal,
    onBack,
  });

  const currentItem = total > 0 ? queue[currentIndex] : null;

  const frontText = currentItem
    ? config.direction === "ru-zh"
      ? currentItem.ru
      : currentItem.zh
    : "";

  const backText = currentItem
    ? config.direction === "ru-zh"
      ? currentItem.zh
      : currentItem.ru
    : "";

  const chapterName = currentItem?.chapterName ?? "";
  const modeLabel = MODE_LABELS[config.mode] ?? config.mode;

  if (loading) {
    return (
      <div className="study_session">
        <div className="state_message">
          <LoaderIcon className="state_message_icon" />
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study_session">
        <div className="state_message">
          <AlertIcon className="state_message_icon" />
          <span>加载失败，请刷新页面重试</span>
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="study_session">
        <div className="state_message">
          <AlertIcon className="state_message_icon" />
          <span>暂无单词</span>
        </div>
      </div>
    );
  }

  return (
    <div className="study_session">
      <header className="study_header">
        <div className="study_header_left">
          <button
            className="btn btn_icon"
            onClick={onBack}
            aria-label="返回首页"
          >
            <HomeIcon />
          </button>
          <span className="study_header_chapter">{chapterName}</span>
          <span className="study_header_mode">{modeLabel}</span>
        </div>
        <ThemeToggle />
      </header>

      <div className="card_area">
        {completed ? (
          <div className="completion">
            <CheckIcon className="completion_icon" />
            <p className="completion_text">学习完成！</p>
            <p className="completion_detail">
              共 {total} 个单词 · {chapterName} · {modeLabel}
            </p>
            <div className="completion_actions">
              <button className="btn btn_primary" onClick={restart}>
                重新学习
              </button>
              <button className="btn" onClick={onBack}>
                返回首页
              </button>
            </div>
          </div>
        ) : (
          <CardDisplay
            frontText={frontText}
            backText={backText}
            isRevealed={isRevealed}
            onToggle={toggleReveal}
          />
        )}
      </div>

      <NavigationBar
        currentIndex={currentIndex}
        total={total}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}
