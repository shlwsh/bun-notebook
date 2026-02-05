use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
    pub path: String,
    pub name: String,
    pub matches: Vec<SearchMatch>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchMatch {
    pub line_number: usize,
    pub content: String,
}

#[tauri::command]
pub async fn search_content(root_path: String, query: String) -> Result<Vec<SearchResult>, String> {
    if query.is_empty() {
        return Ok(Vec::new());
    }

    let query_lower = query.to_lowercase();
    let root = Path::new(&root_path);
    let mut results = Vec::new();

    search_recursive(root, &query_lower, &mut results)?;

    Ok(results)
}

fn search_recursive(
    path: &Path,
    query: &str,
    results: &mut Vec<SearchResult>,
) -> Result<(), String> {
    if path.is_dir() {
        for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let p = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();

            if name.starts_with('.')
                || name == "node_modules"
                || name == "target"
                || name == "dist"
                || name == "build"
            {
                continue;
            }

            search_recursive(&p, query, results)?;
        }
    } else if path.extension().map_or(false, |ext| ext == "md") {
        let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
        let mut matches = Vec::new();

        for (idx, line) in content.lines().enumerate() {
            if line.to_lowercase().contains(query) {
                matches.push(SearchMatch {
                    line_number: idx,
                    content: line.trim().to_string(),
                });
            }
        }

        if !matches.is_empty() {
            results.push(SearchResult {
                path: path.to_string_lossy().to_string(),
                name: path
                    .file_name()
                    .map_or("".to_string(), |f| f.to_string_lossy().to_string()),
                matches,
            });
        }
    }
    Ok(())
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FileNode {
    pub name: String,
    pub path: String,
    pub is_directory: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub children: Option<Vec<FileNode>>,
}

