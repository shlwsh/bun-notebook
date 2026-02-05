---
name: project-development-standards
description: 本项目核心开发规范，涵盖交互语言、代码质量、模块化及测试要求。
---

# Project Development Standards (项目开发规范)

本 Skill 定义了 `bun-codeview` 项目的所有开发活动必须遵循的严格规范。在执行任何编码任务前，请务必参考此规范。

## 1. 交互与文档规范 (Interaction Language)
*   **强制中文**: 所有的对话交互、思考过程（Translation）、以及生成的文档（Artifacts, Comments）必须使用**简体中文**。
*   **Artifacts**: `task.md`, `implementation_plan.md`, `walkthrough.md` 等文档内容须用中文撰写。

## 2. 代码质量与模块化 (Code Quality & Modularity)
*   **行数限制**: 单个代码文件（`.vue`, `.ts`, `.rs`）严禁超过 **300行**。
*   **模块化策略**:
    *   **Frontend (Vue)**:
        *   将逻辑提取为 Composables (`src/composables/`).
        *   将 UI 拆分为纯展示组件 (`src/components/ui/`).
        *   复杂组件应拆分为父子组件结构。
    *   **Backend (Rust)**:
        *   利用 Rust 的 `mod` 系统拆分功能。
        *   避免巨型 `lib.rs` 或 `main.rs`。
*   **Refactoring**: 如果修改现有文件时发现其超过 300 行，必须优先进行拆分重构。

## 3. 测试驱动 (Testing Requirements)
*   **强制单元测试**: 任何新功能或重要逻辑修改，必须包含相应的单元测试。
    *   **Frontend**: 使用 `Vitest` + `Vue Test Utils` / `Testing Library`。
        *   测试文件置于 `src/tests/`。
    *   **Backend**: 使用 Rust 内置 `#[test]` 模块。
*   **验证**: 提交代码前必须运行并通过所有相关测试。

## 4. 架构一致性 (Architecture Consistency)
*   **Tauri + Vue 3 + Rust**: 严格遵循由 Tauri 驱动的前后端分离架构。
*   **State Management**: 前端状态优先使用 `Pinia`。
*   **UI Framework**: 使用 TailwindCSS 进行样式开发，避免手写大量 CSS。

## 5. 安全与权限 (Security & Permissions)
*   **Tauri Capabilities**: 凡涉及本地系统级操作（文件读写、目录访问、网络请求、Shell 命令等），**必须**同步更新后端 Rust 项目的白名单配置（如 `src-tauri/capabilities/default.json`）。
*   **Whitelist Rule**: 任何未添加到 Capabilities 白名单的系统命令调用均会被 Tauri 拦截，导致执行失败。开发新功能时务必检查此项配置。

## 6. 工作流建议 (Recommended Workflow)
1.  **任务拆解**: 接到需求后，在 `task.md` 中拆解为原子任务。
2.  **规划**: 编写 `implementation_plan.md`，明确涉及的文件和模块拆分计划。
3.  **开发**: 编码时实时监控文件长度，适时拆分。
4.  **测试**: 同步编写测试用例并验证。
5.  **交付**: 更新 `walkthrough.md` 进行中文总结。
