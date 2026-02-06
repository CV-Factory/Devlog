import type { DevlogSession, PostArtifact } from "./schema.js";

/**
 * DevlogSession을 블로그 포스트용 PostArtifact로 변환합니다.
 */
export function renderPost(session: DevlogSession): PostArtifact {
  const date = session.createdAt.split("T")[0];

  let markdown = `# ${session.title}\n\n`;

  for (const message of session.messages) {
    const roleName = message.role === "user" ? "Developer" : "AI Agent";
    markdown += `### ${roleName}\n\n`;

    for (const content of message.content) {
      if (content.type === "text") {
        markdown += `${content.text}\n\n`;
      } else if (content.type === "code") {
        markdown += `\`\`\`${content.lang}\n${content.text}\n\`\`\`\n\n`;
      }
    }
  }

  return {
    frontmatter: {
      title: session.title,
      date,
      tags: session.tags,
      draft: false,
    },
    markdown: markdown.trim(),
    assets: [],
  };
}
