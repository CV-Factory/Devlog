---
name: devlog-change-validation
description: Devlog 프로젝트의 코드 변경 시 품질 게이트 수행 및 무결성 검증 절차.

## When to Use

- 기능 추가/버그 수정/리팩터링 등 코드 변경이 있는 모든 작업

## Workflow

### 1) 품질 게이트 (필수)

- `devlog-quality-gate`를 활성화하고 해당 절차(Build Tool, Typecheck, Formatter, Test, MCP Standards)를 수행하여 검증을 완료한다.

### 2) Devlog 계약 검증 (필수)

- 수집 단위가 `DevlogSession` 계약으로 정규화되었는지 확인한다.
- 렌더 결과가 `PostArtifact` 최소 요구사항(프론트매터/마크다운/에셋)을 만족하는지 확인한다.

### 3) 미리보기 및 배포 리허설 (권장)

- 가능하면 `preview`를 생성하여 링크/이미지/코드블록 렌더를 확인한다.
- 배포 target별 실패 모드와 롤백 경로를 확인한다.

### 4) 원자적 커밋 및 푸시 (필수)

- `git-atomic-commit` 스킬을 참고하여 변경 사항을 논리적 단위로 나누어 커밋한다.

## Completion Criteria

- 타입 체크 및 포맷팅 검증 통과
- 관련 테스트 통과
- `DevlogSession`/`PostArtifact` 계약 검증 완료
- 변경 내용이 논리적으로 커밋됨
