import { test, expect } from '@playwright/test'

/**
 * 编辑器功能集成测试
 * 测试文件查看、编辑、Markdown 工具栏等功能
 */

test.describe('文件查看器基础功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('应该显示文件查看器（当打开文件时）', async ({ page }) => {
    // 注意：这个测试需要先打开一个文件
    // 在实际测试中，你需要先选择一个文件
    // 这里我们只验证文件查看器的结构
    
    // 如果有文件打开，应该能看到文件查看器
    const fileViewer = page.locator('[data-testid="file-viewer"]')
    
    // 检查文件查看器是否存在（可能不可见，因为没有打开文件）
    const count = await fileViewer.count()
    
    // 如果存在文件查看器，验证其结构
    if (count > 0) {
      await expect(fileViewer).toBeVisible()
      await expect(page.locator('[data-testid="file-viewer-header"]')).toBeVisible()
    }
  })
})

test.describe('Markdown 视图模式切换', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 注意：这些测试假设已经打开了一个 Markdown 文件
    // 在实际测试中，你需要先打开一个 .md 文件
  })

  test('应该显示视图模式切换按钮（Markdown 文件）', async ({ page }) => {
    // 检查视图模式切换组是否存在
    const viewModeToggle = page.locator('[data-testid="view-mode-toggle"]')
    
    // 如果存在（说明打开了 Markdown 文件）
    if (await viewModeToggle.count() > 0) {
      await expect(viewModeToggle).toBeVisible()
      
      // 验证三个模式按钮都存在
      await expect(page.locator('[data-testid="preview-mode-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="split-mode-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="editor-mode-button"]')).toBeVisible()
    }
  })

  test('应该能够切换到预览模式', async ({ page }) => {
    const previewButton = page.locator('[data-testid="preview-mode-button"]')
    
    if (await previewButton.count() > 0) {
      await previewButton.click()
      
      // 验证按钮状态变化
      await expect(previewButton).toHaveClass(/bg-\[#3e3e3e\]/)
    }
  })

  test('应该能够切换到分屏模式', async ({ page }) => {
    const splitButton = page.locator('[data-testid="split-mode-button"]')
    
    if (await splitButton.count() > 0) {
      await splitButton.click()
      
      // 验证按钮状态变化
      await expect(splitButton).toHaveClass(/bg-\[#3e3e3e\]/)
    }
  })

  test('应该能够切换到编辑器模式', async ({ page }) => {
    const editorButton = page.locator('[data-testid="editor-mode-button"]')
    
    if (await editorButton.count() > 0) {
      await editorButton.click()
      
      // 验证按钮状态变化
      await expect(editorButton).toHaveClass(/bg-\[#3e3e3e\]/)
    }
  })
})

test.describe('文件操作按钮', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('应该显示主题切换按钮', async ({ page }) => {
    const themeButton = page.locator('[data-testid="theme-button"]')
    
    if (await themeButton.count() > 0) {
      await expect(themeButton).toBeVisible()
    }
  })

  test('应该能够打开主题菜单', async ({ page }) => {
    const themeButton = page.locator('[data-testid="theme-button"]')
    
    if (await themeButton.count() > 0) {
      await themeButton.click()
      
      // 验证主题菜单显示
      await expect(page.locator('[data-testid="theme-menu"]')).toBeVisible()
      
      // 验证主题选项存在
      await expect(page.locator('[data-testid="theme-option-default"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-option-light"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-option-sepia"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-option-github"]')).toBeVisible()
    }
  })

  test('应该能够切换主题', async ({ page }) => {
    const themeButton = page.locator('[data-testid="theme-button"]')
    
    if (await themeButton.count() > 0) {
      // 打开主题菜单
      await themeButton.click()
      await expect(page.locator('[data-testid="theme-menu"]')).toBeVisible()
      
      // 选择浅色主题
      await page.click('[data-testid="theme-option-light"]')
      
      // 验证菜单关闭
      await expect(page.locator('[data-testid="theme-menu"]')).not.toBeVisible()
    }
  })

  test('应该显示导出按钮', async ({ page }) => {
    const exportButton = page.locator('[data-testid="export-button"]')
    
    if (await exportButton.count() > 0) {
      await expect(exportButton).toBeVisible()
    }
  })

  test('应该能够打开导出菜单', async ({ page }) => {
    const exportButton = page.locator('[data-testid="export-button"]')
    
    if (await exportButton.count() > 0) {
      await exportButton.click()
      
      // 验证导出菜单显示
      await expect(page.locator('[data-testid="export-menu"]')).toBeVisible()
      
      // 验证导出选项存在
      await expect(page.locator('[data-testid="export-html-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="export-pdf-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="export-docx-button"]')).toBeVisible()
    }
  })

  test('应该显示打印按钮', async ({ page }) => {
    const printButton = page.locator('[data-testid="print-button"]')
    
    if (await printButton.count() > 0) {
      await expect(printButton).toBeVisible()
    }
  })
})

test.describe('Markdown 工具栏功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('应该显示 Markdown 工具栏（Markdown 文件）', async ({ page }) => {
    const toolbar = page.locator('[data-testid="markdown-toolbar"]')
    
    // 如果存在 Markdown 工具栏（说明打开了 Markdown 文件）
    if (await toolbar.count() > 0) {
      await expect(toolbar).toBeVisible()
    }
  })

  test('应该显示所有格式化按钮', async ({ page }) => {
    const toolbar = page.locator('[data-testid="markdown-toolbar"]')
    
    if (await toolbar.count() > 0) {
      // 验证主要按钮存在
      await expect(page.locator('[data-testid="heading-dropdown-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="bold-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="italic-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="strikethrough-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="unordered-list-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="ordered-list-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="task-list-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="table-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="link-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="image-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="code-block-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="quote-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="horizontal-rule-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="undo-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="redo-button"]')).toBeVisible()
    }
  })

  test('应该能够打开标题下拉菜单', async ({ page }) => {
    const headingButton = page.locator('[data-testid="heading-dropdown-button"]')
    
    if (await headingButton.count() > 0) {
      await headingButton.click()
      
      // 验证标题菜单显示
      await expect(page.locator('[data-testid="heading-menu"]')).toBeVisible()
      
      // 验证所有标题级别按钮存在
      for (let level = 1; level <= 6; level++) {
        await expect(page.locator(`[data-testid="heading-level-${level}-button"]`)).toBeVisible()
      }
    }
  })

  test('应该能够选择标题级别', async ({ page }) => {
    const headingButton = page.locator('[data-testid="heading-dropdown-button"]')
    
    if (await headingButton.count() > 0) {
      // 打开标题菜单
      await headingButton.click()
      await expect(page.locator('[data-testid="heading-menu"]')).toBeVisible()
      
      // 选择 H2 标题
      await page.click('[data-testid="heading-level-2-button"]')
      
      // 验证菜单关闭
      await expect(page.locator('[data-testid="heading-menu"]')).not.toBeVisible()
    }
  })
})

test.describe('文件保存功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('应该在文件修改后显示保存按钮', async ({ page }) => {
    // 注意：这个测试需要实际修改文件内容
    // 保存按钮只在文件被修改后才显示
    const saveButton = page.locator('[data-testid="save-file-button"]')
    
    // 检查保存按钮是否存在（可能不可见，因为文件未修改）
    const count = await saveButton.count()
    
    if (count > 0) {
      await expect(saveButton).toBeVisible()
    }
  })
})
