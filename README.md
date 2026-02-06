# MD Notebook - 极简 Markdown 阅读与编辑器

MD Notebook 是一款基于 **Tauri 2.0**、**Rust** 和 **Vue 3** 构建的高性能、精简型 Markdown 编辑器。它专注于为本地项目文档提供极速的浏览与编辑体验。

## 🚀 核心特性

-   **📂 多文件类型支持**：支持 Markdown、TypeScript、JavaScript、TXT 等多种文件类型的浏览和编辑
-   **📝 专业级编辑体验**：集成 **CodeMirror 6**，支持语法高亮、实时 Linting 校验（如标题空格检查）
-   **🎨 Markdown 富文本工具栏**：提供可视化编辑工具，支持标题、粗体、斜体、列表、表格、图片、链接等快捷操作
-   **💻 TypeScript/JavaScript 支持**：完整的 TS/JS 代码编辑功能，带语法高亮和代码格式化
-   **✨ 智能交互**：
    *   **表格助手**：回车自动补全表格行
    *   **多媒体集成**：支持图片**拖拽与粘贴**，自动管理 `attachments` 附件目录
-   **📊 深度渲染**：支持内置 **Mermaid 流程图**预览，呈现精美的文档效果
-   **💾 文档导出**：支持导出为 HTML、PDF、DOCX 格式，方便分享和存档
-   **⚡ 极速性能**：基于 Rust 后端，亚秒级加载大型文件
-   **📍 路径感知**：内置面包屑导航，深层目录结构一目了然
-   **🎨 主题切换**：支持深色/浅色主题，多种预览主题可选

## 🛠️ 技术栈

-   **后端 (Rust)**: Tauri 2.0
-   **前端 (Vue 3)**: CodeMirror 6, Marked, Mermaid, Highlight.js, Pinia
-   **样式**: Tailwind CSS
-   **构建工具**: Vite + Bun

## 📦 快速开始

1.  **安装依赖**：`bun install`
2.  **开发模式**：`bun tauri:dev` 或 `bun run dev`
3.  **正式构建**：`bun tauri build`

## ⌨️ 快捷操作

-   `Ctrl/Cmd + O`: 打开文件夹
-   `Ctrl/Cmd + S`: 保存当前修改
-   `Ctrl/Cmd + B`: 切换侧边栏
-   `Enter`: 在表格行内自动补全下一行

## 📖 使用指南

### 支持的文件类型

- **Markdown (.md)**: 完整的预览和编辑功能，带富文本工具栏
- **TypeScript (.ts, .tsx)**: 代码编辑，语法高亮
- **JavaScript (.js, .jsx)**: 代码编辑，语法高亮
- **文本文件 (.txt, .log)**: 纯文本编辑
- **JSON (.json)**: JSON 文件查看和编辑
- **图片 (.png, .jpg, .svg 等)**: 图片预览

### 基本操作

1. **打开项目**：点击工具栏的文件夹图标或使用 `Ctrl+O`，选择包含文件的目录
2. **浏览文件**：左侧文件树会显示所有支持的文件类型
3. **编辑文档**：
   - **Markdown 文件**：可在预览和编辑模式间切换，编辑模式下显示工具栏
   - **代码文件**：直接进入编辑模式，支持语法高亮
   - **文本文件**：纯文本编辑模式
4. **保存文件**：修改后点击保存按钮或使用 `Ctrl+S` 快捷键
5. **导出文档**：点击导出按钮，选择 HTML、PDF 或 DOCX 格式另存（仅 Markdown）
6. **插入图片**：在 Markdown 编辑模式下，直接拖拽或粘贴图片，自动保存到 `attachments` 目录

### Markdown 工具栏功能

在 Markdown 编辑模式下，工具栏提供以下快捷操作：

