//! 知识库存储服务
//! 使用 JSON 文件存储知识库数据

use crate::models::{Chunk, Document, DocumentMetadata, HeadingInfo, KnowledgeBase};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use uuid::Uuid;

/// 存储数据结构
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
struct StorageData {
    knowledge_bases: Vec<KnowledgeBase>,
    documents: Vec<Document>,
}

/// 知识库存储服务
pub struct KnowledgeBaseService {
    storage_path: PathBuf,
}

impl KnowledgeBaseService {
    /// 创建服务实例
    pub fn new() -> Result<Self, String> {
        let storage_dir = dirs::data_dir()
            .ok_or("无法获取数据目录")?
            .join("bun-codeview")
            .join("knowledge_bases");

        fs::create_dir_all(&storage_dir).map_err(|e| e.to_string())?;

        Ok(Self {
            storage_path: storage_dir.join("kb_data.json"),
        })
    }

    /// 加载存储数据
    fn load_data(&self) -> Result<StorageData, String> {
        if !self.storage_path.exists() {
            return Ok(StorageData::default());
        }
        let content = fs::read_to_string(&self.storage_path).map_err(|e| e.to_string())?;
        serde_json::from_str(&content).map_err(|e| e.to_string())
    }

    /// 保存存储数据
    fn save_data(&self, data: &StorageData) -> Result<(), String> {
        let content = serde_json::to_string_pretty(data).map_err(|e| e.to_string())?;
        fs::write(&self.storage_path, content).map_err(|e| e.to_string())
    }

    /// 创建知识库
    pub fn create_knowledge_base(
        &self,
        name: String,
        description: Option<String>,
    ) -> Result<KnowledgeBase, String> {
        let mut data = self.load_data()?;
        let now = Utc::now();

        let kb = KnowledgeBase {
            id: Uuid::new_v4().to_string(),
            name,
            description,
            created_at: now,
            updated_at: now,
            document_count: 0,
        };

        data.knowledge_bases.push(kb.clone());
        self.save_data(&data)?;
        Ok(kb)
    }

    /// 列出所有知识库
    pub fn list_knowledge_bases(&self) -> Result<Vec<KnowledgeBase>, String> {
        let data = self.load_data()?;
        Ok(data.knowledge_bases)
    }

    /// 获取知识库详情
    pub fn get_knowledge_base(&self, id: &str) -> Result<Option<KnowledgeBase>, String> {
        let data = self.load_data()?;
        Ok(data.knowledge_bases.into_iter().find(|kb| kb.id == id))
    }

    /// 删除知识库
    pub fn delete_knowledge_base(&self, id: &str) -> Result<(), String> {
        let mut data = self.load_data()?;
        data.knowledge_bases.retain(|kb| kb.id != id);
        data.documents.retain(|doc| doc.kb_id != id);
        self.save_data(&data)
    }

    /// 导入文档到知识库
    pub fn import_document(&self, kb_id: &str, path: &str) -> Result<Document, String> {
        let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
        let file_name = std::path::Path::new(path)
            .file_stem()
            .map(|s| s.to_string_lossy().to_string())
            .unwrap_or_else(|| "Untitled".to_string());

        let (chunks, headings) = self.parse_markdown(&content);
        let metadata = DocumentMetadata {
            word_count: content.chars().filter(|c| !c.is_whitespace()).count(),
            line_count: content.lines().count(),
            headings,
            keywords: None,
        };

        let title = metadata
            .headings
            .first()
            .map(|h| h.text.clone())
            .unwrap_or(file_name);

        let doc = Document {
            id: Uuid::new_v4().to_string(),
            kb_id: kb_id.to_string(),
            path: path.to_string(),
            title,
            content,
            chunks,
            metadata,
            created_at: Utc::now(),
        };

        let mut data = self.load_data()?;
        data.documents.push(doc.clone());

        // 更新知识库文档计数
        if let Some(kb) = data.knowledge_bases.iter_mut().find(|kb| kb.id == kb_id) {
            kb.document_count = data.documents.iter().filter(|d| d.kb_id == kb_id).count();
            kb.updated_at = Utc::now();
        }

        self.save_data(&data)?;
        Ok(doc)
    }

