# CodeView Tauri 桌面应用实施方案

**版本**: 1.0  
**日期**: 2026-01-11  
**状态**: 已批准

---

## 目录

1. [项目概述](#项目概述)
2. [技术架构](#技术架构)
3. [项目结构](#项目结构)
4. [核心模块设计](#核心模块设计)
5. [前端集成](#前端集成)
6. [IPC 通信设计](#ipc-通信设计)
7. [构建与分发](#构建与分发)
8. [实施计划](#实施计划)
9. [开发环境配置](#开发环境配置)

---

## 项目概述

### 目标

将 CodeView 源码分析系统重构为跨平台桌面应用，实现：

- ✅ 完整的 tree-sitter 代码解析功能
- ✅ 真正的单文件可执行程序 (< 15MB)
- ✅ 跨平台支持 (Windows/macOS/Linux)
- ✅ 原生性能，无 WASM 限制
- ✅ 双击运行，无需安装运行时

### 技术选型

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Tauri 2.0 | 跨平台桌面应用框架 |
| 后端 | Rust | 系统编程语言 |
| 前端 | React + TypeScript | 复用现有前端 |
| 解析 | tree-sitter | 原生 Rust 绑定 |
| Git | git2 | libgit2 的 Rust 绑定 |
| 构建 | Cargo + Vite | 前后端独立构建 |

---

## 技术架构

### 整体架构图

```
┌──────────────────────────────────────────────────────────────────┐
│                    CodeView Desktop Application                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     前端层 (WebView)                         │ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │                 React Application                       ││ │
│  │  │  ┌───────────┐ ┌───────────┐ ┌─────────────────────────┐││ │
│  │  │  │ Dashboard │ │  Graph    │ │     File Explorer       │││ │
│  │  │  │   View    │ │  Canvas   │ │        View             │││ │
│  │  │  └───────────┘ └───────────┘ └─────────────────────────┘││ │
│  │  │  ┌─────────────────────────────────────────────────────┐││ │
│  │  │  │              Tauri API Client                       │││ │
│  │  │  │         @tauri-apps/api (invoke/event)              │││ │
│  │  │  └─────────────────────────────────────────────────────┘││ │
│  │  └─────────────────────────────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                        IPC Bridge                                 │
│                      (JSON-RPC over IPC)                         │
│                              │                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     后端层 (Rust Core)                       │ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │                   Command Handlers                      ││ │
│  │  │     analyze_project | parse_file | get_git_history     ││ │
│  │  └─────────────────────────────────────────────────────────┘│ │
│  │                              │                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │                    Service Layer                        ││ │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌──────────────────┐  ││ │
│  │  │  │ ParserServ  │ │AnalysisSrv │ │    GitService    │  ││ │
│  │  │  │             │ │            │ │                  │  ││ │
│  │  │  │ tree-sitter │ │ 依赖分析   │ │     git2         │  ││ │
│  │  │  │ 原生解析    │ │ 文件遍历   │ │   提交历史       │  ││ │
│  │  │  └─────────────┘ └─────────────┘ └──────────────────┘  ││ │
│  │  └─────────────────────────────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 数据流

```
用户操作 → React UI → Tauri invoke() → Rust Command → Service → 结果
    ↑                                                              │
    └─────────────────── JSON Response ←───────────────────────────┘
```

---

## 项目结构

### 目录布局

```
codeview-desktop/
├── src-tauri/                    # Rust 后端
│   ├── Cargo.toml
│   ├── tauri.conf.json           # Tauri 配置
│   ├── capabilities/             # 权限配置
│   ├── icons/                    # 应用图标
│   └── src/
│       ├── main.rs               # 入口点
│       ├── lib.rs                # 库导出
│       ├── commands/             # Tauri 命令
│       │   ├── mod.rs
│       │   ├── analyze.rs        # 分析命令
│       │   ├── parse.rs          # 解析命令
│       │   └── git.rs            # Git 命令
│       ├── services/             # 业务服务
│       │   ├── mod.rs
│       │   ├── parser.rs         # 解析服务
│       │   ├── analysis.rs       # 分析服务
│       │   └── git.rs            # Git 服务
│       └── models/               # 数据模型
│           ├── mod.rs
│           ├── node.rs           # 代码节点
│           └── project.rs        # 项目信息
│
├── src/                          # React 前端 (复用现有)
│   ├── App.tsx
│   ├── components/
│   │   ├── GraphCanvas.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── useTauri.ts           # Tauri API 封装
│   └── services/
│       └── api.ts                # API 调用 (改为 invoke)
│
├── package.json
├── vite.config.ts
├── index.html
└── README.md
```

---

## 核心模块设计

### 1. Rust 依赖配置

```toml
# src-tauri/Cargo.toml
[package]
name = "codeview-desktop"
version = "1.0.0"
edition = "2021"

[dependencies]
# Tauri 核心
tauri = { version = "2", features = ["devtools"] }
tauri-plugin-shell = "2"
tauri-plugin-dialog = "2"
tauri-plugin-fs = "2"

# 序列化
serde = { version = "1", features = ["derive"] }
serde_json = "1"

# 代码解析
tree-sitter = "0.24"
tree-sitter-typescript = "0.23"
tree-sitter-java = "0.23"
tree-sitter-javascript = "0.23"

# Git 集成
git2 = "0.19"

# 异步运行时
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }

# 错误处理
anyhow = "1"
thiserror = "2"

# 文件遍历
walkdir = "2"
ignore = "0.4"           # 支持 .gitignore

# 图数据结构
petgraph = "0.6"

[build-dependencies]
tauri-build = { version = "2", features = [] }

[profile.release]
opt-level = "z"
lto = true
strip = true
codegen-units = 1
```

### 2. 解析服务 (ParserService)

```rust
// src-tauri/src/services/parser.rs
use tree_sitter::{Parser, Language, Tree};
use std::collections::HashMap;
use anyhow::Result;

pub struct ParserService {
    parsers: HashMap<String, Parser>,
}

impl ParserService {
    pub fn new() -> Result<Self> {
        let mut parsers = HashMap::new();
        
        // 初始化 TypeScript 解析器
        let mut ts_parser = Parser::new();
        ts_parser.set_language(&tree_sitter_typescript::LANGUAGE_TYPESCRIPT.into())?;
        parsers.insert("typescript".to_string(), ts_parser);
        
        // 初始化 Java 解析器
        let mut java_parser = Parser::new();
        java_parser.set_language(&tree_sitter_java::LANGUAGE_JAVA.into())?;
        parsers.insert("java".to_string(), java_parser);
        
        // 初始化 JavaScript 解析器
        let mut js_parser = Parser::new();
        js_parser.set_language(&tree_sitter_javascript::LANGUAGE_JAVASCRIPT.into())?;
        parsers.insert("javascript".to_string(), js_parser);
        
        Ok(Self { parsers })
    }
    
    pub fn parse(&mut self, code: &str, language: &str) -> Result<Option<Tree>> {
        let parser = self.parsers.get_mut(language)
            .ok_or_else(|| anyhow::anyhow!("Unsupported language: {}", language))?;
        
        Ok(parser.parse(code, None))
    }
    
    pub fn supported_languages(&self) -> Vec<String> {
        self.parsers.keys().cloned().collect()
    }
}
```

### 3. 符号提取器

```rust
// src-tauri/src/services/symbol_extractor.rs
use tree_sitter::{Node, Tree};
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Symbol {
    pub id: String,
    pub name: String,
    pub kind: SymbolKind,
    pub start_line: usize,
    pub end_line: usize,
    pub file_path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SymbolKind {
    Class,
    Interface,
    Function,
    Method,
    Variable,
    Import,
}

pub fn extract_symbols(tree: &Tree, file_path: &str, language: &str) -> Vec<Symbol> {
    let mut symbols = Vec::new();
    let root = tree.root_node();
    
    match language {
        "typescript" | "javascript" => extract_ts_symbols(root, file_path, &mut symbols),
        "java" => extract_java_symbols(root, file_path, &mut symbols),
        _ => {}
    }
    
    symbols
}

fn extract_ts_symbols(node: Node, file_path: &str, symbols: &mut Vec<Symbol>) {
    match node.kind() {
        "class_declaration" => {
            if let Some(name) = get_child_by_field(&node, "name") {
                symbols.push(Symbol {
                    id: format!("{}:{}", file_path, name),
                    name: name.to_string(),
                    kind: SymbolKind::Class,
                    start_line: node.start_position().row + 1,
                    end_line: node.end_position().row + 1,
                    file_path: file_path.to_string(),
                });
            }
        }
        "function_declaration" | "method_definition" => {
            if let Some(name) = get_child_by_field(&node, "name") {
                symbols.push(Symbol {
                    id: format!("{}:{}", file_path, name),
                    name: name.to_string(),
                    kind: if node.kind() == "method_definition" { 
                        SymbolKind::Method 
                    } else { 
                        SymbolKind::Function 
                    },
                    start_line: node.start_position().row + 1,
                    end_line: node.end_position().row + 1,
                    file_path: file_path.to_string(),
                });
            }
        }
        _ => {}
    }
    
    // 递归遍历子节点
    for i in 0..node.child_count() {
        if let Some(child) = node.child(i) {
            extract_ts_symbols(child, file_path, symbols);
        }
    }
}
```

### 4. Tauri 命令处理

```rust
// src-tauri/src/commands/analyze.rs
use tauri::State;
use std::sync::Mutex;
use crate::services::{ParserService, AnalysisService};
use crate::models::{AnalysisResult, ProjectInfo};

#[tauri::command]
pub async fn analyze_project(
    path: String,
    parser: State<'_, Mutex<ParserService>>,
) -> Result<AnalysisResult, String> {
    let mut parser = parser.lock().map_err(|e| e.to_string())?;
    
    let analysis_service = AnalysisService::new();
    analysis_service.analyze(&path, &mut parser)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn parse_file(
    path: String,
    language: String,
    parser: State<'_, Mutex<ParserService>>,
) -> Result<Vec<Symbol>, String> {
    let content = std::fs::read_to_string(&path)
        .map_err(|e| e.to_string())?;
    
    let mut parser = parser.lock().map_err(|e| e.to_string())?;
    let tree = parser.parse(&content, &language)
        .map_err(|e| e.to_string())?
        .ok_or("Failed to parse file")?;
    
    Ok(extract_symbols(&tree, &path, &language))
}

#[tauri::command]
pub fn get_supported_languages(
    parser: State<'_, Mutex<ParserService>>,
) -> Result<Vec<String>, String> {
    let parser = parser.lock().map_err(|e| e.to_string())?;
    Ok(parser.supported_languages())
}
```

### 5. 应用入口

```rust
// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod services;
mod models;

use std::sync::Mutex;
use services::ParserService;

fn main() {
    let parser = ParserService::new()
        .expect("Failed to initialize parser");
    
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .manage(Mutex::new(parser))
        .invoke_handler(tauri::generate_handler![
            commands::analyze::analyze_project,
            commands::analyze::parse_file,
            commands::analyze::get_supported_languages,
            commands::git::get_git_history,
            commands::git::get_diff_files,
        ])
        .run(tauri::generate_context!())
        .expect("Error running Tauri application");
}
```

---

## 前端集成

### 1. Tauri API 封装

```typescript
// src/hooks/useTauri.ts
import { invoke } from '@tauri-apps/api/core';

export interface Symbol {
    id: string;
    name: string;
    kind: string;
    startLine: number;
    endLine: number;
    filePath: string;
}

export interface AnalysisResult {
    nodes: CodeNode[];
    edges: Edge[];
    stats: ProjectStats;
}

export const useApi = () => {
    const analyzeProject = async (path: string): Promise<AnalysisResult> => {
        return await invoke('analyze_project', { path });
    };
    
    const parseFile = async (path: string, language: string): Promise<Symbol[]> => {
        return await invoke('parse_file', { path, language });
    };
    
    const getGitHistory = async (path: string): Promise<Commit[]> => {
        return await invoke('get_git_history', { path });
    };
    
    const getSupportedLanguages = async (): Promise<string[]> => {
        return await invoke('get_supported_languages');
    };
    
    return {
        analyzeProject,
        parseFile,
        getGitHistory,
        getSupportedLanguages,
    };
};
```

### 2. 修改现有 API 调用

```typescript
// src/services/api.ts
// 原来使用 fetch，改为使用 Tauri invoke

// ❌ 原来
// const response = await fetch('/api/analyze', { ... });

// ✅ 现在
import { invoke } from '@tauri-apps/api/core';

export const analyzeProject = async (path: string) => {
    return await invoke('analyze_project', { path });
};
```

### 3. 文件选择对话框

```typescript
// src/components/ProjectSelector.tsx
import { open } from '@tauri-apps/plugin-dialog';

export const ProjectSelector = () => {
    const handleSelectFolder = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            title: '选择项目目录',
        });
        
        if (selected) {
            // 触发分析
            await analyzeProject(selected as string);
        }
    };
    
    return (
        <button onClick={handleSelectFolder}>
            选择项目目录
        </button>
    );
};
```

---

## IPC 通信设计

### 命令列表

| 命令 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `analyze_project` | `{ path: string }` | `AnalysisResult` | 分析项目 |
| `parse_file` | `{ path, language }` | `Symbol[]` | 解析文件 |
| `get_git_history` | `{ path }` | `Commit[]` | Git 历史 |
| `get_diff_files` | `{ from, to }` | `string[]` | 变更文件 |
| `get_supported_languages` | - | `string[]` | 支持的语言 |

### 错误处理

```rust
// Rust 端统一错误类型
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Parse error: {0}")]
    Parse(String),
    
    #[error("Git error: {0}")]
    Git(#[from] git2::Error),
}

// 转换为 Tauri 可序列化错误
impl From<AppError> for String {
    fn from(err: AppError) -> String {
        err.to_string()
    }
}
```

---

## 构建与分发

### Tauri 配置

```json
// src-tauri/tauri.conf.json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "CodeView",
  "version": "1.0.0",
  "identifier": "com.codeview.app",
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "frontendDist": "../dist",
    "devUrl": "http://localhost:5173"
  },
  "app": {
    "windows": [
      {
        "title": "CodeView - 源码分析工具",
        "width": 1280,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "macOS": {
      "minimumSystemVersion": "10.13"
    }
  }
}
```

### 构建命令

```bash
# 开发模式
npm run tauri dev

# 生产构建
npm run tauri build

# 跨平台构建 (需要 CI/CD)
npm run tauri build -- --target x86_64-pc-windows-msvc
npm run tauri build -- --target x86_64-apple-darwin
npm run tauri build -- --target x86_64-unknown-linux-gnu
```

### 产物大小预估

| 平台 | 格式 | 大小 |
|------|------|------|
| macOS | `.app` | ~12MB |
| Windows | `.exe` | ~10MB |
| Linux | `.AppImage` | ~15MB |

---

## 实施计划

### 时间线

```
Week 1: 基础设施
├── Day 1-2: Tauri 项目初始化，前端迁移
├── Day 3-4: tree-sitter 集成，ParserService
└── Day 5: 符号提取器，基础 API

Week 2: 功能实现  
├── Day 1-2: AnalysisService 完整迁移
├── Day 3: GitService 迁移
└── Day 4-5: 前端调整，IPC 通信

Week 3: 完善与测试
├── Day 1-2: 错误处理，边界情况
├── Day 3: 跨平台测试
├── Day 4: 性能优化
└── Day 5: 文档与发布

Week 4: 收尾 (缓冲)
├── Day 1-2: Bug 修复
└── Day 3-5: 最终测试，发布准备
```

### 里程碑

| 日期 | 里程碑 | 交付物 |
|------|--------|--------|
| Week 1 末 | M1: 解析可用 | tree-sitter 集成完成 |
| Week 2 末 | M2: 功能完整 | 所有服务迁移完成 |
| Week 3 末 | M3: 发布就绪 | 跨平台可执行文件 |

---

## 开发环境配置

### 前置要求

```bash
# 1. 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 2. 安装 Tauri CLI
cargo install tauri-cli

# 3. 验证安装
cargo tauri info
```

### 项目初始化命令

```bash
# 在现有项目中添加 Tauri
cd bun-codeview
npm install @tauri-apps/cli@latest @tauri-apps/api@latest
npm run tauri init

# 或创建新项目
npm create tauri-app@latest codeview-desktop
```

### 开发工作流

```bash
# 启动开发服务器
npm run tauri dev

# 监视 Rust 代码变化自动重载
# (Tauri 已内置)

# 运行 Rust 测试
cd src-tauri && cargo test

# 检查代码
cd src-tauri && cargo clippy
```

---

## 附录

### A. 语言支持扩展

添加新语言只需：

```rust
// 1. 添加依赖
// Cargo.toml
[dependencies]
tree-sitter-python = "0.23"

// 2. 初始化解析器
let mut py_parser = Parser::new();
py_parser.set_language(&tree_sitter_python::LANGUAGE_PYTHON.into())?;
parsers.insert("python".to_string(), py_parser);

// 3. 添加符号提取规则
fn extract_python_symbols(node: Node, ...) { ... }
```

### B. 可扩展功能

| 功能 | 难度 | 说明 |
|------|------|------|
| 代码搜索 | 中 | 使用 ripgrep |
| LSP 集成 | 高 | 代码补全、跳转 |
| 主题切换 | 低 | 前端 CSS 变量 |
| 多窗口 | 中 | Tauri 多窗口 API |
| 自动更新 | 低 | tauri-plugin-updater |

### C. 参考资源

- [Tauri 2.0 官方文档](https://v2.tauri.app/)
- [tree-sitter Rust 文档](https://docs.rs/tree-sitter/)
- [git2 文档](https://docs.rs/git2/)
