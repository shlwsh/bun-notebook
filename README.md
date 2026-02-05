# Bun Markdown - 极简 Markdown 阅读与编辑器

Bun Markdown 是一款基于 **Tauri 2.0**、**Rust** 和 **Vue 3** 构建的高性能、精简型 Markdown 编辑器。它专注于为本地项目文档提供极速的浏览与编辑体验。

## 🚀 核心特性

-   **📂 专注式资源管理器**：自动过滤非 Markdown 文件，只显示项目中的 `.md` 结构及其相关文件夹。
-   **📝 专业级编辑体验**：集成 **CodeMirror 6**，支持语法高亮、实时 Linting 校验（如标题空格检查）。
-   **✨ 智能交互**：
    *   **表格助手**：回车自动补全表格行。
    *   **多媒体集成**：支持图片**拖拽与粘贴**，自动管理 `attachments` 附件目录。
-   **📊 深度渲染**：支持内置 **Mermaid 流程图**预览，呈现精美的文档效果。
-   **⚡ 极速性能**：基于 Rust 后端，亚秒级加载大型 Markdown 文件。
-   **📍 路径感知**：内置面包屑导航，深层目录结构一目了然。

## 🛠️ 技术栈

-   **后端 (Rust)**: Tauri 2.0
-   **前端 (Vue 3)**: CodeMirror 6, Marked, Mermaid, Highlight.js, Pinia
-   **样式**: Vanilla CSS + TailwindCSS

## 📦 快速开始

1.  **安装依赖**：`bun install`
2.  **开发模式**：`bun tauri dev`
3.  **正式构建**：`bun tauri build`

## 🚀 发布与部署

### 构建命令

- **快速构建**: `bun tauri build` - 直接构建 Tauri 应用
- **完整部署**: `bun deploy` - 运行完整的部署流程
- **Windows 批处理**: 双击 `scripts/deploy.bat` 执行部署
- **PowerShell 脚本**: `powershell -ExecutionPolicy Bypass -File ./scripts/deploy.ps1`

### 部署流程

部署脚本会自动执行以下步骤：

1. **环境检查** - 验证 Bun 是否已安装
2. **依赖安装** - 运行 `bun install` 安装所有依赖
3. **构建应用** - 执行 `bun tauri build` 进行 Release 模式编译
4. **输出结果** - 显示构建产物的位置

### 构建产物

构建完成后，会在以下位置生成文件：

- **可执行文件**: `src-tauri/target/release/bun-codeview.exe`
- **Windows 安装包**: `src-tauri/target/release/bundle/msi/*.msi`

### 使用方式

1. **直接运行**: 双击 `bun-codeview.exe` 即可运行应用
2. **安装分发**: 使用 `.msi` 安装包进行分发和安装

### 应用配置

- **应用名称**: bun-codeview
- **版本**: 0.1.0
- **应用标识**: com.smz.bun-codeview
- **前端构建**: 使用 Vite 构建前端资源到 `dist` 目录
- **打包目标**: 支持所有平台

### 正式发布分发

#### 需要分发的文件

**只需要分发以下文件之一：**

1. **独立可执行文件**: `bun-codeview.exe`
   - 位置: `src-tauri/target/release/bun-codeview.exe`
   - 这是一个**完全独立的可执行文件**，可以直接运行
   - 包含了所有必需的前端资源、后端代码和依赖

2. **Windows 安装包**: `*.msi`
   - 位置: `src-tauri/target/release/bundle/msi/*.msi`
   - 用于标准 Windows 安装流程

#### 不需要拷贝的文件/目录

**以下文件/目录不需要分发**（它们已被编译进可执行文件）：

- ❌ `src/` - 源代码目录
- ❌ `public/` - 前端静态资源
- ❌ `src-tauri/src/` - Rust 源代码
- ❌ `src-tauri/icons/` - 图标文件（已嵌入可执行文件）
- ❌ `src-tauri/tauri.conf.json` - 配置文件
- ❌ `package.json`、`bun.lock` - Node.js 依赖配置
- ❌ `vite.config.ts` - 构建配置
- ❌ 任何源代码文件

#### 运行时自动创建的目录

应用程序在首次运行时会自动创建以下数据目录：

1. **知识库数据目录**:
   ```
   %APPDATA%/bun-codeview/knowledge_bases/kb_data.json
   ```
   - 存储知识库和文档数据

2. **历史记录目录**:
   ```
   %USERPROFILE%/.codeview/recent_projects.json
   ```
   - 存储最近打开的项目历史

#### 分发建议

**推荐方式**：
- 分发 `bun-codeview.exe` 单个文件
- 用户可以直接双击运行，无需安装
- 或者分发 `.msi` 安装包，提供标准安装体验

**无需担心**：
- 无需安装 Bun、Node.js 或 Rust
- 无需拷贝任何配置文件
- 无需设置环境变量
- 应用程序完全独立运行

## ⌨️ 快捷操作

-   `Cmd/Ctrl + S`: 保存当前修改
-   `Cmd/Ctrl + B`: 切换侧边栏
-   `Enter`: 在表格行内自动补全下一行

## 📜 开源协议
MIT License
