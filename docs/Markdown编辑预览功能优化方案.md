# MD Notebook — Markdown 编辑与预览功能优化方案

## 背景

当前 MD Notebook 的 Markdown 编辑和预览采用互斥切换模式（预览 / 源码二选一），用户无法在编辑时实时看到渲染效果，这是最大的体验痛点。此外，工具栏功能不够丰富、缺少常用快捷键、没有大纲导航和字数统计等辅助功能。本方案旨在分阶段系统性地提升编辑和预览体验。

## 现有架构关键发现

- `layout.ts:9` 已预留 `editorLayout: 'single' | 'horizontal' | 'vertical'` 字段，但未使用
- `@codemirror/search` 已安装但未引入（可直接启用查找替换）
- `@codemirror/commands` 中的 `undo`/`redo` 已可用但未暴露到工具栏
- `navigation.ts:13` 的 `activeView` 仅支持 `'files' | 'search'`，需扩展
- `FileViewer.vue` 约 900 行，承载了编辑、预览、导出全部逻辑

---

## 第一阶段：核心体验突破（P0）

### 1.1 分屏实时预览模式

**目标：** 编辑和预览可同时显示，左编辑右预览，支持拖拽调整比例。

**修改文件：**
- `src/components/FileViewer.vue` — 核心改造

**实现要点：**

1. 将 `showRaw: boolean` 替换为 `viewMode: ref<'preview' | 'editor' | 'split'>('preview')`
2. 头部切换按钮从两个改为三个（预览 / 分屏 / 源码），引入 `Eye`、`Columns2`、`Code2` 图标
3. 内容区域改造：用 `flex-row` 布局同时渲染编辑器和预览面板，中间加可拖拽分隔条
4. `shouldShowEditor` 计算属性改为：`viewMode === 'editor' || viewMode === 'split'`
5. 新增 `shouldShowPreview` 计算属性：`viewMode === 'preview' || viewMode === 'split'`
6. `updateMarkdown` 中的 source 选择逻辑：分屏/编辑模式使用 `editorContent`，预览模式使用 `content`
7. 分屏模式下对 `updateMarkdown` 做 300ms debounce，避免频繁渲染
8. 分屏比例通过 `splitRatio: ref(50)` 控制，mousedown 拖拽分隔条调整（范围 20%-80%）
9. MarkdownToolbar 在编辑和分屏模式下都显示

### 1.2 常用快捷键

**目标：** 支持 Ctrl/Cmd+B（粗体）、Ctrl/Cmd+I（斜体）、Ctrl/Cmd+K（链接）等。

**修改文件：**
- `src/components/FileViewer.vue` — 在 `editorExtensions` 的 markdown 分支中添加 keymap
- `src/components/editor/MarkdownToolbar.vue` — 更新按钮 title 显示快捷键提示

**快捷键列表：**

| 快捷键 | 功能 |
|--------|------|
| Cmd/Ctrl + B | 加粗 |
| Cmd/Ctrl + I | 斜体 |
| Cmd/Ctrl + K | 插入链接 |
| Cmd/Ctrl + Shift + K | 插入代码块 |
| Cmd/Ctrl + Shift + X | 删除线 |
| Cmd/Ctrl + F | 查找 |
| Cmd/Ctrl + H | 替换 |
| Cmd/Ctrl + S | 保存 |
| Cmd/Ctrl + Z | 撤销 |
| Cmd/Ctrl + Shift + Z | 重做 |

### 1.3 启用查找替换

**目标：** Ctrl/Cmd+F 查找，Ctrl/Cmd+H 替换。

**修改文件：**
- `src/components/FileViewer.vue` — 引入 `@codemirror/search`

**实现要点：**
- `@codemirror/search` 已安装，仅需引入并添加到 extensions 数组
- 查找替换面板自带完整 UI，添加暗色主题样式适配

### 1.4 自动保存

