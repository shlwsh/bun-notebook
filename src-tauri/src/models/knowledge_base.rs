use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

/// 知识库
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KnowledgeBase {
    pub id: String,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub document_count: usize,
}

/// 文档
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Document {
    pub id: String,
    pub kb_id: String,
    pub path: String,
    pub title: String,
    pub content: String,
    pub chunks: Vec<Chunk>,
    pub metadata: DocumentMetadata,
    pub created_at: DateTime<Utc>,
}

/// 文本块
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Chunk {
    pub id: String,
    pub content: String,
    pub start_line: usize,
    pub end_line: usize,
    pub headings: Vec<String>,
}

/// 文档元数据
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DocumentMetadata {
    pub word_count: usize,
    pub line_count: usize,
    pub headings: Vec<HeadingInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub keywords: Option<Vec<String>>,
}

/// 标题信息
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HeadingInfo {
    pub level: u8,
    pub text: String,
    pub line: usize,
}

/// 生成请求
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateRequest {
    pub kb_id: String,
    pub generate_type: GenerateType,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub topic: Option<String>,
}

/// 生成类型
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum GenerateType {
    Summary,
    PptOutline,
    TopicReport,
}

/// 生成结果
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateResult {
    pub success: bool,
    pub output_path: String,
    pub content: String,
}

/// AI 配置
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AiConfig {
    pub provider: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub api_key: Option<String>,
    pub base_url: String,
    pub model: String,
    pub max_tokens: u32,
    pub temperature: f32,
}

impl Default for AiConfig {
    fn default() -> Self {
        Self {
            provider: "openai".to_string(),
            api_key: None,
            base_url: "https://api.openai.com/v1".to_string(),
            model: "gpt-4o".to_string(),
            max_tokens: 4096,
            temperature: 0.7,
        }
    }
}
