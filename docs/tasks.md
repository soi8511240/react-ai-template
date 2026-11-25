# 작업 목록 (Tasks)

> AI와 사람이 **지금 무엇을 할 차례인지** 확인하는 문서입니다.
> 위에서부터 순서대로 하나씩 진행하고, 끝나면 `[x]`로 체크합니다.
> 각 작업 옆의 `(US-xx)`는 `requirements.md`의 사용자 스토리 번호입니다.

---

## 진행 상태e
- **현재 단계**: Phase 1
- **다음 작업**: 1-1
- **막힌 부분**: 없음

---

## Phase 1. 프로젝트 세팅

- [ ] 1-1. Vite + React + TypeScript 프로젝트 생성 (`npm create vite@latest`)
- [ ] 1-2. `AGENTS.md`의 폴더 구조대로 폴더 생성
- [ ] 1-3. `types/index.ts`에 기본 타입 작성 (`design.md` 3번 기준)
- [ ] 1-4. 기본 템플릿 코드 정리 (Vite 예제 파일 삭제)
- [ ] 1-5. `npm run build` 통과 확인

## Phase 2. 공통 레이아웃

- [ ] 2-1. `Layout`, `Header`, `Footer` 구현
- [ ] 2-2. 모바일 메뉴 구현 (햄버거 버튼, 열기/닫기)
- [ ] 2-3. 라우팅 설정 (React Router)
- [ ] 2-4. 요구사항에 명시된 공통 컴포넌트만 구현

## Phase 3. 프로젝트별 페이지 및 관리 화면

- [ ] 3-1. `requirements.md`에 확정된 페이지 목록 및 라우트 구현
- [ ] 3-2. AGENTS.md에 정의된 IA 태그·구조·스타일 규칙을 기준으로 `/Ia` 페이지 및 `iaData.ts` 생성, CSS 적용
- [ ] 3-3. AGENTS.md에 정의된 Guide 태그·구조·스타일 규칙을 기준으로 `/Guide` 페이지 생성 및 전용 CSS 적용
- [ ] 3-4. `/Ia` 목록 최상단에 `/Guide` 등록 및 라우트 검증
- [ ] 3-5. 공통 컴포넌트 추가/수정 시 Guide Props·예제 동기화

## Phase 4. 마무리

- [ ] 4-1. 반응형 점검 (360px / 768px / 1024px)
- [ ] 4-2. 접근성 점검 (`alt`, 키보드 포커스)
- [ ] 4-3. 하드코딩된 색상, 텍스트를 변수와 상수로 정리
- [ ] 4-4. `console.log` 제거, `npm run lint` 통과
- [ ] 4-5. `npm run build` 최종 확인
- [ ] 4-6. 문서와 실제 코드가 일치하는지 확인 (requirements, design 업데이트)
- [ ] 4-7. IA(`src/data/iaData.ts`) 화면 목록·경로·상태가 실제 라우트와 tasks.md 완료 기록과 일치하는지 확인
- [ ] 4-8. `/guide` 최상단 등록, IA 필터·집계·미리보기, Guide 앵커·예제 및 CSS 격리 확인
- [ ] 4-9. `node scripts/check-project.mjs` 실행 후 결과 확인 (정적 보조 검사)

---

## 완료 기록

| 날짜 | 작업 | 메모 |
|---|---|---|
| {YYYY-MM-DD} | - | - |

## 나중에 할 것 (Backlog)

- [ ] 실제 API 연동
- [ ] 다크 모드
- [ ] {추가 아이디어}
