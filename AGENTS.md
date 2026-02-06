---
name: devlog-orchestrator-guide
description: Devlog 프로젝트의 오케스트레이터 에이전트 운영 가이드. MCP 기반 개발을 목표로 하며, 모노레포 구조와 SST 기술 스택을 기반으로 한다.
---

## 0. 현재 목표 및 핵심 결정

### 최종 목표

- 개발자↔에이전트 대화를 자동으로 블로그 프론트엔드용 컨텐츠로 가공하고 배포한다.
- 최대한 많은 에이전틱 IDE/에이전트 환경에서 동일한 워크플로우를 제공한다.

### 핵심 아키텍처 결정

- **TDD(Test-Driven Development) 필수**: 모든 개발 프로세스는 TDD를 중심축으로 한다. 테스트를 먼저 작성하고(Red), 이를 통과시키며(Green), 리팩터링(Refactor)하는 과정을 엄격히 준수한다.
- **테스트 설계 방법론 준수**: 모든 테스트 코드는 **EP-BVA(등가 분할/경계값 분석)**, **페어와이즈(Pairwise)**, **상태 전이(State Transition)** 방법론을 기반으로 설계되어야 한다.
- **병렬 코드 품질 검사(prek) 필수**: 모든 커밋 전 `prek`을 통한 병렬 코드 품질 검사 통과가 필수이다. `prek`은 Rust 기반의 고성능 훅 러너로, 동일 우선순위의 훅을 병렬로 실행하여 검증 시간을 단축한다. 검증 프로세스에는 **Biome**(Lint/Format), **Type-check**, **Knip**(Unused items), **Dependency-cruiser**, **Stryker**(Mutation testing)가 포함된다.
- **주요 언어**: 모든 MCP 서버 및 핵심 로직은 **TypeScript**를 기반으로 구현한다.
- **프론트엔드**: 블로그 프론트엔드는 **React**와 **Next.js**(App Router)를 사용한다.
- 대화 히스토리는 IDE 로컬 저장소를 읽지 않는다.
- 에이전트가 가진 현재 컨텍스트를 기반으로 결과물을 생성하고 외부로 내보낸다.
- 표준 수집 경로는 MCP 기반이며, 비MCP 환경을 위한 수동/CLI Import 경로를 병행한다.

### 표준 산출물 계약

- 모든 수집 단위는 `DevlogSession`(JSON) 하나로 정규화한다.
- 블로그 프론트엔드로 전달되는 최종 산출물은 `PostArtifact`(Markdown + assets + metadata)로 정규화한다.

### DevlogSession (v1) 스키마

```json
{
  "schemaVersion": "devlog.session.v1",
  "sessionId": "uuid",
  "title": "string",
  "createdAt": "2026-02-06T12:34:56.000Z",
  "updatedAt": "2026-02-06T13:10:00.000Z",
  "source": {
    "client": "cursor|windsurf|vscode|claude-code|claude-desktop|chatgpt|unknown",
    "clientVersion": "string?",
    "model": "string?",
    "projectPath": "string?",
    "repo": {
      "remote": "string?",
      "branch": "string?",
      "commit": "string?"
    }
  },
  "tags": ["string"],
  "audience": "public|internal|private",
  "redaction": {
    "applied": true,
    "policy": "string"
  },
  "messages": [
    {
      "id": "string",
      "ts": "2026-02-06T12:35:10.000Z",
      "role": "user|assistant|tool|system",
      "content": [
        { "type": "text", "text": "string" },
        { "type": "code", "lang": "string", "text": "string" },
        {
          "type": "artifactRef",
          "kind": "diff|file|image|url",
          "ref": "string"
        }
      ],
      "meta": {
        "toolName": "string?",
        "toolInput": "object?",
        "toolOutput": "object?"
      }
    }
  ],
  "artifacts": [
    {
      "kind": "diff|file|image|command|log|link",
      "name": "string",
      "contentType": "text/plain|text/markdown|application/json|image/png|...",
      "content": "string?",
      "uri": "string?",
      "createdAt": "2026-02-06T13:00:00.000Z"
    }
  ],
  "outputs": {
    "post": {
      "frontmatter": {
        "title": "string",
        "date": "2026-02-06",
        "tags": ["string"],
        "draft": false
      },
      "markdown": "string",
      "assets": [
        {
          "path": "string",
          "contentType": "string",
          "base64": "string"
        }
      ]
    }
  }
}
```

### PostArtifact 최소 요구사항

