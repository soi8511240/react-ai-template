# IA 페이지 명세 (`docs/ia-spec.md`)

> IA(Information Architecture) 관리 화면 `/Ia`의 상세 명세입니다 (AGENTS.md 6.2절). 공통 규칙은 `AGENTS.md`를 따릅니다.

## 0. 개요

> **이 문서가 IA 화면의 디자인·마크업·기능 기준 원본(SSOT)입니다.**
> 별도의 `Ia.tsx` 파일 없이 이 문서만으로 동일한 IA 화면을 구현합니다. 아래 코드와 CSS는 원본 `Ia.tsx`(2026-11-13 반영)에서 마크업·문구·동작·스타일 값을 그대로 옮긴 것입니다.

**목적과 위치**

- IA는 퍼블리싱 화면 목록, 파일 연결, 진행 상태 및 작업 현황을 확인하는 **관리용 페이지**입니다.
- 파일 구성은 아래 4개이며, 이 구성 외의 IA 전용 파일을 만들지 않습니다.

| 파일 | 내용 | 기준 |
| --- | --- | --- |
| `src/pages/Ia.tsx` | IA 화면 컴포넌트 | 2절 코드 그대로 사용 |
| `src/data/iaData.ts` | `TASKS`, `IA_INFO`, `IA_TABLES` | 3절 템플릿에 프로젝트 화면 목록 작성 |
| `src/types/index.ts` | `TaskKey`, `Cell`, `HeaderCell`, `IaTable` | 3절 타입 추가 |
| `src/assets/css/ia.css` | IA 독립 스타일 | 4절 CSS 그대로 추가 |

- 라우트는 `/Ia`로 고정하고, 일반 서비스의 `Header / Footer / Layout`을 적용하지 않는 **독립 화면**으로 등록합니다.
- `Ia.tsx`는 `ia.css`를 직접 import합니다. `/Guide`는 `Guide.tsx`에서 `guide.css`를 import합니다. 두 관리 화면 모두 일반 페이지의 `common.css` 스타일에 의존하지 않도록 필요한 기본 스타일을 전용 CSS에 명시합니다.

```tsx
<Routes>
    {/* IA 관리 화면: 공통 Header·Footer·Layout을 적용하지 않는 독립 화면 (docs/ia-spec.md) */}
    <Route path="/Ia" element={<Ia />} />
    {/* 일반 페이지는 Layout 안에서 렌더링 */}
    <Route element={<Layout><Outlet /></Layout>}>...</Route>
</Routes>
```

- 개발 서버 접속 주소는 `http://localhost:5173/Ia`이며 실제 포트는 프로젝트 설정을 따릅니다.

## 1. 디자인·기능 유지 규칙

- 기존 IA 디자인은 **100% 유지**합니다. 사용자의 별도 승인 없이 색상, 타이포그래피, 간격, 테이블 구조, 표시 문구, 상호작용을 변경하지 않습니다.
- 유지할 화면 구성(위에서 아래 순서):
    1. `header > h1` — `<em>{프로젝트명}</em>, Front-end Web developer Worksheet`
    2. `nav` — 메뉴(테이블)별 앵커 링크 (`#menuIdx1` …), 상단 고정 위치
    3. `section.noticeWrap` — 원형 `*Notice` 배지(색상 순환 애니메이션)와 상태 설명 문구
    4. `footer` — Total Count 표 (메뉴별·상태별 집계, 상태별 배경색)
    5. `section.filterWrap` — `All` + 상태별 체크박스 필터 (체크 즉시 적용)
    6. `section` — Worksheet 제목과 메뉴별 표 (`h3`에 `Menu1:` 자동 번호, `caption`에 `Target path :`)
    7. `iframe.previewIframe` — 파일명 링크에 마우스를 올리면 화면 왼쪽에 400px 미리보기
- 상태 이름과 키는 `Undone(0)`, `Done(1)`, `Modify(2)`, `Delete(3)`로 고정합니다.
- 파일명 링크는 새 창(`target="_blank"`)으로 열고, 링크 경로는 실제 React Router 경로와 일치해야 합니다.
- 미리보기 iframe 내부 `#wrap` 축소는 동일 출처이고 `#wrap`이 있는 페이지에서만 동작합니다. 없으면 축소 없이 미리보기만 표시합니다.
- Done/Modify 날짜 색상(`delayBefore/After/Today/Error`)은 원본 로직대로 클래스명에 `dueDate`가 포함된 셀에만 적용됩니다. (원본 데이터의 날짜 셀은 `date` 클래스이므로 색상 없이 가운데 정렬로 표시)

**원본에서 바꾸는 것 (이것만 다름)**

