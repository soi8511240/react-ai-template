# AGENTS.md — 기본 프로젝트 AI 개발 가이드

> 이 파일은 프로젝트의 **AI 개발 규칙에 대한 단일 원본(SSOT)**입니다. AI 코딩 도구는 작업 전에 이 파일을 확인하며, 도구별 지침 파일(`CLAUDE.md` 등)은 이 문서를 참조하도록 설정합니다. (도구마다 자동 로딩 방식이 다르므로 자동 참조 여부를 확인합니다.)

---

## 1. 프로젝트 개요

- **이름:** 프로젝트 이름
- **설명:** 해당 프로젝트 설명
- **대상 사용자:** 모든 사용자
- **작업 범위:** **퍼블리싱 전용** React + TypeScript
- **문서 읽기 순서:** `docs/requirements.md` → `docs/design.md` → `docs/tasks.md`
- **작업별 추가 문서:** IA 작업은 `docs/ia-spec.md`, Guide 작업은 `docs/guide-spec.md`
- 문서가 없거나 내용이 불명확하면 가정하지 않고 사용자에게 확인합니다.
- **규칙 우선순위:** 공통 AI 에이전트에 사전 설정된 프롬프트·규칙 → 이 문서 → 개별 요청 순입니다. 충돌하면 임의로 선택하지 않고 차이를 보고합니다. 

## 2. 기술 스택 및 라이브러리  

| 구분 | 사용 기술 | 규칙 |
| --- | --- | --- |
| 빌드 | Vite | 기존 설정 유지 | 
| 프레임워크 | React 18+ | 함수형 컴포넌트와 Hooks | 
| 언어 | TypeScript | `strict: true` 기준 | 
| 스타일 | 일반 CSS | `common.css`, `ia.css`, `guide.css`만 사용 (5.3절) |
| 라우팅 | React Router | 페이지가 2개 이상일 때 사용 | 
| 상태 관리 | React 내장 API | `useState`, `useContext` 우선 | // 환경에따라 설정되나, 기능위주의 훅은 설정 불필요. 개발파트에서 관리 및 최적화 필요.
| 슬라이드 | Swiper | 슬라이드·캐러셀 구현 시 필수 | // swiper/react 사용은 프레임워크 확정 후 (5.6)
| 패키지 매니저 | npm | 기존 의존성 우선, 필요 시 요청 필수 |

**사용 금지**

- Tailwind CSS, SCSS, CSS Modules, styled-components, Emotion 등 다른 스타일 방식
- MUI, Ant Design 등 UI 컴포넌트 라이브러리
- Lucide, Font Awesome, React Icons 등 외부 아이콘 라이브러리
- 클래스형 React 컴포넌트, TypeScript `any` 
- 전역 상태 관리 라이브러리

**설치 정책**

- 기존에 설치된 라이브러리를 우선 사용합니다.
- **Swiper만 사전 승인**되어 있어 필요 시 `npm install swiper`로 설치할 수 있습니다.
- 그 외 신규 라이브러리는 이유와 영향 범위를 설명하고 승인받은 뒤 설치하며, 이 문서를 갱신합니다.

## 3. 주요 명령어 // 환경 미정: Vite/npm 기준, 확정 후 갱신

```bash
npm install       # 의존성 설치
npm run dev       # 개발 서버 (기본 http://localhost:5173, 실제 포트는 프로젝트 설정)
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 미리보기
npm run lint      # 린트 (스크립트가 정의된 경우)
```

- 작업 완료 시 `npm run build`로 확인하고, 실행하지 못했다면 그 사실을 명시합니다.

## 4. 프로젝트 폴더 구조

### 컴포넌트 레벨 // 안건 4: 레벨 구분과 관리 범위

<!-- 폴더는 **재사용 범위**로 나눕니다.  -->
폴더는 크기(Atoms, Molecules, Organisms)로 구분 합니다.

