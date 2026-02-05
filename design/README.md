# CodeView 架构演进方案对比

**日期**: 2026-01-11  
**更新**: 已确认采用 Tauri 方案

---

## 方案概览

本文档对比解决 tree-sitter 编译环境问题的架构方案。

| 方案 | 描述 | 工作量 | 推荐场景 |
|------|------|--------|----------|
| ⭐ [Tauri 桌面应用](tauri-desktop-implementation.md) | **推荐方案** - 跨平台桌面应用 | 3-4 周 | 个人开发工具 |
| [Rust Web Server](rust-rewrite-proposal.md) | Axum 重写后端 | 2-3 周 | 多用户 Web 服务 |
| [混合架构](hybrid-architecture-design.md) | Rust CLI + Bun Server | 1 周 | 快速验证 |

---

## ⭐ 推荐方案：Tauri 桌面应用

已确认采用 **Tauri** 方案，原因：111

- ✅ 跨平台桌面应用 (Windows/macOS/Linux)
- ✅ 方便个人开发工作
- ✅ 双击运行，无需浏览器
- ✅ 原生 tree-sitter 性能
- ✅ 单文件分发 (~12MB)

---

## 详细方案文档

### 1. [Rust 完全重写方案](rust-rewrite-proposal.md)

使用 Axum 框架完全重写后端，实现真正的高性能单文件可执行程序。

**核心内容**:
- 三种子方案对比 (Tauri/Axum/混合)
- 详细技术栈选型
- 三阶段迁移策略
- 里程碑规划

### 2. [混合架构方案](hybrid-architecture-design.md)

保留现有 Bun 后端，仅将解析功能抽取为 Rust CLI 工具。

**核心内容**:
- 系统架构设计
- Rust CLI 接口规范
- TypeScript 代理服务
- 通信协议设计

---

## 决策建议

### 如果追求快速解决

选择 **混合架构**：
- 1 周完成
- 风险低
- 保留现有代码

### 如果追求长期产品化

选择 **Rust 重写 (Axum)**：
- 最佳性能
- 最小体积
- 易于维护

### 如果仅用于演示/MVP

选择 **保持现状**：
- 零成本123
- 足够满足非解析功能
- 开发模式获得完整功能

---

## 相关文件

- [Rust 重写方案](rust-rewrite-proposal.md)
- [混合架构设计](hybrid-architecture-design.md)
- [问题分析会话](../sessions/2026-01-11-treesitter-analysis-session.md)
