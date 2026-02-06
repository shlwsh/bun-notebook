# 增强编辑器功能设计

## 架构设计

### 组件结构

```
src/components/
├── FileViewer.vue (现有，需要增强)
├── editor/
│   ├── MarkdownToolbar.vue (新增)
│   ├── EditorCore.vue (新增，抽取编辑器核心逻辑)
│   └── FileTypeHandler.ts (新增，文件类型处理)
└── layout/
    ├── FileBrowser.vue (现有，需要修改)
    └── FileTreeNode.vue (现有，需要修改)
```

## 详细设计

### 1. 文件类型支持

#### 1.1 文件类型定义

```typescript
// src/types/fileTypes.ts
export enum FileType {
  MARKDOWN = 'markdown',
  TYPESCRIPT = 'typescript',
  TEXT = 'text',
  IMAGE = 'image',
  UNKNOWN = 'unknown'
}

export interface FileTypeConfig {
  extensions: string[];
  icon: string;
  color: string;
  editorMode: 'preview' | 'edit' | 'both';
  language?: string;
}

export const FILE_TYPE_CONFIGS: Record<FileType, FileTypeConfig> = {
  [FileType.MARKDOWN]: {
    extensions: ['md', 'markdown'],
    icon: 'FileText',
    color: 'text-blue-400',
    editorMode: 'both',
    language: 'markdown'
  },
  [FileType.TYPESCRIPT]: {
    extensions: ['ts', 'tsx'],
    icon: 'FileCode',
    color: 'text-blue-500',
    editorMode: 'edit',
    language: 'typescript'
  },
  [FileType.TEXT]: {
    extensions: ['txt'],
    icon: 'FileText',
    color: 'text-gray-400',
    editorMode: 'edit'
  },
  [FileType.IMAGE]: {
    extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
    icon: 'Image',
    color: 'text-green-400',
    editorMode: 'preview'
  },
  [FileType.UNKNOWN]: {
    extensions: [],
    icon: 'File',
    color: 'text-gray-500',
    editorMode: 'preview'
  }
};
```

#### 1.2 文件类型识别

```typescript
// src/utils/fileTypeDetector.ts
export function detectFileType(filePath: string): FileType {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  
  for (const [type, config] of Object.entries(FILE_TYPE_CONFIGS)) {
    if (config.extensions.includes(extension)) {
      return type as FileType;
    }
  }
  
  return FileType.UNKNOWN;
}
```

### 2. Markdown 工具栏设计

#### 2.1 工具栏布局

```
┌─────────────────────────────────────────────────────────────┐
│ [H1▼] [B] [I] [S] │ [•] [1.] │ [表格] [图片] [链接] [代码] │
└─────────────────────────────────────────────────────────────┘
```

#### 2.2 工具栏按钮定义

```typescript
// src/components/editor/toolbarConfig.ts
export interface ToolbarButton {
  id: string;
  label: string;
  icon: string;
  action: (editor: EditorView) => void;
  shortcut?: string;
  tooltip: string;
}

export const TOOLBAR_BUTTONS: ToolbarButton[] = [
  // 标题组
  {
    id: 'heading',
    label: 'H1',
    icon: 'Heading1',
    action: (editor) => insertHeading(editor, 1),
    tooltip: '插入标题'
  },
  // 文本样式组
  {
    id: 'bold',
    label: 'B',
    icon: 'Bold',
    action: (editor) => wrapSelection(editor, '**', '**'),
    shortcut: 'Ctrl+B',
    tooltip: '粗体'
  },
  {
    id: 'italic',
    label: 'I',
    icon: 'Italic',
    action: (editor) => wrapSelection(editor, '*', '*'),
    shortcut: 'Ctrl+I',
    tooltip: '斜体'
  },
  // ... 更多按钮
];
```

#### 2.3 工具栏操作实现

