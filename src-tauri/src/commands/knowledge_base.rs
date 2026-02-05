//! 知识库相关的 Tauri 命令

use crate::models::{Document, KnowledgeBase};
use crate::services::knowledge_base_service::KnowledgeBaseService;

/// 创建知识库
#[tauri::command]
pub async fn create_knowledge_base(
    name: String,
    description: Option<String>,
) -> Result<KnowledgeBase, String> {
    let service = KnowledgeBaseService::new()?;
    service.create_knowledge_base(name, description)
}

/// 列出所有知识库
#[tauri::command]
pub async fn list_knowledge_bases() -> Result<Vec<KnowledgeBase>, String> {
    let service = KnowledgeBaseService::new()?;
    service.list_knowledge_bases()
}

/// 获取知识库详情
#[tauri::command]
pub async fn get_knowledge_base(id: String) -> Result<Option<KnowledgeBase>, String> {
    let service = KnowledgeBaseService::new()?;
    service.get_knowledge_base(&id)
}

/// 删除知识库
#[tauri::command]
pub async fn delete_knowledge_base(id: String) -> Result<(), String> {
    let service = KnowledgeBaseService::new()?;
    service.delete_knowledge_base(&id)
}

/// 导入文档到知识库
#[tauri::command]
pub async fn import_documents(kb_id: String, paths: Vec<String>) -> Result<Vec<Document>, String> {
    let service = KnowledgeBaseService::new()?;
    let mut documents = Vec::new();

    for path in paths {
        match service.import_document(&kb_id, &path) {
            Ok(doc) => documents.push(doc),
            Err(e) => {
                log::warn!("导入文档失败 {}: {}", path, e);
            }
        }
    }

    Ok(documents)
}

/// 获取知识库的所有文档
#[tauri::command]
pub async fn get_documents(kb_id: String) -> Result<Vec<Document>, String> {
    let service = KnowledgeBaseService::new()?;
    service.get_documents(&kb_id)
}

/// 删除文档
#[tauri::command]
pub async fn delete_document(doc_id: String) -> Result<(), String> {
    let service = KnowledgeBaseService::new()?;
    service.delete_document(&doc_id)
}