**目标：** 3秒无操作自动保存 + 窗口失焦自动保存。

**修改文件：**
- `src/components/FileViewer.vue` — 修改 `handleEditorChange` 和生命周期钩子
- `src/store/app.ts` — 添加 `autoSave: true` 和 `autoSaveDelay: 3000` 配置项

**实现要点：**
- `handleEditorChange` 中启动 debounce 定时器（读取 `appStore.autoSaveDelay`）
- `window blur` 事件触发立即保存
- `onUnmounted` 中清理定时器和事件监听

---

## 第二阶段：编辑体验增强（P1）

### 2.1 工具栏功能扩展

**目标：** 添加任务列表、水平线、撤销/重做按钮。

**修改文件：**
- `src/utils/markdownOperations.ts` — 新增 `insertTaskList` 函数
- `src/components/editor/MarkdownToolbar.vue` — 添加 4 个新按钮（CheckSquare、Minus、Undo2、Redo2）

**新增工具栏按钮：**

| 按钮 | 图标 | 功能 |
|------|------|------|
| 任务列表 | CheckSquare | 插入/切换 `- [ ]` 格式 |
| 水平线 | Minus | 插入 `---` 分隔线 |
| 撤销 | Undo2 | 撤销上一步操作 |
| 重做 | Redo2 | 重做上一步操作 |

### 2.2 代码块复制按钮

**目标：** 预览中的代码块右上角显示"复制"按钮。

**修改文件：**
- `src/components/FileViewer.vue` — 修改 `renderer.code` 和 `updateMarkdown`

**实现要点：**
- `renderer.code` 输出的 HTML 中包裹一个 `relative group` 容器，内含 hover 显示的复制按钮
- 按钮通过 `data-code` 属性携带原始代码文本
- `updateMarkdown` 的 `nextTick` 中绑定复制逻辑（`navigator.clipboard.writeText`）
- 复制后按钮文字变为"已复制!"，2秒后恢复

### 2.3 字数统计

**目标：** 在底部状态栏显示当前文件的行数、字数、字符数。

**修改文件：**
- `src/store/navigation.ts` — 新增 `activeFileStats` 状态和 `updateFileStats` action
- `src/components/FileViewer.vue` — 在 `handleEditorChange` 中计算并更新统计
- `src/components/layout/StatusBar.vue` — 在右侧区域显示统计信息

**实现要点：**
- 字数统计支持中英文混合：中文按字计数，英文按空格分词计数
- 统计数据通过 navigation store 传递，避免组件间直接耦合
- StatusBar 中仅在有活动文件时显示

### 2.4 编辑器与预览滚动同步

**目标：** 分屏模式下，编辑器和预览面板滚动联动。

**修改文件：**
- `src/components/FileViewer.vue` — 添加滚动同步逻辑

**实现要点：**
- 基于滚动比例（scrollTop / (scrollHeight - clientHeight)）进行同步
- 使用 `isScrollSyncing` 标志 + `requestAnimationFrame` 防止循环触发
- 编辑器滚动事件在 `handleEditorReady` 中通过 `view.scrollDOM.addEventListener` 绑定
- 预览容器滚动事件通过模板 `@scroll` 绑定
- 仅在 `viewMode === 'split'` 时激活

---

## 第三阶段：文档管理增强（P1）

### 3.1 大纲/目录导航

**目标：** 在侧边栏添加"大纲"视图，显示当前 Markdown 文件的标题层级结构，点击可跳转。

**修改/新增文件：**
- `src/store/navigation.ts` — 扩展 `activeView` 类型为 `'files' | 'search' | 'outline'`，新增 `headings` 状态
- 新建 `src/components/layout/OutlineView.vue` — 大纲视图组件
- `src/components/layout/ActivityBar.vue` — 添加大纲按钮（`ListTree` 图标）
- `src/components/layout/PrimarySidebar.vue` — 添加 `OutlineView` 条件渲染
- `src/components/FileViewer.vue` — 内容变化时解析标题并更新 store

