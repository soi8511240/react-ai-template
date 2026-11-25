# 설계 (Design)

> 이 문서는 **어떻게 만드는지** 정의하는 설계 문서입니다.
> 기능 요구사항은 `docs/requirements.md`, AI 개발 및 코딩 규칙은 `AGENTS.md`를 따릅니다.
> **현재 작업 범위:** React + TypeScript 기반 퍼블리싱 전용
> 마지막 수정: 2026-11-23

---

## 1. 화면 구조

### 1.1 전체 화면 구조

```text
App
├── /Ia (독립 관리 페이지)
├── /Guide (독립 관리 페이지)
└── Layout (일반 페이지) <div id="siteWrap">
    ├── Header <header id="header">
    ├── Main <main id="container">
    │   └── {프로젝트별 페이지}
    └── Footer <footer id="footer">
```

> 실제 페이지·컴포넌트는 `requirements.md`에서 확정한 것만 생성합니다.

### 1.1.1 IA 및 Guide 독립 페이지 설계

- `/Ia`와 `/Guide`는 **공통 Layout, Header, Footer를 적용하지 않는 독립 관리 페이지**입니다.
- `/Ia`는 `src/pages/Ia.tsx`, `/Guide`는 `src/pages/Guide.tsx`에서 관리합니다.
- `/Ia`의 화면 목록에는 **Guide (`/Guide`) 항목을 최초 생성부터 반드시 포함**하며, 항상 목록 최상단에 둡니다. 공통 컴포넌트가 없어도 삭제하거나 생략하지 않습니다.
- 일반 페이지를 추가하면 IA 화면 목록을 갱신하고, 공통 컴포넌트를 추가하거나 Props·사용법을 변경하면 Guide 항목을 갱신합니다.
- 실제 경로와 IA 링크는 일치해야 하며, `/Ia`에서 Guide 링크를 클릭하면 `/Guide`로 이동해야 합니다.

**라우팅 구조**

```tsx
<Routes>
    <Route path="/Ia" element={<Ia />} />
    <Route path="/Guide" element={<Guide />} />
    <Route element={<Layout><Outlet /></Layout>}>
        {/* 일반 페이지 */}
    </Route>
</Routes>
```

### 1.2 기본 레이아웃 설계

| 컴포넌트 | HTML 태그 | ID | 역할 |
| --- | --- | --- | --- |
| `Layout` | `<div>` | `siteWrap` | 일반 페이지 루트 (CSS 범위 기준) |
| `Header` | `<header>` | `header` | 공통 상단 영역 |
| `Layout`의 콘텐츠 영역 | `<main>` | `container` | 페이지 콘텐츠 영역 |
| `Footer` | `<footer>` | `footer` | 공통 하단 영역 |

**기본 레이아웃 규칙**

- **일반 페이지에만** 공통 `Layout`을 적용합니다. `/Ia`, `/Guide`는 예외입니다.
- `Layout`은 `<div id="siteWrap">`을 루트로 하고, 그 안에 `Header`, `<main id="container">`, `Footer`를 순서대로 배치합니다.
- `Header`는 `<header id="header">`, `Footer`는 `<footer id="footer">`를 루트 요소로 사용합니다.
- 페이지 컴포넌트는 `<main>` 내부에 렌더링하며, 중첩된 `<main>`을 만들지 않습니다.
- 한 화면에서 동일한 ID를 중복 사용하지 않습니다.
- 공통 레이아웃 CSS는 `src/assets/css/common.css`에서 관리하며, `Layout.tsx`에서 import합니다.

**Layout 구현 예시** (`src/components/layout/Layout.tsx`)

```tsx
import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../assets/css/common.css';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div id="siteWrap">
            <Header />
            <main id="container">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
```

**공통 레이아웃 높이**

- 모든 일반 페이지는 최소 브라우저 화면 높이를 확보합니다.
- `#siteWrap`을 세로 Flex 구조로 두고 Header, Container, Footer를 배치합니다.
- 콘텐츠가 짧아도 Footer는 화면 최하단에 위치해야 합니다.
- 콘텐츠가 화면 높이를 초과하면 Footer는 콘텐츠 아래로 자연스럽게 이동합니다.
- Footer에 `position: fixed` 또는 `absolute`를 사용하지 않습니다.
- IA 및 Guide 관리 페이지는 독립 레이아웃이므로 해당 규칙에서 제외합니다.

