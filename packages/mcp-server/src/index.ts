import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Devlog MCP Server
 * 대화 세션 수집 및 블로그 포스트 렌더링/배포 도구 제공
 */
const server = new Server(
  {
    name: "devlog-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * 도구 목록 정의
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "captureSession",
        description: "현재 대화 세션을 DevlogSession 포맷으로 수집하여 저장합니다.",
        inputSchema: {
          type: "object",
          properties: {
            session: { type: "object", description: "DevlogSession 객체" },
          },
          required: ["session"],
        },
      },
      {
        name: "renderPost",
        description: "수집된 세션을 바탕으로 블로그 포스트(PostArtifact)를 렌더링합니다.",
        inputSchema: {
          type: "object",
          properties: {
            sessionId: { type: "string", description: "세션 ID" },
          },
          required: ["sessionId"],
        },
      },
      {
        name: "previewPost",
        description: "렌더링된 포스트의 미리보기 URL을 제공합니다.",
        inputSchema: {
          type: "object",
          properties: {
            post: { type: "object", description: "PostArtifact 객체" },
          },
          required: ["post"],
        },
      },
      {
        name: "publishPost",
        description: "포스트를 최종 대상(블로그)으로 발행합니다.",
        inputSchema: {
          type: "object",
          properties: {
            post: { type: "object", description: "PostArtifact 객체" },
            target: { type: "string", description: "발행 대상 (예: github, aws)" },
          },
          required: ["post", "target"],
        },
      },
    ],
  };
});

/**
 * 도구 실행 핸들러
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "captureSession":
      return { content: [{ type: "text", text: "Session captured (stub)" }] };
    case "renderPost":
      return { content: [{ type: "text", text: "Post rendered (stub)" }] };
    case "previewPost":
      return { content: [{ type: "text", text: "Preview URL: http://localhost:3000/preview (stub)" }] };
    case "publishPost":
      return { content: [{ type: "text", text: "Post published to " + args?.target + " (stub)" }] };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

/**
 * 서버 실행
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Devlog MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
