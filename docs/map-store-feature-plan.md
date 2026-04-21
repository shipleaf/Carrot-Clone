# 지도 근처 매장 기능 설계

## 구현 진행 상황

| # | 항목 | 상태 | 비고 |
|---|---|---|---|
| 1 | Prisma + SQLite 세팅 + 스키마 정의 | ✅ 완료 | |
| 2 | seed 파일로 근처 매장 데이터 입력 | ✅ 완료 | 강남구 매장 5개 + 리뷰 10개 |
| 3 | `/api/stores/focus` API 구현 (Haversine 최근접 계산) | ✅ 완료 | |
| 4 | 카카오 맵 + 마커 렌더링 (`/api/stores` 전체 목록 사용) | ⬜ 미완료 | |
| 5 | 포커스 박스 CSS 오버레이 | ⬜ 미완료 | |
| 6 | `map.idle` → API 호출 → 바텀시트 표시 | ⬜ 미완료 | |
| 7 | 바텀시트 탭 UI (정보 / 메뉴 / 리뷰) | ⬜ 미완료 | |
| 8 | 미니 지도 (드래그/확대 비활성화 옵션 적용) | ⬜ 미완료 | |

---

## 구현 메모

### Prisma 7 주의사항
- Prisma 7부터 `new PrismaClient()` 에 드라이버 어댑터 필수 (`adapter` 또는 `accelerateUrl`)
- SQLite 어댑터: `@prisma/adapter-better-sqlite3` + `better-sqlite3`
- seed 설정은 `package.json`의 `"prisma"` 필드가 아닌 `prisma.config.ts`의 `migrations.seed`에 기재
- DB 파일 위치: 프로젝트 루트 `dev.db` (`DATABASE_URL="file:./dev.db"`)

### 추가된 파일
```
prisma/
  schema.prisma         - Store / StoreImage / StoreHours / MenuItem / Review / ReviewImage 모델
  seed.ts               - 강남구 매장 5개 + 리뷰 10개 시드 데이터
  migrations/
    20260421060930_init/
      migration.sql

app/
  lib/
    prisma.ts           - PrismaClient 싱글톤 (글로벌 캐시)
    haversine.ts        - Haversine 거리 계산 유틸
  api/
    stores/
      route.ts          - GET /api/stores?swLat=&swLng=&neLat=&neLng=
      focus/
        route.ts        - GET /api/stores/focus?swLat=&swLng=&neLat=&neLng=&centerLat=&centerLng=
```

### 추가된 패키지
```
dependencies:
  prisma, @prisma/client
  @prisma/adapter-better-sqlite3, better-sqlite3

devDependencies:
  dotenv, tsx
  @types/better-sqlite3
```

---

## 1. 화면 구성

```
┌─────────────────────────┐
│                         │
│      카카오 맵           │
│                         │
│      ┌───────┐          │  ← 포커스 박스 (화면 고정, CSS 오버레이)
│      │ focus │          │
│      └───────┘          │
│                         │
├─────────────────────────┤
│   바텀 시트              │  ← 포커스 박스 안 최근접 매장 1개
│   [매장 상세 정보]        │
└─────────────────────────┘
```

---

## 2. 포커스 박스 로직

- 포커스 박스는 CSS fixed로 지도 위에 고정된 UI 요소
- 지도가 **움직이는 동안** (`map.drag`): 이전 매장 정보 유지
- 지도가 **멈췄을 때** (`map.idle`): 포커스 박스 범위 계산 → API 호출 → 바텀시트 갱신

### 보여줄 매장 선택 기준

> **포커스 박스 중심점과 가장 가까운 매장 1개**

```
포커스 박스 중심 → 범위 안 매장들까지 거리 계산 (Haversine) → 최근접 1개 반환
```

- 범위 안에 매장이 없으면 바텀시트 숨김
- 거리 계산은 서버에서 처리

---

## 3. DB 스키마

### Store (매장 기본 정보)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | Int | PK |
| name | String | 매장명 |
| category | String | 카페 / 음식점 등 |
| lat | Float | 위도 |
| lng | Float | 경도 |
| address | String | 도로명 주소 |
| phone | String | 전화번호 |
| instagramUrl | String? | 인스타그램 주소 |
| description | String? | 매장 소개글 |
| ownerName | String | 점주 이름 |
| ownerProfileImageUrl | String? | 점주 프로필 사진 |
| createdAt | DateTime | 생성일 |

