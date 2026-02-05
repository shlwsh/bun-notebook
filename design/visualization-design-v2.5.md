# 可视化分析方案设计 v2.5

**版本**: 2.5  
**日期**: 2026-01-12  
**状态**: 待审核  
**基于**: v2.4 可视化分析方案

---

## 版本演进

| 版本 | 新增功能 |
|------|----------|
| v2.3 | 分层下钻视图（六层架构） |
| v2.4 | 链路追溯视图（端到端闭环） |
| v2.5 | 展示元素字典 + 图标系统 + 图谱导入导出 |

---

## 一、展示元素字典 (Element Dictionary)

### 设计目标

将所有可视化元素定义为统一的元素字典，支持配置扩充。

### 元素分类

```typescript
// src/types/elementDictionary.ts

export interface ElementDefinition {
  id: string;                          // 唯一标识
  name: string;                        // 显示名称
  nameEn: string;                      // 英文名称
  category: ElementCategory;           // 所属分类
  icon: string;                        // 图标名称（Lucide React）
  color: string;                       // 主色调
  shape: NodeShape;                    // 节点形状
  description: string;                 // 描述
  isBuiltin: boolean;                  // 是否内置
}

export enum ElementCategory {
  // 分层架构元素
  Architecture = 'Architecture',
  // 链路追溯元素
  LinkTrace = 'LinkTrace',
  // 通用元素
  Common = 'Common',
  // 用户自定义
  Custom = 'Custom',
}

export enum NodeShape {
  Rectangle = 'rectangle',             // 矩形
  RoundedRect = 'rounded-rect',        // 圆角矩形
  Circle = 'circle',                   // 圆形
  Diamond = 'diamond',                 // 菱形
  Hexagon = 'hexagon',                 // 六边形
  Cylinder = 'cylinder',               // 圆柱形（数据库）
  Parallelogram = 'parallelogram',     // 平行四边形
  Stadium = 'stadium',                 // 跑道形
}
```

### 内置元素字典

#### 分层架构元素

| ID | 名称 | 图标 | 颜色 | 形状 |
|----|------|------|------|------|
| `service-type` | 服务类型 | `Layers` | `#4CAF50` | 圆角矩形 |
| `service-directory` | 服务目录 | `FolderTree` | `#2196F3` | 圆角矩形 |
| `module` | 模块 | `Package` | `#9C27B0` | 圆角矩形 |
| `submodule` | 子模块 | `Component` | `#FF9800` | 圆角矩形 |
| `class` | 类 | `FileCode` | `#f44336` | 矩形 |
| `interface` | 接口 | `FileType` | `#E91E63` | 矩形虚线 |
| `method` | 方法 | `Function` | `#607D8B` | 圆形 |
| `property` | 属性 | `Variable` | `#795548` | 圆形小 |

#### 链路追溯元素

| ID | 名称 | 图标 | 颜色 | 形状 |
|----|------|------|------|------|
| `page-component` | 页面组件 | `Layout` | `#4CAF50` | 圆角矩形 |
| `ui-action` | UI操作 | `MousePointerClick` | `#8BC34A` | 圆形 |
| `api-call` | API调用 | `Send` | `#00BCD4` | 平行四边形 |
| `gateway` | 网关 | `Router` | `#2196F3` | 六边形 |
| `controller` | 控制器 | `Server` | `#9C27B0` | 矩形 |
| `service-method` | 服务方法 | `Cog` | `#673AB7` | 矩形 |
| `repository` | 数据访问 | `Database` | `#3F51B5` | 矩形 |
| `message-queue` | 消息队列 | `MessageSquare` | `#FF9800` | 菱形 |
| `cache` | 缓存 | `HardDrive` | `#FFC107` | 菱形 |
| `database-table` | 数据库表 | `Table2` | `#f44336` | 圆柱形 |
| `sql-query` | SQL查询 | `FileSearch` | `#E91E63` | 矩形小 |
| `response-dto` | 响应数据 | `FileJson` | `#607D8B` | 平行四边形 |

#### 服务类型元素

