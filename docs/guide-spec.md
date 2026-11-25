# Guide 페이지 명세 (`docs/guide-spec.md`)

> 공통 컴포넌트 UI Guide `/Guide`의 상세 명세입니다 (AGENTS.md 6.3절). 공통 규칙은 `AGENTS.md`를 따릅니다.

## 1. 작성 규칙

**목적 및 위치**

- `/Guide`는 퍼블리싱 공통 컴포넌트의 Props, 상태, 이벤트, 사용 예제를 확인하는 독립 페이지입니다.
- 파일: `src/pages/Guide.tsx`. 일반 서비스 Header/Footer를 적용하지 않습니다.
- 기존 `Guide.tsx`의 마크업·클래스명을 우선 재사용하며, 컴포넌트가 추가되면 가이드 항목도 함께 갱신합니다.
- 스타일은 **`src/assets/css/guide.css`**에 작성하며 Guide 전용 클래스(`.guideWrap`, `.guide*`)만 사용합니다. `Guide.tsx`에서 전용 CSS를 import하고 `common.css`에 Guide 전용 스타일을 작성하지 않습니다.

**기본 화면 구조 (참고 템플릿)**

```text
.guideWrap
├── aside.guideSide
│   ├── h1.guideLogo
│   └── nav.guideNav → a[href="#섹션ID"]
└── main.guideContent
    ├── .guideHead → 제목 / 소개
    └── section.guideSection#섹션ID (반복)
        ├── .guideTitle → 구분 / 컴포넌트명 / 파일 경로
        └── .guideItem (반복)
            ├── .guideItemHead → 제목 / 설명
            └── .guidePreview → Props 표 / 실제 UI / 예제 코드
```

**가이드 작성 기준**

- 컴포넌트별 섹션을 만들고 왼쪽 메뉴 앵커와 섹션 `id`를 동일하게 연결합니다.
- 각 섹션에는 필요한 항목만 작성합니다: **Props 표**(`Props / Type / Default / Description`), **상태·이벤트**, **실제 UI 예제**, **사용 코드**.
- 기존 클래스 `.guideTable`, `.guideFlex`, `.guideCode`, `.guideItem` 등을 재사용합니다.
- `GuideItem`은 `title`, 선택적 `desc`, `children`을 받는 공통 블록으로 사용합니다.
- 컴포넌트 Props와 예제는 실제 구현을 확인하여 작성하며 존재하지 않는 옵션을 만들지 않습니다.
- 기존 섹션 예: `button`, `input`, `checkbox`, `radiobox`, `select`, `tabs`, `modal`, `table`.
- React 컴포넌트는 AGENTS.md 5.1절의 `const` 화살표 함수 및 파일 마지막 `export default` 규칙을 따릅니다.

**왼쪽 메뉴 활성화 및 접근성**

- 최초 진입 시 URL 해시와 일치하는 메뉴를 활성화하며, 해시가 없으면 첫 번째 메뉴를 활성화합니다.
- 메뉴 클릭 시 해당 섹션으로 부드럽게 이동하고 선택된 링크에 `on` 클래스를 적용합니다.
- 직접 스크롤할 때도 현재 섹션에 맞춰 활성 메뉴를 변경합니다. 활성 메뉴는 항상 하나만 유지합니다.
- 기존 `<a href="#섹션ID">`를 유지하고 Tab·Enter 조작, `:focus-visible` 포커스 표시를 지원합니다.
- 활성 링크에는 `aria-current="location"`을 적용합니다.
- 스크롤 감지는 `IntersectionObserver` 등을 사용하되 이벤트 및 Observer를 정리합니다.
- 활성 메뉴 스타일은 `guide.css`의 `.guideWrap .guideNav a.on`에서 관리합니다.

**페이지 생성 시 IA 및 Guide 등록 (필수)**

- **Guide 페이지 자체는 `/Ia`의 필수 고정 등록 항목이며, 항상 목록의 최상단에 배치합니다.** 최초 프로젝트 구성부터 `src/pages/Guide.tsx`와 `/Guide` 라우트를 만들고, `src/data/iaData.ts`의 `IA_TABLES`에 `Guide` 페이지를 반드시 등록합니다. 공통 컴포넌트 추가 여부와 무관하게 항상 유지합니다.

- `src/pages/`에 새 페이지를 생성하면 **같은 작업에서 IA 화면 목록에도 해당 페이지를 추가**합니다.
- IA 목록은 `src/data/iaData.ts`의 `IA_TABLES`를 기준으로 관리하고, 화면명·경로·진행 상태를 실제 라우트와 일치시킵니다. 기존 IA 화면 구조 및 스타일은 변경하지 않습니다.
- 새 페이지에서 **재사용 가능한 공통 컴포넌트를 신규 작성하거나 기존 공통 컴포넌트의 Props·사용법을 변경했다면** `/Guide`에 해당 컴포넌트의 메뉴와 섹션, Props·사용 예제를 추가하거나 갱신합니다.
- 페이지 자체를 Guide에 중복 등록하지 않습니다. **IA는 페이지 목록, Guide는 공통 컴포넌트 설명**을 관리합니다.
- 단순 페이지 생성으로 Guide 변경이 필요하지 않다면 작업 결과에 `Guide 변경 없음(공통 컴포넌트 변경 없음)`이라고 명시합니다.
- IA·Guide 갱신도 해당 작업의 완료 조건에 포함하며, 누락된 경우 완료 처리하지 않습니다.

## 2. UI Guide CSS 원본 (`src/assets/css/guide.css`)