### StoreImage (매장 사진, 여러 장)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | Int | PK |
| storeId | Int | FK → Store |
| url | String | 이미지 URL |
| order | Int | 정렬 순서 |

### StoreHours (영업시간)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | Int | PK |
| storeId | Int | FK → Store |
| dayOfWeek | Int | 0=일 ~ 6=토 |
| openTime | String | "09:00" |
| closeTime | String | "22:00" |
| isClosed | Boolean | 휴무일 여부 |

### MenuItem (메뉴/가격)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | Int | PK |
| storeId | Int | FK → Store |
| name | String | 메뉴명 |
| price | Int | 가격 (원) |
| description | String? | 메뉴 설명 |
| imageUrl | String? | 메뉴 이미지 |

### Review (리뷰)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | Int | PK |
| storeId | Int | FK → Store |
| userId | String | 작성자 식별자 |
| userProfileImageUrl | String? | 작성자 프로필 사진 |
| rating | Int | 1~5 |
| content | String | 리뷰 내용 |
| likeCount | Int | 좋아요 수 |
| createdAt | DateTime | 작성일 |

### ReviewImage (리뷰 첨부 사진, 여러 장)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | Int | PK |
| reviewId | Int | FK → Review |
| url | String | 이미지 URL |

---

## 4. API

### 포커스 박스 조회 (핵심)
```
GET /api/stores/focus
  ?swLat=   &swLng=    ← 포커스 박스 남서 꼭짓점
  &neLat=   &neLng=    ← 포커스 박스 북동 꼭짓점
  &centerLat= &centerLng=  ← 박스 중심점 (최근접 계산용)

→ 범위 안 매장 중 중심과 가장 가까운 1개 + 전체 정보 반환
   없으면 null 반환
```

### 전체 매장 목록 (마커 렌더링용)
```
GET /api/stores
  ?swLat= &swLng= &neLat= &neLng=

→ 현재 지도 뷰포트 안의 매장 목록 (마커 표시용, id/name/category/lat/lng만 반환)
```

---

## 5. 바텀시트 UI 구성

```
┌──────────────────────────────┐
│ [사진 슬라이더 - StoreImage]  │
│ 매장명  카테고리  별점        │
│ 소개글                       │
│ 점주: [프로필사진] 점주이름   │
├──────────────────────────────┤
│ 탭: [정보] [메뉴] [리뷰]     │
├──────────────────────────────┤
│ [정보 탭]                    │
│ 영업시간 (요일별)             │
│ 전화번호                     │
│ 인스타그램                   │
│ 주소                         │
│ 지도 미니뷰 (드래그/확대 잠금) │
├──────────────────────────────┤
│ [메뉴 탭]                    │
│ 메뉴명 ········· 가격        │
├──────────────────────────────┤
│ [리뷰 탭]                    │
│ [프로필] 아이디  ★★★★☆      │
│ 날짜  👍 좋아요수             │
│ 리뷰 내용                    │
│ [첨부사진들]                 │
└──────────────────────────────┘
```

---

## 6. 기술 스택

| 역할 | 선택 |
|---|---|
| DB | SQLite (소규모, 파일 기반 / 추후 PostgreSQL 마이그레이션 가능) |
| ORM | Prisma |
| 지도 | react-kakao-maps-sdk |
| 바텀시트 | framer-motion 또는 직접 구현 |
| 상태관리 | useState / Zustand |

---

## 7. 구현 순서

1. ✅ Prisma + SQLite 세팅 + 스키마 정의
2. ✅ seed 파일로 근처 매장 데이터 입력
3. ✅ `/api/stores/focus` API 구현 (Haversine 최근접 계산)
4. ⬜ 카카오 맵 + 마커 렌더링 (`/api/stores` 전체 목록 사용)
5. ⬜ 포커스 박스 CSS 오버레이
6. ⬜ `map.idle` → API 호출 → 바텀시트 표시
7. ⬜ 바텀시트 탭 UI (정보 / 메뉴 / 리뷰)
8. ⬜ 미니 지도 (드래그/확대 비활성화 옵션 적용)
