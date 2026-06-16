import { useState } from "react";
import ThemeToggle from "../ThemeToggle/index.jsx";
import HomePage from "../HomePage/index.jsx";
import StudySession from "../StudySession/index.jsx";

export default function App() {
  const [page, setPage] = useState("home");
  const [config, setConfig] = useState(null);

  function handleStart(cfg) {
    setConfig(cfg);
    setPage("study");
  }

  function handleBack() {
    setPage("home");
  }

  return (
    <>
      {page === "home" && <HomePage onStart={handleStart} />}
      {page === "study" && config && (
        <StudySession config={config} onBack={handleBack} />
      )}
      {page === "home" && <ThemeToggle />}
    </>
  );
}
