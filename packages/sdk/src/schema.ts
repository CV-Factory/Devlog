import { z } from "zod";

/**
 * DevlogSession (v1) Schema
 * 정규화된 대화 세션 데이터 구조
 */

export const DevlogContentSchema = z.union([
  z.object({ type: z.literal("text"), text: z.string() }),
  z.object({ type: z.literal("code"), lang: z.string(), text: z.string() }),
  z.object({
    type: z.literal("artifactRef"),
    kind: z.enum(["diff", "file", "image", "url"]),
    ref: z.string(),
  }),
]);

export const DevlogMessageSchema = z.object({
  id: z.string(),
  ts: z.string().datetime(), // ISO8601
  role: z.enum(["user", "assistant", "tool", "system"]),
  content: z.array(DevlogContentSchema),
  meta: z
    .object({
      toolName: z.string().optional(),
      toolInput: z.any().optional(),
      toolOutput: z.any().optional(),
    })
    .optional(),
});

export const DevlogArtifactSchema = z.object({
  kind: z.enum(["diff", "file", "image", "command", "log", "link"]),
  name: z.string(),
  contentType: z.string(),
  content: z.string().optional(),
  uri: z.string().optional(),
  createdAt: z.string().datetime(),
});

export const PostArtifactSchema = z.object({
  frontmatter: z.object({
    title: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    tags: z.array(z.string()),
    draft: z.boolean(),
  }),
  markdown: z.string(),
  assets: z.array(
    z.object({
      path: z.string(),
      contentType: z.string(),
      base64: z.string(),
    }),
  ),
});

export const DevlogSessionSchema = z.object({
  schemaVersion: z.literal("devlog.session.v1"),
  sessionId: z.string().uuid(),
  title: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  source: z.object({
    client: z.enum([
      "cursor",
      "windsurf",
      "vscode",
      "claude-code",
      "claude-desktop",
      "chatgpt",
      "unknown",
    ]),
    clientVersion: z.string().optional(),
    model: z.string().optional(),
    projectPath: z.string().optional(),
    repo: z
      .object({
        remote: z.string().optional(),
        branch: z.string().optional(),
        commit: z.string().optional(),
      })
      .optional(),
  }),
  tags: z.array(z.string()),
  audience: z.enum(["public", "internal", "private"]),
  redaction: z.object({
    applied: z.boolean(),
    policy: z.string(),
  }),
  messages: z.array(DevlogMessageSchema),
  artifacts: z.array(DevlogArtifactSchema),
  outputs: z
    .object({
      post: PostArtifactSchema,
    })
    .optional(),
});

export type DevlogContent = z.infer<typeof DevlogContentSchema>;
export type DevlogMessage = z.infer<typeof DevlogMessageSchema>;
export type DevlogArtifact = z.infer<typeof DevlogArtifactSchema>;
export type PostArtifact = z.infer<typeof PostArtifactSchema>;
export type DevlogSession = z.infer<typeof DevlogSessionSchema>;
