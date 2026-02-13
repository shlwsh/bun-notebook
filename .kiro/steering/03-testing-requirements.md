---
inclusion: always
---

# 测试要求规范

## 测试原则

**代码完成后必须进行单元测试**，确保代码质量和功能正确性。

## 前端测试要求

### 测试框架
- 使用 **Vitest** 作为单元测试运行器
- 使用 **@testing-library/vue** 进行组件测试
- 使用 **Happy-DOM** 或 **JSDOM** 模拟浏览器环境
- 使用 **Playwright** 进行端到端（E2E）和集成测试（必须）

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

#### 4. 集成测试（必须）
- 所有集成测试必须使用 **Playwright** 进行
- 测试文件放在 `e2e/` 目录
- 测试文件命名：`*.spec.ts`
- 测试完整的用户流程和功能交互

**示例：**
```typescript
// e2e/file-operations.spec.ts
import { test, expect } from '@playwright/test'

test.describe('文件操作功能', () => {
  test('应该能够打开和查看文件', async ({ page }) => {
    await page.goto('/')
    
    // 点击文件浏览器
    await page.click('[data-testid="file-explorer"]')
    
    // 选择文件
    await page.click('[data-testid="file-item-readme"]')
    
    // 验证文件内容显示
    await expect(page.locator('[data-testid="file-content"]')).toBeVisible()
  })
})
```

### 测试命令

**单元测试（Vitest）：**
```bash
# 运行所有单元测试
bun test

# 运行测试并生成覆盖率报告
bun test --coverage

# 监听模式（开发时）
bun test --watch

# 运行特定测试文件
bun test src/utils/fileIcons.test.ts
```

**集成测试（Playwright - 必须）：**
```bash
# 运行所有 E2E 测试
bun run test:e2e

# 运行测试（带 UI 界面）
bun run test:e2e:ui

# 运行特定浏览器的测试
bun run test:e2e --project=chromium
bun run test:e2e --project=firefox

# 调试模式运行测试
bun run test:e2e --debug

# 生成测试报告
bun run test:e2e --reporter=html

# 运行特定测试文件
bun run test:e2e e2e/file-operations.spec.ts
```

**禁止使用：**
```bash
# ❌ 不要使用 npm
npm test
npm run test
npx playwright test
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
项目根目录/
├── e2e/                           # Playwright E2E 测试（必须）
│   ├── file-operations.spec.ts   # 文件操作集成测试
│   ├── editor.spec.ts            # 编辑器功能集成测试
│   ├── navigation.spec.ts        # 导航功能集成测试
│   └── knowledge-base.spec.ts    # 知识库功能集成测试
├── playwright.config.ts          # Playwright 配置文件
├── playwright-report/            # 测试报告（自动生成）
└── test-results/                 # 测试结果（自动生成）

src/
├── utils/
│   ├── fileIcons.ts
│   └── fileIcons.test.ts         # 工具函数单元测试
├── store/
│   ├── app.ts
│   └── app.test.ts               # Store 单元测试
├── components/
│   ├── FileViewer.vue
│   └── FileViewer.test.ts        # 组件单元测试
└── tests/
    └── export.test.ts            # 其他单元测试

src-tauri/src/
├── commands/
│   └── fs.rs                     # 内联单元测试
├── services/
│   └── knowledge_base_service.rs # 内联单元测试
└── tests/
    └── integration_test.rs       # Rust 集成测试
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
- 单元测试：使用 Vitest 的 `vi.mock()` 功能
- E2E 测试：使用 Playwright 的 `page.route()` 拦截网络请求
- 避免测试依赖真实的文件系统或网络（单元测试）

### 5. 边界条件测试
- 测试正常情况
- 测试边界值
- 测试异常情况
- 测试空值和 null

### 6. Playwright 集成测试最佳实践

#### 使用 data-testid 属性
为了提高测试的稳定性，在组件中添加 `data-testid` 属性：

```vue
<template>
  <button data-testid="save-button" @click="save">
    保存
  </button>
</template>
```

测试中使用：
```typescript
await page.click('[data-testid="save-button"]')
```

#### 等待策略
- 使用 `page.waitForLoadState('networkidle')` 等待页面加载完成
- 使用 `expect(locator).toBeVisible()` 等待元素可见
- 避免使用固定的 `page.waitForTimeout()`

#### 截图和视频
- 失败时自动截图和录制视频（已在配置中启用）
- 可以手动添加截图：`await page.screenshot({ path: 'screenshot.png' })`

#### 测试数据隔离
- 每个测试使用独立的测试数据
- 测试结束后清理测试数据
- 使用 `test.beforeEach` 和 `test.afterEach` 管理测试环境

## 测试检查清单

在提交代码前，确保：

### 单元测试检查
- [ ] 所有新增的工具函数都有单元测试
- [ ] 所有新增的 Store 都有单元测试
- [ ] 关键组件有基本的渲染测试
- [ ] 所有单元测试都能通过（`bun test`）
- [ ] 测试覆盖率达到要求（≥ 80%）
- [ ] 没有跳过的测试（`it.skip` 或 `test.skip`）
- [ ] 测试代码清晰易懂
- [ ] 单元测试运行速度合理（< 5秒）

### 集成测试检查（Playwright - 必须）
- [ ] 所有新增的用户流程都有 E2E 测试
- [ ] 关键功能有完整的集成测试覆盖
- [ ] 所有 E2E 测试都能通过（`bun run test:e2e`）
- [ ] 测试使用了合适的 `data-testid` 选择器
- [ ] 测试有适当的等待和断言
- [ ] 测试在 Chromium 和 Firefox 上都能通过
- [ ] 失败时有清晰的错误信息和截图
- [ ] E2E 测试运行速度合理（< 2分钟）

## 持续集成

测试应该集成到 CI/CD 流程中：

1. 每次提交前运行单元测试（`bun test`）
2. 每次提交前运行 E2E 测试（`bun run test:e2e`）
3. Pull Request 必须通过所有测试（单元测试 + E2E 测试）
4. 定期检查测试覆盖率
5. 失败的测试必须立即修复
6. CI 环境中使用 Playwright 的 CI 模式运行测试

## Playwright 安装和配置

### 首次安装
```bash
# 安装 Playwright 依赖
bun add -d @playwright/test playwright

# 安装浏览器
bunx playwright install
```

### 配置文件
Playwright 配置文件位于 `playwright.config.ts`，包含：
- 测试目录和文件匹配模式
- 浏览器配置（Chromium、Firefox）
- 超时设置
- 报告配置
- 自动启动开发服务器

### 常用命令
```bash
# 运行所有 E2E 测试
bun run test:e2e

# 带 UI 界面运行
bun run test:e2e:ui

# 调试模式
bun run test:e2e --debug

# 查看测试报告
bunx playwright show-report
```
