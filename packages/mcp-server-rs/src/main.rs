mod schema;

use rmcp::{RoleServer, ServerHandler, ServiceExt, model::*, service::RequestContext};
use schema::DevlogSession;
use serde_json::json;
use std::sync::Arc;
use tokio::io::{stdin, stdout};

struct DevlogServer;

impl ServerHandler for DevlogServer {
    fn get_info(&self) -> InitializeResult {
        InitializeResult {
            protocol_version: ProtocolVersion::V_2024_11_05,
            server_info: Implementation {
                name: "devlog-server-rs".into(),
                version: "0.1.0".into(),
                icons: None,
                title: None,
                website_url: None,
            },
            instructions: None,
            capabilities: ServerCapabilities::builder().enable_tools().build(),
        }
    }

    async fn list_tools(
        &self,
        _params: Option<PaginatedRequestParams>,
        _context: RequestContext<RoleServer>,
    ) -> Result<ListToolsResult, rmcp::ErrorData> {
        let tools = vec![
            Tool {
                name: "captureSession".into(),
                description: Some(
                    "현재 대화 세션을 DevlogSession 포맷으로 수집하여 저장합니다.".into(),
                ),
                input_schema: Arc::new(
                    serde_json::from_value(json!({
                        "type": "object",
                        "properties": {
                            "session": { "type": "object", "description": "DevlogSession 객체" }
                        },
                        "required": ["session"]
                    }))
                    .unwrap(),
                ),
                annotations: None,
                icons: None,
                meta: None,
                title: None,
                output_schema: None,
            },
            Tool {
                name: "renderPost".into(),
                description: Some(
                    "수집된 세션을 바탕으로 블로그 포스트(PostArtifact)를 렌더링합니다.".into(),
                ),
                input_schema: Arc::new(
                    serde_json::from_value(json!({
                        "type": "object",
                        "properties": {
                            "sessionId": { "type": "string", "description": "세션 ID" }
                        },
                        "required": ["sessionId"]
                    }))
                    .unwrap(),
                ),
                annotations: None,
                icons: None,
                meta: None,
                title: None,
                output_schema: None,
            },
        ];

        Ok(ListToolsResult {
            tools,
            next_cursor: None,
            meta: None,
        })
    }

    async fn call_tool(
        &self,
        params: CallToolRequestParams,
        _context: RequestContext<RoleServer>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        let tool_name = params.name.to_string();
        match tool_name.as_str() {
            "captureSession" => {
                let session_json = params.arguments.and_then(|mut args| args.remove("session"));
                if let Some(session_val) = session_json {
                    match serde_json::from_value::<DevlogSession>(session_val) {
                        Ok(session) => Ok(CallToolResult {
                            content: vec![Annotated::new(
                                RawContent::text(format!(
                                    "Session captured successfully: {} ({})",
                                    session.session_id, session.title
                                )),
                                None,
                            )],
                            is_error: Some(false),
                            meta: None,
                            structured_content: None,
                        }),
                        Err(e) => Err(rmcp::ErrorData::invalid_params(
                            format!("Invalid session format: {}", e),
                            None,
                        )),
                    }
                } else {
                    Err(rmcp::ErrorData::invalid_params(
                        "Missing 'session' argument",
                        None,
                    ))
                }
            }
            "renderPost" => Ok(CallToolResult {
                content: vec![Annotated::new(
                    RawContent::text("Post rendered (Rust stub)"),
                    None,
                )],
                is_error: Some(false),
                meta: None,
                structured_content: None,
            }),
            _ => Err(rmcp::ErrorData::method_not_found::<CallToolRequestMethod>()),
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let server = DevlogServer;
    let transport = (stdin(), stdout());

    // Start the server
    let _ = server.serve(transport).await?;

    Ok(())
}
