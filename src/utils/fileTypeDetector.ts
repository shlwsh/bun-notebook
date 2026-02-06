import { FileType, FILE_TYPE_CONFIGS } from '../types/fileTypes';

/**
 * 根据文件路径检测文件类型
 * @param filePath 文件路径
 * @returns 文件类型枚举
 */
export function detectFileType(filePath: string): FileType {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  
  for (const [type, config] of Object.entries(FILE_TYPE_CONFIGS)) {
    if (config.extensions.includes(extension)) {
      return type as FileType;
    }
  }
  
  return FileType.UNKNOWN;
}

/**
 * 获取文件类型配置
 * @param filePath 文件路径
 * @returns 文件类型配置对象
 */
export function getFileTypeConfig(filePath: string) {
  const fileType = detectFileType(filePath);
  return FILE_TYPE_CONFIGS[fileType];
}

/**
 * 检查文件是否支持编辑
 * @param filePath 文件路径
 * @returns 是否支持编辑
 */
export function isEditableFile(filePath: string): boolean {
  const config = getFileTypeConfig(filePath);
  return config.editorMode === 'edit' || config.editorMode === 'both';
}

/**
 * 检查文件是否支持预览
 * @param filePath 文件路径
 * @returns 是否支持预览
 */
export function isPreviewableFile(filePath: string): boolean {
  const config = getFileTypeConfig(filePath);
  return config.supportsPreview;
}

/**
 * 获取文件扩展名
 * @param filePath 文件路径
 * @returns 文件扩展名（小写）
 */
export function getFileExtension(filePath: string): string {
  return filePath.split('.').pop()?.toLowerCase() || '';
}
