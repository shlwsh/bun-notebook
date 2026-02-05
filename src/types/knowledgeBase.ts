/**
 * 知识库相关类型定义
 */

/** 知识库 */
export interface KnowledgeBase {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    documentCount: number;
}

/** 文档 */
export interface Document {
    id: string;
    kbId: string;
    path: string;
    title: string;
    content: string;
    chunks: Chunk[];
    metadata: DocumentMetadata;
    createdAt: string;
}

/** 文本块 */
export interface Chunk {
    id: string;
    content: string;
    startLine: number;
    endLine: number;
    headings: string[];
}

/** 文档元数据 */
export interface DocumentMetadata {
    wordCount: number;
    lineCount: number;
    headings: HeadingInfo[];
    keywords?: string[];
}

/** 标题信息 */
export interface HeadingInfo {
    level: number;
    text: string;
    line: number;
}

/** 生成类型 */
export type GenerateType = 'summary' | 'pptOutline' | 'topicReport';

/** 生成请求 */
export interface GenerateRequest {
    kbId: string;
    generateType: GenerateType;
    topic?: string;
}

/** 生成结果 */
export interface GenerateResult {
    success: boolean;
    outputPath: string;
    content: string;
}

/** AI 配置 */
export interface AiConfig {
    provider: string;
    apiKey?: string;
    baseUrl: string;
    model: string;
    maxTokens: number;
    temperature: number;
}
