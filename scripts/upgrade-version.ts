#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface VersionInfo {
  version: string;
  changelog: Array<{
    version: string;
    date: string;
    changes: string;
  }>;
}

function parseVersion(version: string): { major: number; minor: number; date: string; build: number } {
  // Ver:1.0.yyyymmdd.###
  const match = version.match(/Ver:(\d+)\.(\d+)\.(\d{8})\.(\d{3})/);
  if (!match) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    date: match[3],
    build: parseInt(match[4])
  };
}

function generateNewVersion(currentVersion: string): string {
  const parsed = parseVersion(currentVersion);
  const today = new Date();
  const dateStr = today.getFullYear().toString() + 
                  (today.getMonth() + 1).toString().padStart(2, '0') + 
                  today.getDate().toString().padStart(2, '0');
  
  let newBuild = 1;
  if (parsed.date === dateStr) {
    newBuild = parsed.build + 1;
  }
  
  return `Ver:${parsed.major}.${parsed.minor}.${dateStr}.${newBuild.toString().padStart(3, '0')}`;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

async function upgradeVersion(changeDescription: string) {
  const versionFilePath = join(process.cwd(), 'version.json');
  
  try {
    const content = readFileSync(versionFilePath, 'utf-8');
    const versionInfo: VersionInfo = JSON.parse(content);
    
    const newVersion = generateNewVersion(versionInfo.version);
    const today = new Date();
    
    versionInfo.version = newVersion;
    versionInfo.changelog.unshift({
      version: newVersion,
      date: formatDate(today),
      changes: changeDescription
    });
    
    writeFileSync(versionFilePath, JSON.stringify(versionInfo, null, 2));
    
    console.log(`✅ Version upgraded successfully!`);
    console.log(`📦 New version: ${newVersion}`);
    console.log(`📝 Changes: ${changeDescription}`);
    console.log(`📅 Date: ${formatDate(today)}`);
  } catch (error) {
    console.error('❌ Error upgrading version:', error);
    process.exit(1);
  }
}

const changeDescription = process.argv[2];

if (!changeDescription) {
  console.error('❌ Please provide a change description');
  console.error('Usage: bun run upgrade "版本变更内容"');
  process.exit(1);
}

upgradeVersion(changeDescription);
