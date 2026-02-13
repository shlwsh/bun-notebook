import { test, expect } from '@playwright/test'

/**
 * 示例集成测试
 * 演示如何使用 Playwright 进行端到端测试
 */

test.describe('应用基础功能测试', () => {
  test('应该成功加载首页', async ({ page }) => {
    // 访问首页
    await page.goto('/')
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle')
    
    // 验证页面标题
    await expect(page).toHaveTitle(/源码分析系统|Code Analysis/)
  })
  
  test('应该能够打开文件浏览器', async ({ page }) => {
    await page.goto('/')
    
    // 查找并点击文件浏览器按钮（根据实际 UI 调整选择器）
    const fileExplorerButton = page.locator('[data-testid="file-explorer"]')
    if (await fileExplorerButton.isVisible()) {
      await fileExplorerButton.click()
      
      // 验证文件浏览器已打开
      await expect(page.locator('[data-testid="file-tree"]')).toBeVisible()
    }
  })
})

test.describe('导航功能测试', () => {
  test('应该能够在不同页面间导航', async ({ page }) => {
    await page.goto('/')
    
    // 测试路由导航（根据实际路由调整）
    // 示例：点击设置按钮
    const settingsButton = page.locator('[data-testid="settings-button"]')
    if (await settingsButton.isVisible()) {
      await settingsButton.click()
      
      // 验证 URL 变化
      await expect(page).toHaveURL(/settings/)
    }
  })
})