### 1.3 폴더 구조

```text
src/
├── main.tsx
├── App.tsx
├── pages/                 # 페이지 (파일 단위)
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Ia.tsx
│   └── Guide.tsx
├── components/
│   ├── common/            # 여러 화면에서 쓰는 UI (파일 단위)
│   │   ├── Button.tsx
│   │   └── Slider.tsx
│   └── layout/            # 공통 레이아웃
│       ├── Layout.tsx
│       ├── Header.tsx
│       └── Footer.tsx
├── hooks/
├── types/
├── constants/
├── data/
├── utils/
└── assets/
    ├── css/
    │   ├── common.css   # 일반 페이지
    │   ├── ia.css       # IA 독립 화면
    │   └── guide.css    # Guide 독립 화면
    ├── images/
    ├── icons/
    └── fonts/
```

**폴더 설계 원칙**

- 페이지는 `src/pages/`, 컴포넌트는 `src/components/`에서 관리합니다.
- 컴포넌트·페이지마다 폴더를 만들지 않고 파일 하나로 둡니다.
- 여러 화면에서 사용하는 UI는 `components/common/`, 공통 레이아웃은 `components/layout/`에 배치합니다.
- 한 페이지에서만 사용하는 UI는 별도 컴포넌트 폴더를 만들지 않고 해당 페이지 파일 안에 작성합니다. (`AGENTS.md` 5.1)
- 공통 React 로직은 `hooks/`에서 관리합니다.
- 일반 데이터 가공 함수는 `utils/`에서 관리합니다.
- 일반 페이지 CSS는 `assets/css/common.css`, IA는 `assets/css/ia.css`, Guide는 `assets/css/guide.css`로 분리합니다.
- IA와 Guide는 필수 관리 화면이므로 관련 페이지·CSS 파일 및 라우트를 초기 구성에 포함합니다. 그 외 불필요한 파일은 미리 생성하지 않습니다.

## 2. 컴포넌트 명세

| 컴포넌트 | 위치 (`src/` 기준) | Props | 설명 |
|---|---|---|---|
| `Layout` | `components/layout/Layout.tsx` | `children` | `#siteWrap` 안에 Header, main, Footer를 조합하는 공통 레이아웃 |
| `Header` | `components/layout/Header.tsx` | - | `<header id="header">`, 로고, 메뉴, 스크롤에 따른 스타일 변경 |
| `Footer` | `components/layout/Footer.tsx` | - | `<footer id="footer">` 공통 하단 영역 |
| `Button` | `components/common/Button.tsx` | `label`, `variant`, `onClick` | 공통 버튼 |
| `Slider` | `components/common/Slider.tsx` | `items`, `options` | Swiper 기반 공통 슬라이드 |
| `ServiceCard` | `pages/Home.tsx` 내부 | `service: Service` | 아이콘, 제목, 설명 (Home 전용) |
| `ContactForm` | `pages/Home.tsx` 내부 | `onSubmit` | 입력 폼 및 유효성 검사 (Home 전용) |

> 컴포넌트 목록은 설계 예시이며, 실제 요구사항에 없는 컴포넌트는 생성하지 않습니다.
> 한 페이지 전용 UI가 2곳 이상에서 쓰이게 되면 그때 `components/common/`으로 분리합니다.

### 2.1 컴포넌트 설계 원칙

- React 함수형 컴포넌트를 사용합니다.
- 컴포넌트는 `const` + 화살표 함수로 선언합니다.
- Props는 TypeScript `interface`로 정의합니다.
- 공통 컴포넌트가 존재하면 새로 만들지 않고 재사용합니다.
- 화면 UI와 데이터 처리 로직은 역할에 따라 분리합니다.
- 불필요하게 컴포넌트를 세분화하지 않습니다.
- 컴포넌트 작성 규칙은 `AGENTS.md` 5.1절을 따릅니다.

## 3. 데이터 타입

