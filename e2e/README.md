# E2E 测试指南

本目录包含使用 Playwright 编写的端到端（E2E）集成测试。

## 测试原则

**所有集成测试必须使用 Playwright 进行**，确保应用在真实浏览器环境中的功能正确性。

## 目录结构

```
e2e/
├── README.md                    # 本文件
├── example.spec.ts              # 示例测试
├── file-operations.spec.ts      # 文件操作测试
├── editor.spec.ts               # 编辑器功能测试
├── navigation.spec.ts           # 导航功能测试
└── knowledge-base.spec.ts       # 知识库功能测试
```

## 运行测试

### 基本命令

```bash
# 运行所有 E2E 测试
bun run test:e2e

# 带 UI 界面运行（推荐用于开发）
bun run test:e2e:ui

# 调试模式运行
bun run test:e2e:debug

# 运行特定测试文件
bun run test:e2e e2e/file-operations.spec.ts

# 运行特定浏览器
bun run test:e2e --project=chromium
bun run test:e2e --project=firefox
```

### 查看测试报告

```bash
# 生成并查看 HTML 报告
bun run test:e2e:report
```

## 编写测试

### 基本结构

```typescript
import { test, expect } from '@playwright/test'

test.describe('功能模块名称', () => {
  test('应该完成某个操作', async ({ page }) => {
    // 1. 准备：访问页面
    await page.goto('/')
    
    // 2. 执行：进行操作
    await page.click('[data-testid="button"]')
    
    // 3. 断言：验证结果
    await expect(page.locator('[data-testid="result"]')).toBeVisible()
  })
})
```

### 使用 data-testid

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
await expect(page.locator('[data-testid="save-button"]')).toBeVisible()
```

### 等待策略

```typescript
// 等待页面加载完成
await page.waitForLoadState('networkidle')

// 等待元素可见
await expect(page.locator('[data-testid="element"]')).toBeVisible()

// 等待导航完成
await page.waitForURL('**/settings')

// 等待特定条件
await page.waitForFunction(() => document.title.includes('完成'))
```

### 常用操作

```typescript
// 点击
await page.click('[data-testid="button"]')

// 输入文本
await page.fill('[data-testid="input"]', '测试内容')

// 选择下拉框
await page.selectOption('[data-testid="select"]', 'option-value')

// 上传文件
await page.setInputFiles('[data-testid="file-input"]', 'path/to/file')

// 键盘操作
await page.keyboard.press('Enter')
await page.keyboard.type('Hello')

// 鼠标操作
await page.hover('[data-testid="element"]')
await page.dblclick('[data-testid="element"]')
```

### 常用断言

```typescript
// 元素可见性
await expect(page.locator('[data-testid="element"]')).toBeVisible()
await expect(page.locator('[data-testid="element"]')).toBeHidden()

// 文本内容
await expect(page.locator('[data-testid="element"]')).toHaveText('预期文本')
await expect(page.locator('[data-testid="element"]')).toContainText('部分文本')

// 属性值
await expect(page.locator('[data-testid="input"]')).toHaveValue('值')
await expect(page.locator('[data-testid="element"]')).toHaveAttribute('class', 'active')

// URL
await expect(page).toHaveURL('http://localhost:1420/')
await expect(page).toHaveURL(/settings/)

// 标题
await expect(page).toHaveTitle('页面标题')
```

## 测试最佳实践

### 1. 测试隔离

每个测试应该独立运行，不依赖其他测试：

```typescript
test.beforeEach(async ({ page }) => {
  // 每个测试前重置状态
  await page.goto('/')
})

test.afterEach(async ({ page }) => {
  // 每个测试后清理
  await page.evaluate(() => localStorage.clear())
})
```

### 2. 使用 Page Object Model

对于复杂页面，使用 Page Object 模式：

```typescript
// e2e/pages/editor.page.ts
export class EditorPage {
  constructor(private page: Page) {}
  
  async openFile(filename: string) {
    await this.page.click(`[data-testid="file-${filename}"]`)
  }
  
  async saveFile() {
    await this.page.click('[data-testid="save-button"]')
  }
}

// 测试中使用
const editor = new EditorPage(page)
await editor.openFile('test.md')
await editor.saveFile()
```

### 3. 避免硬编码等待

```typescript
// ❌ 不好
await page.waitForTimeout(3000)

// ✅ 好
await expect(page.locator('[data-testid="element"]')).toBeVisible()
```

### 4. 使用有意义的测试名称

```typescript
// ❌ 不好
test('test 1', async ({ page }) => { ... })

// ✅ 好
test('应该在点击保存按钮后成功保存文件', async ({ page }) => { ... })
```

### 5. 测试关键用户流程

优先测试：
- 核心业务流程
- 用户最常用的功能
- 容易出错的功能
- 跨模块的集成功能

## 调试技巧

### 1. 使用 UI 模式

```bash
bun run test:e2e:ui
```

UI 模式提供：
- 可视化测试执行
- 时间旅行调试
- 查看每一步的截图
- 实时编辑测试

### 2. 使用调试模式

```bash
bun run test:e2e:debug
```

调试模式会：
- 打开浏览器窗口
- 暂停在每个操作
- 允许手动检查页面

### 3. 添加调试语句

```typescript
// 暂停执行，打开调试器
await page.pause()

// 截图
await page.screenshot({ path: 'debug.png' })

// 打印页面内容
console.log(await page.content())
```

## 常见问题

### 测试超时

如果测试经常超时，可以增加超时时间：

```typescript
test('长时间操作', async ({ page }) => {
  test.setTimeout(60000) // 60秒
  // ... 测试代码
})
```

### 元素找不到

确保：
1. 元素已经渲染（使用 `toBeVisible()`）
2. 选择器正确（优先使用 `data-testid`）
3. 页面已加载完成（使用 `waitForLoadState`）

### 测试不稳定

如果测试时而通过时而失败：
1. 检查是否有竞态条件
2. 添加适当的等待
3. 确保测试隔离
4. 检查是否依赖外部状态

## 参考资源

- [Playwright 官方文档](https://playwright.dev/)
- [Playwright 最佳实践](https://playwright.dev/docs/best-practices)
- [Playwright API 参考](https://playwright.dev/docs/api/class-playwright)
