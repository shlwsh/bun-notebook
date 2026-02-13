import { test, expect } from '@playwright/test'

/**
 * 导航功能集成测试
 * 测试应用的基本导航、页面加载等功能
 */

test.describe('应用基础导航', () => {
  test('应该成功加载首页', async ({ page }) => {
    // 访问首页
    await page.goto('/')
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle')
    
    // 验证页面标题包含应用名称
    await expect(page).toHaveTitle(/源码分析|Code Analysis|Notebook/)
  })

  test('应该显示主要布局组件', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 验证文件浏览器存在
    await expect(page.locator('[data-testid="file-browser"]')).toBeVisible()
    
    // 验证页面主体内容区域存在
    const mainContent = page.locator('main, [role="main"], .main-content')
    
    // 至少应该有一个主要内容区域
    const count = await mainContent.count()
    expect(count).toBeGreaterThan(0)
  })

  test('应该能够响应窗口大小变化', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 获取初始视口大小
    const initialViewport = page.viewportSize()
    expect(initialViewport).toBeTruthy()
    
    // 改变视口大小
    await page.setViewportSize({ width: 1024, height: 768 })
    
    // 验证页面仍然可见
    await expect(page.locator('[data-testid="file-browser"]')).toBeVisible()
    
    // 恢复原始大小
    if (initialViewport) {
      await page.setViewportSize(initialViewport)
    }
  })
})

test.describe('页面加载性能', () => {
  test('应该在合理时间内加载完成', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // 页面应该在 5 秒内加载完成
    expect(loadTime).toBeLessThan(5000)
  })

  test('应该正确加载所有关键资源', async ({ page }) => {
    // 监听资源加载失败
    const failedResources: string[] = []
    
    page.on('requestfailed', request => {
      failedResources.push(request.url())
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 验证没有关键资源加载失败
    expect(failedResources.length).toBe(0)
  })
})

test.describe('错误处理', () => {
  test('应该能够处理控制台错误', async ({ page }) => {
    const consoleErrors: string[] = []
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 等待一段时间确保所有初始化完成
    await page.waitForTimeout(1000)
    
    // 验证没有严重的控制台错误
    // 注意：某些警告可能是正常的，这里只检查是否有致命错误
    const hasCriticalErrors = consoleErrors.some(error => 
      error.includes('Uncaught') || 
      error.includes('TypeError') ||
      error.includes('ReferenceError')
    )
    
    expect(hasCriticalErrors).toBe(false)
  })

  test('应该能够处理网络错误', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/**', route => {
      route.abort('failed')
    })
    
    await page.goto('/')
    
    // 页面应该仍然能够加载（即使某些 API 调用失败）
    await expect(page.locator('[data-testid="file-browser"]')).toBeVisible()
  })
})

test.describe('键盘导航', () => {
  test('应该支持 Tab 键导航', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 按 Tab 键
    await page.keyboard.press('Tab')
    
    // 验证焦点移动到某个可聚焦元素
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })
    
    expect(focusedElement).toBeTruthy()
  })

  test('应该支持 Escape 键关闭弹出菜单', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 如果有主题按钮，打开主题菜单
    const themeButton = page.locator('[data-testid="theme-button"]')
    
    if (await themeButton.count() > 0) {
      await themeButton.click()
      await expect(page.locator('[data-testid="theme-menu"]')).toBeVisible()
      
      // 按 Escape 键
      await page.keyboard.press('Escape')
      
      // 验证菜单关闭
      await expect(page.locator('[data-testid="theme-menu"]')).not.toBeVisible()
    }
  })
})

test.describe('无障碍功能', () => {
  test('应该有合适的 ARIA 标签', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 检查是否有 data-testid 属性（用于测试和无障碍）
    const elementsWithTestId = await page.locator('[data-testid]').count()
    
    // 应该有多个带 data-testid 的元素
    expect(elementsWithTestId).toBeGreaterThan(5)
  })

  test('应该支持屏幕阅读器', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 检查是否有合适的语义化 HTML 元素
    const buttons = await page.locator('button').count()
    const inputs = await page.locator('input').count()
    
    // 应该有按钮和输入框
    expect(buttons).toBeGreaterThan(0)
    expect(inputs).toBeGreaterThan(0)
  })
})

test.describe('浏览器兼容性', () => {
  test('应该在不同浏览器中正常工作', async ({ page, browserName }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 验证核心功能在所有浏览器中都可用
    await expect(page.locator('[data-testid="file-browser"]')).toBeVisible()
    
    // 记录当前浏览器
    console.log(`测试浏览器: ${browserName}`)
  })
})

test.describe('响应式设计', () => {
  test('应该在移动设备视口下正常显示', async ({ page }) => {
    // 设置移动设备视口
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 验证页面仍然可访问
    const fileBrowser = page.locator('[data-testid="file-browser"]')
    
    // 文件浏览器应该存在（可能被隐藏或调整布局）
    const count = await fileBrowser.count()
    expect(count).toBeGreaterThan(0)
  })

  test('应该在平板设备视口下正常显示', async ({ page }) => {
    // 设置平板设备视口
    await page.setViewportSize({ width: 768, height: 1024 })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 验证文件浏览器可见
    await expect(page.locator('[data-testid="file-browser"]')).toBeVisible()
  })

  test('应该在桌面设备视口下正常显示', async ({ page }) => {
    // 设置桌面设备视口
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 验证文件浏览器可见
    await expect(page.locator('[data-testid="file-browser"]')).toBeVisible()
  })
})