> 실제 공용 타입은 `src/types/`에 정의합니다. 아래 코드는 설계 참고용입니다.

```ts
type PartyRole = '계약자' | '피보험자' | '종피보험자';

interface NavItem {
    label: string;
    href: string;
}

interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface SlideItem {
    id: string;
    title: string;
    image?: string;
    link?: string;
}
```

### 3.1 타입 관리 원칙

- 여러 컴포넌트에서 공유하는 타입은 `src/types/`에 정의합니다.
- 특정 컴포넌트에서만 사용하는 Props 타입은 해당 컴포넌트 파일에 정의합니다.
- API 및 목업 데이터에는 명확한 타입을 사용합니다.
- TypeScript의 `any` 타입은 사용하지 않습니다.
- 동일한 타입을 여러 파일에 중복 선언하지 않습니다.

## 4. 상태 관리

| 상태 | 위치 | 방식 | 설명 |
|---|---|---|---|
| 모바일 메뉴 열림 여부 | `Header` | `useState` | 메뉴 열기/닫기 |
| 폼 입력값 | `ContactForm` | `useState` | 입력값 관리 및 초기화 |
| 슬라이드 활성 인덱스 | 슬라이드 컴포넌트 | Swiper API / 필요 시 `useState` | 현재 슬라이드 상태 |
| 브라우저 화면 너비 | `useWindowSize` | 커스텀 훅 | JavaScript에서 화면 너비가 필요한 경우 |
| 여러 컴포넌트 공유 상태 | 가장 가까운 공통 부모 | `useState` / Props | 필요한 범위에서 공유 |
| 전역 상태 | 필요 시 Context | `useContext` | 여러 페이지에서 공유할 때만 |

### 4.1 상태 관리 원칙

- 상태는 해당 상태를 사용하는 **가장 가까운 공통 부모**에서 관리합니다.
- 컴포넌트 내부에서만 사용하는 상태는 해당 컴포넌트에서 관리합니다.
- 단순한 상태는 `useState`를 우선 사용합니다.
- 전역 상태는 반드시 필요한 경우에만 도입합니다.
- 동일한 상태를 중복 관리하지 않습니다.
- 계산 가능한 값은 기존 상태에서 도출합니다.
- Swiper 내부에서 관리할 수 있는 슬라이드 상태는 별도로 중복 관리하지 않습니다.
- 화면 크기에 따른 스타일 변경은 CSS 미디어쿼리를 우선 사용합니다.

## 5. 인터랙션

| 대상 | 동작 | 결과 |
|---|---|---|
| 메뉴 링크 | 클릭 | 해당 페이지 또는 섹션으로 이동 |
| 햄버거 버튼 | 클릭 | 모바일 메뉴 열기/닫기 |
| 모바일 메뉴 | 바깥 영역 클릭 | 메뉴 닫기 |
| Header | 스크롤 | 조건에 따라 배경 및 그림자 변경 |
| 문의 폼 | 제출 | 유효성 검사 후 목업 성공 메시지 표시 |
| 슬라이드 | 터치 / 드래그 | Swiper를 통한 슬라이드 이동 |
| 슬라이드 네비게이션 | 이전 / 다음 버튼 클릭 | 슬라이드 이동 |
| 슬라이드 페이지네이션 | 페이지 표시 클릭 | 해당 슬라이드 이동 |

### 5.1 인터랙션 설계 원칙

- 사용자의 클릭, 입력, 스크롤 등 필요한 이벤트만 구현합니다.
- React 이벤트 핸들러를 사용합니다.
- 이벤트 핸들러 이름은 `handle` 접두어를 사용합니다.
- 이벤트 리스너를 직접 등록한 경우 컴포넌트 정리 시 해제합니다.
- React 상태로 처리할 수 있는 UI는 불필요한 DOM 직접 조작을 피합니다.
- 슬라이드 인터랙션은 Swiper API를 우선 사용합니다.
- 실제 API가 연결되지 않은 기능은 퍼블리싱용 목업 동작으로 구현합니다.
- 디버깅용 `console.log`를 남기지 않습니다.

## 6. 디자인 토큰

