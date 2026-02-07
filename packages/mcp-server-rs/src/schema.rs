use chrono::{DateTime, Utc};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DevlogSession {
    pub schema_version: String,
    pub session_id: Uuid,
    pub title: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub source: SessionSource,
    pub tags: Vec<String>,
    pub audience: Audience,
    pub redaction: Redaction,
    pub messages: Vec<Message>,
    pub artifacts: Vec<Artifact>,
    pub outputs: SessionOutputs,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SessionSource {
    pub client: String,
    pub client_version: Option<String>,
    pub model: Option<String>,
    pub project_path: Option<String>,
    pub repo: Option<RepoInfo>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RepoInfo {
    pub remote: Option<String>,
    pub branch: Option<String>,
    pub commit: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "lowercase")]
pub enum Audience {
    Public,
    Internal,
    Private,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Redaction {
    pub applied: bool,
    pub policy: String,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Message {
    pub id: String,
    pub ts: DateTime<Utc>,
    pub role: MessageRole,
    pub content: Vec<MessageContent>,
    pub meta: Option<MessageMeta>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "lowercase")]
pub enum MessageRole {
    User,
    Assistant,
    Tool,
    System,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(tag = "type")]
pub enum MessageContent {
    #[serde(rename = "text")]
    Text { text: String },
    #[serde(rename = "code")]
    Code { lang: String, text: String },
    #[serde(rename = "artifactRef")]
    ArtifactRef {
        kind: String,
        #[serde(rename = "ref")]
        reference: String,
    },
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MessageMeta {
    pub tool_name: Option<String>,
    pub tool_input: Option<serde_json::Value>,
    pub tool_output: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Artifact {
    pub kind: String,
    pub name: String,
    pub content_type: String,
    pub content: Option<String>,
    pub uri: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SessionOutputs {
    pub post: PostArtifact,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PostArtifact {
    pub frontmatter: Frontmatter,
    pub markdown: String,
    pub assets: Vec<Asset>,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Frontmatter {
    pub title: String,
    pub date: String,
    pub tags: Vec<String>,
    pub draft: bool,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Asset {
    pub path: String,
    pub content_type: String,
    pub base64: String,
}