- `frontmatter.title`, `frontmatter.date` 존재
- `markdown`은 코드 블록 언어 태그 포함
- 이미지/첨부는 `assets[]`로 함께 제공

### MCP 도구 계약(권장)

- `devlog.captureSession({ session }) -> { stored: true, sessionId }`
- `devlog.renderPost({ sessionId | session }) -> { post: PostArtifact }`
- `devlog.previewPost({ post }) -> { previewUrl }`
- `devlog.publishPost({ post, target }) -> { url }`

### 비MCP Import 계약(필수)

- 에이전트가 최종 출력으로 `DevlogSession` JSON을 그대로 제공할 수 있어야 한다.
- 표준 포맷은 다음 코드 블록이다.

```json
{
  "schemaVersion": "devlog.session.v1",
  "sessionId": "...",
  "title": "...",
  "messages": []
}
```

## 1. 에이전트 운영 및 도구 사용 규정

### 핵심 가동 지침

- **작업 시작 시 반드시 `skills/` 디렉토리를 탐색한다.** 현재 수행하려는 작업과 연관된 SKILL.md가 있다면 이를 즉시 로드하고 해당 체크리스트를 작업의 SSOT(Single Source of Truth)로 삼는다.
- **MCP 표준 준수**: 모든 산출물은 MCP(Model Context Protocol) 규격을 준수해야 한다. 관련 프로토콜, 인터페이스 및 데이터 형식을 준수한다.
- **모노레포 구조 준수**: 모든 작업은 `packages/` 내의 적절한 패키지 범위에서 수행하며, 공통 로직은 `packages/sdk`를 활용한다.
- **환경 제약 해결**: MSVC 미설치, OS 라이브러리 부재 등 로컬 환경 제약은 `packages/containers/` 내의 Docker 설정을 참고하거나 Docker 기반으로 해결한다.
- 모든 기술적 의사결정 및 검증 절차는 개별 Skill 정의에 위임한다.

### 도구 사용 강제

- 코드 탐색은 code-index MCP만 사용한다. (`mcp_code-index_*`)
- 공식 문서 탐색은 Context7 MCP만 사용한다. (`mcp_context7_*`)
- 사고 과정(구조적 문제해결)은 Sequential Thinking MCP만 사용한다. (`mcp_Sequential_Thinking_sequentialthinking`)
- 브라우저 로그/네트워크 확인은 Chrome DevTools MCP만 사용한다. (`mcp_Chrome_DevTools_MCP_*`)

### 표준 언어 및 환경

- 최종 산출물/사용자 응대는 한국어를 표준으로 한다.
- Git 커밋 메시지 관례를 따르며, Windows PowerShell 환경에 최적화된 명령어를 사용한다.
- **비대화형 실행 필수**: Git 및 테스트 관련 명령어는 에이전트 환경에서 중단 없이 실행될 수 있도록 반드시 비대화형(Non-interactive) 모드로 실행한다.
  - Git: `git --no-pager`, `git commit -m "..."` (에디터 호출 금지)
  - 테스트: 테스트 실행 시 대화형 프롬프트가 발생하지 않도록 설정
- **SST 인프라**: 인프라 변경 시 `infra/` 디렉토리의 SST v3 설정을 준수한다.
- Docker Compose를 실행할 때는 `COMPOSE_MENU=false`로 비대화형을 강제한다.

## 2. 작업 프로세스 및 스킬 매핑

에이전트는 다음 작업 단계별로 명시된 기술 스킬을 적용해야 한다.

- **설계 및 아키텍처**: `skills/architecture-principles` (모노레포, MCP 표준 준수 반영)
- **로깅 및 예외 처리**: `skills/logging-policy`
- **코드 품질 및 검증**: `skills/prek-quality-gate` (Build Tool, Linter, MCP 표준 준수 반영)
- **변경 및 검증**: `skills/change-validation`, `skills/test-isolation`
- **Git 작업**: `skills/git-atomic-commit`, `skills/merge-conflict-resolution`
- **인프라 및 배포**: `skills/dockerfile-optimization` (컨테이너 설정 참고)
- **도커 환경 검증**: `skills/docker-validation`

## 3. 예외 및 품질 게이트

- 로컬 환경에서 검증이 불가능한 경우 반드시 `skills/docker-validation` 또는 도커 환경을 사용하여 검증을 완료한다.
- 모든 변경 사항은 최종적으로 `skills/prek-quality-gate` (devlog-quality-gate)를 통과해야 한다.
