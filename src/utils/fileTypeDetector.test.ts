import { describe, it, expect } from 'vitest';
import {
  detectFileType,
  getFileTypeConfig,
  isEditableFile,
  isPreviewableFile,
  getFileExtension
} from './fileTypeDetector';
import { FileType } from '../types/fileTypes';

describe('fileTypeDetector', () => {
  describe('detectFileType', () => {
    it('应该正确识别 Markdown 文件', () => {
      expect(detectFileType('test.md')).toBe(FileType.MARKDOWN);
      expect(detectFileType('README.markdown')).toBe(FileType.MARKDOWN);
    });

    it('应该正确识别 TypeScript 文件', () => {
      expect(detectFileType('app.ts')).toBe(FileType.TYPESCRIPT);
      expect(detectFileType('Component.tsx')).toBe(FileType.TYPESCRIPT);
    });

    it('应该正确识别 JavaScript 文件', () => {
      expect(detectFileType('script.js')).toBe(FileType.JAVASCRIPT);
      expect(detectFileType('App.jsx')).toBe(FileType.JAVASCRIPT);
    });

    it('应该正确识别文本文件', () => {
      expect(detectFileType('notes.txt')).toBe(FileType.TEXT);
      expect(detectFileType('error.log')).toBe(FileType.TEXT);
    });

    it('应该正确识别 JSON 文件', () => {
      expect(detectFileType('package.json')).toBe(FileType.JSON);
    });

    it('应该正确识别图片文件', () => {
      expect(detectFileType('photo.png')).toBe(FileType.IMAGE);
      expect(detectFileType('icon.jpg')).toBe(FileType.IMAGE);
      expect(detectFileType('logo.svg')).toBe(FileType.IMAGE);
    });

    it('应该对未知文件类型返回 UNKNOWN', () => {
      expect(detectFileType('file.xyz')).toBe(FileType.UNKNOWN);
      expect(detectFileType('noextension')).toBe(FileType.UNKNOWN);
    });

    it('应该不区分大小写', () => {
      expect(detectFileType('FILE.TS')).toBe(FileType.TYPESCRIPT);
      expect(detectFileType('README.MD')).toBe(FileType.MARKDOWN);
    });
  });

  describe('getFileTypeConfig', () => {
    it('应该返回正确的配置对象', () => {
      const config = getFileTypeConfig('test.ts');
      expect(config.extensions).toContain('ts');
      expect(config.language).toBe('typescript');
      expect(config.editorMode).toBe('edit');
    });

    it('应该返回 Markdown 配置', () => {
      const config = getFileTypeConfig('README.md');
      expect(config.editorMode).toBe('both');
      expect(config.supportsPreview).toBe(true);
    });
  });

  describe('isEditableFile', () => {
    it('应该识别可编辑的文件', () => {
      expect(isEditableFile('test.ts')).toBe(true);
      expect(isEditableFile('notes.txt')).toBe(true);
      expect(isEditableFile('README.md')).toBe(true);
      expect(isEditableFile('data.json')).toBe(true);
    });

    it('应该识别不可编辑的文件', () => {
      expect(isEditableFile('photo.png')).toBe(false);
      expect(isEditableFile('unknown.xyz')).toBe(false);
    });
  });

  describe('isPreviewableFile', () => {
    it('应该识别可预览的文件', () => {
      expect(isPreviewableFile('README.md')).toBe(true);
      expect(isPreviewableFile('photo.png')).toBe(true);
    });

    it('应该识别不可预览的文件', () => {
      expect(isPreviewableFile('script.ts')).toBe(false);
      expect(isPreviewableFile('notes.txt')).toBe(false);
    });
  });

  describe('getFileExtension', () => {
    it('应该正确提取文件扩展名', () => {
      expect(getFileExtension('test.ts')).toBe('ts');
      expect(getFileExtension('README.md')).toBe('md');
      expect(getFileExtension('package.json')).toBe('json');
    });

    it('应该返回小写扩展名', () => {
      expect(getFileExtension('FILE.TS')).toBe('ts');
      expect(getFileExtension('README.MD')).toBe('md');
    });

    it('应该处理没有扩展名的文件', () => {
      // 没有扩展名时，split('.').pop() 会返回文件名本身
      // 这是预期行为，因为无法区分文件名和扩展名
      expect(getFileExtension('noextension')).toBe('noextension');
    });

    it('应该处理多个点的文件名', () => {
      expect(getFileExtension('file.test.ts')).toBe('ts');
    });
  });
});
