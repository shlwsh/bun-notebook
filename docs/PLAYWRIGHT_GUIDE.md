# Playwright 集成测试指南

本文档介绍如何在项目中使用 Playwright 进行端到端（E2E）和集成测试。

## 目录

- [简介](#简介)
- [安装配置](#安装配置)
- [快速开始](#快速开始)
- [编写测试](#编写测试)
- [运行测试](#运行测试)
- [调试技巧](#调试技巧)
- [最佳实践](#最佳实践)
- [CI/CD 集成](#cicd-集成)

## 简介

### 什么是 Playwright？

Playwright 是微软开发的现代化端到端测试框架，支持：
- 跨浏览器测试（Chromium、Firefox、WebKit）
- 自动等待机制
- 强大的调试工具
- 并行测试执行
- 自动截图和视频录制

### 为什么使用 Playwright？

1. **真实浏览器环境**：在真实浏览器中测试，而不是模拟环境
2. **可靠性高**：自动等待机制减少测试不稳定性
3. **功能强大**：支持复杂的用户交互和场景
4. **调试友好**：提供 UI 模式和时间旅行调试
5. **跨浏览器**：一次编写，多浏览器运行

## 安装配置

### 首次安装

```bash
# 1. 安装 Playwright 依赖
bun add -d @playwright/test playwright

# 2. 安装浏览器
bunx playwright install

# 3. 安装系统依赖（Linux）
bunx playwright install-deps
```

### 配置文件

项目已包含 `playwright.config.ts` 配置文件，主要配置：

```typescript
export default defineConfig({
  testDir: './e2e',              // 测试目录
  testMatch: '**/*.spec.ts',     // 测试文件匹配
  timeout: 30 * 1000,            // 测试超时（30秒）
  retries: process.env.CI ? 2 : 0, // CI 环境重试2次
  
  use: {
    baseURL: 'http://localhost:1420',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  
  webServer: {
    command: 'bun run vite:dev',
    url: 'http://localhost:1420',
    reuseExistingServer: !process.env.CI,
  },
})
```

## 快速开始

### 1. 创建第一个测试

在 `e2e/` 目录下创建测试文件：

```typescript
// e2e/my-first-test.spec.ts
import { test, expect } from '@playwright/test'

test('应该成功加载首页', async ({ page }) => {
  // 访问首页
  await page.goto('/')
  
  // 等待页面加载
  await page.waitForLoadState('networkidle')
  
  // 验证页面标题
  await expect(page).toHaveTitle(/源码分析系统/)
})
```

### 2. 运行测试

```bash
# 运行所有测试
bun run test:e2e

# 带 UI 界面运行
bun run test:e2e:ui
```

### 3. 查看结果

测试完成后：
- 控制台显示测试结果
- 失败时自动生成截图和视频（在 `test-results/` 目录）
- HTML 报告（在 `playwright-report/` 目录）

## 编写测试

### 基本结构

```typescript
import { test, expect } from '@playwright/test'

test.describe('功能模块', () => {
  // 每个测试前执行
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })
  
  // 测试用例
  test('应该完成某个操作', async ({ page }) => {
    // 1. 准备
    const button = page.locator('[data-testid="my-button"]')
    
    // 2. 执行
    await button.click()
    
    // 3. 断言
    await expect(page.locator('[data-testid="result"]')).toBeVisible()
  })
  
  // 每个测试后执行
  test.afterEach(async ({ page }) => {
    // 清理工作
  })
})
```

### 选择器策略

推荐使用 `data-testid` 属性：

```vue
<!-- 组件中添加 data-testid -->
<template>
  <div>
    <button data-testid="save-button" @click="save">保存</button>
    <input data-testid="file-name-input" v-model="fileName" />
    <div data-testid="file-content">{{ content }}</div>
  </div>
</template>
```

```typescript
// 测试中使用
await page.click('[data-testid="save-button"]')
await page.fill('[data-testid="file-name-input"]', 'test.md')
await expect(page.locator('[data-testid="file-content"]')).toHaveText('内容')
```

### 常用操作

#### 导航

```typescript
// 访问页面
await page.goto('/')
await page.goto('/settings')

// 等待导航完成
await page.waitForURL('**/settings')

// 后退/前进
await page.goBack()
await page.goForward()
```

#### 点击和输入

```typescript
// 点击
await page.click('[data-testid="button"]')
await page.dblclick('[data-testid="element"]')

// 输入
await page.fill('[data-testid="input"]', '文本内容')
await page.type('[data-testid="input"]', '逐字输入')

// 清空输入
await page.fill('[data-testid="input"]', '')
```

#### 键盘和鼠标

```typescript
// 键盘
await page.keyboard.press('Enter')
await page.keyboard.press('Control+S')
await page.keyboard.type('Hello World')

// 鼠标
await page.hover('[data-testid="element"]')
await page.mouse.click(100, 200)
```

#### 文件操作

```typescript
// 上传文件
await page.setInputFiles('[data-testid="file-input"]', 'path/to/file.txt')

// 上传多个文件
await page.setInputFiles('[data-testid="file-input"]', [
  'file1.txt',
  'file2.txt'
])

// 下载文件
const downloadPromise = page.waitForEvent('download')
await page.click('[data-testid="download-button"]')
const download = await downloadPromise
await download.saveAs('/path/to/save/file')
```

### 常用断言

```typescript
// 可见性
await expect(page.locator('[data-testid="element"]')).toBeVisible()
await expect(page.locator('[data-testid="element"]')).toBeHidden()

// 文本
await expect(page.locator('[data-testid="element"]')).toHaveText('完整文本')
await expect(page.locator('[data-testid="element"]')).toContainText('部分')

// 值
await expect(page.locator('[data-testid="input"]')).toHaveValue('值')

// 属性
await expect(page.locator('[data-testid="element"]')).toHaveAttribute('class', 'active')

// 数量
await expect(page.locator('[data-testid="item"]')).toHaveCount(5)

// URL 和标题
await expect(page).toHaveURL(/settings/)
await expect(page).toHaveTitle('页面标题')
```

### 等待策略

```typescript
// 等待页面加载
await page.waitForLoadState('load')
await page.waitForLoadState('domcontentloaded')
await page.waitForLoadState('networkidle')

// 等待元素
await page.waitForSelector('[data-testid="element"]')
await page.waitForSelector('[data-testid="element"]', { state: 'visible' })

// 等待函数
await page.waitForFunction(() => document.title.includes('完成'))

// 等待超时
await page.waitForTimeout(1000) // 尽量避免使用
```

## 运行测试

### 基本命令

```bash
# 运行所有测试
bun run test:e2e

# 运行特定文件
bun run test:e2e e2e/file-operations.spec.ts

# 运行特定测试
bun run test:e2e -g "应该保存文件"

# 运行特定浏览器
bun run test:e2e --project=chromium
bun run test:e2e --project=firefox
```

### UI 模式（推荐）

```bash
bun run test:e2e:ui
```

UI 模式提供：
- 可视化测试列表
- 实时查看测试执行
- 时间旅行调试
- 查看每一步的截图和 DOM
- 实时编辑测试代码

### 调试模式

```bash
# 调试模式运行
bun run test:e2e:debug

# 调试特定测试
bun run test:e2e --debug -g "测试名称"
```

### 查看报告

```bash
# 查看 HTML 报告
bun run test:e2e:report
```

## 调试技巧

### 1. 使用 page.pause()

在测试中添加断点：

```typescript
test('调试测试', async ({ page }) => {
  await page.goto('/')
  
  // 暂停执行，打开 Playwright Inspector
  await page.pause()
  
  await page.click('[data-testid="button"]')
})
```

### 2. 截图和视频

```typescript
// 手动截图
await page.screenshot({ path: 'screenshot.png' })

// 截取特定元素
await page.locator('[data-testid="element"]').screenshot({ path: 'element.png' })

// 全页截图
await page.screenshot({ path: 'full-page.png', fullPage: true })
```

### 3. 打印调试信息

```typescript
// 打印页面内容
console.log(await page.content())

// 打印元素文本
console.log(await page.locator('[data-testid="element"]').textContent())

// 打印元素属性
console.log(await page.locator('[data-testid="element"]').getAttribute('class'))
```

### 4. 慢速执行

```typescript
test('慢速执行', async ({ page }) => {
  // 每个操作延迟 1000ms
  await page.goto('/', { timeout: 60000 })
  await page.waitForTimeout(1000)
  await page.click('[data-testid="button"]')
})
```

或在配置中设置：

```typescript
use: {
  launchOptions: {
    slowMo: 1000, // 每个操作延迟 1000ms
  },
}
```

## 最佳实践

### 1. 使用 Page Object Model

```typescript
// e2e/pages/editor.page.ts
import { Page } from '@playwright/test'

export class EditorPage {
  constructor(private page: Page) {}
  
  // 定位器
  get saveButton() {
    return this.page.locator('[data-testid="save-button"]')
  }
  
  get fileNameInput() {
    return this.page.locator('[data-testid="file-name-input"]')
  }
  
  // 操作方法
  async openFile(filename: string) {
    await this.page.click(`[data-testid="file-${filename}"]`)
  }
  
  async saveFile() {
    await this.saveButton.click()
    await this.page.waitForSelector('[data-testid="save-success"]')
  }
  
  async setFileName(name: string) {
    await this.fileNameInput.fill(name)
  }
}

// 测试中使用
import { EditorPage } from './pages/editor.page'

test('使用 Page Object', async ({ page }) => {
  const editor = new EditorPage(page)
  
  await page.goto('/')
  await editor.openFile('test.md')
  await editor.setFileName('new-name.md')
  await editor.saveFile()
})
```

### 2. 测试隔离

```typescript
test.describe('文件操作', () => {
  test.beforeEach(async ({ page }) => {
    // 每个测试前重置状态
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })
  
  test.afterEach(async ({ page }) => {
    // 清理测试数据
  })
})
```

### 3. 使用 Fixtures

```typescript
// e2e/fixtures.ts
import { test as base } from '@playwright/test'
import { EditorPage } from './pages/editor.page'

type MyFixtures = {
  editorPage: EditorPage
}

export const test = base.extend<MyFixtures>({
  editorPage: async ({ page }, use) => {
    const editorPage = new EditorPage(page)
    await use(editorPage)
  },
})

// 测试中使用
test('使用 Fixture', async ({ page, editorPage }) => {
  await page.goto('/')
  await editorPage.saveFile()
})
```

### 4. 并行测试

```typescript
// 默认并行执行
test.describe.parallel('并行测试组', () => {
  test('测试 1', async ({ page }) => { ... })
  test('测试 2', async ({ page }) => { ... })
})

// 串行执行
test.describe.serial('串行测试组', () => {
  test('测试 1', async ({ page }) => { ... })
  test('测试 2', async ({ page }) => { ... })
})
```

### 5. 条件测试

```typescript
// 跳过测试
test.skip('暂时跳过', async ({ page }) => { ... })

// 仅运行此测试
test.only('仅运行此测试', async ({ page }) => { ... })

// 条件跳过
test('条件测试', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Firefox 不支持此功能')
  // ...
})
```

## CI/CD 集成

### GitHub Actions

项目已包含 `.github/workflows/test.yml` 配置：

```yaml
e2e-tests:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: oven-sh/setup-bun@v1
    - run: bun install
    - run: bunx playwright install --with-deps
    - run: bun run test:e2e
      env:
        CI: true
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

### 本地 CI 模式

```bash
# 模拟 CI 环境运行
CI=true bun run test:e2e
```

## 常见问题

### 1. 测试超时

**问题**：测试经常超时

**解决方案**：
```typescript
// 增加特定测试的超时时间
test('长时间操作', async ({ page }) => {
  test.setTimeout(60000) // 60秒
  // ...
})

// 或在配置中全局设置
export default defineConfig({
  timeout: 60 * 1000,
})
```

### 2. 元素找不到

**问题**：`Error: Element not found`

**解决方案**：
```typescript
// 确保元素可见
await expect(page.locator('[data-testid="element"]')).toBeVisible()

// 等待元素出现
await page.waitForSelector('[data-testid="element"]')

// 检查选择器是否正确
console.log(await page.locator('[data-testid="element"]').count())
```

### 3. 测试不稳定

**问题**：测试时而通过时而失败

**解决方案**：
- 使用 `expect().toBeVisible()` 而不是 `waitForSelector()`
- 避免使用 `waitForTimeout()`
- 确保测试隔离
- 检查是否有竞态条件

### 4. 浏览器安装失败

**问题**：`bunx playwright install` 失败

**解决方案**：
```bash
# 安装系统依赖（Linux）
bunx playwright install-deps

# 仅安装特定浏览器
bunx playwright install chromium

# 使用代理
HTTPS_PROXY=http://proxy:port bunx playwright install
```

## 参考资源

- [Playwright 官方文档](https://playwright.dev/)
- [Playwright API 参考](https://playwright.dev/docs/api/class-playwright)
- [Playwright 最佳实践](https://playwright.dev/docs/best-practices)
- [Playwright 示例](https://github.com/microsoft/playwright/tree/main/examples)
- [项目测试规范](./.kiro/steering/03-testing-requirements.md)