| 레벨 | 정의 | 위치 | 관리 |
| --- | --- | --- | --- |
| 공통 | 디자인 원본의 UI 유형과 1:1로 관리되는 컴포넌트 | `src/components/atomic/` | Guide 등록 필수 (역할·사용 조건 포함) |
| 도메인 | 특정 업무 영역에서만 공용으로 쓰는 컴포넌트 | `src/components/domain/` | Guide 등록 필수 (역할·사용 조건 포함) |
| 내부 | 하나의 컴포넌트 안에서만 쓰는 부품 | 상위 컴포넌트 파일 안 (별도 파일·폴더 없음) | 관리 대상 아님, Guide 미등록 |
<!-- | 공용 | 2곳 이상에서 쓰며, 디자인 원본의 UI 유형과 1:1로 관리되는 컴포넌트 | `src/components/common/` | Guide 등록 필수 (역할·사용 조건 포함) | // 환경 미정: 디자인 원본 형태 (Figma 전달 확률 낮음) -->
<!-- | 도메인 | 특정 업무 영역에서만 공용으로 쓰는 컴포넌트 | 필요할 때 승인 후 영역 폴더 추가 | Guide에 영역 표기 | -->

<!-- - 디자인과 코드의 1:1 관리는 **공용, 도메인 컴포넌트**에만 적용합니다. 합성 패턴은 관리되지 않습니다. 이름을 맞추는 것이 아니라, 디자인에 쓰이는 UI 유형이 Guide의 공용 컴포넌트에 빠짐없이 있고 그 반대도 성립하는 것을 뜻합니다. 개수는 달라도 되며,  -->
<!-- - 디자인의 변형은 코드에서 variant로 표현될 수 있습니다. -->
<!-- - **1회성 컴포넌트는 관리 대상에 두지 않습니다.** 1곳에서만 쓰는 UI는 해당 컴포넌트 파일 안에 작성합니다. (5.1) -->
<!-- - **서비스 페이지는 저장소에 남기지 않습니다.** 페이지는 작업자가 공용 컴포넌트를 조합해 구성하는 산출물이며 구성이 작업자마다 달라질 수 있습니다. // 안건 1 -->

**판단 기준**

- 역할이 같으면 → 기존 컴포넌트의 variant 또는 합성. 같은 역할 안에서 색상이나 크기만 다르면 variant로 처리합니다.
- 동작만 같으면 → 기반(primitive)만 공유하고 별도 컴포넌트로 생성합니다.
- 역할도 모양도 다르면 → 신규로 만들되, 가능하면 내부 컴포넌트로 둡니다.
- 예) 데이트피커 자체는 공용으로 관리하고, 팝업 안의 버튼은 기존 Button과 같은 역할이면 Button을 재사용합니다. 역할이나 동작이 다르면 데이트피커 파일 안의 내부 컴포넌트로 작성합니다.

**승격 규칙**

- 내부 컴포넌트가 다른 곳에서도 필요해지면 공용으로 승격하고 Guide에 등록합니다.
- 도메인 컴포넌트가 다른 업무 영역에서도 필요해지면 공용으로 승격합니다.

### 폴더 구조

```text

```text
src/   // 환경 미정: 파일 형식(.tsx/.ts)과 구성은 확정 후 갱신 / 안건 10: 환경 미정의 적용 범위
├── main.tsx                 # 진입점 (수정 최소화)  // 환경 미정
├── App.tsx                  # 라우팅  // 환경 미정
├── pages/                   # 관리 화면만 (서비스 페이지는 저장소에 두지 않음)
│   ├── Ia.tsx               # /Ia 관리 화면
│   └── Guide.tsx            # /Guide 관리 화면
├── components/
│   ├── common/              # 2곳 이상에서 쓰는 UI (파일 단위)
│   │   ├── Button.tsx
│   │   └── Slider.tsx
│   ├── <영역>/              # 도메인 컴포넌트 (필요할 때 승인 후 추가)
│   └── layout/              # 공통 레이아웃
│       ├── Layout.tsx       # #siteWrap, common.css import  // 환경 미정
│       ├── Header.tsx
│       └── Footer.tsx
├── hooks/                   # 커스텀 훅 (useXxx.ts)  // 환경 미정
├── types/index.ts           # 공용 타입  // 환경 미정
├── constants/index.ts       # 공용 상수
├── data/                    # 목업 데이터, IA 화면 목록(iaData.ts)
├── utils/                   # 순수 유틸 함수
└── assets/
    ├── css/                 # common.css, ia.css, guide.css
    ├── images/
    ├── icons/
    └── fonts/