```typescript
// src/utils/markdownOperations.ts
export function wrapSelection(
  editor: EditorView, 
  prefix: string, 
  suffix: string
) {
  const selection = editor.state.selection.main;
  const selectedText = editor.state.sliceDoc(selection.from, selection.to);
  
  editor.dispatch({
    changes: {
      from: selection.from,
      to: selection.to,
      insert: `${prefix}${selectedText}${suffix}`
    },
    selection: {
      anchor: selection.from + prefix.length,
      head: selection.to + prefix.length
    }
  });
}

export function insertHeading(editor: EditorView, level: number) {
  const selection = editor.state.selection.main;
  const line = editor.state.doc.lineAt(selection.from);
  const lineStart = line.from;
  
  const prefix = '#'.repeat(level) + ' ';
  
  editor.dispatch({
    changes: {
      from: lineStart,
      insert: prefix
    },
    selection: {
      anchor: lineStart + prefix.length
    }
  });
}

export function insertTable(editor: EditorView, rows: number, cols: number) {
  const header = '| ' + 'Header |'.repeat(cols) + '\n';
  const separator = '|' + ' --- |'.repeat(cols) + '\n';
  const rowTemplate = '|' + '   |'.repeat(cols) + '\n';
  const tableContent = header + separator + rowTemplate.repeat(rows - 1);
  
  const selection = editor.state.selection.main;
  editor.dispatch({
    changes: {
      from: selection.from,
      insert: '\n' + tableContent + '\n'
    }
  });
}
```

### 3. 编辑器增强

#### 3.1 TypeScript 支持

```typescript
// src/composables/useEditor.ts
import { javascript } from '@codemirror/lang-javascript';

export function getEditorExtensions(fileType: FileType) {
  const extensions = [
    oneDark,
    lintGutter(),
    EditorView.lineWrapping,
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
  ];
  
  switch (fileType) {
    case FileType.MARKDOWN:
      extensions.push(markdown());
      extensions.push(markdownKeymap());
      break;
      
    case FileType.TYPESCRIPT:
      extensions.push(javascript({ typescript: true }));
      extensions.push(autocompletion());
      extensions.push(closeBrackets());
      break;
      
    case FileType.TEXT:
      // 纯文本，只需要基本功能
      break;
  }
  
  return extensions;
}
```

#### 3.2 编辑器配置

```typescript
// src/config/editorConfig.ts
export const EDITOR_CONFIG = {
  tabSize: 2,
  indentWithTab: true,
  lineWrapping: true,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
  foldGutter: true,
  dropCursor: true,
  allowMultipleSelections: true,
  indentOnInput: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: true,
  rectangularSelection: true,
  crosshairCursor: true,
  highlightSelectionMatches: true,
  closeBracketsKeymap: true,
  searchKeymap: true,
  foldKeymap: true,
  completionKeymap: true,
  lintKeymap: true,
};
```

### 4. 文件树优化

#### 4.1 文件过滤逻辑

```typescript
// src/components/layout/FileBrowser.vue
const supportedExtensions = ['md', 'ts', 'tsx', 'txt'];

const filterFileTree = (nodes: FileNode[]): FileNode[] => {
  return nodes.reduce((acc: FileNode[], node) => {
    if (node.isDirectory) {
      const filteredChildren = filterFileTree(node.children || []);
      if (filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      }
    } else {
      const ext = node.name.split('.').pop()?.toLowerCase();
      if (ext && supportedExtensions.includes(ext)) {
        acc.push(node);
      }
    }
    return acc;
  }, []);
};
```

#### 4.2 文件图标映射

```typescript
// src/utils/fileIcons.ts
export function getFileIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const iconMap: Record<string, string> = {
    'md': 'FileText',
    'markdown': 'FileText',
    'ts': 'FileCode',
    'tsx': 'FileCode',
    'txt': 'FileText',
    'png': 'Image',
    'jpg': 'Image',
    'jpeg': 'Image',
    'gif': 'Image',
    'svg': 'Image',
  };
  
  return iconMap[ext || ''] || 'File';
}

export function getFileIconColor(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const colorMap: Record<string, string> = {
    'md': 'text-blue-400',
    'ts': 'text-blue-500',
    'tsx': 'text-blue-500',
    'txt': 'text-gray-400',
  };
  
  return colorMap[ext || ''] || 'text-gray-500';
}
```

### 5. UI/UX 设计

#### 5.1 Markdown 工具栏样式