> 실제 디자인 토큰은 `src/assets/css/common.css`의 **`#siteWrap`** 안에 CSS 변수로 정의합니다.
> 일반 페이지 루트에 선언하므로 `/Ia`, `/Guide`에는 영향을 주지 않습니다.

```css
#siteWrap {
    /* 색상 */
    --color-primary: #1e40af;
    --color-primary-hover: #1e3a8a;
    --color-text: #111827;
    --color-text-muted: #6b7280;
    --color-bg: #ffffff;
    --color-bg-subtle: #f9fafb;
    --color-border: #e5e7eb;
    /* 폰트 */
    --font-family: 'Pretendard', system-ui, sans-serif;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 2rem;
    /* 간격 */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-12: 3rem;
    /* 모서리 및 그림자 */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    /* 레이아웃 */
    --container-max: 1200px;
    --header-height: 64px;
}
```

### 6.1 스타일 관리 원칙

- 일반 페이지 CSS는 `common.css`, IA 전용 CSS는 `ia.css`, Guide 전용 CSS는 `guide.css`에서 관리합니다.
- 선택자 범위: `common.css`는 `#siteWrap`, `ia.css`는 `#iaWrap` 아래로 한정하고, `guide.css`는 Guide 전용 클래스(`.guideWrap`, `.guide*`)만 사용합니다.
- `common.css`를 `main.tsx`에서 전역 import하지 않고 `Layout.tsx`에서만 import합니다.
- React에서 CSS import는 자동 격리를 의미하지 않으므로, 라우트별 로딩만 믿지 않고 전역 선택자·reset의 영향도 확인합니다.
- CSS Modules, SCSS, styled-components 등을 사용하지 않습니다.
- 공통 디자인 값은 CSS 변수로 관리합니다.
- 기존 CSS 클래스명과 마크업 구조를 최대한 유지합니다.
- 반응형은 모바일 우선으로 구현합니다.
- 기본 브레이크포인트는 `768px`, `1024px`입니다.
- Swiper 기본 CSS는 공식 패키지 import를 허용합니다.
- Swiper의 추가 스타일 및 커스터마이징은 `common.css`에 작성합니다.

### 6.2 인라인 스타일 사용 목록

> 인라인 스타일은 `AGENTS.md` 5.3.1절의 예외(런타임 동적 값)에만 사용합니다.
> 사용하면 코드에 `[inline-style]` 주석을 달고 이 표에 한 줄을 추가합니다. 제거하면 행도 삭제합니다.

| 파일 | 요소 (클래스/ID) | 속성 | 이유 | 날짜 |
|---|---|---|---|---|
| - | - | - | 현재 사용 없음 | - |

## 7. API / 데이터 소스

| 용도 | 현재 (퍼블리싱) | 추후 (개발) |
|---|---|---|
| 서비스 목록 | `src/data/services.ts` 목업 | `GET /api/services` |
| 문의 제출 | 로컬 유효성 검사 및 목업 완료 처리 | `POST /api/contact` |
| 슬라이드 목록 | `src/data/` 목업 데이터 | 필요 시 API 연동 |

### 7.1 데이터 관리 원칙

- 현재 단계에서는 실제 API 연동을 구현하지 않습니다.
- 퍼블리싱에 필요한 데이터는 목업 데이터로 구성합니다.
- 반복되는 UI 데이터는 배열로 관리합니다.
- 여러 화면에서 공유하는 목업 데이터는 `src/data/`에 배치합니다.
- 데이터 타입을 명시합니다.
- 실제 API 연동은 개발 단계 전환 후 진행합니다.

### 7.2 환경 변수

환경 변수는 `.env` 파일에 `VITE_` 접두사를 붙여 관리합니다.

```env
VITE_API_URL=https://example.com/api
```

- 실제 비밀키나 인증 정보는 클라이언트 환경 변수에 저장하지 않습니다.
- 현재 퍼블리싱 단계에서는 불필요한 환경 변수를 추가하지 않습니다.

## 8. 슬라이드 컴포넌트 설계 (Swiper)

### 8.1 기본 구조

```text
Home (pages/Home.tsx)
└── Hero 영역
    └── Slider (components/common/Slider.tsx)
        ├── Swiper
        │   ├── SwiperSlide × N
        │   └── ...
        ├── Navigation (선택)
        └── Pagination (선택)
```

