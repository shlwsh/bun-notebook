import { detectFileType, getFileTypeConfig } from './fileTypeDetector';
import { FileType } from '../types/fileTypes';

/**
 * 获取文件图标名称
 * @param fileName 文件名
 * @returns Lucide 图标名称
 */
export function getFileIcon(fileName: string): string {
  const config = getFileTypeConfig(fileName);
  return config.icon;
}

/**
 * 获取文件图标颜色类名
 * @param fileName 文件名
 * @returns Tailwind CSS 颜色类名
 */
export function getFileIconColor(fileName: string): string {
  const config = getFileTypeConfig(fileName);
  return config.color;
}

/**
 * 获取文件夹图标
 * @param isOpen 文件夹是否展开
 * @returns 图标名称
 */
export function getFolderIcon(isOpen: boolean): string {
  return isOpen ? 'FolderOpen' : 'Folder';
}

/**
 * 根据文件类型获取编辑器语言模式
 * @param fileName 文件名
 * @returns 编辑器语言模式
 */
export function getEditorLanguage(fileName: string): string | undefined {
  const config = getFileTypeConfig(fileName);
  return config.language;
}

/**
 * 检查是否为代码文件
 * @param fileName 文件名
 * @returns 是否为代码文件
 */
export function isCodeFile(fileName: string): boolean {
  const fileType = detectFileType(fileName);
  return [
    FileType.TYPESCRIPT,
    FileType.JAVASCRIPT,
    FileType.JSON
  ].includes(fileType);
}

/**
 * 检查是否为文本文件
 * @param fileName 文件名
 * @returns 是否为文本文件
 */
export function isTextFile(fileName: string): boolean {
  const fileType = detectFileType(fileName);
  return [
    FileType.MARKDOWN,
    FileType.TYPESCRIPT,
    FileType.JAVASCRIPT,
    FileType.TEXT,
    FileType.JSON
  ].includes(fileType);
}
