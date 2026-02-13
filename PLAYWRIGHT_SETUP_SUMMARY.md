# Playwright 集成测试框架安装总结

## 完成时间
2026-02-13

## 安装内容

### 1. 依赖安装
- ✅ 安装 `@playwright/test` 和 `playwright` 包
- ✅ 安装 Chromium 和 Firefox 浏览器
- ✅ 更新 `package.json` 添加测试脚本

### 2. 配置文件
- ✅ `playwright.config.ts` - Playwright 主配置文件
- ✅ `.gitignore` - 添加测试报告和结果目录
- ✅ `.github/workflows/test.yml` - CI/CD 测试流程

### 3. 测试文件
- ✅ `e2e/example.spec.ts` - 示例测试文件
- ✅ `e2e/README.md` - E2E 测试指南

### 4. 文档
- ✅ `docs/PLAYWRIGHT_GUIDE.md` - 完整的 Playwright 使用指南
- ✅ 更新 `.kiro/steering/03-testing-requirements.md` - 添加 Playwright 测试规范
- ✅ 更新 `.kiro/steering/02-tech-stack.md` - 添加 Playwright 到技术栈

## 新增的 npm 脚本

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:report": "playwright show-report"
}
```

## 使用方法

### 运行测试

```bash
# 运行所有 E2E 测试
bun run test:e2e

# 带 UI 界面运行（推荐用于开发）
bun run test:e2e:ui

# 调试模式
bun run test:e2e:debug

# 查看测试报告
bun run test:e2e:report
```

### 编写测试

1. 在 `e2e/` 目录下创建 `*.spec.ts` 文件
2. 使用 `data-testid` 属性标记需要测试的元素
3. 编写测试用例

示例：

```typescript
import { test, expect } from '@playwright/test'

test('应该完成某个操作', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="button"]')
  await expect(page.locator('[data-testid="result"]')).toBeVisible()
})
```

## 项目规范更新

### 测试要求（必须遵守）

1. **所有集成测试必须使用 Playwright 进行**
2. 测试文件放在 `e2e/` 目录
3. 测试文件命名：`*.spec.ts`
4. 使用 `data-testid` 属性作为选择器
5. 测试必须在 Chromium 和 Firefox 上通过
6. 提交代码前必须运行 E2E 测试

### 测试分类

- **单元测试**：使用 Vitest，测试工具函数、Store、组件
- **集成测试**：使用 Playwright，测试完整的用户流程和功能交互

## 目录结构

```
项目根目录/
├── e2e/                          # Playwright E2E 测试
│   ├── README.md                 # E2E 测试指南
│   └── example.spec.ts           # 示例测试
├── playwright.config.ts          # Playwright 配置
├── playwright-report/            # 测试报告（自动生成）
├── test-results/                 # 测试结果（自动生成）
├── docs/
│   └── PLAYWRIGHT_GUIDE.md       # Playwright 使用指南
└── .github/workflows/
    └── test.yml                  # CI/CD 测试流程
```

## 下一步

### 1. 为现有功能添加 E2E 测试

建议为以下功能添加集成测试：

- [ ] 文件操作（打开、保存、删除）
- [ ] 编辑器功能（编辑、格式化、搜索）
- [ ] 导航功能（页面切换、路由）
- [ ] 知识库功能（创建、编辑、删除）
- [ ] 导出功能（PDF、Markdown）

### 2. 在组件中添加 data-testid

为关键 UI 元素添加 `data-testid` 属性：

```vue
<template>
  <button data-testid="save-button" @click="save">保存</button>
  <input data-testid="file-name-input" v-model="fileName" />
  <div data-testid="file-content">{{ content }}</div>
</template>
```

### 3. 配置 CI/CD

项目已包含 `.github/workflows/test.yml`，推送代码时会自动运行测试。

### 4. 学习和实践

- 阅读 `docs/PLAYWRIGHT_GUIDE.md` 了解详细用法
- 阅读 `e2e/README.md` 了解测试规范
- 参考 `e2e/example.spec.ts` 编写测试
- 使用 `bun run test:e2e:ui` 体验 UI 模式

## 验证安装

运行以下命令验证安装是否成功：

```bash
# 1. 检查 Playwright 版本
bunx playwright --version

# 2. 运行示例测试
bun run test:e2e

# 3. 打开 UI 模式
bun run test:e2e:ui
```

## 常见问题

### 浏览器安装失败

如果浏览器安装失败，可以手动安装：

```bash
bunx playwright install chromium firefox
```

### 测试超时

如果测试经常超时，可以在 `playwright.config.ts` 中增加超时时间：

```typescript
export default defineConfig({
  timeout: 60 * 1000, // 60秒
})
```

### 端口冲突

如果 1420 端口被占用，可以修改 `playwright.config.ts` 中的 `baseURL` 和 `webServer.url`。

## 参考文档

- [Playwright 官方文档](https://playwright.dev/)
- [项目 Playwright 指南](./docs/PLAYWRIGHT_GUIDE.md)
- [E2E 测试指南](./e2e/README.md)
- [测试要求规范](./.kiro/steering/03-testing-requirements.md)

## 总结

✅ Playwright 框架已成功安装并配置
✅ 项目规范已更新，要求所有集成测试使用 Playwright
✅ 提供了完整的文档和示例
✅ 配置了 CI/CD 自动测试流程

现在可以开始编写 E2E 测试了！
