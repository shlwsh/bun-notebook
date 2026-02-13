import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright 配置文件
 * 用于端到端（E2E）和集成测试
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 测试目录
  testDir: './e2e',
  
  // 测试文件匹配模式
  testMatch: '**/*.spec.ts',
  
  // 最大失败次数（0 表示不限制）
  maxFailures: 0,
  
  // 并行执行的 worker 数量
  workers: process.env.CI ? 1 : undefined,
  
  // 失败时重试次数
  retries: process.env.CI ? 2 : 0,
  
  // 测试超时时间（30秒）
  timeout: 30 * 1000,
  
  // 全局超时时间（10分钟）
  globalTimeout: 10 * 60 * 1000,
  
  // 每个测试的 expect 超时时间
  expect: {
    timeout: 5000,
  },
  
  // 测试报告配置
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list'],
  ],
  
  // 全局设置
  use: {
    // 基础 URL（用于 page.goto('/') 等相对路径）
    baseURL: 'http://localhost:1420',
    
    // 浏览器上下文选项
    viewport: { width: 1280, height: 720 },
    
    // 操作超时时间
    actionTimeout: 10 * 1000,
    
    // 导航超时时间
    navigationTimeout: 30 * 1000,
    
    // 截图配置
    screenshot: 'only-on-failure',
    
    // 视频录制配置
    video: 'retain-on-failure',
    
    // 追踪配置（用于调试）
    trace: 'retain-on-failure',
  },
  
  // 测试项目配置（不同浏览器）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // webkit 在某些 macOS 版本上可能不支持，可以注释掉
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  
  // Web 服务器配置（自动启动开发服务器）
  webServer: {
    command: 'bun run vite:dev',
    url: 'http://localhost:1420',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
