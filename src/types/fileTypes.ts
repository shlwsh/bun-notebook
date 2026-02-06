export enum FileType {
  MARKDOWN = 'markdown',
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  TEXT = 'text',
  IMAGE = 'image',
  JSON = 'json',
  UNKNOWN = 'unknown'
}

export interface FileTypeConfig {
  extensions: string[];
  icon: string;
  color: string;
  editorMode: 'preview' | 'edit' | 'both';
  language?: string;
  supportsPreview: boolean;
}

export const FILE_TYPE_CONFIGS: Record<FileType, FileTypeConfig> = {
  [FileType.MARKDOWN]: {
    extensions: ['md', 'markdown'],
    icon: 'FileText',
    color: 'text-blue-400',
    editorMode: 'both',
    language: 'markdown',
    supportsPreview: true
  },
  [FileType.TYPESCRIPT]: {
    extensions: ['ts', 'tsx'],
    icon: 'FileCode',
    color: 'text-blue-500',
    editorMode: 'edit',
    language: 'typescript',
    supportsPreview: false
  },
  [FileType.JAVASCRIPT]: {
    extensions: ['js', 'jsx'],
    icon: 'FileCode',
    color: 'text-yellow-500',
    editorMode: 'edit',
    language: 'javascript',
    supportsPreview: false
  },
  [FileType.TEXT]: {
    extensions: ['txt', 'log'],
    icon: 'FileText',
    color: 'text-gray-400',
    editorMode: 'edit',
    supportsPreview: false
  },
  [FileType.JSON]: {
    extensions: ['json'],
    icon: 'FileJson',
    color: 'text-yellow-400',
    editorMode: 'edit',
    language: 'json',
    supportsPreview: false
  },
  [FileType.IMAGE]: {
    extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp'],
    icon: 'Image',
    color: 'text-green-400',
    editorMode: 'preview',
    supportsPreview: true
  },
  [FileType.UNKNOWN]: {
    extensions: [],
    icon: 'File',
    color: 'text-gray-500',
    editorMode: 'preview',
    supportsPreview: false
  }
};
