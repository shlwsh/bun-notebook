---
inclusion: always
---

# 技术栈规范

本项目是一个基于 Tauri 的桌面应用程序，采用前后端分离架构。

## 前端技术栈

### 核心框架
- **Vue 3.5+** - 使用 Composition API 和 `<script setup>` 语法
- **TypeScript 5.9+** - 严格类型检查
- **Vite 7.2+** - 构建工具和开发服务器

### UI 和样式
- **Tailwind CSS 4.1+** - 原子化 CSS 框架
- **Lucide Vue Next** - 图标库
- **GitHub Markdown CSS** - Markdown 样式

### 状态管理
- **Pinia 3.0+** - Vue 3 官方推荐的状态管理库

### 路由
- **Vue Router 4.5+** - 官方路由解决方案

### 编辑器
- **CodeMirror 6** - 代码编辑器核心
  - 支持多语言高亮（JavaScript, Python, Rust, Markdown）
  - 自动完成、搜索、Lint 等功能
  - One Dark 主题

### Markdown 处理
- **Marked 17+** - Markdown 解析器
- **Mermaid 11+** - 图表渲染
- **Highlight.js 11+** - 代码高亮

### 国际化
- **Vue I18n 11+** - 多语言支持

### 导出功能
- **html2pdf.js** - PDF 导出

## 后端技术栈（Rust/Tauri）

### 核心框架
- **Tauri 2.0** - 桌面应用框架
- **Rust 1.77.2+** - 系统编程语言

### Tauri 插件
- **tauri-plugin-shell** - Shell 命令执行
- **tauri-plugin-fs** - 文件系统访问
- **tauri-plugin-dialog** - 系统对话框
- **tauri-plugin-log** - 日志记录
- **tauri-plugin-process** - 进程管理

### Rust 依赖
- **Serde** - 序列化/反序列化
- **Tokio** - 异步运行时
- **Anyhow/Thiserror** - 错误处理
- **Chrono** - 日期时间处理
- **UUID** - 唯一标识符生成
- **Markdown** - Markdown 处理

## 开发工具

### 包管理器
- **Bun** - 项目唯一的包管理器和运行时
  - 所有依赖安装使用 `bun install`
  - 所有脚本执行使用 `bun run <script>`
  - 禁止使用 npm、yarn 或 pnpm
- **pnpm** - 仅用于锁文件兼容性（不直接使用）

### 代码质量
- **ESLint 9+** - JavaScript/TypeScript 代码检查
- **TypeScript ESLint** - TypeScript 专用规则
- **Clippy** - Rust 代码检查（配置在 `clippy.toml`）
- **Rustfmt** - Rust 代码格式化（配置在 `rustfmt.toml`）

### 测试框架
- **Vitest 4+** - 前端单元测试和集成测试
- **@testing-library/vue** - Vue 组件测试
- **Happy-DOM/JSDOM** - DOM 环境模拟

## 技术栈使用规范

### 前端开发规范

1. **组件开发**
   - 使用 Vue 3 Composition API
   - 优先使用 `<script setup>` 语法
   - 组件必须有明确的 TypeScript 类型定义
   - Props 和 Emits 必须显式声明类型

2. **状态管理**
   - 使用 Pinia Store 管理全局状态
   - Store 文件放在 `src/store/` 目录
   - 每个 Store 必须有清晰的类型定义

3. **样式开发**
   - 优先使用 Tailwind CSS 工具类
   - 避免编写自定义 CSS（除非必要）
   - 使用 `clsx` 和 `tailwind-merge` 处理条件样式

4. **类型定义**
   - 共享类型放在 `shared/types.ts`
   - 模块特定类型放在 `src/types/` 目录
   - 避免使用 `any` 类型

### 后端开发规范

1. **Rust 代码组织**
   - Commands 放在 `src-tauri/src/commands/`
   - Services 放在 `src-tauri/src/services/`
   - Models 放在 `src-tauri/src/models/`

2. **错误处理**
   - 使用 `anyhow::Result` 处理错误
   - 自定义错误使用 `thiserror`
   - 错误信息必须清晰明确

3. **异步编程**
   - 使用 Tokio 异步运行时
   - I/O 操作必须异步化
   - 避免阻塞主线程

### 构建和部署

- 开发环境：`bun run tauri:dev` 或 `./scripts/dev.ps1`
- 生产构建：`bun run tauri:build`
- 部署：`bun run deploy` 或 `./scripts/deploy.ps1`

### 版本管理

- 使用 `bun run upgrade` 升级版本
- 版本信息存储在 `version.json`
- 遵循语义化版本规范

## Bun 使用规范

### 命令规范

**必须使用 Bun 命令：**
```bash
# 安装依赖
bun install

# 运行脚本
bun run dev
bun run build
bun run test
bun run tauri:dev

# 添加依赖
bun add <package>
bun add -d <package>  # 开发依赖

# 移除依赖
bun remove <package>

# 执行 TypeScript 文件
bun scripts/mygit.ts
bun scripts/upgrade-version.ts
```

**禁止使用的命令：**
```bash
# ❌ 不要使用
npm install
npm run dev
yarn add
pnpm install
```

### 为什么使用 Bun

1. **性能优势**：Bun 比 npm/yarn/pnpm 快 10-20 倍
2. **原生 TypeScript**：直接运行 .ts 文件，无需编译
3. **内置工具**：集成测试运行器、打包器等
4. **兼容性**：完全兼容 npm 生态系统

### 注意事项

- 项目根目录有 `bun.lock` 文件（不是 package-lock.json）
- CI/CD 环境也必须使用 Bun
- 团队成员必须安装 Bun：`curl -fsSL https://bun.sh/install | bash`