- **标题 (H1-H6)**: 点击标题下拉菜单选择标题级别
- **粗体**: 包裹选中文本为粗体 `**文本**`
- **斜体**: 包裹选中文本为斜体 `*文本*`
- **删除线**: 包裹选中文本为删除线 `~~文本~~`
- **无序列表**: 插入或切换无序列表 `- 项目`
- **有序列表**: 插入或切换有序列表 `1. 项目`
- **表格**: 插入 3x3 表格模板
- **链接**: 插入链接 `[文本](URL)`
- **图片**: 插入图片 `![描述](图片路径)`
- **代码块**: 插入代码块 ` ```语言 `
- **引用**: 插入引用块 `> 引用文本`

### 高级功能

- **Mermaid 图表**：在 Markdown 中使用 ` ```mermaid ` 代码块创建流程图
- **语法检查**：Markdown 编辑器会自动检查语法问题并提供修复建议
- **多标签页**：同时打开多个文件，右键标签页可关闭其他或全部标签
- **主题切换**：点击工具栏主题按钮或设置中切换深色/浅色主题
- **代码高亮**：TypeScript/JavaScript 文件自动语法高亮

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
- **版本**: 查看状态栏右侧版本号
- **应用标识**: com.smz.bun-codeview
- **前端构建**: 使用 Vite 构建前端资源到 `dist` 目录
- **打包目标**: 支持 Windows、macOS、Linux

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

## 🔧 版本管理

项目内置版本管理系统，版本号格式：`Ver:1.0.yyyymmdd.###`

### 升级版本

```bash
bun run upgrade "版本变更内容"
```

示例：
```bash
bun run upgrade "添加新功能"
bun run upgrade "修复bug"
```

版本号会自动显示在状态栏右侧，点击可查看完整更新日志。

## 🤖 智能 Git 提交工具 (MyGit)

项目内置 AI 驱动的 Git 提交工具，可自动生成简洁的中文提交信息。

### 快速使用

```bash
# AI 自动生成提交信息（推荐）
bun run mygit

# 手动指定提交信息
bun run mygit "feat: 添加新功能"
```

### 配置 AI 功能

1. 复制环境变量模板：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入你的 DashScope API Key：
   ```bash
   DASHSCOPE_API_KEY=sk-your-api-key-here
   DASHSCOPE_MODEL=deepseek-v3
   ```

3. 获取 API Key：访问 [DashScope 控制台](https://dashscope.console.aliyun.com/)

### 功能特性

- ✅ **AI 智能生成**：根据文件变更自动生成简洁的中文提交信息
- ✅ **一键提交**：自动执行 `git add`、`git commit`、`git push`
- ✅ **自动设置上游**：首次推送分支时自动设置上游分支
- ✅ **兜底机制**：AI 失败时自动使用文件名生成提交信息
- ✅ **灵活使用**：支持手动指定提交信息

详细使用说明请查看 [MyGit 使用文档](docs/MYGIT_USAGE.md)。

## 📄 版权信息

**著作权人：笨笨熊 (BenBenXiong)**

本软件受著作权法保护。版权所有 © 2026 笨笨熊。

**联系方式**：shlwsh@126.com

## 📜 开源协议

本项目采用 **MIT License with Attribution Requirement**（MIT 许可协议 + 出处标注要求）。

### 核心要点

✅ **允许的行为**：
- 免费使用、复制、修改、合并、发布、分发本软件
- 用于个人、学习、研究或商业目的
- 创建衍生作品

⚠️ **必须遵守的要求**：
- **必须标注出处**：在源代码、应用程序或文档中明确注明原始作者和项目来源
- **保留版权声明**：在所有副本中包含原始版权声明和许可声明
- **承担使用风险**：软件按"原样"提供，作者不承担任何担保责任

### 出处标注格式

如果您使用或修改了本软件，请在显著位置标注：

```
基于 MD Notebook 开发
原作者：笨笨熊 (BenBenXiong)
原始项目：[项目地址]
```

### 免责声明

本软件按"原样"提供，不提供任何形式的明示或暗示担保。作者不对因使用本软件而产生的任何直接、间接、特殊或后果性损害承担责任。使用者应自行承担使用风险。

详细的许可条款和免责声明请查看 [LICENSE](LICENSE) 文件。

如有任何疑问或需要特殊授权，请联系：shlwsh@126.com