- 아래는 Guide CSS 원본 전체입니다. 디자인 수치는 변경하지 않습니다.
- `Guide.tsx`에서 `guide.css`를 import합니다. 이 원본은 `.guideSide` 등 독립 클래스 선택자를 포함하므로, 다른 페이지와 충돌하지 않도록 Guide 전용 클래스명을 다른 페이지에서 사용하지 않습니다.
- 왼쪽 메뉴의 `on` 상태 및 키보드 포커스는 아래 원본에 없는 추가 동작이므로, 기존 원본 규칙을 보존하면서 필요한 규칙만 별도로 덧붙입니다.

```css
.guideWrap {min-height: 100vh;background: #f6f7f9;color: #1d2129;}

/* sidebar */
.guideSide {position: fixed;left: 0;top: 0;width: 250px;height: 100vh;padding: 40px 28px;box-sizing: border-box;background: #111318;color: #fff;}
.guideLogo { margin: 0 0 50px; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
.guideNav { display: flex; flex-direction: column; gap: 4px; }
.guideNav strong { margin: 26px 0 10px; color: #777e8c; font-size: 11px; letter-spacing: 1.2px; }
.guideNav a { display: block; padding: 9px 12px; border-radius: 8px; color: #b8bdc7; font-size: 14px; text-decoration: none; transition: 0.2s; }
.guideNav a:hover { background: rgba(255,255,255,0.08); color: #fff; }

.guideWrap .guideSide { display: flex; flex-direction: column; }
.guideWrap .guideLogo { flex: none; }
.guideWrap .guideNav { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; margin-right: -16px; padding-right: 12px; }
.guideWrap .guideNav > * { flex-shrink: 0; }

@supports not selector(::-webkit-scrollbar) {
    .guideWrap .guideNav { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.25) transparent; }
}
.guideWrap .guideNav::-webkit-scrollbar { width: 4px; }
.guideWrap .guideNav::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
.guideWrap .guideNav::-webkit-scrollbar-track { background: transparent; }
.guideWrap .guideNav::-webkit-scrollbar-thumb { border-radius: 4px; background: rgba(255,255,255,0.25); }
.guideWrap .guideNav::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }

/* content */
.guideContent { margin-left: 250px; padding: 70px 70px 150px; }
.guideHead { margin-bottom: 70px; }
.guideBadge { display: inline-flex; align-items: center; height: 26px; padding: 0 10px; border-radius: 20px; background: #111318; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
.guideHead h2 { margin: 18px 0 10px; font-size: 42px; line-height: 1.2; letter-spacing: -1.5px; }
.guideHead p { margin: 0; color: #777; font-size: 15px; }

/* section */
.guideSection { margin-top: 60px; padding-top: 20px; }
.guideTitle { display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid #dadde3; }
.guideCategory { display: block; margin-bottom: 7px; color: #8a8f99; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
.guideTitle h3 { margin: 0; font-size: 30px; letter-spacing: -0.8px; }
.guidePath { color: #999; font-family: monospace; font-size: 12px; }

/* item */
.guideItem { margin-top: 26px; overflow: hidden; border: 1px solid #e1e3e8; border-radius: 14px; background: #fff; }
.guideItemHead { padding: 20px 24px; border-bottom: 1px solid #eeeeef; }
.guideItemHead strong { display: block; font-size: 15px; }
.guideItemHead p { margin: 6px 0 0; color: #888; font-size: 13px; }
.guidePreview { display: flex; flex-direction: column; gap: 18px; padding: 34px; }

/* util */
.guideFlex { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.guideFlex.alignEnd { align-items: flex-end; }

/* props table */
.guideTableWrap { overflow: hidden; border: 1px solid #e5e7eb; border-radius: 10px; }
.guideTable { width: 100%; border-collapse: collapse; }
.guideTable th { padding: 13px 16px; background: #f7f8fa; color: #666; font-size: 12px; font-weight: 600; text-align: left; }
.guideTable td { padding: 14px 16px; border-top: 1px solid #eee; color: #555; font-size: 13px; }
.guideTable code { padding: 3px 6px; border-radius: 5px; background: #f1f3f5; color: #333; font-size: 12px; }

/* code */
.guideCode { overflow-x: auto; margin: 0; padding: 22px; border-radius: 10px; background: #17191e; color: #e9ebef; font-family: Consolas, monospace; font-size: 13px; line-height: 1.7; }
.guideValues { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.guideValues code { display: inline-flex; align-items: center; min-height: 24px; padding: 2px 8px; border: 1px solid #e1e4e8; border-radius: 5px; background: #f6f8fa; color: #555; font-size: 11px; }

/* guide Input */
.guideInputList { display: flex; flex-direction: column; gap: 12px; }
```

**완료 기준**

- [ ] 메뉴와 섹션 ID가 일치하며 클릭·스크롤 시 `on` 클래스가 올바르게 변경된다.
- [ ] Tab·Enter로 메뉴를 사용할 수 있고 포커스가 보인다.
- [ ] 가이드 예제가 실제 공통 컴포넌트 Props·동작과 일치한다.
- [ ] Guide CSS는 `guide.css`에서만 관리하며 일반 페이지 및 IA에 영향을 주지 않는다.
- [ ] `/Ia`에 `Guide` 항목이 항상 표시되고 클릭 시 `/Guide`가 열린다.
- [ ] 새 페이지 생성 시 IA 등록 여부를 확인하고, 공통 컴포넌트 변경 시 Guide를 갱신한다.
