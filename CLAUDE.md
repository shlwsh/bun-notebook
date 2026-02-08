# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 语言规则 / Language Rules

**重要：在此项目中工作时，必须遵循以下语言规则：**

- **所有对话和回复必须使用中文**
- **所有文档输出必须使用中文**
- **代码注释应使用中文**
- **提交信息（commit messages）应使用中文**
- **错误信息和日志输出应使用中文**

唯一例外：代码本身（变量名、函数名、类名等）可以使用英文，以保持代码的可读性和国际化兼容性。

## Project Overview

MD Notebook is a high-performance Markdown editor built with **Tauri 2.0** (Rust backend) and **Vue 3** (frontend). It's designed for fast browsing and editing of local project documentation with support for multiple file types (Markdown, TypeScript, JavaScript, text files, images).

**Key Architecture:**
- **Backend**: Rust-based Tauri application providing file system operations, knowledge base management, and project history
- **Frontend**: Vue 3 SPA with Pinia state management, CodeMirror 6 for editing, and Tailwind CSS for styling
- **Build System**: Vite + Bun for fast development and builds

## Development Commands

### Setup and Development
```bash
# Install dependencies
bun install

# Development mode (starts Tauri with hot reload)
bun tauri:dev
# or
bun run dev

# Run tests
bun test

# Lint code
bun lint
```

### Building and Deployment
```bash
# Build production application
bun tauri build

# Full deployment (runs complete build pipeline)
bun deploy

# Windows-specific deployment scripts
scripts/deploy.bat
powershell -ExecutionPolicy Bypass -File ./scripts/deploy.ps1
```

### Version Management
```bash
# Upgrade version with changelog entry
bun run upgrade "版本变更内容"

# Create and push Git tag (triggers GitHub Actions release)
bun run mytag
```

**Version Format**: `Ver:1.0.yyyymmdd.###` (e.g., `Ver:1.0.20260206.007`)
- Version info stored in `version.json`
- Displayed in status bar
- Auto-increments build number for same-day releases

### Git Workflow (AI-Powered)
```bash
# AI-generated commit message (requires DashScope API key)
bun run mygit

# Manual commit message
bun run mygit "feat: 添加新功能"
```

**Configuration**: Copy `.env.example` to `.env` and set:
- `DASHSCOPE_API_KEY`: Your DashScope API key
- `DASHSCOPE_MODEL`: Model to use (default: `deepseek-v3`)

## Architecture

### Frontend Structure

**State Management (Pinia stores in `src/store/`):**
- `app.ts`: Global app state (theme, locale, project path, recent projects)
- `navigation.ts`: Tab management and active view state
- `layout.ts`: Sidebar visibility and dimensions
- `knowledgeBase.ts`: Knowledge base and document management

**Component Organization (`src/components/`):**
- `layout/`: Main application layout components
  - `AppLayout.vue`: Root layout with resizable sidebar
  - `IconToolbar.vue`: Top toolbar with file operations
  - `ActivityBar.vue`: Left activity bar for view switching
  - `PrimarySidebar.vue`: File tree and search views
  - `EditorGroup.vue`: Tab-based editor container
  - `StatusBar.vue`: Bottom status bar with version info
- `editor/`: Editor-specific components
  - `MarkdownToolbar.vue`: Rich text editing toolbar for Markdown
- `kb/`: Knowledge base management components

**Key Utilities (`src/utils/`):**
- `fileTypeDetector.ts`: File type detection and icon mapping
- `fileIcons.ts`: File icon utilities
- `markdownOperations.ts`: Markdown editing helpers

### Backend Structure (Rust)

**Entry Point**: `src-tauri/src/lib.rs` - Registers all Tauri commands and plugins

**Commands (`src-tauri/src/commands/`):**
- `fs.rs`: File system operations (read/write files, directory tree, search, export)
- `knowledge_base.rs`: Knowledge base CRUD operations

**Services (`src-tauri/src/services/`):**
- `history_service.rs`: Project history management (stored in `~/.codeview/recent_projects.json`)
- `knowledge_base_service.rs`: Knowledge base storage (stored in `%APPDATA%/bun-codeview/knowledge_bases/kb_data.json`)

