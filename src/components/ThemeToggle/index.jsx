import { useTheme } from "../../hooks/useTheme.js";
import { SunIcon, MoonIcon } from "../Icons/index.jsx";
import "./index.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme_toggle"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "切换到暗色主题" : "切换到亮色主题"}
      title={theme === "light" ? "暗色模式" : "亮色模式"}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
