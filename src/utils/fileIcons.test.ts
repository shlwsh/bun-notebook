import { describe, it, expect } from 'vitest';
import {
  getFileIcon,
  getFileIconColor,
  getFolderIcon,
  getEditorLanguage,
  isCodeFile,
  isTextFile
} from './fileIcons';

describe('fileIcons', () => {
  describe('getFileIcon', () => {
    it('应该返回 TypeScript 文件图标', () => {
      expect(getFileIcon('test.ts')).toBe('FileCode');
      expect(getFileIcon('Component.tsx')).toBe('FileCode');
    });

    it('应该返回 JavaScript 文件图标', () => {
      expect(getFileIcon('script.js')).toBe('FileCode');
      expect(getFileIcon('App.jsx')).toBe('FileCode');
    });

    it('应该返回 Markdown 文件图标', () => {
      expect(getFileIcon('README.md')).toBe('FileText');
    });

    it('应该返回文本文件图标', () => {
      expect(getFileIcon('notes.txt')).toBe('FileText');
    });

    it('应该返回 JSON 文件图标', () => {
      expect(getFileIcon('package.json')).toBe('FileJson');
    });

    it('应该返回图片文件图标', () => {
      expect(getFileIcon('photo.png')).toBe('Image');
      expect(getFileIcon('icon.jpg')).toBe('Image');
    });

    it('应该返回未知文件图标', () => {
      expect(getFileIcon('unknown.xyz')).toBe('File');
    });
  });

  describe('getFileIconColor', () => {
    it('应该返回 TypeScript 文件颜色', () => {
      expect(getFileIconColor('test.ts')).toBe('text-blue-500');
    });

    it('应该返回 JavaScript 文件颜色', () => {
      expect(getFileIconColor('script.js')).toBe('text-yellow-500');
    });

    it('应该返回 Markdown 文件颜色', () => {
      expect(getFileIconColor('README.md')).toBe('text-blue-400');
    });

    it('应该返回文本文件颜色', () => {
      expect(getFileIconColor('notes.txt')).toBe('text-gray-400');
    });

    it('应该返回 JSON 文件颜色', () => {
      expect(getFileIconColor('package.json')).toBe('text-yellow-400');
    });

    it('应该返回图片文件颜色', () => {
      expect(getFileIconColor('photo.png')).toBe('text-green-400');
    });
  });

  describe('getFolderIcon', () => {
    it('应该返回打开的文件夹图标', () => {
      expect(getFolderIcon(true)).toBe('FolderOpen');
    });

    it('应该返回关闭的文件夹图标', () => {
      expect(getFolderIcon(false)).toBe('Folder');
    });
  });

  describe('getEditorLanguage', () => {
    it('应该返回 TypeScript 语言模式', () => {
      expect(getEditorLanguage('test.ts')).toBe('typescript');
    });

    it('应该返回 JavaScript 语言模式', () => {
      expect(getEditorLanguage('script.js')).toBe('javascript');
    });

    it('应该返回 Markdown 语言模式', () => {
      expect(getEditorLanguage('README.md')).toBe('markdown');
    });

    it('应该返回 JSON 语言模式', () => {
      expect(getEditorLanguage('package.json')).toBe('json');
    });

    it('应该对不支持的文件返回 undefined', () => {
      expect(getEditorLanguage('notes.txt')).toBeUndefined();
      expect(getEditorLanguage('photo.png')).toBeUndefined();
    });
  });

  describe('isCodeFile', () => {
    it('应该识别代码文件', () => {
      expect(isCodeFile('test.ts')).toBe(true);
      expect(isCodeFile('script.js')).toBe(true);
      expect(isCodeFile('package.json')).toBe(true);
    });

    it('应该识别非代码文件', () => {
      expect(isCodeFile('README.md')).toBe(false);
      expect(isCodeFile('notes.txt')).toBe(false);
      expect(isCodeFile('photo.png')).toBe(false);
    });
  });

  describe('isTextFile', () => {
    it('应该识别文本文件', () => {
      expect(isTextFile('README.md')).toBe(true);
      expect(isTextFile('test.ts')).toBe(true);
      expect(isTextFile('script.js')).toBe(true);
      expect(isTextFile('notes.txt')).toBe(true);
      expect(isTextFile('package.json')).toBe(true);
    });

    it('应该识别非文本文件', () => {
      expect(isTextFile('photo.png')).toBe(false);
      expect(isTextFile('unknown.xyz')).toBe(false);
    });
  });
});
