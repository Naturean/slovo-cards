# AGENTS.md

## Project

Slovo Cards — a Russian vocabulary flashcard app for Chinese speakers. Users
browse word lists by chapter, then study in flashcard mode with four shuffle
strategies and bidirectional Russian-Chinese translation. Pure static SPA:
no SSR, no backend, no database, no routing library. Deployed as static files.

## Stack

- **Node** ≥ 18 LTS (dev/build only; no runtime server)
- **Vite** 8 (build tool, dev server)
- **React** 19.2.6 + react-dom 19.2.6
- **@vitejs/plugin-react** 6
- **ESLint** 10.3 (flat config)
- Deploy target: any static host (serve `dist/`)

## Commands

```bash
pnpm dev            # Vite dev server on :5173 with HMR
pnpm build          # production build → dist/
pnpm preview        # preview production build locally
pnpm lint           # ESLint against all project files
```

## Layout

```plaintext
src/                       # all application code
  index.jsx                # entry point — mounts #root
  index.css                # global reset, theme tokens, shared .btn classes
  components/              # React components; one folder per component
    App/                   # top-level: manual page router (useState)
    HomePage/              # config form: chapter, mode, direction
    StudySession/          # flashcard session (also contains shuffle, useKeyboard, useStudyQueue)
    CardDisplay/           # single flashcard (front/hint/back)
    NavigationBar/         # prev/next + progress indicator
    ChapterDropdown/       # custom dropdown (listbox + keyboard nav)
    ThemeToggle/           # dark/light toggle, fixed position
    Icons/                 # inline SVG icon components
  context/                 # React context providers
  hooks/                   # custom hooks (useWords, useTheme)
  utils/                   # small pure utilities (cn only)
public/                    # static assets served as-is
  data/words.json          # vocabulary data — only data source
dist/                      # build output (gitignored)
```

## Rules

- **Do not add npm dependencies** without proposing first — this is a lean
  static SPA and dependency additions are unusual.
- **Do not add a router.** Page switching is manual via `useState` in App.
  Do not introduce react-router, wouter, or any routing library.
- **Do not add a CSS framework or preprocessor.** Use plain CSS with the
  `--color-*` custom properties defined in `src/index.css`.
- **Do not add TypeScript.** The project is pure JSX.
- **Do not add a backend, BaaS, or database.** All data lives in
  `public/data/words.json`.
- **Do not touch `dist/` to fix build issues.** Rebuild instead. If a build
  is broken, fix the source and run `pnpm build`.
- **Keyboard handlers must skip input/textarea/select** tags —
  `useKeyboard` relies on `e.target.tagName`. New global keybindings must
  follow the same guard.
- **Do not inline persisted state** (localStorage/sessionStorage keys)
  without adding a `slovo-cards-` prefix in `localStorage` or scoping in
  `sessionStorage` — ThemeProvider and HomePage already use prefixed keys;
  collisions will break user state silently.

## Conventions

- **Component folder pattern:** each component gets its own folder under
  `src/components/` with `index.jsx` and `index.css`. (`App` and `Icons`
  are exceptions — they have no CSS file.) Import as
  `import Foo from "../Foo/index.jsx"`. No barrel files.
- **Exports:** components use `export default`; hooks and utilities use
  named `export function`. Exception: `useWords` also has a default
  export alongside its named export — either import style works.
- **CSS is global by convention.** There are no CSS modules or scoping
  tools. Class names use underscores as separators (BEM-lite:
  `study_header`, `home_page`, `toggle_btn_active`). No kebab-case in
  class names.
- **Theme tokens** live in `src/index.css` as `--color-*` on `:root` and
  duplicated under `[data-theme="dark"]`. All components reference these
  variables — never hardcode colors.
- **Conditional class joining** uses `cn()` from `src/utils/cn.js`:
  `cn("base", condition && "active")`.
- **`themeContext.js` is lowercase** — the only file in the project that
  breaks PascalCase (creates the context object that `ThemeContext.jsx`
  consumes). Keep this split: `themeContext.js` = `createContext`,
  `ThemeContext.jsx` = provider.
- **Words data shape** — `words.json` is a `{ chapters: [{ id, name, words:
[{ id, ru, zh }] }] }` object. The `useWords` hook normalizes this
  on load. Word IDs are chapter-scoped, not globally unique.
- **UI language is zh-CN** — user-facing strings are Chinese.
- **Theme anti-flash** — `index.html` includes an inline `<script>` that
  reads `localStorage` and sets `data-theme` before first paint, plus a
  `.preload` CSS class that suppresses transitions to avoid a flash of
  light theme. The `ThemeProvider` removes the `preload` class on mount.
  Do not remove these guards without also solving the flash another way.
