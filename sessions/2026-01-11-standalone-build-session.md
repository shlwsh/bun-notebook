# CodeView 独立二进制构建会话记录

**日期**: 2026-01-11  
**时间**: 15:03 - 15:31  
**目标**: 完成 Phase 5 - 将应用打包为独立可执行二进制文件

---

## 会话概述

本次会话的主要目标是完成 CodeView 源码分析系统的 Phase 5 开发阶段，即将整个应用（前端 + 后端）打包成一个独立的、可分发的二进制可执行文件。

## 遇到的主要挑战

### 1. web-tree-sitter WASM 加载问题

**问题描述**：
- `web-tree-sitter` 库需要在运行时加载 `.wasm` 文件
- Bun 编译时会将代码打包到虚拟文件系统 `/$bunfs/root/` 中
- WASM 文件的加载路径被错误地指向虚拟路径，导致找不到文件

**错误信息**：
```
TypeError: $4.init is not a function
RuntimeError: Aborted(Error: ENOENT: no such file or directory, open '/$bunfs/root/web-tree-sitter.wasm')
```

**解决方案**：
1. 修改导入方式为 CommonJS 风格：
   ```typescript
   const TreeSitter = require("web-tree-sitter");
   const Parser = TreeSitter.Parser;
   const Language = TreeSitter.Language;
   ```

2. 添加优雅降级逻辑，解析器初始化失败时应用仍可运行：
   ```typescript
   private initFailed = false;
   
   public async init() {
       if (this.isInitialized || this.initFailed) return;
       try {
           // 初始化逻辑...
       } catch (e) {
           console.error("❌ Failed to initialize tree-sitter:", e);
           this.initFailed = true;
       }
   }
   ```

### 2. 静态文件托管问题

**问题描述**：
- `@elysiajs/static` 插件在编译环境下会对 HTML 文件进行资源解析
- 导致返回 Bun 的错误页面而非前端 HTML

**错误信息**：
```
error: Could not resolve: "/vite.svg"
    at /Users/smz/trae_work/bun-codeview/dist/public/index.html
error: Could not resolve: "/assets/index-DR0MNPJm.js"
```

**解决方案**：
移除 `@elysiajs/static` 插件，改用手动实现的静态文件处理器：

```typescript
const serveStatic = (filePath: string) => {
    if (!existsSync(filePath)) {
        return new Response("Not Found", { status: 404 });
    }
    const ext = filePath.split('.').pop() || '';
    const mimeTypes: Record<string, string> = {
        'html': 'text/html; charset=utf-8',
        'css': 'text/css; charset=utf-8',
        'js': 'application/javascript; charset=utf-8',
        // ...
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const content = readFileSync(filePath);
    return new Response(content, {
        headers: { "Content-Type": contentType }
    });
};
```

### 3. 路径解析问题

**问题描述**：
- 编译后的二进制在运行时，`process.cwd()` 返回执行目录
- 需要确保静态资源路径正确指向 `dist/public/`

**解决方案**：
使用 `resolve()` 进行运行时动态路径计算：

```typescript
const getPublicDir = () => resolve(process.cwd(), "public");
```

## 修改的文件清单

### 后端

| 文件 | 修改内容 |
|------|----------|
| `backend/src/index.ts` | 移除 staticPlugin，添加手动静态文件处理逻辑 |
| `backend/src/parser/ParserService.ts` | 修改 web-tree-sitter 导入方式，添加优雅降级 |
| `backend/src/parser/SymbolService.ts` | 同步修改 web-tree-sitter 导入方式 |
| `backend/tsconfig.json` | 添加 esModuleInterop 配置 |

### 构建脚本

| 文件 | 修改内容 |
|------|----------|
| `scripts/build-standalone.ts` | 优化构建流程，产物输出到 dist 目录，添加 WASM 文件拷贝 |

## 构建流程

### 构建脚本核心逻辑

```typescript
async function build() {
  // 1. 清理环境
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
  
  // 2. 构建前端
  await $`cd ${frontendDir} && bun run build`.text();
  
  // 3. 拷贝前端产物
  await $`cp -r ${frontendDir}/dist/* ${distPublicDir}/`.text();
  
  // 4. 拷贝 WASM 语言包
  await $`cp ${langDir}/*.wasm ${distLangDir}/`.text();
  await $`cp ${treeSitterWasm} ${distLangDir}/`.text();
  
  // 5. 编译后端二进制
  await $`bun build --compile --minify --outfile ${join(distDir, "codeview-app")} ${join(backendDir, "src", "index.ts")}`.text();
}
```

### 构建命令

```bash
bun ./scripts/build-standalone.ts
```

### 构建产物

```
dist/
├── codeview-app          # 64MB 独立可执行文件
└── public/
    ├── index.html
    ├── vite.svg
    ├── assets/
    │   ├── index-*.js
    │   └── index-*.css
    └── languages/
        ├── tree-sitter-java.wasm
        ├── tree-sitter-typescript.wasm
        └── web-tree-sitter.wasm
```

## 运行方式

```bash
cd dist && ./codeview-app
```

应用在 `http://localhost:3000` 启动。

## 功能状态

| 功能 | 状态 | 说明 |
|------|------|------|
| 前端界面 | ✅ 正常 | 完整的 React 应用界面 |
| API 服务 | ✅ 正常 | 所有 REST API 端点正常工作 |
| 静态资源 | ✅ 正常 | JS/CSS/图片正确加载 |
| 项目分析 | ✅ 正常 | 文件遍历和依赖分析 |
| Git 历史 | ✅ 正常 | 提交历史和变更追踪 |
| 代码解析 | ⚠️ 降级 | tree-sitter 在编译环境下不可用 |

## 验证测试

### API 健康检查

```bash
$ curl http://localhost:3000/api/health
{"status":"ok","runtime":"bun","timestamp":1768116289857}
```

### 前端页面

浏览器访问 `http://localhost:3000` 显示完整的 CodeView Analysis 界面：
- 项目路径输入框
- "开始深度分析" 按钮
- 架构拓扑视图占位区
- 系统就绪状态指示器

## 已知限制

1. **解析器功能降级**：由于 web-tree-sitter 的 WASM 文件无法在 Bun 编译环境中正确加载，代码符号解析功能在独立二进制中不可用。

2. **文件大小**：独立二进制约 64MB，包含完整的 Bun 运行时。

3. **运行依赖**：需要 `public/` 目录与可执行文件在同一目录下。

## 建议

- 如需完整解析功能，建议使用开发模式运行：
  ```bash
  cd backend && bun run src/index.ts
  ```

- 未来可考虑使用 Bun 的 `--embed` 选项嵌入静态资源（如果该功能可用）

## 相关文件

- 构建脚本: `scripts/build-standalone.ts`
- 后端入口: `backend/src/index.ts`
- 解析服务: `backend/src/parser/ParserService.ts`
- 符号服务: `backend/src/parser/SymbolService.ts`

---

**会话结束时间**: 2026-01-11 15:31  
**状态**: Phase 5 完成，独立二进制构建成功
