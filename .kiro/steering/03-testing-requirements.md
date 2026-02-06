---
inclusion: always
---

# 测试要求规范

## 测试原则

**代码完成后必须进行单元测试**，确保代码质量和功能正确性。

## 前端测试要求

### 测试框架
- 使用 **Vitest** 作为测试运行器
- 使用 **@testing-library/vue** 进行组件测试
- 使用 **Happy-DOM** 或 **JSDOM** 模拟浏览器环境

### 测试覆盖范围

#### 1. 工具函数测试（必须）
- 所有 `src/utils/` 下的工具函数必须有单元测试
- 测试文件命名：`*.test.ts`
- 测试覆盖率要求：≥ 80%

**示例：**
```typescript
// src/utils/fileIcons.test.ts
import { describe, it, expect } from 'vitest'
import { getFileIcon } from './fileIcons'

describe('getFileIcon', () => {
  it('应该返回正确的文件图标', () => {
    expect(getFileIcon('test.ts')).toBe('typescript-icon')
  })
})
```

#### 2. Store 测试（必须）
- 所有 Pinia Store 必须有单元测试
- 测试 actions、getters 的逻辑正确性
- 测试状态变更的副作用

**示例：**
```typescript
// src/store/app.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from './app'

describe('App Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('应该正确初始化状态', () => {
    const store = useAppStore()
    expect(store.isLoading).toBe(false)
  })
})
```

#### 3. 组件测试（推荐）
- 关键业务组件应该有测试
- 测试用户交互和事件触发
- 测试组件渲染和 Props 传递

**示例：**
```typescript
// src/components/FileViewer.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FileViewer from './FileViewer.vue'

describe('FileViewer', () => {
  it('应该正确渲染文件内容', () => {
    const wrapper = mount(FileViewer, {
      props: { content: 'test content' }
    })
    expect(wrapper.text()).toContain('test content')
  })
})
```

### 测试命令

**使用 Bun 运行测试（必须）：**
```bash
# 运行所有测试
bun test

# 运行测试并生成覆盖率报告
bun test --coverage

# 监听模式（开发时）
bun test --watch

# 运行特定测试文件
bun test src/utils/fileIcons.test.ts
```

**禁止使用：**
```bash
# ❌ 不要使用 npm
npm test
npm run test
```

## 后端测试要求

### Rust 测试规范

#### 1. 单元测试（必须）
- 每个公共函数必须有单元测试
- 测试放在模块内部或 `tests/` 目录
- 使用 `#[cfg(test)]` 标记测试模块

**示例：**
```rust
// src-tauri/src/services/knowledge_base_service.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_knowledge_base() {
        let result = create_knowledge_base("test");
        assert!(result.is_ok());
    }
}
```

#### 2. 集成测试（推荐）
- 测试 Tauri Commands 的完整流程
- 测试文件系统操作
- 测试数据持久化

### 测试命令
```bash
# 运行 Rust 测试
cd src-tauri
cargo test

# 运行测试并显示输出
cargo test -- --nocapture
```

## 测试文件组织

```
src/
├── utils/
│   ├── fileIcons.ts
│   └── fileIcons.test.ts          # 工具函数测试
├── store/
│   ├── app.ts
│   └── app.test.ts                # Store 测试
├── components/
│   ├── FileViewer.vue
│   └── FileViewer.test.ts         # 组件测试
└── tests/
    └── export.test.ts             # 集成测试

src-tauri/src/
├── commands/
│   └── fs.rs                      # 内联测试
├── services/
│   └── knowledge_base_service.rs  # 内联测试
└── tests/
    └── integration_test.rs        # 集成测试
```

## 测试最佳实践

### 1. 测试命名规范
- 使用描述性的测试名称
- 中文描述测试意图
- 格式：`应该 + 预期行为`

### 2. 测试结构
- **Arrange**（准备）：设置测试数据和环境
- **Act**（执行）：执行被测试的代码
- **Assert**（断言）：验证结果

### 3. 测试隔离
- 每个测试应该独立运行
- 避免测试之间的依赖
- 使用 `beforeEach` 和 `afterEach` 清理状态

### 4. Mock 和 Stub
- 对外部依赖进行 Mock
- 使用 Vitest 的 `vi.mock()` 功能
- 避免测试依赖真实的文件系统或网络

### 5. 边界条件测试
- 测试正常情况
- 测试边界值
- 测试异常情况
- 测试空值和 null

## 测试检查清单

在提交代码前，确保：

- [ ] 所有新增的工具函数都有单元测试
- [ ] 所有新增的 Store 都有测试
- [ ] 关键组件有基本的渲染测试
- [ ] 所有测试都能通过
- [ ] 测试覆盖率达到要求
- [ ] 没有跳过的测试（`it.skip`）
- [ ] 测试代码清晰易懂
- [ ] 测试运行速度合理（< 5秒）

## 持续集成

测试应该集成到 CI/CD 流程中：

1. 每次提交前运行测试
2. Pull Request 必须通过所有测试
3. 定期检查测试覆盖率
4. 失败的测试必须立即修复
