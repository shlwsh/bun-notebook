# Tree-sitter 编译环境问题分析会话

**日期**: 2026-01-11  
**时间**: 15:44 - 15:54  
**目标**: 解决 tree-sitter 在 Bun 编译环境下不可用的问题

---

## 问题背景

在 Phase 5 独立二进制构建中，`web-tree-sitter` 模块无法在编译后正常工作，代码解析功能被迫降级。用户希望找到解决方案。

## 分析过程

### 1. 问题根因分析

- `web-tree-sitter` 需要加载 `.wasm` 文件
- Bun 编译时将代码打包到虚拟文件系统 `/$bunfs/root/`
- WASM 文件的加载路径被错误地指向虚拟路径

### 2. 方案评估

提出了 4 种解决方案：

| 方案 | 可行性 | 工作量 | 说明 |
|------|--------|--------|------|
| Bun 嵌入机制 | ❓ 需验证 | 低 | 使用 `import with { type: "file" }` |
| Lezer 解析器 | ⚠️ 部分可行 | 中 | 不支持 Java |
| Rust 重写 | ✅ 可行 | 大 | 最佳长期方案 |
| 混合架构 | ✅ 可行 | 中 | Rust CLI + Bun Server |

### 3. 方案一实施：Bun 嵌入机制

修改了 `ParserService.ts` 使用 Bun 的嵌入式文件导入：

```typescript
import treeSitterWasm from "../node_modules/web-tree-sitter/web-tree-sitter.wasm" with { type: "file" };
import tsLangWasm from "../../languages/tree-sitter-typescript.wasm" with { type: "file" };
```

**构建结果**: ✅ 成功 - WASM 文件成功嵌入到 66MB 可执行文件

**运行时结果**: ❌ 失败

```
Error: 
  at failIf (/$bunfs/root/codeview-app:9:13156)
  at getDylinkMetadata (/$bunfs/root/codeview-app:9:13557)
  at loadWebAssemblyModule (/$bunfs/root/codeview-app:9:18525)
```

### 4. 失败原因深入分析

`web-tree-sitter` 内部使用 **Emscripten** 编译的 WASM 加载器，该加载器的 `dylink` 元数据解析器需要真实文件系统访问，与 Bun 的虚拟文件系统 (`$bunfs`) 架构不兼容。

**这是底层技术栈的设计差异，不是 bug。**

---

## 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `backend/src/parser/ParserService.ts` | 添加编译环境检测，优化降级逻辑 |
| `scripts/build-standalone.ts` | 简化构建流程（移除手动 WASM 拷贝） |
| `frontend/tsconfig.app.json` | 添加 shared 目录到 include |

---

## 最终结论

### Bun + web-tree-sitter 存在根本性不兼容

两者底层技术栈的架构差异导致无法在编译环境中正常工作：
- **Bun**: 使用虚拟文件系统 `$bunfs` 嵌入资源
- **web-tree-sitter**: Emscripten 编译的 WASM 加载器需要真实文件系统

### 推荐方案

1. **短期**: 保持当前降级模式，开发模式获得完整功能
2. **长期**: 使用 Rust 重写后端，使用原生 tree-sitter 绑定

---

## 当前功能状态

| 功能 | 开发模式 | 编译模式 |
|------|----------|----------|
| 前端界面 | ✅ | ✅ |
| API 服务 | ✅ | ✅ |
| 项目分析 | ✅ | ✅ |
| Git 历史 | ✅ | ✅ |
| 代码解析 | ✅ | ⚠️ 降级 |

---

## 相关文件

- 解析服务: `backend/src/parser/ParserService.ts`
- 构建脚本: `scripts/build-standalone.ts`
- 分析报告: `.gemini/antigravity/brain/8a937d04-482d-4e5f-9fbd-b000fced01dc/walkthrough.md`

---

**会话结束时间**: 2026-01-11 15:54  
**状态**: 分析完成 - 方案一验证失败，保持降级模式