```

### 4.1 폴더 관리 규칙

- 위 구조가 **기준 구조**입니다. 구조에 있는 폴더는 필요할 때 생성합니다.
- 구조에 없는 폴더는 `docs/requirements.md`에 정의되어 있거나 사용자가 승인한 경우에만 추가하고 이 문서를 갱신합니다.
- **공용 컴포넌트는 `src/components/common/`, 레이아웃은 `layout/`, 관리 화면(`/Ia`, `/Guide`)은 `src/pages/`에만 만들며, 컴포넌트·페이지마다 폴더를 만들지 않고 파일 하나로 둡니다. 내부 컴포넌트와 서비스 페이지는 별도 파일·폴더로 저장하지 않습니다.**
- `common.css`는 `main.tsx`에서 전역 import하지 않고 `Layout.tsx`에서만 import합니다. // 환경 미정: 확정 후 갱신
- `/Ia`, `/Guide`는 Layout 밖 독립 라우트로 두고 각 페이지에서 전용 CSS를 import합니다. // 환경 미정: 확정 후 갱신

## 5. 코딩 규칙

### 5.1 컴포넌트 및 함수

- 컴포넌트와 일반 함수는 모두 ES6(ES2015)의 **`const` + 화살표 함수**로 선언하고, 컴포넌트는 파일 마지막에 `export default ComponentName;`으로 내보냅니다. (`function` 선언, `export default function` 금지) // 환경 미정: 확정 후 갱신
- 이벤트 핸들러는 `handle` 접두어를 사용합니다.
- Props 타입은 해당 컴포넌트 파일에 `interface XxxProps`로 정의합니다. 여러 파일에서 공유하는 타입만 `src/types/`에 둡니다. // 환경 미정: 확정 후 갱신
- 약 150줄을 넘으면 분리를 검토하되, 줄 수만을 이유로 쪼개지 않습니다. // 안건 13: 내부 컴포넌트가 커질 때의 분리 위치 (4장)

**공통 컴포넌트 기준**

- 같거나 비슷한 UI가 **2곳 이상**에서 쓰이고 구조·동작을 공통화할 수 있을 때만 `components/common/`으로 분리합니다.
- 1곳에서만 쓰는 UI는 해당 컴포넌트 또는 페이지 파일 안에 작성합니다. (4장 내부 컴포넌트)
- "나중에 쓸 수도 있다"는 이유로 미리 만들지 않습니다. 단, requirements.md·디자인 원본에서 2곳 이상 사용이 확인된 컴포넌트는 6.4절 순서에 따라 페이지보다 먼저 만듭니다. // 환경 미정: 디자인 원본 형태 (Figma 전달 확률 낮음) / 안건 8: 선행 컴포넌트 선정 근거
- 기존 공통 컴포넌트가 있으면 새로 만들지 않고 재사용하며, 데이터와 상태는 Props로 제어합니다.

```tsx
// 환경 미정: 확정 후 갱신
interface ButtonProps {
    label: string;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
}