fn read_dir_recursive(path: &Path, depth: i32) -> Result<Vec<FileNode>, String> {
    if depth < 0 {
        return Ok(Vec::new());
    }

    let entries = match fs::read_dir(path) {
        Ok(e) => e,
        Err(_) => return Ok(Vec::new()),
    };

    let mut nodes = Vec::new();

    for entry in entries {
        let entry = match entry {
            Ok(e) => e,
            Err(_) => continue,
        };
        let path_buf = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();

        if name.starts_with('.')
            || name == "node_modules"
            || name == "target"
            || name == "dist"
            || name == "build"
        {
            continue;
        }

        if path_buf.is_dir() {
            let children = read_dir_recursive(&path_buf, depth - 1)?;
            // Keep folder even if empty, unless we want to filter empty ones? 
            // User said "show all subfolders", implies structure matters more than content.
            nodes.push(FileNode {
                name,
                path: path_buf.to_string_lossy().to_string(),
                is_directory: true,
                children: Some(children),
            });
        } else {
            // Include all files
            nodes.push(FileNode {
                name,
                path: path_buf.to_string_lossy().to_string(),
                is_directory: false,
                children: None,
            });
        }
    }

    // 目录在前，文件在后，按字母排序
    nodes.sort_by(|a, b| match (a.is_directory, b.is_directory) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(nodes)
}

#[tauri::command]
pub async fn read_directory_tree(path: String) -> Result<Vec<FileNode>, String> {
    let root = Path::new(&path);
    if !root.exists() {
        return Err("路径不存在".to_string());
    }
    read_dir_recursive(root, 10)
}

#[tauri::command]
pub async fn read_file_content(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn write_file_content(path: String, content: String) -> Result<(), String> {
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_dir(path: String) -> Result<(), String> {
    fs::create_dir_all(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn save_binary_file(path: String, data: Vec<u8>) -> Result<(), String> {
    fs::write(path, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn export_markdown(path: String, content: String, format: String, is_content_html: Option<bool>) -> Result<(), String> {
    let output_path = Path::new(&path);
    let is_html = is_content_html.unwrap_or(false);

    let html_content = if is_html {
        content
    } else {
        markdown::to_html(&content)
    };

    match format.as_str() {
        "html" => {
            let full_html = format!(
                r#"<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{{font-family:sans-serif;line-height:1.6;padding:2em;max-width:800px;margin:auto;}}pre{{background:#f4f4f4;padding:1em;border-radius:4px;}}code{{font-family:monospace;}}blockquote{{border-left:4px solid #ddd;padding-left:1em;color:#666;}}table{{border-collapse:collapse;width:100%;margin-bottom:1em;}}th,td{{border:1px solid #ddd;padding:8px;text-align:left;}}th{{background-color:#f2f2f2;}}img{{max-width:100%;}}</style></head><body>{}</body></html>"#,
                html_content
            );
            fs::write(output_path, full_html).map_err(|e| e.to_string())?;
        },
        "docx" | "doc" => {
            // 实现一个兼容 Word 的 HTML 导出格式（Word 可以直接打开带 HTML 标记的 .doc 文件）
            let word_html = format!(
                r#"<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset='utf-8'><title>Export</title>
                <style>
                  body {{ font-family: Arial, sans-serif; }}
                  table {{ border-collapse: collapse; width: 100%; margin-bottom: 15px; }}
                  th, td {{ border: 1px solid #000; padding: 5px 10px; text-align: left; }}
                  th {{ background-color: #f2f2f2; }}
                  img {{ max-width: 100%; height: auto; }}
                  pre {{ background: #f4f4f4; padding: 10px; border: 1px solid #ddd; }}
                </style>
                </head>
                <body>{}</body></html>"#,
                html_content
            );
            fs::write(output_path, word_html).map_err(|e| e.to_string())?;
        },
        _ => return Err(format!("目前后端暂不支持 {} 格式的自动转换，PDF 导出请使用预览页面的打印按钮并选择'另存为 PDF'。", format)),
    }

    Ok(())
}

#[tauri::command]
pub async fn create_new_file(path: String) -> Result<(), String> {
    if Path::new(&path).exists() {
        return Err("文件已经存在".to_string());
    }
    fs::write(path, "").map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn copy_file(src: String, dest: String) -> Result<(), String> {
    fs::copy(src, dest).map(|_| ()).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn rename_file(src: String, dest: String) -> Result<(), String> {
    fs::rename(src, dest).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_file(path: String) -> Result<(), String> {
    if Path::new(&path).is_dir() {
        fs::remove_dir_all(path).map_err(|e| e.to_string())
    } else {
        fs::remove_file(path).map_err(|e| e.to_string())
    }
}

// 保留基础的项目历史管理
use crate::services::history_service::HistoryService;

#[tauri::command]
pub async fn get_project_history() -> Result<Vec<String>, String> {
    HistoryService::load_history()
}

#[tauri::command]
pub async fn add_project_to_history(path: String) -> Result<(), String> {
    HistoryService::add_to_history(&path)
}

#[tauri::command]
pub async fn clear_project_history() -> Result<(), String> {
    HistoryService::clear_history()
}

// 知识库相关命令
use crate::models::{Document, KnowledgeBase};
use crate::services::knowledge_base_service::KnowledgeBaseService;

#[tauri::command]
pub async fn create_knowledge_base(
    name: String,
    description: Option<String>,
) -> Result<KnowledgeBase, String> {
    let service = KnowledgeBaseService::new()?;
    service.create_knowledge_base(name, description)
}

#[tauri::command]
pub async fn list_knowledge_bases() -> Result<Vec<KnowledgeBase>, String> {
    let service = KnowledgeBaseService::new()?;
    service.list_knowledge_bases()
}

#[tauri::command]
pub async fn get_knowledge_base(id: String) -> Result<Option<KnowledgeBase>, String> {
    let service = KnowledgeBaseService::new()?;
    service.get_knowledge_base(&id)
}

#[tauri::command]
pub async fn delete_knowledge_base(id: String) -> Result<(), String> {
    let service = KnowledgeBaseService::new()?;
    service.delete_knowledge_base(&id)
}

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

#[tauri::command]
pub async fn get_documents(kb_id: String) -> Result<Vec<Document>, String> {
    let service = KnowledgeBaseService::new()?;
    service.get_documents(&kb_id)
}

#[tauri::command]
pub async fn delete_document(doc_id: String) -> Result<(), String> {
    let service = KnowledgeBaseService::new()?;
    service.delete_document(&doc_id)
}