```vue
<template>
  <div class="h-10 bg-[#252525] border-b border-[#2b2b2b] flex items-center px-3 gap-2">
    <!-- 标题下拉菜单 -->
    <div class="relative">
      <button class="flex items-center gap-1 px-2 py-1 hover:bg-[#3e3e3e] rounded">
        <Heading1 :size="16" />
        <ChevronDown :size="12" />
      </button>
      <!-- 下拉菜单 -->
    </div>
    
    <div class="w-px h-6 bg-[#3e3e3e]"></div>
    
    <!-- 文本样式按钮 -->
    <button class="p-1.5 hover:bg-[#3e3e3e] rounded" title="粗体 (Ctrl+B)">
      <Bold :size="16" />
    </button>
    <button class="p-1.5 hover:bg-[#3e3e3e] rounded" title="斜体 (Ctrl+I)">
      <Italic :size="16" />
    </button>
    
    <!-- 更多按钮... -->
  </div>
</template>
```

#### 5.2 响应式设计

- 工具栏在小屏幕上可以折叠
- 按钮有清晰的悬停效果
- 图标大小适中（16px）
- 使用工具提示显示快捷键

### 6. 性能优化

#### 6.1 大文件处理

```typescript
// 虚拟滚动
import { EditorView } from '@codemirror/view';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function loadFile(filePath: string) {
  const stats = await getFileStats(filePath);
  
  if (stats.size > MAX_FILE_SIZE) {
    // 显示警告
    const confirmed = confirm('文件较大，可能影响性能。是否继续？');
    if (!confirmed) return;
  }
  
  // 分块加载
  const content = await readFileInChunks(filePath);
  return content;
}
```

#### 6.2 语法高亮优化

```typescript
// 延迟加载语法高亮
import { syntaxHighlighting } from '@codemirror/language';

const lazyHighlighting = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    // 延迟 100ms 后更新高亮
    setTimeout(() => {
      update.view.dispatch({
        effects: syntaxHighlighting.reconfigure()
      });
    }, 100);
  }
});
```

## 数据流

```
用户操作 → 工具栏按钮点击
    ↓
工具栏组件触发 action
    ↓
markdownOperations 处理逻辑
    ↓
EditorView dispatch 更新
    ↓
CodeMirror 更新文档
    ↓
界面重新渲染
```

## 状态管理

不需要额外的状态管理，编辑器状态由 CodeMirror 管理：
- 文档内容：`editor.state.doc`
- 选区：`editor.state.selection`
- 光标位置：`editor.state.selection.main.head`

## 错误处理

1. **文件读取失败**：显示错误提示，允许重试
2. **文件保存失败**：显示错误提示，保留编辑内容
3. **语法高亮失败**：降级到纯文本模式
4. **大文件警告**：提示用户文件过大，询问是否继续

## 测试策略

### 单元测试
- `markdownOperations.ts` 的所有函数
- `fileTypeDetector.ts` 的文件类型识别
- 工具栏按钮的 action 函数

### 组件测试
- `MarkdownToolbar.vue` 的按钮点击
- `FileViewer.vue` 的文件类型切换
- `FileBrowser.vue` 的文件过滤

### E2E 测试
- 打开不同类型的文件
- 使用工具栏编辑 Markdown
- 保存文件并验证内容

## 实现计划

### Phase 1: 基础支持（2-3天）
1. 添加 TypeScript 和 TXT 文件类型支持
2. 更新文件树显示逻辑
3. 更新 FileViewer 组件支持新文件类型

### Phase 2: Markdown 工具栏（2-3天）
1. 创建 MarkdownToolbar 组件
2. 实现基本格式化功能（标题、粗体、斜体）
3. 实现列表功能

### Phase 3: 高级功能（2-3天）
1. 实现表格插入
2. 实现图片插入
3. 实现链接和代码块插入

### Phase 4: 优化和测试（1-2天）
1. 性能优化
2. 编写测试
3. 修复 bug
4. 文档更新

## 依赖项

### 新增依赖
无需新增依赖，现有的 CodeMirror 6 已经包含所需功能

### 现有依赖
- `@codemirror/lang-javascript` - TypeScript 支持
- `@codemirror/lang-markdown` - Markdown 支持
- `@codemirror/autocomplete` - 自动补全
- `@codemirror/commands` - 编辑器命令
- `lucide-vue-next` - 图标库

## 兼容性考虑

- 确保在 Windows、macOS、Linux 上快捷键正确
- 深色和浅色主题都要测试
- 不同屏幕尺寸下的工具栏布局

## 安全考虑

- 文件路径验证，防止路径遍历攻击
- 大文件限制，防止内存溢出
- 用户输入清理（虽然是本地应用，但仍需注意）
