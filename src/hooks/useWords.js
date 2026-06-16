import { useState, useEffect } from "react";

export function useWords() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchWords = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/data/words.json");
        if (!res.ok) {
          throw new Error("HTTP " + res.status + ": " + res.statusText);
        }
        const data = await res.json();

        if (cancelled) return;

        if (!data.chapters || !Array.isArray(data.chapters)) {
          throw new Error("Invalid data format");
        }

        const loadedChapters = data.chapters.map((ch) => ({
            id: ch.id,
            name: ch.name,
            words: (ch.words || []).map((w) => ({ id: w.id, ru: w.ru, zh: w.zh })),
        }));

        if (!cancelled) {
          setChapters(loadedChapters);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load words");
          setChapters([]);
          setLoading(false);
        }
      }
    }

    fetchWords();

    return () => {
      cancelled = true;
    };
  }, []);

  return { chapters, loading, error };
}
export default useWords;
