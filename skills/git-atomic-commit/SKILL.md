---
name: devlog-git-atomic-commit
description: Devlog 프로젝트의 Conventional Commits 관례에 따른 원자적 커밋 및 푸시 절차.
---

## When to Use

- 코드 변경 후 커밋 및 푸시 단계

## Rules

- **원자적 커밋**: 하나의 커밋은 하나의 논리적 변경(기능 추가, 버그 수정, 리팩터링 등)만 포함해야 한다.
- **Conventional Commits**: 커밋 메시지는 `type: description` 형식을 준수한다. (예: `feat: add mcp tool`, `fix: handle auth error`)
- **비대화형 실행**: `git` 명령어는 에디터나 페이저를 호출하지 않도록 실행한다.
  - 항상 `git --no-pager` 사용
  - 커밋 시 반드시 `-m` 옵션을 사용하여 대화형 에디터 호출 방지
- **변경 사항 검토**: `git diff --cached`를 통해 커밋될 내용을 최종 확인한다. (필요시 `--no-pager` 활용)

## Checklist

- **커밋 메시지 형식**: Conventional Commits 규약을 준수하는가?
- **품질 검증**: 커밋 전에 `devlog-quality-gate`를 통과해야 한다.
