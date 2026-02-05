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