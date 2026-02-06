/**
 * DevlogSession (v1) Schema
 * 정규화된 대화 세션 데이터 구조
 */

export interface DevlogSession {
  schemaVersion: "devlog.session.v1";
  sessionId: string;
  title: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  source: {
    client: "cursor" | "windsurf" | "vscode" | "claude-code" | "claude-desktop" | "chatgpt" | "unknown";
    clientVersion?: string;
    model?: string;
    projectPath?: string;
    repo?: {
      remote?: string;
      branch?: string;
      commit?: string;
    };
  };
  tags: string[];
  audience: "public" | "internal" | "private";
  redaction: {
    applied: boolean;
    policy: string;
  };
  messages: DevlogMessage[];
  artifacts: DevlogArtifact[];
  outputs?: {
    post: PostArtifact;
  };
}

export interface DevlogMessage {
  id: string;
  ts: string; // ISO8601
  role: "user" | "assistant" | "tool" | "system";
  content: DevlogContent[];
  meta?: {
    toolName?: string;
    toolInput?: any;
    toolOutput?: any;
  };
}

export type DevlogContent =
  | { type: "text"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "artifactRef"; kind: "diff" | "file" | "image" | "url"; ref: string };

export interface DevlogArtifact {
  kind: "diff" | "file" | "image" | "command" | "log" | "link";
  name: string;
  contentType: string;
  content?: string;
  uri?: string;
  createdAt: string; // ISO8601
}

export interface PostArtifact {
  frontmatter: {
    title: string;
    date: string; // YYYY-MM-DD
    tags: string[];
    draft: boolean;
  };
  markdown: string;
  assets: {
    path: string;
    contentType: string;
    base64: string;
  }[];
}