**Models (`src-tauri/src/models/`):**
- `knowledge_base.rs`: Data structures for knowledge bases and documents

**Key Tauri Commands:**
- File operations: `read_directory_tree`, `read_file_content`, `write_file_content`, `create_dir`, `save_binary_file`, `search_content`, `export_markdown`, `create_new_file`, `copy_file`, `rename_file`, `delete_file`
- History: `get_project_history`, `add_project_to_history`, `clear_project_history`
- Knowledge base: `create_knowledge_base`, `list_knowledge_bases`, `get_knowledge_base`, `delete_knowledge_base`, `import_documents`, `get_documents`, `delete_document`

### Communication Pattern

Frontend invokes Rust commands via Tauri's `invoke()` API:
```typescript
import { invoke } from '@tauri-apps/api/core';
const result = await invoke<ReturnType>('command_name', { param: value });
```

## Important Implementation Details

### File Tree Filtering
The file tree automatically excludes:
- Hidden files (starting with `.`)
- `node_modules`, `target`, `dist`, `build` directories
- Maximum recursion depth: 10 levels

### Markdown Features
- **Editor**: CodeMirror 6 with markdown language support
- **Preview**: Marked.js for rendering, Mermaid for diagrams, Highlight.js for code blocks
- **Toolbar**: Visual editing tools for headings, bold, italic, lists, tables, links, images, code blocks
- **Image handling**: Drag-and-drop or paste images, auto-saved to `attachments/` directory
- **Export**: HTML, PDF (via html2pdf.js), DOCX formats

### Theme System
- Supports dark/light themes
- Theme state managed in `app.ts` store
- Applied via Tailwind CSS classes throughout components

### Internationalization
- Vue I18n integration (`src/i18n/`)
- Supported locales: en, zh, ru, ja, fr, de
- Locale stored in app store

## Testing

- **Framework**: Vitest with happy-dom environment
- **Test files**: `*.test.ts` files alongside source code
- **Configuration**: `vite.config.ts` (test section)

## Build Output

After `bun tauri build`, artifacts are in `src-tauri/target/release/`:
- **Executable**: `bun-codeview.exe` (Windows) - standalone, no dependencies needed
- **Installer**: `bundle/msi/*.msi` (Windows)
- **macOS**: `.app` bundle and `.dmg` installer
- **Linux**: `.deb`, `.AppImage`

## GitHub Actions

Workflows in `.github/workflows/`:
- **Build test**: Runs on push/PR to main/develop branches
- **Release**: Triggered by version tags (e.g., `v1.0.20260206.007`)
- Builds for: macOS (Intel + Apple Silicon), Windows x64, Linux x64

## Custom Scripts

**Location**: `scripts/` directory

- `mygit.ts`: AI-powered Git commit tool using DashScope API
- `upgrade-version.ts`: Version bumping with changelog management
- `mytag.ts`: Automated Git tag creation and push
- `dev.ps1`: Development server startup with port management
- `deploy.ps1`: Production build pipeline
- `ensure-port.ps1`: Port availability checker

## Configuration Files

- `tauri.conf.json`: Tauri app configuration (window size, bundle settings, identifier)
- `vite.config.ts`: Vite build configuration with Vitest setup
- `tsconfig.json`: TypeScript project references
- `package.json`: Frontend dependencies and scripts
- `src-tauri/Cargo.toml`: Rust dependencies and package info
- `version.json`: Version tracking and changelog

## Development Notes

- **Port**: Development server runs on port 1420 (configurable via `VITE_PORT` env var)
- **Hot Reload**: Frontend changes hot-reload; Rust changes require restart
- **Rust Toolchain**: Minimum version 1.77.2
- **Bun**: Required for package management and script execution
- **Data Storage**:
  - Knowledge bases: `%APPDATA%/bun-codeview/knowledge_bases/` (Windows) or `~/Library/Application Support/bun-codeview/knowledge_bases/` (macOS)
  - Project history: `~/.codeview/recent_projects.json`