const Button = ({ label, variant = 'primary', onClick }: ButtonProps) => {
    return (
        <button type="button" className={`btn ${variant}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;
```

### 5.2 이름 규칙

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트, 타입 | PascalCase | `UserCard`, `UserProfile` |
| 함수, 변수 | camelCase | `formatDate`, `isOpen` |
| 커스텀 훅 | `use` + PascalCase | `useScroll` | // 환경 미정: 확정 후 갱신
| 공용 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS` |
| CSS 클래스, ID | camelCase | `.cardTitle`, `#mainContent` |
| Boolean 변수 | `is`, `has`, `can` 권장 | `isLoading`, `hasError` |

### 5.3 CSS

- CSS 파일은 **`src/assets/css/`의 `common.css`(일반 페이지), `ia.css`(`/Ia`), `guide.css`(`/Guide`) 세 개만** 사용합니다. `*.module.css`, `Home.css`, `variables.css` 등 다른 CSS 파일을 만들지 않습니다. // 안건 11: 대규모(약 600페이지 분량) 프로젝트에서 CSS 3파일 제한이 유지 가능한지
- CSS는 한 번 import되면 다른 라우트에도 남으므로 선택자 범위를 한정합니다.
    - `common.css`: `#siteWrap` 아래 (`Layout.tsx`의 최상위 `<div id="siteWrap">`) // 환경 미정: 확정 후 갱신
    - `ia.css`: `#iaWrap` 아래
    - `guide.css`: Guide 전용 클래스(`.guideWrap`, `.guide*`)만 사용
- `body`, `html`, `*`, `:root` 등 전역 선택자를 쓰지 않습니다. 리셋도 각 루트 아래에 작성합니다.
- 색상·간격·폰트 크기 등 반복 값은 `#siteWrap`에 CSS 변수(디자인 토큰)로 선언합니다. 토큰 목록은 `docs/design.md` 6장을 따릅니다.
- 반응형은 모바일 우선(`min-width`), 기본 브레이크포인트는 `768px`, `1024px`입니다.
- Swiper 등 승인된 라이브러리의 공식 CSS import는 허용하며, 스타일 재정의는 `common.css`에 작성합니다.

```css
/* 01. Design tokens */
#siteWrap {
    --color-text: #222;
    --space-4: 16px;
    --space-6: 24px;
    --radius-md: 8px;
}
/* 02. Reset / Base */
/* 03. Common components */
#siteWrap .card {
    padding: var(--space-4);
    color: var(--color-text);
    border-radius: var(--radius-md);
}
/* 04. Layout */
/* 05. Pages */
/* 06. Swiper custom styles */
/* 07. Responsive */
@media (min-width: 768px) {
    #siteWrap .card { padding: var(--space-6); }
}
```

### 5.3.1 인라인 스타일 예외 및 기록 규칙

- 인라인 스타일(`style` 속성)은 원칙적으로 금지합니다. **런타임에 계산되어 클래스로 미리 정의할 수 없는 동적 값**(진행률 `width`, 드래그·스크롤 위치, 데이터에서 받은 색상·이미지 URL 등)에만 허용합니다.
- 열림/닫힘처럼 정해진 상태는 클래스 토글로, 고정 값은 CSS로 처리합니다.
- 예외로 사용하면 **반드시 두 곳에 기록**합니다.
    1. **코드:** 요소 바로 위에 `{/* [inline-style] 이유 */}` (일반 코드는 `// [inline-style] 이유`) // 환경 미정: 확정 후 갱신
    2. **문서:** `docs/design.md` 6.2절 표에 파일·요소·속성·이유·날짜 추가
- 인라인 스타일을 제거하면 주석과 표의 행도 함께 삭제합니다.
- `docs/ia-spec.md`의 IA 미리보기 `#wrap` 축소(`element.style`)는 명세에 포함된 예외이므로 기록하지 않습니다.

```tsx
{/* 환경 미정: 확정 후 갱신 */}
{/* [inline-style] 슬라이드 진행률: 진행 상태에 따라 계산되는 동적 값 */}
<div className="progressBar" style={{ width: `${progress}%` }} />
```

> 전체 사용 위치는 `grep -rn "\[inline-style\]" src/`로 찾아 design.md 표와 일치하는지 확인합니다.

### 5.4 이미지 및 아이콘

- 이미지·아이콘은 **지정된 폴더에 이미 있는 asset만** 사용합니다. 임의 제작, 유사 아이콘 대체, CSS로 모양 그리기, 폴더에 없는 asset 추가를 하지 않습니다. 필요한 asset이 없으면 사용자에게 요청합니다. (8.2) // 안건 5: 지정 폴더 확정 필요
- 아이콘은 `src/assets/icons/`(가능하면 SVG), 이미지는 `src/assets/images/`에 있는 파일을 사용합니다. 파일명은 용도를 알 수 있는 기존 이름을 따릅니다. 예: `iconSearch.svg`
- 같은 에셋을 중복 저장하지 않으며, 크기·배치는 CSS로 조정합니다.
- 정보 전달 이미지는 의미 있는 `alt`, 장식용은 `alt=""`를 사용하고, 아이콘 버튼·링크에는 접근 가능한 이름(`aria-label` 등)을 제공합니다.

```tsx
// 환경 미정: 확정 후 갱신
import iconSearch from '../../assets/icons/iconSearch.svg';

const SearchButton = () => {
    return (
        <button type="button" aria-label="검색">
            <img src={iconSearch} alt="" />
        </button>
    );
};

export default SearchButton;
```

### 5.5 TypeScript 및 상태 관리 // 환경 미정: 확정 후 갱신

- `any` 대신 `unknown`과 타입 좁히기를 사용하고, 목업 데이터에도 타입을 명시합니다.
- 같은 상태를 중복 관리하지 않고, 계산 가능한 값은 원본 상태에서 도출합니다.
- 상태 변경 시 배열·객체의 불변성을 유지하며, 단순한 화면 상태는 `useState`를 우선 사용합니다.

### 5.6 슬라이드(Swiper) // 환경 미정: swiper/react는 프레임워크 확정 후

- 슬라이드·캐러셀은 **`swiper/react`**로 구현하며, 이동·터치·드래그를 직접 구현하지 않습니다. 슬라이드가 아닌 콘텐츠에는 쓰지 않습니다.
- 설치된 Swiper 버전의 공식 API를 쓰고, 반응형은 `breakpoints`, 자동 재생·페이지네이션·네비게이션은 Swiper 모듈을 사용합니다. 이들은 디자인·요구사항에 있을 때만 추가합니다.
- 여러 화면에서 쓰는 슬라이드는 `src/components/common/`에 두고, 이미 있으면 재사용합니다.
- 슬라이드 데이터는 배열 + `map()`으로 렌더링하고 고유 `key`를 사용합니다.
- 자동 재생 시 정지 수단, 키보드 조작 등 접근성을 고려합니다.

```tsx
// 환경 미정: 확정 후 갱신
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const BannerSlider = () => {
    const slideList = [
        { id: 1, title: '슬라이드 1' },
        { id: 2, title: '슬라이드 2' }
    ];

    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={{ 768: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } }}
        >
            {slideList.map((item) => (
                <SwiperSlide key={item.id}>{item.title}</SwiperSlide>
            ))}
        </Swiper>
    );
};

export default BannerSlider;
```

### 5.7 커스텀 훅 // 환경 미정: 확정 후 갱신

- 여러 컴포넌트에서 반복되는 React 상태·이벤트 로직만 `src/hooks/useXxx.ts`(JSX 필요 시 `.tsx`)로 분리합니다. 한 컴포넌트에서만 쓰는 로직은 분리하지 않습니다.
- Hooks 호출 규칙을 지킵니다. 컴포넌트나 다른 훅의 최상위에서만 호출하고, 조건문·반복문·이벤트 핸들러 안에서 호출하지 않습니다.
- 직접 등록한 이벤트 리스너는 cleanup에서 해제합니다.

| 구분 | `hooks/` | `utils/` |
| --- | --- | --- |
| 목적 | React 로직 재사용 | 일반 함수 재사용 |
| React Hooks·상태 | 사용 | 사용하지 않음 |
| 예시 | `useWindowSize.ts` | `formatDate.ts` |

## 6. 퍼블리싱 작업 규칙

### 6.1 기본 규칙

- 목업 데이터를 사용할 수 있으며, 여러 화면에서 공유하는 목업은 `src/data/`에 둡니다.
- 기존 마크업 구조와 CSS 클래스명을 최대한 유지합니다.
- 시맨틱 태그를 우선 사용하며, 공통 레이아웃의 태그·ID 구조는 `docs/design.md`를 따릅니다.
- 명세의 항목을 표현할 UI는 Guide에 등록된 공통 컴포넌트 중에서 선택합니다. 선택 기준은 Guide의 역할·사용 조건을 따릅니다. // 안건 6: 선택 기준의 정의 주체 확정 필요

### 6.2 IA 페이지 (`/Ia`) // 안건 1: IA 유지. 서비스 페이지는 코드로 남기지 않고, 페이지 구분은 IA 기준으로 사람이 관리

- 상세 명세의 기준 원본은 **`docs/ia-spec.md`**입니다. IA 관련 작업 전에는 반드시 전체를 읽습니다.
- IA는 사람이 관리하며 페이지 구분의 기준입니다. 서비스 페이지는 코드로 남지 않더라도 IA에서 관리합니다.
- 다른 작업에서도 지켜야 할 핵심 규칙:
    - 파일은 `src/pages/Ia.tsx`, `src/data/iaData.ts`, `src/types/index.ts`(IA 타입), `src/assets/css/ia.css`만 사용합니다. // 환경 미정: 확정 후 갱신
    - 기존 IA 디자인·문구·동작은 승인 없이 변경하지 않습니다.
    - 새 페이지가 필요해 보이면 IA를 직접 수정하지 않고 추가를 요청합니다. (8.2) // 안건 2: 요청 후 멈출지 계속할지
    - 검증되지 않은 페이지를 `Done`으로 표시하지 않으며, `docs/tasks.md`와 상태가 다르면 사용자에게 확인합니다. // 안건 3: 페이지 상태 원본 구분 후 문구 조정
    - `Guide` 항목은 항상 IA 목록 최상단에 둡니다.

### 6.3 공통 컴포넌트 Guide (`/Guide`)

- 상세 명세의 기준 원본은 **`docs/guide-spec.md`**입니다. Guide 관련 작업 전에는 반드시 전체를 읽습니다.
- 다른 작업에서도 지켜야 할 핵심 규칙:
    - 파일은 `src/pages/Guide.tsx`, 스타일은 `src/assets/css/guide.css`만 사용합니다. // 환경 미정: 확정 후 갱신
    - 공통 컴포넌트를 추가하거나 Props·사용법을 바꾸면 **같은 작업에서** Guide를 갱신합니다.
    - IA는 페이지 목록, Guide는 공통 컴포넌트 설명입니다. 페이지를 Guide에 등록하지 않습니다.
    - Guide 변경이 없으면 결과 보고에 `Guide 변경 없음(공통 컴포넌트 변경 없음)`이라고 명시합니다.
    - Guide의 컴포넌트 섹션에는 **역할, 사용 조건, 쓰면 안 되는 경우**를 적습니다. 명세 항목의 성격(자유 입력, 단일·복수 선택, 날짜, 동의 등)에 따라 어떤 컴포넌트를 쓸지 판단할 수 있어야 합니다. // 안건 6: 상세 항목은 `docs/guide-spec.md`에 반영, 선택 기준의 정의 주체 확정 필요

### 6.4 작업 순서: 공통 컴포넌트·Guide 먼저, 페이지는 나중 // 안건 1: 페이지는 저장소에 남기지 않음(4장) — 3단계를 "페이지 생성 시 지켜야 할 규칙"으로 바꿀지

**앞 단계가 완료(검증 및 `docs/tasks.md` 체크)되기 전에 다음 단계를 시작하지 않습니다.**

| 단계 | 작업 | 완료 조건 |
| --- | --- | --- |
| 1. 초기 구성 | 라우트, `Layout`(`#siteWrap`), 디자인 토큰, `/Ia`, `/Guide` | 두 관리 화면 접속, IA에 Guide 등록, 빌드 통과 |
| 2. 공통 컴포넌트 + Guide | requirements.md·디자인 원본에서 2곳 이상 사용이 확인된 컴포넌트 | 컴포넌트마다 Guide 섹션(역할·사용 조건, Props 표, 실제 UI, 사용 코드) 작성 | // 환경 미정: 디자인 원본 형태 (Figma 전달 확률 낮음) / 안건 8: 화면설계가 없을 때 선행 컴포넌트를 정하는 근거
| 3. 페이지 | 공통 컴포넌트를 조합해 페이지 작성 | IA 등록, 디자인·동작 확인, 빌드 통과 |

- 2단계 예시: `Input`, `Select`, `Radio`, `Checkbox`, `DatePicker`, `Button`, `Modal`, `Tabs`, `Accordion`, `Stepper`, `Table`, `Tooltip`. 실제 목록은 requirements.md·디자인 원본 기준이며, 없는 컴포넌트나 Props·변형(variant)을 미리 만들지 않습니다. // 환경 미정: 디자인 원본 형태 (Figma 전달 확률 낮음)
- 3단계에서 공통 컴포넌트가 부족하면 페이지에서 복사하거나 CSS 덮어쓰기로 우회하지 않고, 컴포넌트를 수정하고 Guide를 함께 갱신합니다.
- 새 공통 컴포넌트가 필요해 보이면 페이지 작업을 멈추고 `docs/tasks.md`에 컴포넌트 작업 추가를 제안합니다. 승인 후 컴포넌트와 Guide를 먼저 완료합니다.
- `docs/tasks.md`는 1 → 2 → 3단계 순으로 작성하고, 공통 컴포넌트 작업은 그것을 쓰는 페이지 작업보다 항상 위에 둡니다.

## 7. SSOT 문서 관리

| 정보 | 공식 원본 |
| --- | --- |
| AI 개발 규칙 | `AGENTS.md` |
| 기능 요구사항 | `docs/requirements.md` |
| 구조 및 설계, 디자인 토큰, 인라인 스타일 사용 목록 | `docs/design.md` |
| 작업 진행 상태 (컴포넌트·규칙 등) | `docs/tasks.md` (체크박스) |
| 페이지 상태 | IA (`/Ia`) | // 안건 3: IA와 `tasks.md`의 상태가 중복되지 않도록 구분
| IA 페이지 명세 | `docs/ia-spec.md` (화면 목록만 `src/data/iaData.ts`에서 관리) |
| Guide 페이지 명세 | `docs/guide-spec.md` |
| 공용 타입 / 상수 | `src/types/` / `src/constants/` (import하여 사용) | // 환경 미정: 확정 후 갱신

- 같은 규칙과 데이터를 여러 곳에 중복 정의하지 않습니다.
- 스펙 변경이 확정되면 공식 문서를 먼저 갱신하고 코드를 수정합니다.
- 문서와 코드가 충돌하면 임의로 덮어쓰지 않고 차이를 보고합니다.

## 8. AI 작업 절차

1. **문서 확인:** 관련 문서를 읽고 `docs/tasks.md`에서 현재 작업과, 6.4절 순서상 시작 가능한 단계인지 확인합니다.
2. **기존 코드 검색:** 새 파일을 만들기 전에 유사한 파일과 공통 컴포넌트가 있는지 찾습니다.
3. **작업 단위:** 요청된 작업 한 가지에만 집중합니다.
4. **최소 수정:** 요청 범위 밖의 리팩터링, 파일 이동·삭제·덮어쓰기, 라이브러리 설치는 사전 승인을 받습니다.
5. **불명확하면 질문:** 추측으로 설계를 확정하거나 디자인 원본에 없는 UI·기능·에셋을 추가하지 않습니다. // 환경 미정: 디자인 원본 형태 (Figma 전달 확률 낮음) / 안건 12: 스케줄러 등 무인 실행 시에는 질문 대신 질문 목록을 남기고 해당 작업을 중단하는 방식인지
6. **Guide 동기화:** 공통 컴포넌트 추가·변경 시 Guide를 같은 작업에서 갱신합니다. 새 페이지가 필요하면 IA에 추가를 요청합니다.
7. **검증:** `npm run build`, 가능한 경우 lint, 라우트·디자인·접근성을 확인합니다. 실행하지 않은 검사를 통과했다고 보고하지 않습니다. // 환경 미정: 확정 후 갱신
8. **작업 기록:** 검증된 작업만 `docs/tasks.md`에서 `[x]`로 변경합니다.
9. **결과 보고:** 수정 파일, Guide 반영 여부, 요청 사항(IA·컴포넌트·asset), 인라인 스타일 사용 여부(design.md 기록 여부), 변경 이유, 검증 결과, 남은 문제를 요약합니다.

### 8.1 Git 안전 규칙

- 작업 전 `git status`로 변경 범위를 확인하고, 사용자 변경분을 덮어쓰지 않습니다.
- `git reset --hard`, `git clean -fd`, 강제 푸시, 이력 재작성은 명시적 승인 없이는 금지합니다.

### 8.2 요청이 필요한 경우 // 안건 2: 요청 규칙 통일, 요청 후 멈출지 계속할지

- 아래 경우에는 직접 추가하거나 수정하지 않고 사용자에게 **요청**합니다.
    - 새 페이지가 필요해 보일 때: IA에 항목 추가를 요청합니다. (IA는 사람이 관리합니다.)
    - 새 공통 컴포넌트가 필요할 때: `docs/tasks.md`에 컴포넌트 작업 추가를 제안합니다. (6.4)
    - 필요한 asset이 지정 폴더에 없을 때: asset 추가를 요청합니다. (5.4)
    - 새 라이브러리가 필요할 때: 이유와 영향 범위를 설명하고 승인을 요청합니다. (2장)
- 요청에는 필요한 이유, 기존 항목으로 해결되지 않는 이유, 사용 위치를 적습니다.

## 9. 완료 전 점검 목록

- [ ] 4.1절 위치 밖, 또는 컴포넌트·페이지별 폴더에 파일을 만들지 않았다.
- [ ] 1곳에서만 쓰는 UI(내부 컴포넌트)를 별도 파일·폴더로 만들지 않았다. (4장)
- [ ] CSS 파일은 세 개뿐이고, 선택자가 각 루트 범위 안에 있다. (5.3)
- [ ] 디자인 토큰으로 관리할 값을 하드코딩하지 않았다. (5.3)
- [ ] 인라인 스타일이 있다면 주석과 design.md 표에 기록했다. (5.3.1)
- [ ] 디버깅용 `console.log`가 남아 있지 않다.
- [ ] 승인되지 않은 패키지를 설치하지 않았다. (2장)
- [ ] `main.tsx`, `vite.config.ts`, `tsconfig.json`을 이유 없이 수정하지 않았다. (독립 CSS 분리에 필요한 최소 수정은 허용) // 환경 미정: 확정 후 갱신
- [ ] 같은 기능의 공통 컴포넌트를 중복으로 만들지 않았다. (5.1)
- [ ] Guide를 갱신했고, IA는 직접 수정하지 않았으며 기존 IA 디자인·기능을 바꾸지 않았다. (6.2, 6.3)
- [ ] 새 페이지·공통 컴포넌트·asset이 필요했다면 직접 추가하지 않고 요청했다. (8.2)

규칙을 지키기 어려운 사정이 있으면 이유와 대안을 먼저 설명하고 승인받은 뒤 진행합니다.

<!--
새 컴포넌트 요청은 누가 승인하고, 얼마나 빨리 처리되는지
컴포넌트 저장소에도 **PR 리뷰와 CI(lint, 빌드)**가 적용되는지
컴포넌트 모양을 변경 전후로 자동 비교하는 비주얼 리그레션 도구를 쓰는지
생성된 페이지는 누가, 어느 단계에서 검수하는지
컴포넌트가 바뀌었을 때 이미 전달된 페이지는 그대로 둘지, 다시 생성할지
컴포넌트 변경 요청에 **"기존 화면이 깨지는 변경인가"**를 적는 칸이 있는지
(선택) 페이지 유형별 배치 패턴을 정해서 결과를 더 비슷하게 만들지
-->