### 8.2 설계 원칙

- 슬라이드가 필요한 영역은 Swiper 라이브러리를 사용합니다.
- 공통 슬라이드는 `src/components/common/Slider.tsx`에서 관리합니다.
- 여러 화면에서 공통으로 사용하는 슬라이드 UI는 재사용 가능한 컴포넌트로 구현합니다.
- 화면별 슬라이드 데이터 및 옵션은 해당 화면의 요구사항에 맞게 정의합니다.
- 슬라이드 이동 및 활성 인덱스 관리가 별도로 필요한 경우 커스텀 훅으로 분리할 수 있습니다.
- 불필요한 커스텀 훅은 생성하지 않습니다.
- PC 및 모바일 환경에 맞는 반응형 슬라이드를 구현합니다.
- 슬라이드 이동 기능을 별도 JavaScript로 직접 구현하지 않습니다.

### 8.3 슬라이드 옵션 설계

| 옵션 | Swiper 속성 | 적용 기준 |
|---|---|---|
| 화면에 표시할 슬라이드 수 | `slidesPerView` | 화면 디자인에 따라 설정 |
| 슬라이드 간격 | `spaceBetween` | 디자인에 따라 설정 |
| 반응형 | `breakpoints` | PC / 태블릿 / 모바일 |
| 자동 재생 | `autoplay` | 요구사항에 있을 때만 |
| 반복 재생 | `loop` | 요구사항에 있을 때만 |
| 페이지네이션 | `pagination` | 디자인에 있을 때만 |
| 이전 / 다음 버튼 | `navigation` | 디자인에 있을 때만 |
| 전환 속도 | `speed` | 요구사항에 따라 설정 |

### 8.4 반응형 설계

- 기본 슬라이드 옵션은 모바일 환경을 기준으로 정의합니다.
- 태블릿 및 PC에서는 Swiper `breakpoints` 옵션을 사용합니다.
- 기본 기준은 `768px`, `1024px`입니다.
- 실제 표시 개수와 간격은 화면별 디자인에 따라 결정합니다.
- CSS로 처리할 수 있는 레이아웃은 CSS를 우선 사용합니다.

### 8.5 슬라이드 데이터 구조

```ts
interface SlideItem {
    id: string;
    title: string;
    image?: string;
    link?: string;
}
```

- 슬라이드 목록은 배열로 관리합니다.
- 각 슬라이드는 고유한 `id`를 가집니다.
- 실제 필요한 속성만 추가합니다.
- 공용 타입으로 사용하는 경우 `src/types/`에 정의합니다.

### 8.6 스타일 설계

- Swiper 기본 스타일은 공식 CSS import를 사용합니다.
- 추가 슬라이드 스타일은 `src/assets/css/common.css`에 작성합니다.
- 일반 페이지별 CSS 파일은 만들지 않습니다. `ia.css`, `guide.css`만 별도 관리 페이지의 예외로 허용합니다.
- Swiper 클래스에 스타일을 적용할 때는 가능한 한 상위 컴포넌트 클래스로 범위를 제한합니다.
- 기존 Swiper 기능을 방해하는 CSS를 작성하지 않습니다.

## 9. 커스텀 훅 설계

### 9.1 기본 원칙

- 여러 컴포넌트에서 반복되는 React 상태 및 이벤트 로직을 재사용할 때 커스텀 훅을 사용합니다.
- 커스텀 훅은 `src/hooks/`에서 관리합니다.
- 이름은 `useXxx.ts` 형식으로 작성합니다.
- 단순 데이터 변환 및 계산은 `src/utils/`에서 관리합니다.
- 하나의 컴포넌트에서만 사용하는 간단한 상태는 해당 컴포넌트 내부에서 관리합니다.
- 커스텀 훅은 필요한 경우에만 생성합니다.

### 9.2 커스텀 훅 설계 예시