| ID | 名称 | 图标 | 颜色 | 形状 |
|----|------|------|------|------|
| `frontend-service` | 前端服务 | `Monitor` | `#4CAF50` | 圆角矩形 |
| `backend-service` | 后端服务 | `Server` | `#2196F3` | 圆角矩形 |
| `middleware-service` | 中间件服务 | `Network` | `#FF9800` | 六边形 |
| `database-service` | 数据库服务 | `Database` | `#f44336` | 圆柱形 |
| `external-service` | 外部服务 | `Cloud` | `#9E9E9E` | 云形 |

### 元素字典配置

```json
// config/element-dictionary.json
{
  "version": "1.0",
  "elements": [
    {
      "id": "custom-microservice",
      "name": "微服务",
      "nameEn": "Microservice",
      "category": "Custom",
      "icon": "Container",
      "color": "#00ACC1",
      "shape": "rounded-rect",
      "description": "自定义微服务节点"
    }
  ]
}
```

---

## 二、图标系统

### 图标库选型

使用 **Lucide React** 图标库（与项目已有依赖一致）：
- 开源免费
- 500+ 图标
- React 原生支持
- 可自定义大小和颜色

### 图标渲染组件

```typescript
// src/components/ElementIcon.tsx

import * as LucideIcons from 'lucide-react';
import { ElementDefinition } from '../types/elementDictionary';

interface ElementIconProps {
  element: ElementDefinition;
  size?: number;
  className?: string;
}

export const ElementIcon: React.FC<ElementIconProps> = ({ 
  element, 
  size = 24,
  className 
}) => {
  const IconComponent = LucideIcons[element.icon as keyof typeof LucideIcons];
  
  if (!IconComponent) {
    return <LucideIcons.HelpCircle size={size} color={element.color} />;
  }
  
  return (
    <IconComponent 
      size={size} 
      color={element.color}
      className={className}
    />
  );
};
```

### 节点形状渲染

```typescript
// src/components/nodes/ShapedNode.tsx

export const ShapedNode: React.FC<ShapedNodeProps> = ({ element, label }) => {
  const shapeStyles = {
    'rectangle': 'rounded-none',
    'rounded-rect': 'rounded-lg',
    'circle': 'rounded-full aspect-square',
    'diamond': 'rotate-45',
    'hexagon': 'clip-path-hexagon',
    'cylinder': 'rounded-t-full rounded-b-lg',
  };
  
  return (
    <div 
      className={`flex items-center gap-2 p-3 border-2 ${shapeStyles[element.shape]}`}
      style={{ 
        backgroundColor: `${element.color}20`,
        borderColor: element.color 
      }}
    >
      <ElementIcon element={element} size={20} />
      <span className="font-medium">{label}</span>
    </div>
  );
};
```

---

## 三、图谱文件格式与导入导出

### 格式选型

采用 **GraphML** 作为主格式（行业标准），同时支持 JSON 格式：

| 格式 | 用途 | 优势 |
|------|------|------|
| **GraphML** | 导入导出、与其他工具互通 | 行业标准、yEd/Gephi 兼容 |
| **JSON** | 内部存储、前端直接使用 | 解析快、易于处理 |
| **DOT** | 导出到 Graphviz | 可视化调试 |

### GraphML 结构

```xml
<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns">
  <!-- 元数据定义 -->
  <key id="element_type" for="node" attr.name="elementType" attr.type="string"/>
  <key id="element_name" for="node" attr.name="name" attr.type="string"/>
  <key id="element_path" for="node" attr.name="path" attr.type="string"/>
  <key id="element_level" for="node" attr.name="level" attr.type="int"/>
  <key id="edge_type" for="edge" attr.name="edgeType" attr.type="string"/>
  <key id="edge_weight" for="edge" attr.name="weight" attr.type="double"/>
  
  <graph id="CodeGraph" edgedefault="directed">
    <!-- 节点 -->
    <node id="n1">
      <data key="element_type">backend-service</data>
      <data key="element_name">ruoyi-system</data>
      <data key="element_path">E:\work\RuoYi-Cloud\ruoyi-system</data>
      <data key="element_level">2</data>
    </node>
    
    <!-- 边 -->
    <edge id="e1" source="n1" target="n2">
      <data key="edge_type">import</data>
      <data key="edge_weight">1.0</data>
    </edge>
  </graph>
</graphml>
```

### JSON 内部格式