| 원본 `Ia.tsx` | 새 구현 | 이유 |
| --- | --- | --- |
| 컴포넌트 안 `<style>` 태그 | `ia.css` `#iaWrap` 범위 규칙 (4절) | 독립 페이지 CSS 정책 (AGENTS.md 5.3) |
| `useEffect`로 `style[type="text/css"]` 전부 삭제 | **구현하지 않음** | 다른 화면 스타일까지 삭제됨 |
| 최상위 Fragment `<>` | `<div id="iaWrap">` | CSS 범위 제한 기준 |
| `h3` 인라인 `style={{marginTop: 50, marginBottom: 10}}` | `className="menuTitle"` + CSS | 인라인 스타일 금지 (AGENTS.md 5.3) |
| `function`·`toggleAll` 등 이름 | `const` 화살표 함수, `handle` 접두어 | 코딩 규칙 (AGENTS.md 5.1) |
| 데이터가 컴포넌트 파일 안에 있음 | `src/data/iaData.ts` 분리 | 데이터 관리 규칙 |

## 2. IA 컴포넌트 (`src/pages/Ia.tsx`) — 그대로 사용

```tsx
import { useMemo, useState } from 'react';
import type { FormEvent, SyntheticEvent } from 'react';
import { IA_INFO, IA_TABLES, TASKS } from '../data/iaData';
import type { Cell, TaskKey } from '../types';

// IA 관리 화면 (/Ia) — docs/ia-spec.md 기준
// - 마크업·표시 문구·동작은 원본 Ia.tsx와 동일하게 유지합니다.
// - 원본의 <style> 태그와 전역 style 제거 useEffect는 사용하지 않고, 스타일은 ia.css의 #iaWrap 범위에 있습니다.
// - 공통 Header·Footer·Layout을 적용하지 않는 독립 화면입니다.

const hasClass = (cell: Cell, className: string) => cell.className.split(' ').includes(className);

const getTaskKey = (row: Cell[]): TaskKey => {
    const task = row.find((cell) => hasClass(cell, 'checkTask'))?.text;
    return TASKS.some((item) => item.key === task) ? (task as TaskKey) : '0';
};

const getTaskName = (key: TaskKey) => TASKS.find((task) => task.key === key)?.name ?? 'Undone';

const getFileHref = (path: string, row: Cell[]) => {
    const fileName = row.find((cell) => hasClass(cell, 'fileName'))?.text ?? '';
    const filePath = row.find((cell) => hasClass(cell, 'filePath'))?.text ?? '';
    return [path.replace(/\/$/, ''), filePath.replace(/^\/|\/$/g, ''), fileName].filter(Boolean).join('/');
};

const getDueDateClass = (date: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'delayError';
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayText = `${yyyy}-${mm}-${dd}`;
    if (date > todayText) return 'delayBefore';
    if (date < todayText) return 'delayAfter';
    return 'delayToday';
};

const countTasks = (rows: Cell[][]) => {
    const counts = Object.fromEntries(TASKS.map((task) => [task.key, 0])) as Record<TaskKey, number>;
    rows.forEach((row) => counts[getTaskKey(row)]++);
    return counts;
};

const Ia = () => {
    const [selectedTasks, setSelectedTasks] = useState<TaskKey[]>(TASKS.map((task) => task.key));
    const [previewUrl, setPreviewUrl] = useState('');

    const allChecked = selectedTasks.length === TASKS.length;

    const totalCounts = useMemo(() => countTasks(IA_TABLES.flatMap((table) => table.rows)), []);

    const handleToggleAll = () => setSelectedTasks(allChecked ? [] : TASKS.map((task) => task.key));

    const handleToggleTask = (key: TaskKey) => {
        setSelectedTasks((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
    };

    const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    // 미리보기 iframe 내부 #wrap 축소: 동일 출처이고 #wrap이 있는 페이지에서만 동작합니다.
    const handlePreviewLoad = (event: SyntheticEvent<HTMLIFrameElement>) => {
        try {
            const wrap = event.currentTarget.contentDocument?.querySelector<HTMLElement>('#wrap');
            if (wrap) {
                wrap.style.transform = 'scale(0.16923076923076924)';
                wrap.style.transformOrigin = '0 0';
            }
        } catch {
            // 다른 origin의 페이지는 iframe 내부 DOM에 접근할 수 없습니다.
        }
    };

    return (
        <div id="iaWrap">
            <header>
                <h1><em>{IA_INFO.title}</em>, Front-end Web developer Worksheet</h1>
            </header>

            <nav>
                <h2>Navigation</h2>
                <ul>
                    {IA_TABLES.map((table) => (
                        <li key={table.id}><a href={`#${table.id}`}>{table.title}</a></li>
                    ))}
                </ul>
            </nav>

            <section className="noticeWrap">
                <h2>Notice</h2>
                <ul>
                    <li>{IA_INFO.notice}</li>
                </ul>
            </section>

            <footer>
                <h2>Total Count</h2>
                <table>
                    <caption>Task total count</caption>
                    <thead>
                        <tr>
                            <th scope="col">Menu</th>
                            {TASKS.map((task) => (
                                <th scope="col" key={task.key}><i>{task.name}</i><b>{task.key}</b></th>
                            ))}
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {IA_TABLES.map((table) => {
                            const counts = countTasks(table.rows);
                            return (
                                <tr key={table.id}>
                                    <th scope="row">{table.title}</th>
                                    {TASKS.map((task) => <td key={task.key}>{counts[task.key]}</td>)}
                                    <td>{table.rows.length}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row">Total</th>
                            {TASKS.map((task) => <td key={task.key}>{totalCounts[task.key]}</td>)}
                            <td>{IA_TABLES.reduce((sum, table) => sum + table.rows.length, 0)}</td>
                        </tr>
                    </tfoot>
                </table>
            </footer>

            <section className="filterWrap">
                <h2>Task Key/Filter</h2>
                <form onSubmit={handleFilterSubmit}>
                    <fieldset>
                        <legend>Filter option(It&apos;ll be automatically applied)</legend>
                        <label><input type="checkbox" checked={allChecked} onChange={handleToggleAll} />All</label>
                        {TASKS.map((task) => (
                            <label key={task.key}>
                                <input
                                    type="checkbox"
                                    checked={selectedTasks.includes(task.key)}
                                    onChange={() => handleToggleTask(task.key)}
                                />
                                <b className={task.key === '0' ? 'default' : undefined}>{task.key}</b><i>{task.name}</i>
                            </label>
                        ))}
                    </fieldset>
                </form>
            </section>

            <section>
                <h2>{IA_INFO.worksheet}</h2>
                {IA_TABLES.map((table) => {
                    const visibleRows = table.rows.filter((row) => selectedTasks.includes(getTaskKey(row)));
                    const tableCounts = countTasks(table.rows);

                    return (
                        <div key={table.id}>
                            <h3 id={table.id} className="menuTitle">{table.title}</h3>
                            <table>
                                <caption>{table.path}</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" className="pageNumber">Number</th>
                                        {table.headers.map((header, index) => (
                                            <th scope="col" className={header.className || undefined} key={`${header.text}-${index}`}>
                                                {header.text}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleRows.map((row) => {
                                        const originalIndex = table.rows.indexOf(row);
                                        const taskKey = getTaskKey(row);
                                        return (
                                            <tr key={`${table.id}-${originalIndex}`}>
                                                <td className="pageNumber">{originalIndex + 1}</td>
                                                {row.map((cell, cellIndex) => {
                                                    const isFileName = hasClass(cell, 'fileName');
                                                    const isTask = hasClass(cell, 'checkTask');
                                                    const isDueDate = hasClass(cell, 'dueDate');
                                                    const className = [cell.className, isDueDate ? getDueDateClass(cell.text) : '']
                                                        .filter(Boolean)
                                                        .join(' ');
                                                    const href = isFileName && cell.text ? getFileHref(table.path, row) : '';
                                                    return (
                                                        <td className={className} data-task={isTask ? taskKey : undefined} key={cellIndex}>
                                                            {isFileName && cell.text ? (
                                                                <a
                                                                    href={href}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    onMouseEnter={() => setPreviewUrl(href)}
                                                                    onMouseLeave={() => setPreviewUrl('')}
                                                                >
                                                                    {cell.text}
                                                                </a>
                                                            ) : isTask ? getTaskName(taskKey) : cell.text}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    {TASKS.map((task) => (
                                        <tr key={task.key}>
                                            <th scope="row" colSpan={table.headers.length}><i>{task.name}</i><b>{task.key}</b></th>
                                            <td>{tableCounts[task.key]}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <th scope="row" colSpan={table.headers.length}>Total</th>
                                        <td>{table.rows.length}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    );
                })}
            </section>

            {previewUrl && (
                <iframe className="previewIframe" src={previewUrl} title="페이지 미리보기" onLoad={handlePreviewLoad} />
            )}
        </div>
    );
};

export default Ia;
```

## 3. IA 데이터 구조 (`src/types/index.ts`, `src/data/iaData.ts`)

**타입** — `src/types/index.ts`에 추가합니다. (원본 타입 이름 유지)

```ts
// IA 관리 화면 (docs/ia-spec.md 원본 구조 유지)
// Task 상태: 0 Undone(코딩중), 1 Done(코딩완료), 2 Modify(완료 후 수정), 3 Delete(완료 후 삭제)
export type TaskKey = '0' | '1' | '2' | '3';

export interface Cell {
    className: string;
    text: string;
}

export interface HeaderCell {
    className: string;
    text: string;
}

export interface IaTable {
    id: string;
    title: string;
    path: string;
    headers: HeaderCell[];
    rows: Cell[][];
}
```

**데이터 템플릿** — `src/data/iaData.ts`. 구조는 그대로 두고 `IA_INFO`와 `IA_TABLES`의 화면 목록만 프로젝트에 맞게 작성합니다.

```ts
import type { Cell, HeaderCell, IaTable, TaskKey } from '../types';

// IA 관리 화면 데이터 (docs/ia-spec.md)
// - 화면 목록은 docs/requirements.md 페이지 목록과 실제 React Router 경로 기준입니다.
// - Task 상태는 docs/tasks.md 완료 기록 기준이며, 페이지를 추가·수정하면 이 파일도 함께 갱신합니다.

export const TASKS: { key: TaskKey; name: string }[] = [
    { key: '0', name: 'Undone' },
    { key: '1', name: 'Done' },
    { key: '2', name: 'Modify' },
    { key: '3', name: 'Delete' }
];

// 프로젝트마다 바꾸는 값: title(h1 <em> 문구), worksheet(작업 영역 제목)
// notice 문구는 원본 그대로 유지합니다.
export const IA_INFO = {
    title: '프로젝트 이름',
    worksheet: 'Worksheet: Web',
    notice: 'Undone: 코딩중, Done: 코딩완료, Modify: 코딩 완료 후 HTML수정, Delete: 코딩 완료 후 SB삭제'
};

// 메뉴 깊이 열 개수 (원본 기본값: 5~6. 프로젝트 메뉴 깊이에 맞게 조정)
const DEPTH_COUNT = 2;

const createHeaders = (depthCount: number): HeaderCell[] => [
    ...Array.from({ length: depthCount }, (_, index) => ({ className: 'menuDepth', text: `Depth${index + 1}` })),
    { className: 'fileName', text: 'File Name/ID' },
    { className: 'dueDate', text: 'Done/Modify' },
    { className: 'people', text: 'People' },
    { className: 'issueMemo', text: 'Issue/Memo' },
    { className: 'checkTask', text: 'Task' }
];

interface RowOption {
    date?: string;
    people?: string;
    memo?: string;
    task?: TaskKey;
}

// depths: 메뉴 깊이별 이름 (상위 메뉴와 같은 행이 아니면 빈 문자열)
// fileName: 실제 React Router 경로 (IA에서 새 창 열기·미리보기 링크로 사용)
// task 기본값은 '0'(Undone). 검증된 페이지만 '1'(Done)로 바꿉니다.
const createRow = (depths: string[], fileName: string, option: RowOption = {}): Cell[] => {
    const { date = '', people = '', memo = '', task = '0' } = option;
    return [
        ...Array.from({ length: DEPTH_COUNT }, (_, index) => ({ className: 'menuDepth', text: depths[index] ?? '' })),
        { className: 'fileName', text: fileName },
        { className: 'date', text: date },
        { className: 'people', text: people },
        { className: 'issueMemo', text: memo },
        { className: 'checkTask', text: task }
    ];
};

// 예시: 메뉴(테이블)마다 id는 menuIdx1부터 순서대로 부여합니다.
// Guide는 필수 고정 항목이며 항상 첫 번째(menuIdx1)에 둡니다. (docs/guide-spec.md)
export const IA_TABLES: IaTable[] = [
    {
        id: 'menuIdx1',
        title: 'Guide',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [createRow(['Guide'], '/Guide')]
    },
    {
        id: 'menuIdx2',
        title: '메인',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [createRow(['메인'], '/', { date: 'YYYY-MM-DD', task: '1' })]
    },
    {
        id: 'menuIdx3',
        title: '회사소개',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [
            createRow(['회사소개'], '/about'),
            createRow(['', '오시는 길'], '/about/location', { memo: '지도 API 미정' })
        ]
    }
];
```

**셀 규칙**

| 열 | `className` | 내용 |
| --- | --- | --- |
| 메뉴 깊이 | `menuDepth` | 해당 깊이의 메뉴명. 상위 메뉴와 같은 행이 아니면 빈 문자열 |
| 파일명/ID | `fileName` | 실제 라우트 경로. 값이 있으면 새 창 링크 + 미리보기 |
| (선택) 하위 경로 | `filePath` | 필요할 때만. 링크 = `table.path` + `filePath` + `fileName` |
| 완료/수정일 | `date` | `YYYY-MM-DD` |
| 담당자 | `people` | 이름 |
| 이슈/메모 | `issueMemo` | 특이사항 |
| 상태 | `checkTask` | `'0'`~`'3'`. 그 외 값은 `'0'`(Undone)으로 처리 |

**화면 목록 관리**

- 실제 IA 목록은 `docs/requirements.md`, `docs/design.md`, 생성된 `src/pages/` 페이지를 기준으로 등록합니다. 임의로 화면이나 완료 상태를 만들지 않습니다.
- 미완료 페이지를 `Done`으로 표시하지 않습니다. `docs/tasks.md`에서 검증 완료된 페이지만 `'1'`로 바꿉니다.
- 페이지 추가·수정 시 IA 항목의 메뉴명, 파일명(경로), 상태를 함께 갱신합니다.
- **필수 고정 항목:** `/Guide` 페이지는 공통 컴포넌트 유무와 관계없이 `/Ia` 화면 목록에 반드시 포함합니다. `src/pages/Guide.tsx` 및 `/Guide` 라우트를 생성·유지하고 `IA_TABLES`에 `Guide` 행을 등록합니다. 삭제하거나 누락하지 않습니다.
- Guide의 상태는 실제 작업 및 검증 결과를 따르며, 미완료 상태를 임의로 `Done`으로 표시하지 않습니다.
- `docs/tasks.md`(작업 공식 기록)와 IA 상태가 다르면 사용자에게 확인하며 임의로 덮어쓰지 않습니다.
- 과거 프로젝트의 메뉴·파일명·화면 ID(예: `SMSCO00001M`)는 새 프로젝트 데이터로 사용하지 않습니다.

## 4. IA 스타일 (`src/assets/css/ia.css`) — 그대로 추가

- 원본 `<style>`의 모든 규칙을 **값 변경 없이** `#iaWrap` 범위로 옮긴 결과입니다. 변환 규칙: 각 선택자 앞에 `#iaWrap ` 추가, `body` → `#iaWrap`, `html input[...]` → `input[...]`, normalize의 `body{margin:0}`·`html{...}`·빈 규칙 제외, `@keyframes`는 범위 지정이 불가하여 그대로 둠.
- `08-1`은 프로젝트 공통 리셋(`box-sizing: border-box`, `ul` 목록 스타일 제거)을 IA 안에서만 원본 기본값으로 되돌리는 보정입니다.
- 일반 페이지 CSS가 IA에 영향을 주지 않고, IA CSS가 일반 페이지(`#header`, `#container`, `#footer`)에 영향을 주지 않는지 확인합니다.

```css
/* 08. IA 관리 화면 (/Ia) --------------------------------------------------- */
/* docs/ia-spec.md: 원본 Ia.tsx <style>의 규칙을 값 변경 없이 #iaWrap 범위로 옮겼습니다.
   - body 규칙 → #iaWrap, html input[...] → input[...]
   - normalize의 body{margin:0}, html{...}, 빈 규칙(q{}, h1 em::before{})은 제외
   - @keyframes bgChange는 범위 지정이 불가하여 그대로 둡니다. */

/* 08-1. 일반 페이지 스타일과 분리: IA는 원본처럼 브라우저 기본값 기준으로 표시 */
#iaWrap,
#iaWrap *,
#iaWrap *::before,
#iaWrap *::after {
    box-sizing: content-box;
}

#iaWrap ul {
    padding-left: 40px;
    list-style: disc;
}

/* 08-2. 원본 Ia.tsx 인라인 스타일(h3 style={{marginTop: 50, marginBottom: 10}})을 옮긴 규칙 */
#iaWrap h3.menuTitle {
    margin-top: 50px;
    margin-bottom: 10px;
}

/* 08-3. 원본 Ia.tsx <style> (범위 지정본) */
#iaWrap article, #iaWrap aside, #iaWrap details, #iaWrap figcaption, #iaWrap figure, #iaWrap footer, #iaWrap header, #iaWrap hgroup, #iaWrap main, #iaWrap nav, #iaWrap section, #iaWrap summary {display: block}
#iaWrap audio, #iaWrap canvas, #iaWrap video {display: inline-block}
#iaWrap audio:not([controls]) {display: none;height: 0;}
#iaWrap [hidden], #iaWrap template {display: none}
#iaWrap a {background: transparent;text-decoration: none;}
#iaWrap a:focus {outline: thin dotted}
#iaWrap a:active, #iaWrap a:hover {outline: 0}
#iaWrap h1 {font-size: 2em;margin: 0.67em 0;}
#iaWrap abbr[title] {border-bottom: 1px dotted}
#iaWrap b, #iaWrap strong {font-weight: bold}
#iaWrap dfn {font-style: italic}
#iaWrap hr {-moz-box-sizing: content-box;box-sizing: content-box;height: 0;}
#iaWrap mark {background: #ff0;color: #000;}
#iaWrap code, #iaWrap kbd, #iaWrap pre, #iaWrap samp {font-family: monospace, serif;font-size: 1em;}
#iaWrap pre {white-space: pre-wrap}
#iaWrap small {font-size: 80%}
#iaWrap sub, #iaWrap sup {font-size: 75%;line-height: 0;position: relative;vertical-align: baseline;}
#iaWrap sup {top: -0.5em}
#iaWrap sub {bottom: -0.25em}
#iaWrap img {border: 0}
#iaWrap svg:not(:root) {overflow: hidden}
#iaWrap figure {margin: 0}
#iaWrap fieldset {border: 1px solid #c0c0c0;margin: 0 2px;padding: 0.35em 0.625em 0.75em;}
#iaWrap legend {border: 0;padding: 0;}
#iaWrap button, #iaWrap input, #iaWrap select, #iaWrap textarea {font-family: inherit;font-size: 100%;margin: 0;}
#iaWrap button, #iaWrap input {line-height: normal}
#iaWrap button, #iaWrap select {text-transform: none}
#iaWrap button, #iaWrap input[type="button"], #iaWrap input[type="reset"], #iaWrap input[type="submit"] {-webkit-appearance: button;cursor: pointer;}
#iaWrap button[disabled], #iaWrap input[disabled] {cursor: default}
#iaWrap input[type="checkbox"], #iaWrap input[type="radio"] {box-sizing: border-box;padding: 0;}
#iaWrap input[type="search"] {-webkit-appearance: textfield;-moz-box-sizing: content-box;-webkit-box-sizing: content-box;box-sizing: content-box;}
#iaWrap input[type="search"]::-webkit-search-cancel-button, #iaWrap input[type="search"]::-webkit-search-decoration {-webkit-appearance: none}
#iaWrap button::-moz-focus-inner, #iaWrap input::-moz-focus-inner {border: 0;padding: 0;}
#iaWrap textarea {overflow: auto;vertical-align: top;}
#iaWrap table {border-collapse: collapse;border-spacing: 0;}
#iaWrap section:not([class]) tr [data-task="0"], #iaWrap tfoot tr:nth-child(1) th, #iaWrap footer thead th:nth-child(2), #iaWrap footer tfoot td:nth-child(2) {color: #b90b0b;background-color: #feeeee;}
#iaWrap section:not([class]) tr [data-task="1"], #iaWrap tfoot tr:nth-child(2) th, #iaWrap footer thead th:nth-child(3), #iaWrap footer tfoot td:nth-child(3) {color: #5f8b33;background-color: #eaf5e1;}
#iaWrap section:not([class]) tr [data-task="2"], #iaWrap tfoot tr:nth-child(3) th, #iaWrap footer thead th:nth-child(4), #iaWrap footer tfoot td:nth-child(4) {color: #f2ac1a;background-color: #fffbe5;}
#iaWrap section:not([class]) tr [data-task="3"], #iaWrap tfoot tr:nth-child(4) th, #iaWrap footer thead th:nth-child(5), #iaWrap footer tfoot td:nth-child(5) {color: #23485a;background-color: #eef7fc;}
#iaWrap section:not([class]) tr [data-task="4"], #iaWrap tfoot tr:nth-child(5) th, #iaWrap footer thead th:nth-child(6), #iaWrap footer tfoot td:nth-child(6) {color: #892997;background-color: #f4eefc;}
#iaWrap .delayBefore {color: #5f8b33}
#iaWrap .delayAfter {color: #b90b0b}
#iaWrap .delayToday {color: #23485a}
#iaWrap .delayError {color: #f2ac1a}
#iaWrap nav + h2, #iaWrap footer b, #iaWrap tfoot b, #iaWrap footer h2, #iaWrap footer caption {display: block;overflow: hidden;position: absolute;left: 0;top: 0;width: 1px;height: 1px;text-indent: -1px;}
#iaWrap {min-width: 1000px;margin: 100px auto 0;padding-bottom: 50px;color: #777;border-bottom: 20px solid #333;font: .75em/1 "helveticaneue-light", "helvetica neue light", "helvetica neue", helvetica, arial, sans-serif;}
#iaWrap section, #iaWrap footer, #iaWrap header {width: 95%;margin: auto;}
#iaWrap h1, #iaWrap h2, #iaWrap h3 {color: #333;font-weight: normal;letter-spacing: -1px;}
#iaWrap h1 {position: relative;margin-bottom: 50px;padding: 50px 0 25px;border: 4px double #eee;border-width: 4px 0 1px;font: italic 2.3em "droid serif", georgia, times, serif;}
#iaWrap h1 em {font-size: 1.5em}
#iaWrap h2 {letter-spacing: 1px}
#iaWrap nav h2 {width: 95%;height: 30px;margin: 0 auto;padding: 0;font-size: 1.2em;line-height: 30px;}
#iaWrap nav h2::after {content: ": "}
#iaWrap .noticeWrap h2 {position: absolute;top: 0;right: 0;bottom: 0;left: 0;margin: auto auto auto 10px;width: 150px;height: 150px;border-radius: 150px;color: #fff;font-size: 2em;text-align: center;line-height: 150px;letter-spacing: 3px;background-color: #666;animation: bgChange 5s linear 2s;-webkit-animation: bgChange 5s linear 2s;}
#iaWrap .noticeWrap h2::before {content: "*"}
@keyframes bgChange {0% { color: #fff;background-color: #ccc;} 10%{color: #b90b0b;background-color: #feeeee;} 20%{color: #5f8b33;background-color: #eaf5e1;} 30%{color: #f2ac1a;background-color: #fffbe5;} 40%{color: #23485a;background-color: #eef7fc;} 50%{color: #892997;background-color: #f4eefc;} 60%{color: #23485a;background-color: #eef7fc;} 70%{color: #f2ac1a;background-color: #fffbe5;} 80%{color: #5f8b33;background-color: #eaf5e1;} 90%{color: #b90b0b;background-color: #feeeee;} 100%{color: #fff;background-color: #ccc;}}
@-webkit-keyframes bgChange {0% { color: #fff;background-color: #ccc;} 10%{color: #b90b0b;background-color: #feeeee;} 20%{color: #5f8b33;background-color: #eaf5e1;} 30%{color: #f2ac1a;background-color: #fffbe5;} 40%{color: #23485a;background-color: #eef7fc;} 50%{color: #892997;background-color: #f4eefc;} 60%{color: #23485a;background-color: #eef7fc;} 70%{color: #f2ac1a;background-color: #fffbe5;} 80%{color: #5f8b33;background-color: #eaf5e1;} 90%{color: #b90b0b;background-color: #feeeee;} 100%{color: #fff;background-color: #ccc;}}
#iaWrap .filterWrap h2 {margin: 0 0 10px;font-size: 1.8em;text-align: center;}
#iaWrap section:not([class]) h2 {color: #eee;margin: 0;border-bottom: 2px solid;font: italic 3em "droid serif", georgia, times, serif;text-align: right;opacity: .7;}
#iaWrap h3 {margin: 50px 0 0 0;font-size: 1.8em;}
#iaWrap h3:before {counter-increment: menu;content: "Menu" counter(menu) ": ";font-size: .8em;letter-spacing: 0px;}
#iaWrap a {color: #205589;text-decoration: none;}
#iaWrap a:hover, #iaWrap a:focus {text-decoration: underline}
#iaWrap i {margin-right: 3px;font-style: normal;}
#iaWrap b {font-weight: normal}
#iaWrap ::selection {background: #f2ebff}
#iaWrap nav {overflow: hidden;position: absolute;top: 50px;left: 0;width: 100%;min-width: 1000px;}
#iaWrap nav ul {overflow: hidden;width: 95%;margin: -30px auto 0;padding: 0 0 10px;border-bottom: 5px solid #333;list-style: none;}
#iaWrap nav li, #iaWrap nav a {float: left}
#iaWrap nav a {position: relative;height: 30px;margin: 0 10px;color: #333;font-size: 1.2em;font-weight: bold;text-decoration: none;line-height: 30px;transition: .3s ease-out;}
#iaWrap nav a:hover {color: #b90b0b;transition: .3s;}
#iaWrap nav li:not(:first-child) a::before {content: "";display: block;position: absolute;top: 10px;left: -10px;width: 1px;height: 10px;background-color: #aaa;}
#iaWrap nav li:first-child a {margin-left: 90px}
#iaWrap section {counter-reset: menu;margin-top: 50px;padding: 25px 0;}
#iaWrap .noticeWrap {position: relative;min-height: 100px;margin-bottom: 25px;padding: 50px 0;border-bottom: 1px dashed #eee;}
#iaWrap .noticeWrap ul {margin: 0 10px 0 160px;line-height: 1.5;}
#iaWrap table {width: 100%;border: 1px solid #e0e0e0;border-bottom-width: 2px;font-size: .95em;}
#iaWrap caption {margin: -10px 0 5px;padding-bottom: 5px;border-bottom: 1px dashed #ccc;font-size: 1em;text-align: right;}
#iaWrap caption:before {content: "Target path : "}
#iaWrap thead th {color: #666;padding: 15px 5px;border: 1px solid #e0e0e0;border-bottom-width: 2px;font-weight: normal;background: #f3f3f3;}
#iaWrap tbody tr:nth-child(2n) td, #iaWrap tbody tr:nth-child(2n) th {background-color: #f8f8f8}
#iaWrap tbody th, #iaWrap tbody td {padding: 10px 5px;border: 1px solid #e0e0e0;font-weight: normal;background: #fcfcfc;transition: .3s ease-out;}
#iaWrap tbody tr:hover td {color: #000;background-color: #f3f9ff;transition: .3s;}
#iaWrap tbody td:last-child {text-align: center}
#iaWrap tfoot {border-top: 3px double #ccc}
#iaWrap tfoot th, #iaWrap tfoot td {color: #333;padding: 5px;border: 1px solid #e0e0e0;font-weight: normal;background: #fcfcfc;}
#iaWrap tfoot th {padding: 3px 10px;text-align: right;background-color: #eee;}
#iaWrap th:first-child {width: 6%}
#iaWrap .dueDate {width: 7%}
#iaWrap .dueDate, #iaWrap td:first-child {text-align: center}
#iaWrap footer {margin-top: -10px;margin-bottom: 25px;padding: 0 10px;}
#iaWrap footer table {text-align: center}
#iaWrap footer th, #iaWrap footer td {border-width: 3px;border-color: #fff;}
#iaWrap footer th:first-child {width: auto}
#iaWrap footer thead th {letter-spacing: 1px;font-size: 1.3em;background-color: #fff !important;}
#iaWrap footer thead th:first-child, #iaWrap footer tbody th:first-child {text-align: right;border-left-width: 1px;}
#iaWrap footer tbody tr:last-child th, #iaWrap footer tbody tr:last-child td {border-bottom-width: 15px}
#iaWrap footer tfoot th, #iaWrap footer tfoot td {padding: 10px;font-size: 1.5em;}
#iaWrap footer tfoot th:first-child {color: #666;background-color: #f3f3f3;}
#iaWrap .filterWrap {margin-top: 0;border-top: 1px dashed #eee;border-bottom: 1px dashed #ccc;background-color: #fcfcfc;}
#iaWrap .filterWrap fieldset {border: none;margin: 0;padding: 0 10px;overflow: hidden;text-align: center;}
#iaWrap .filterWrap legend {display: none}
#iaWrap .filterWrap label {display: inline-block;margin-right: 10px;padding: 5px 0;font-size: 1.2em;}
#iaWrap .filterWrap input {margin-right: 5px}
#iaWrap .filterWrap b::after {content: ":"}
#iaWrap .filterWrap i {margin-left: 5px}
#iaWrap .people {text-align:center}
#iaWrap nav a { letter-spacing: -1px; }
#iaWrap .design, #iaWrap .date { text-align: center; }
#iaWrap .previewIframe { display: block; position: fixed; top: 0; left: 0; background: #fff; width: 400px; height: 100%; border: 1px solid #000; z-index: 999; }
#iaWrap .delete { text-decoration: line-through; }
```

## 5. IA 구현 절차 (체크리스트)

1. `src/types/index.ts`에 3절 타입을 추가합니다.
2. `src/data/iaData.ts`를 3절 템플릿으로 만들고, `IA_INFO.title`과 `IA_TABLES` 화면 목록을 requirements.md·실제 라우트 기준으로 작성합니다.
3. `src/pages/Ia.tsx`를 2절 코드 그대로 만듭니다.
4. `src/assets/css/ia.css`에 4절 CSS를 작성하고 `Ia.tsx`에서 import합니다. `common.css`에는 IA 스타일을 추가하지 않습니다.
5. React Router에 `/Ia`, `/Guide`를 Layout 밖 독립 라우트로 등록하고, `Guide.tsx`에서 `guide.css`를 import합니다. `/Ia` 목록 최상단에 `Guide` 항목이 보이도록 `IA_TABLES`에 추가합니다.
6. 확인: `common.css`가 `/Ia`, `/Guide`에 영향을 주지 않고 각 전용 CSS가 일반 페이지에 영향을 주지 않는지 확인합니다. `/Ia`에서 상단 Navigation·Notice·Total Count·필터·메뉴별 표가 보이는지, 필터 체크 해제 시 행이 숨겨지는지, 파일명 링크 새 창 열기와 마우스 오버 미리보기가 되는지, 일반 페이지 스타일이 바뀌지 않았는지, `npm run build` 통과.
