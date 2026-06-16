import { useMemo } from "react";
import { shuffle } from "./shuffle.js";

export function useStudyQueue(config, chapters) {
  return useMemo(() => {
    if (!config || !chapters || chapters.length === 0) {
      return [];
    }

    const { mode, chapterId } = config;

    switch (mode) {
      case "chapter-ordered":
        return buildChapterOrdered(chapters, chapterId);

      case "chapter-random":
        return buildChapterRandom(chapters, chapterId);

      case "random-chapter-ordered":
        return buildRandomChapterOrdered(chapters);

      case "fully-random":
        return buildFullyRandom(chapters);

      default:
        return [];
    }
  }, [config, chapters]);
}

function buildChapterOrdered(chapters, chapterId) {
  if (chapterId === "all") {
    const result = [];
    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];
      for (let j = 0; j < ch.words.length; j++) {
        const w = ch.words[j];
        result.push({ ru: w.ru, zh: w.zh, chapterId: ch.id, chapterName: ch.name });
      }
    }
    return result;
  }
  const chapter = findChapter(chapters, chapterId);
  if (!chapter) return [];
  return chapter.words.map((w) => ({
    ru: w.ru,
    zh: w.zh,
    chapterId: chapter.id,
    chapterName: chapter.name,
  }));
}

function buildChapterRandom(chapters, chapterId) {
  if (chapterId === "all") {
    const result = [];
    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];
      const shuffledWords = shuffle(ch.words);
      for (let j = 0; j < shuffledWords.length; j++) {
        const w = shuffledWords[j];
        result.push({ ru: w.ru, zh: w.zh, chapterId: ch.id, chapterName: ch.name });
      }
    }
    return result;
  }
  const chapter = findChapter(chapters, chapterId);
  if (!chapter) return [];
  const shuffledWords = shuffle(chapter.words);
  return shuffledWords.map((w) => ({
    ru: w.ru,
    zh: w.zh,
    chapterId: chapter.id,
    chapterName: chapter.name,
  }));
}

function buildRandomChapterOrdered(chapters) {
  const shuffledChapters = shuffle(chapters);
  const result = [];
  for (let i = 0; i < shuffledChapters.length; i++) {
    const ch = shuffledChapters[i];
    for (let j = 0; j < ch.words.length; j++) {
      const w = ch.words[j];
      result.push({ ru: w.ru, zh: w.zh, chapterId: ch.id, chapterName: ch.name });
    }
  }
  return result;
}

function buildFullyRandom(chapters) {
  const allWords = [];
  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    for (let j = 0; j < ch.words.length; j++) {
      const w = ch.words[j];
      allWords.push({ ru: w.ru, zh: w.zh, chapterId: ch.id, chapterName: ch.name });
    }
  }
  return shuffle(allWords);
}

function findChapter(chapters, chapterId) {
  const numId = Number(chapterId);
  for (let i = 0; i < chapters.length; i++) {
    if (chapters[i].id === numId) return chapters[i];
  }
  return null;
}

export default useStudyQueue;