| 훅 | 목적 | 사용 대상 |
|---|---|---|
| `useWindowSize` | 브라우저 화면 크기 추적 | 화면 크기에 따른 JavaScript 처리 |
| `useOutsideClick` | 외부 영역 클릭 감지 | 메뉴, 팝업 등 |
| `useScroll` | 스크롤 위치 및 상태 관리 | Header 등 |
| `useSlider` | Swiper 관련 공통 상태 로직 | 여러 슬라이드에서 별도 로직이 필요한 경우 |

> 위 목록은 설계 예시입니다. 실제로 필요한 훅만 구현합니다.

### 9.3 hooks와 utils 구분

| 구분 | hooks | utils |
|---|---|---|
| 위치 | `src/hooks/` | `src/utils/` |
| 목적 | React 로직 재사용 | 일반 함수 재사용 |
| 상태 관리 | React Hooks 사용 가능 | React Hooks 사용 안 함 |
| 사용 예시 | `useWindowSize()` | `formatDate()` |

## 10. 결정 기록 (ADR)

> 중요한 기술 결정과 그 이유를 기록합니다.
> 코딩 규칙의 공식 원본은 `AGENTS.md`이며, 이 표에는 설계 결정의 배경만 기록합니다.

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-11-13 | 일반 페이지 CSS 단일 파일 사용 | 일반 페이지 스타일 관리 일관성 유지 |
| 2026-11-13 | CSS Modules 사용하지 않음 | `AGENTS.md`의 CSS 정책 준수 |
| 2026-11-13 | 상태 관리 라이브러리 미사용 | 현재 퍼블리싱 규모에서는 React 내장 기능으로 충분 |
| 2026-11-13 | Swiper 라이브러리 사용 | 슬라이드 기능의 일관성 및 유지보수 |
| 2026-11-13 | 공통 React 로직은 커스텀 훅으로 분리 | 중복 코드 감소 및 재사용성 확보 |
| 2026-11-13 | 공통 레이아웃 시맨틱 태그 및 ID 고정 | Header, main, Footer 구조와 선택자 일관성 확보 |
| 2026-11-16 | IA·Guide 전용 CSS 분리 | 관리 페이지와 일반 페이지 스타일 간섭 방지 |
| 2026-11-16 | IA에 Guide 필수 등록 | 공통 컴포넌트 가이드 접근 경로 보장 |
| 2026-11-23 | 퍼블리싱 폴더(`pub/`) 폐지, 컴포넌트·페이지 파일 단위 관리 | 구조 단순화. 2026-11-13 "퍼블리싱 폴더 분리" 결정을 대체 |

---

## 11. 설계 변경 관리

- 기능 요구사항이 변경되면 `docs/requirements.md`를 먼저 확인합니다.
- 컴포넌트 구조, 데이터 흐름, 인터랙션 등이 변경되면 이 문서를 갱신합니다.
- 코딩 규칙이나 라이브러리 정책 변경은 `AGENTS.md`에서 관리합니다.
- 작업 진행 상태는 `docs/tasks.md`에서 관리합니다.
- 실제 코드와 설계 문서가 다르면 임의로 수정하지 않고 차이를 확인합니다.
- 설계에 없는 기능은 사용자 확인 없이 임의로 추가하지 않습니다.

### 11.1 IA·Guide 작업 완료 검증

- `/Ia`와 `/Guide`가 독립 라우트로 접속되는지 확인합니다.
- `/Ia`의 목록 최상단에 `/Guide` 링크가 항상 존재하는지 확인합니다.
- `ia.css`, `guide.css`, `common.css`의 스타일이 다른 페이지에 영향을 주지 않는지 확인합니다.
- 페이지 추가 시 IA, 공통 컴포넌트 추가·수정 시 Guide 갱신 여부를 확인합니다.

## 12. 프로젝트 템플릿 분리 및 검증

- 일반 페이지 루트는 `#siteWrap`이며, 디자인 토큰도 그 안에 선언합니다.
- `/Ia`, `/Guide`는 Layout 밖 독립 라우트로 두고 전용 CSS와 기존 동작을 유지합니다.
- 페이지/라우트 변경 시 `src/data/iaData.ts`, 공통 컴포넌트 변경 시 Guide를 동기화합니다.
- `scripts/check-project.mjs`는 기본 정적 점검용이며 실제 브라우저 동작 검증을 대체하지 않습니다.
