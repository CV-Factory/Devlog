---
name: devlog-quality-gate
description: Devlog 프로젝트의 빌드 도구 기반 정적 분석 및 품질 게이트와 MCP 표준 준수 검증 절차.

## When to Use

- 코드 변경 후, 병합/커밋 전에 항상 수행

## Primary Gate

- **prek 병렬 검증 (필수)**: `prek run` 명령어를 통해 등록된 모든 품질 훅을 병렬로 실행하여 통과 여부를 확인한다.
- **TDD 준수 여부**: 변경된 기능에 대해 테스트가 먼저 작성되었으며, Red-Green-Refactor 사이클을 준수했는지 검증
- **테스트 설계 방법론 검증**: EP-BVA, 페어와이즈, 상태 전이 방법론이 적절히 적용되었는지 확인
- **정적 분석 및 품질 도구**:
    - **Biome**: Lint 및 Formatting 통합 검증
    - **Type-check**: 프로젝트 전체 TypeScript 타입 안정성 검사
    - **Knip**: 사용되지 않는 파일, 의존성, Export 항목 검출
    - **Dependency-cruiser**: 패키지 간 의존성 규칙 및 순환 참조 검증
- **Devlog 계약 스키마 검증**: `DevlogSession`/`PostArtifact` 스키마 및 예제 payload 검증 스크립트 실행 (존재하는 경우)
- **MCP 표준 준수 검사**: MCP 인터페이스 및 스키마 검증 스크립트 실행 (존재하는 경우)

## prek Configuration & Parallelism

`prek`은 동일한 `priority`를 가진 훅들을 병렬로 실행한다. 효율적인 검증을 위해 다음과 같이 우선순위를 구성한다:

- **Priority 0 (병렬 정적 분석)**:
    - `biome check` (Lint/Format)
    - `type-check` (tsc)
    - `knip` (Unused items)
    - `dep-cruise` (Dependency rules)
- **Priority 10 (병렬 테스트)**: `unit-test` (정적 분석 통과 후 실행)
- **Priority 20**: `e2e-test`, `contract-validation` (최종 검증)

## Monorepo Support

`prek`은 모노레포 구조를 기본적으로 지원한다. 각 패키지(`packages/*`)에 별도의 `.pre-commit-config.yaml`을 두거나, 루트 설정에서 `files` 필터를 사용하여 특정 패키지에만 훅을 적용할 수 있다. 하위 디렉토리의 설정이 루트 설정을 상속받지 않게 하려면 `orphan: true` 옵션을 사용한다.

실행 명령어:
```powershell
# 모든 훅 실행 (병렬)
prek run --all-files
```

## Required Outcome

- 모든 타입 오류가 해결되어야 함
- 포맷팅이 적용되어 변경 사항이 없어야 함
- 관련된 모든 유닛 테스트 및 E2E 테스트가 통과해야 함

## Testing Standards

- **E2E Testing**: 주요 사용자 시나리오를 검증하는 테스트를 수행한다.
- **Type Safety**: 동적 타입을 최소화하고, 모든 인터페이스와 타입을 명확히 정의한다.
- **CI Alignment**: CI 설정과 일치하는 검증 절차를 따른다.
