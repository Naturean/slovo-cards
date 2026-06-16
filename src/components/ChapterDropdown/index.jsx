import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../../utils/cn.js";
import "./index.css";

export default function ChapterDropdown({ chapters, value, onChange, disabled, loading }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);

  const selected = chapters.find((ch) => String(ch.id) === value);
  const label = value === "all" ? "全部章节" : selected?.name ?? "选择章节";

  // Close on outside click
  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Keyboard nav within menu
  const handleKeyDown = useCallback(
    (e) => {
      if (!open || !menuRef.current) return;
      const items = menuRef.current.querySelectorAll('[role="option"]');
      const current = menuRef.current.querySelector('[aria-selected="true"]');
      const idx = Array.from(items).indexOf(current);

      let next = idx;
      if (e.key === "ArrowDown") next = Math.min(idx + 1, items.length - 1);
      if (e.key === "ArrowUp") next = Math.max(idx - 1, 0);
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const el = items[idx];
        if (el) {
          onChange(el.dataset.value);
          setOpen(false);
        }
      }
      if (next !== idx && items[next]) {
        e.preventDefault();
        items[next].focus();
      }
    },
    [open, onChange],
  );

  const handleSelect = useCallback(
    (chId) => {
      onChange(chId);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <div className="dropdown" ref={containerRef}>
      <button
        className={cn("dropdown_trigger", open && "dropdown_trigger_open")}
        onClick={() => !disabled && setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="dropdown_label">
          {loading
            ? "加载中…"
            : chapters.length === 0
              ? "暂无章节"
              : label}
        </span>
        <svg
          className={cn("dropdown_arrow", open && "dropdown_arrow_open")}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          className="dropdown_menu"
          ref={menuRef}
          role="listbox"
          onKeyDown={handleKeyDown}
        >
          <li
            role="option"
            aria-selected={value === "all"}
            data-value="all"
            className={cn("dropdown_item", value === "all" && "dropdown_item_selected")}
            onClick={() => handleSelect("all")}
            tabIndex={0}
          >
            全部章节
            {value === "all" && <span className="dropdown_check">✓</span>}
          </li>
          {chapters.map((ch) => (
            <li
              key={ch.id}
              role="option"
              aria-selected={String(ch.id) === value}
              data-value={String(ch.id)}
              className={cn("dropdown_item", String(ch.id) === value && "dropdown_item_selected")}
              onClick={() => handleSelect(String(ch.id))}
              tabIndex={0}
            >
              {ch.name}
              {String(ch.id) === value && (
                <span className="dropdown_check">✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
