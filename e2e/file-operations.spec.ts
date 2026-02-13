import { test, expect } from '@playwright/test'

/**
 * 文件操作功能集成测试
 * 测试文件浏览、搜索、创建等核心功能
 */

test.describe('文件浏览器功能', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('应该显示文件浏览器', async ({ page }) => {
    // 验证文件浏览器存在
    await expect(page.locator('[data-testid="file-browser"]')).toBeVisible()
    
    // 验证文件浏览器头部存在
    await expect(page.locator('[data-testid="file-browser-header"]')).toBeVisible()
    
    // 验证搜索区域存在
    await expect(page.locator('[data-testid="search-area"]')).toBeVisible()
  })

  test('应该能够搜索文件', async ({ page }) => {
    // 定位搜索输入框
    const searchInput = page.locator('[data-testid="file-search-input"]')
    
    // 输入搜索关键词
    await searchInput.fill('README')
    
    // 验证搜索输入框的值
    await expect(searchInput).toHaveValue('README')
    
    // 验证清除按钮出现
    await expect(page.locator('[data-testid="clear-search-button"]')).toBeVisible()
  })

  test('应该能够清除搜索', async ({ page }) => {
    const searchInput = page.locator('[data-testid="file-search-input"]')
    
    // 输入搜索关键词
    await searchInput.fill('test')
    await expect(searchInput).toHaveValue('test')
    
    // 点击清除按钮
    await page.click('[data-testid="clear-search-button"]')
    
    // 验证搜索框已清空
    await expect(searchInput).toHaveValue('')
    
    // 验证清除按钮消失
    await expect(page.locator('[data-testid="clear-search-button"]')).not.toBeVisible()
  })

  test('应该能够切换 Markdown 过滤', async ({ page }) => {
    const filterButton = page.locator('[data-testid="filter-md-button"]')
    
    // 点击过滤按钮
    await filterButton.click()
    
    // 验证按钮状态变化（通过 class 判断）
    await expect(filterButton).toHaveClass(/bg-blue-600/)
    
    // 再次点击取消过滤
    await filterButton.click()
    
    // 验证按钮恢复原状
    await expect(filterButton).not.toHaveClass(/bg-blue-600/)
  })

  test('应该能够展开和折叠所有文件夹', async ({ page }) => {
    // 点击展开所有按钮
    await page.click('[data-testid="expand-all-button"]')
    
    // 等待一小段时间让动画完成
    await page.waitForTimeout(300)
    
    // 点击折叠所有按钮
    await page.click('[data-testid="collapse-all-button"]')
    
    // 等待一小段时间让动画完成
    await page.waitForTimeout(300)
  })

  test('应该能够刷新文件树', async ({ page }) => {
    const refreshButton = page.locator('[data-testid="refresh-button"]')
    
    // 点击刷新按钮
    await refreshButton.click()
    
    // 验证刷新按钮存在（可能会有旋转动画）
    await expect(refreshButton).toBeVisible()
  })
})

test.describe('文件创建功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('应该能够显示新建文件输入框', async ({ page }) => {
    // 点击新建文件按钮
    await page.click('[data-testid="new-file-button"]')
    
    // 验证新建文件输入面板显示
    await expect(page.locator('[data-testid="new-file-input-panel"]')).toBeVisible()
    
    // 验证输入框存在
    await expect(page.locator('[data-testid="new-file-name-input"]')).toBeVisible()
    
    // 验证创建按钮存在
    await expect(page.locator('[data-testid="create-file-button"]')).toBeVisible()
    
    // 验证取消按钮存在
    await expect(page.locator('[data-testid="cancel-new-file-button"]')).toBeVisible()
  })

  test('应该能够取消新建文件', async ({ page }) => {
    // 点击新建文件按钮
    await page.click('[data-testid="new-file-button"]')
    
    // 验证输入面板显示
    await expect(page.locator('[data-testid="new-file-input-panel"]')).toBeVisible()
    
    // 点击取消按钮
    await page.click('[data-testid="cancel-new-file-button"]')
    
    // 验证输入面板消失
    await expect(page.locator('[data-testid="new-file-input-panel"]')).not.toBeVisible()
  })

  test('应该能够显示新建文件夹输入框', async ({ page }) => {
    // 点击新建文件夹按钮
    await page.click('[data-testid="new-folder-button"]')
    
    // 验证新建文件夹输入面板显示
    await expect(page.locator('[data-testid="new-folder-input-panel"]')).toBeVisible()
    
    // 验证输入框存在
    await expect(page.locator('[data-testid="new-folder-name-input"]')).toBeVisible()
    
    // 验证创建按钮存在
    await expect(page.locator('[data-testid="create-folder-button"]')).toBeVisible()
    
    // 验证取消按钮存在
    await expect(page.locator('[data-testid="cancel-new-folder-button"]')).toBeVisible()
  })

  test('应该能够取消新建文件夹', async ({ page }) => {
    // 点击新建文件夹按钮
    await page.click('[data-testid="new-folder-button"]')
    
    // 验证输入面板显示
    await expect(page.locator('[data-testid="new-folder-input-panel"]')).toBeVisible()
    
    // 点击取消按钮
    await page.click('[data-testid="cancel-new-folder-button"]')
    
    // 验证输入面板消失
    await expect(page.locator('[data-testid="new-folder-input-panel"]')).not.toBeVisible()
  })

  test('新建文件和新建文件夹应该互斥', async ({ page }) => {
    // 点击新建文件按钮
    await page.click('[data-testid="new-file-button"]')
    await expect(page.locator('[data-testid="new-file-input-panel"]')).toBeVisible()
    
    // 点击新建文件夹按钮
    await page.click('[data-testid="new-folder-button"]')
    
    // 验证新建文件面板消失
    await expect(page.locator('[data-testid="new-file-input-panel"]')).not.toBeVisible()
    
    // 验证新建文件夹面板显示
    await expect(page.locator('[data-testid="new-folder-input-panel"]')).toBeVisible()
  })
})

test.describe('文件浏览器工具栏', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('应该显示所有工具栏按钮', async ({ page }) => {
    // 验证所有主要按钮都存在
    await expect(page.locator('[data-testid="filter-md-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="expand-all-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="collapse-all-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="new-file-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="new-folder-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="refresh-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="open-folder-button"]')).toBeVisible()
  })

  test('应该显示当前文件夹名称', async ({ page }) => {
    const folderName = page.locator('[data-testid="current-folder-name"]')
    
    // 验证文件夹名称元素存在
    await expect(folderName).toBeVisible()
    
    // 验证有文本内容（可能是"资源管理器"或实际文件夹名）
    const text = await folderName.textContent()
    expect(text).toBeTruthy()
  })
})
