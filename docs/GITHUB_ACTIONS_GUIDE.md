# GitHub Actions 自动化发布指南

本文档说明如何使用 GitHub Actions 实现 MD Notebook 的跨平台自动构建和发布。

## 📋 前提条件

### 1. 仓库设置

在 GitHub 仓库中进行以下设置：

1. 转到 **Settings > Actions > General**
2. 启用 "Allow all actions and reusable workflows"
3. 在 "Workflow permissions" 中选择 "Read and write permissions"

### 2. 代码签名（可选但推荐）

为了避免安全警告，建议配置代码签名：

#### 生成签名密钥

```bash
# 在项目根目录运行
cargo tauri signer generate --force
```

这会输出：
- 私钥（长字符串）
- 密码

#### 添加到 GitHub Secrets

1. 转到 **Settings > Secrets and variables > Actions**
2. 点击 "New repository secret"
3. 添加以下 secrets：
   - `TAURI_PRIVATE_KEY`: 粘贴私钥
   - `TAURI_KEY_PASSWORD`: 粘贴密码

## 🚀 发布流程

### 方式 1：通过 Git Tag 触发（推荐）

```bash
# 1. 更新版本号
bun run upgrade "发布 v1.0.0"

# 2. 提交更改
git add .
git commit -m "chore: 准备发布 v1.0.0"

# 3. 创建并推送 tag
git tag v1.0.0
git push origin v1.0.0
```

### 方式 2：手动触发

1. 转到 GitHub 仓库的 **Actions** 标签
2. 选择 "MD Notebook 跨平台发布" workflow
3. 点击 "Run workflow"
4. 选择分支并运行

## 📦 构建产物

构建成功后，会在 **Releases** 页面生成草稿，包含以下文件：

### macOS
- `MD_Notebook_x.x.x_x64.dmg` - Intel Mac 安装镜像
- `MD_Notebook_x.x.x_aarch64.dmg` - Apple Silicon 安装镜像

### Windows
- `MD_Notebook_x.x.x_x64-setup.exe` - 安装程序
- `MD_Notebook_x.x.x_x64_en-US.msi` - MSI 安装包

### Linux
- `md-notebook_x.x.x_amd64.deb` - Debian/Ubuntu 包
- `md-notebook_x.x.x_amd64.AppImage` - 通用 AppImage

## ⏱️ 构建时间

- 首次构建：约 15-25 分钟
- 后续构建：约 8-15 分钟（得益于缓存）

## 🔍 监控构建

1. 转到 **Actions** 标签
2. 点击最新的 workflow 运行
3. 查看各平台的构建日志
4. 如果失败，查看错误日志进行调试

## 📝 发布步骤

1. 构建完成后，转到 **Releases** 页面
2. 找到草稿 Release
3. 编辑发布说明，添加更新内容
4. 点击 "Publish release" 正式发布

## 🛠️ 自定义配置

### 修改触发条件

编辑 `.github/workflows/release.yml`：

```yaml
on:
  push:
    tags:
      - 'v*'  # 仅 tag 触发
  # 或添加分支触发
  push:
    branches:
      - main
```

### 只构建特定平台

修改 `matrix.include`，删除不需要的平台。

### 自动发布（不创建草稿）

将 `releaseDraft: true` 改为 `false`。

## ❓ 常见问题

### Linux 构建失败

确保安装了所有依赖，检查 "安装 Linux 依赖" 步骤。

### Bun 安装失败

可以回退到 npm：

```yaml
- name: 安装 Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
- run: npm install
- run: npm run build
```

### 构建超时

增加 runner 规格或优化代码大小。

## 📚 参考资源

- [Tauri Actions 文档](https://github.com/tauri-apps/tauri-action)
- [GitHub Actions 文档](https://docs.github.com/actions)
- [Bun 文档](https://bun.sh/docs)