```typescript
// types/codeGraph.ts

export interface CodeGraph {
  version: string;
  metadata: {
    projectName: string;
    analyzedAt: string;
    toolVersion: string;
    elementDictionaryVersion: string;
  };
  
  nodes: GraphNode[];
  edges: GraphEdge[];
  
  // 分层视图数据
  hierarchy?: HierarchicalNode;
  
  // 链路追溯数据
  traces?: LinkTrace[];
  
  // 统计信息
  stats: {
    totalNodes: number;
    totalEdges: number;
    nodesByType: Record<string, number>;
  };
}

export interface GraphNode {
  id: string;
  elementType: string;          // 元素字典 ID
  name: string;
  path: string;
  level?: number;
  parent?: string;
  
  // 代码位置
  location?: {
    file: string;
    startLine: number;
    endLine: number;
  };
  
  // 度量数据
  metrics?: {
    linesOfCode?: number;
    complexity?: number;
    dependencies?: number;
  };
  
  // 扩展属性
  properties?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'import' | 'extends' | 'implements' | 'calls' | 'uses' | 'returns';
  weight?: number;
  label?: string;
}
```

### 导入导出 API

```rust
// src-tauri/src/commands/graph_io.rs

#[tauri::command]
pub async fn export_graph(
    format: GraphFormat,           // "graphml" | "json" | "dot"
    output_path: String,
    state: tauri::State<'_, AppState>,
) -> Result<String, String>;

#[tauri::command]
pub async fn import_graph(
    file_path: String,
    state: tauri::State<'_, AppState>,
) -> Result<CodeGraph, String>;

#[tauri::command]
pub async fn get_supported_formats() -> Vec<FormatInfo>;
```

### 前端导入导出 UI

```typescript
// src/components/GraphIO.tsx

export const GraphIOPanel: React.FC = () => {
  const { exportGraph, importGraph } = useGraphIO();
  
  return (
    <div className="flex gap-2">
      <Button onClick={() => exportGraph('graphml')}>
        <Download className="w-4 h-4 mr-2" />
        导出 GraphML
      </Button>
      <Button onClick={() => exportGraph('json')}>
        <Download className="w-4 h-4 mr-2" />
        导出 JSON
      </Button>
      <Button onClick={importGraph}>
        <Upload className="w-4 h-4 mr-2" />
        导入图谱
      </Button>
    </div>
  );
};
```

---

## Proposed Changes (扩展)

### 新增后端

| 文件 | 说明 |
|------|------|
| `models/element_dictionary.rs` | 元素字典数据结构 |
| `models/code_graph.rs` | 图谱数据结构 |
| `services/graph_io_service.rs` | GraphML/JSON 导入导出服务 |
| `commands/graph_io.rs` | 导入导出 Commands |

### 新增前端

| 文件 | 说明 |
|------|------|
| `types/elementDictionary.ts` | 元素字典类型定义 |
| `types/codeGraph.ts` | 图谱类型定义 |
| `components/ElementIcon.tsx` | 元素图标组件 |
| `components/nodes/ShapedNode.tsx` | 形状节点组件 |
| `components/GraphIOPanel.tsx` | 导入导出面板 |
| `hooks/useElementDictionary.ts` | 元素字典 Hook |
| `hooks/useGraphIO.ts` | 导入导出 Hook |
| `config/element-dictionary.json` | 默认元素字典配置 |

---

## Verification Plan

### 自动化测试

```bash
# Rust: GraphML 解析测试
cargo test test_parse_graphml
cargo test test_export_graphml
cargo test test_import_json

# 前端: 元素字典加载测试
bun test ElementIcon
bun test GraphIOPanel
```

### 手动验证

1. **元素字典验证**
   - 加载项目后验证各元素图标正确显示
   - 验证不同形状节点渲染正确

2. **导出验证**
   - 导出 GraphML 文件
   - 用 yEd 或其他工具打开验证格式正确

3. **导入验证**
   - 导入之前导出的文件
   - 验证可视化结果与导出前一致

---

## 总结

v2.5 方案新增：

1. **展示元素字典**：统一定义 30+ 可视化元素，支持配置扩充
2. **图标系统**：基于 Lucide React，每种元素独立图标和形状
3. **图谱导入导出**：支持 GraphML（行业标准）和 JSON 格式

完整可视化能力：分层下钻 + 链路追溯 + 元素区分 + 图谱持久化
