#!/usr/bin/env bun

import { readFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

interface VersionInfo {
  version: string;
  changelog: Array<{
    version: string;
    date: string;
    changes: string;
  }>;
}

/**
 * 将内部版本号格式转换为 Git tag 格式
 * Ver:1.0.20260206.007 -> v1.0.20260206.007
 */
function convertToGitTag(version: string): string {
  // 移除 "Ver:" 前缀，添加 "v" 前缀
  return version.replace(/^Ver:/, 'v');
}

/**
 * 执行 shell 命令
 */
function execCommand(command: string, args: string[]): { success: boolean; output: string } {
  const result = spawnSync(command, args, {
    encoding: 'utf-8',
    stdio: ['inherit', 'pipe', 'pipe']
  });
  
  return {
    success: result.status === 0,
    output: result.stdout || result.stderr || ''
  };
}

/**
 * 检查是否有未提交的更改
 */
function hasUncommittedChanges(): boolean {
  const result = execCommand('git', ['status', '--porcelain']);
  return result.output.trim().length > 0;
}

/**
 * 检查 tag 是否已存在
 */
function tagExists(tag: string): boolean {
  const result = execCommand('git', ['tag', '-l', tag]);
  return result.output.trim() === tag;
}

/**
 * 创建并推送 Git tag
 */
async function createAndPushTag() {
  console.log('🏷️  MD Notebook Git Tag 管理工具\n');
  
  // 读取版本信息
  const versionFilePath = join(process.cwd(), 'version.json');
  let versionInfo: VersionInfo;
  
  try {
    const content = readFileSync(versionFilePath, 'utf-8');
    versionInfo = JSON.parse(content);
  } catch (error) {
    console.error('❌ 无法读取 version.json 文件');
    console.error('   请确保文件存在且格式正确');
    process.exit(1);
  }
  
  const currentVersion = versionInfo.version;
  const gitTag = convertToGitTag(currentVersion);
  const latestChange = versionInfo.changelog[0];
  
  console.log(`📦 当前版本: ${currentVersion}`);
  console.log(`🏷️  Git Tag: ${gitTag}`);
  console.log(`📝 最新变更: ${latestChange.changes}`);
  console.log(`📅 变更日期: ${latestChange.date}\n`);
  
  // 检查是否有未提交的更改
  if (hasUncommittedChanges()) {
    console.log('⚠️  检测到未提交的更改');
    console.log('   建议先提交所有更改后再创建 tag\n');
    console.log('   运行以下命令提交更改：');
    console.log('   git add .');
    console.log('   git commit -m "your message"');
    console.log('   git push\n');
    
    const shouldContinue = prompt('是否继续创建 tag？(y/N): ');
    if (shouldContinue?.toLowerCase() !== 'y') {
      console.log('❌ 已取消');
      process.exit(0);
    }
  }
  
  // 检查 tag 是否已存在
  if (tagExists(gitTag)) {
    console.error(`❌ Tag ${gitTag} 已存在`);
    console.error('   如需重新创建，请先删除旧 tag：');
    console.error(`   git tag -d ${gitTag}`);
    console.error(`   git push origin :refs/tags/${gitTag}`);
    process.exit(1);
  }
  
  // 创建 tag
  console.log(`\n🔨 创建 tag: ${gitTag}...`);
  const createResult = execCommand('git', ['tag', '-a', gitTag, '-m', latestChange.changes]);
  
  if (!createResult.success) {
    console.error('❌ 创建 tag 失败');
    console.error(createResult.output);
    process.exit(1);
  }
  
  console.log('✅ Tag 创建成功');
  
  // 推送 tag
  console.log(`\n📤 推送 tag 到远程仓库...`);
  const pushResult = execCommand('git', ['push', 'origin', gitTag]);
  
  if (!pushResult.success) {
    console.error('❌ 推送 tag 失败');
    console.error(pushResult.output);
    console.error('\n💡 提示：如果是首次推送，请确保已配置远程仓库');
    console.error('   git remote add origin <repository-url>');
    process.exit(1);
  }
  
  console.log('✅ Tag 推送成功\n');
  
  // 显示后续步骤
  console.log('🎉 完成！GitHub Actions 将自动开始构建');
  console.log('\n📋 后续步骤：');
  console.log('   1. 访问 GitHub 仓库的 Actions 标签查看构建进度');
  console.log('   2. 构建完成后，在 Releases 页面查看发布草稿');
  console.log('   3. 编辑发布说明并正式发布\n');
  console.log(`🔗 GitHub Actions: https://github.com/<your-repo>/actions`);
  console.log(`🔗 Releases: https://github.com/<your-repo>/releases\n`);
}

// 执行主函数
createAndPushTag().catch((error) => {
  console.error('❌ 发生错误:', error);
  process.exit(1);
});
