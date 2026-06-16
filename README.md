# Slovo Cards

面向中文母语者的俄语词汇学习应用。按章节浏览单词列表，支持四种学习模式和双向俄汉翻译。

纯静态单页应用（SPA），直接部署静态文件。在线地址：[https://slovo-cards.netlify.app/](https://slovo-cards.netlify.app/)

> 其实只是为了自己更好地复习俄语期末考试（笑）

## 功能

- **章节浏览**：按课程章节查看单词列表，搭配章节选择器快速切换
- **闪卡模式**：翻转卡片、查看提示，汉译俄、俄译汉双向学习
- **四种学习模式**：本章顺序、本章随机、乱章顺序、完全随机，满足不同复习偏好
- **进度追踪**：底部显示当前位置与总数
- **键盘操作**：翻页（左右键）、显示释义（空格）、退出学习（ESC）
- **深色 / 浅色主题**：一键切换，偏好自动持久化

## 技术栈

React + Vite

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（http://localhost:5173）
pnpm dev

# 生产构建 → dist/
pnpm build

# 本地预览生产构建
pnpm preview

# 代码检查
pnpm lint
```

## 数据

所有词汇数据位于 `public/data/words.json`，格式为包含章节的数组：

```json
[
  {
    "id": 1,
    "name": "第一课",
    "words": [{ "id": 1, "ru": "слово", "zh": "单词" }]
  }
]
```

## 项目结构

```plaintext
slovo-cards/
├── src/
│   ├── components/
│   │   ├── App/
│   │   ├── CardDisplay/          # 单张闪卡
│   │   ├── ChapterDropdown/      # 章节下拉选择器
│   │   ├── HomePage/             # 配置表单：章节、模式、方向
│   │   ├── Icons/                # 图标组件
│   │   ├── NavigationBar/        # 上一张/下一张 + 进度指示
│   │   ├── StudySession/         # 闪卡学习会话
│   │   └── ThemeToggle/          # 深色/浅色切换
│   ├── context/                  # React上下文
│   ├── hooks/                    # 全局可复用的hooks
│   ├── index.css                 # 全局重置、主题变量、共享按钮样式
│   ├── index.jsx                 # 入口
│   └── utils/                    # 工具函数
└── public/
    └── data/words.json           # 词汇数据
```

## License

MIT