**实现要点：**
- 正则解析 `^(#{1,6})\s+(.+)` 提取标题层级和文本
- 点击大纲项时，预览模式下通过 DOM 查询对应标题元素并 `scrollIntoView`；编辑模式下通过 `editorView.dispatch` 跳转
- 标题缩进通过 `paddingLeft: (level - 1) * 12px` 体现层级

### 3.2 Markdown 文档模板

**目标：** 提供预设模板，方便快速创建常用文档。

**新增文件：**
- `src/utils/markdownTemplates.ts` — 模板定义

**模板列表：**

| 模板名称 | 说明 |
|----------|------|
| 空白文档 | 仅包含一级标题 |
| 会议记录 | 基本信息、参会人、议题、决议、待办事项 |
| 技术文档 | 概述、架构设计、API 接口、部署说明、FAQ |
| 项目 README | 功能特性、快速开始、项目结构、贡献指南、许可证 |
| 周报 | 本周完成、下周计划、问题与风险 |
| 需求文档 | 背景、目标、功能需求、非功能需求、验收标准、排期 |

---

## 第四阶段：锦上添花（P2，待后续实施）

### 4.1 预览中任务列表可交互
- 预览中的 `- [ ]` 和 `- [x]` 渲染为可点击的 checkbox
- 点击后自动修改源码中对应行的状态

### 4.2 图片预览增强
- 预览中的图片支持点击放大查看（lightbox 效果）
- 支持图片缩放和拖拽

### 4.3 表格可视化编辑
- 提供简单的表格行列增删 UI
- 在工具栏的表格按钮中弹出行列数选择器

---

## 实施文件清单汇总

| 阶段 | 文件 | 操作 |
|------|------|------|
| 1 | `src/components/FileViewer.vue` | 修改（分屏、快捷键、查找替换、自动保存、代码块复制、字数统计、滚动同步） |
| 1 | `src/store/app.ts` | 修改（添加 autoSave 配置） |
| 2 | `src/utils/markdownOperations.ts` | 修改（新增 insertTaskList） |
| 2 | `src/components/editor/MarkdownToolbar.vue` | 修改（新增按钮、快捷键提示） |
| 2 | `src/store/navigation.ts` | 修改（新增 activeFileStats、headings、扩展 activeView） |
| 2 | `src/components/layout/StatusBar.vue` | 修改（显示字数统计） |
| 3 | `src/components/layout/OutlineView.vue` | **新建** |
| 3 | `src/components/layout/ActivityBar.vue` | 修改（添加大纲按钮） |
| 3 | `src/components/layout/PrimarySidebar.vue` | 修改（添加 OutlineView） |
| 3 | `src/utils/markdownTemplates.ts` | **新建** |
| 各阶段 | `src/i18n/index.ts` | 修改（添加新的 i18n 键，6 种语言） |

## 验证方式

1. **分屏预览：** 打开一个 .md 文件 → 点击"分屏"按钮 → 左侧编辑右侧实时预览 → 拖拽分隔条调整比例 → 滚动同步
2. **快捷键：** 编辑模式下按 Cmd/Ctrl+B → 插入粗体标记；Cmd/Ctrl+F → 弹出查找面板
3. **自动保存：** 编辑内容后等待 3 秒 → 保存按钮消失（表示已保存）；切换窗口 → 内容自动保存
4. **工具栏：** 点击任务列表按钮 → 插入 `- [ ]`；点击撤销/重做按钮 → 正常工作
5. **代码块复制：** 预览模式下 hover 代码块 → 显示复制按钮 → 点击后剪贴板包含代码
6. **字数统计：** 编辑文件时底部状态栏显示行数、字数、字符数
7. **大纲导航：** 点击侧边栏大纲图标 → 显示标题层级 → 点击标题跳转到对应位置
8. **运行测试：** `bun test` 确保现有测试通过