    /// 获取知识库的所有文档
    pub fn get_documents(&self, kb_id: &str) -> Result<Vec<Document>, String> {
        let data = self.load_data()?;
        Ok(data
            .documents
            .into_iter()
            .filter(|doc| doc.kb_id == kb_id)
            .collect())
    }

    /// 删除文档
    pub fn delete_document(&self, doc_id: &str) -> Result<(), String> {
        let mut data = self.load_data()?;
        let kb_id = data
            .documents
            .iter()
            .find(|d| d.id == doc_id)
            .map(|d| d.kb_id.clone());

        data.documents.retain(|doc| doc.id != doc_id);

        // 更新知识库文档计数
        if let Some(kb_id) = kb_id {
            if let Some(kb) = data.knowledge_bases.iter_mut().find(|kb| kb.id == kb_id) {
                kb.document_count = data.documents.iter().filter(|d| d.kb_id == kb_id).count();
                kb.updated_at = Utc::now();
            }
        }

        self.save_data(&data)
    }

    /// 解析 Markdown 内容，提取标题和分块
    fn parse_markdown(&self, content: &str) -> (Vec<Chunk>, Vec<HeadingInfo>) {
        let mut chunks = Vec::new();
        let mut headings = Vec::new();
        let mut current_headings: Vec<String> = Vec::new();
        let mut chunk_start = 0;
        let mut chunk_content = String::new();
        let lines: Vec<&str> = content.lines().collect();

        for (idx, line) in lines.iter().enumerate() {
            // 检测标题
            if let Some(heading) = self.parse_heading(line) {
                // 保存之前的块
                if !chunk_content.trim().is_empty() {
                    chunks.push(Chunk {
                        id: Uuid::new_v4().to_string(),
                        content: chunk_content.trim().to_string(),
                        start_line: chunk_start,
                        end_line: idx.saturating_sub(1),
                        headings: current_headings.clone(),
                    });
                }

                headings.push(HeadingInfo {
                    level: heading.0,
                    text: heading.1.clone(),
                    line: idx,
                });

                // 更新当前标题层级
                let level = heading.0 as usize;
                if level <= current_headings.len() {
                    current_headings.truncate(level - 1);
                }
                current_headings.push(heading.1);

                chunk_start = idx;
                chunk_content = String::new();
            }

            chunk_content.push_str(line);
            chunk_content.push('\n');

            // 每 500 行或遇到分隔符时分块
            if chunk_content.len() > 2000 || line.starts_with("---") {
                if !chunk_content.trim().is_empty() {
                    chunks.push(Chunk {
                        id: Uuid::new_v4().to_string(),
                        content: chunk_content.trim().to_string(),
                        start_line: chunk_start,
                        end_line: idx,
                        headings: current_headings.clone(),
                    });
                }
                chunk_start = idx + 1;
                chunk_content = String::new();
            }
        }

        // 保存最后一个块
        if !chunk_content.trim().is_empty() {
            chunks.push(Chunk {
                id: Uuid::new_v4().to_string(),
                content: chunk_content.trim().to_string(),
                start_line: chunk_start,
                end_line: lines.len().saturating_sub(1),
                headings: current_headings,
            });
        }

        (chunks, headings)
    }

    /// 解析标题行
    fn parse_heading(&self, line: &str) -> Option<(u8, String)> {
        let trimmed = line.trim_start();
        if !trimmed.starts_with('#') {
            return None;
        }

        let level = trimmed.chars().take_while(|c| *c == '#').count();
        if level > 6 || level == 0 {
            return None;
        }

        let text = trimmed[level..].trim().to_string();
        if text.is_empty() {
            return None;
        }

        Some((level as u8, text))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_heading() {
        let service = KnowledgeBaseService {
            storage_path: PathBuf::from("/tmp/test.json"),
        };

        assert_eq!(
            service.parse_heading("# Title"),
            Some((1, "Title".to_string()))
        );
        assert_eq!(
            service.parse_heading("## Section"),
            Some((2, "Section".to_string()))
        );
        assert_eq!(service.parse_heading("No heading"), None);
    }
}
