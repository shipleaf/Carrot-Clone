## 🥕 당근 동네지도 클론 프로젝트

당근 동네지도 클론 프로젝트입니다. 지도 Discovery 여정을 직접 구현하며 이해하는 것을 목표로 했습니다.

---

## 📖 프로젝트 소개

> _"근처 OO 파는 곳 없나?"_
> _"지금 시간이 늦었는데… 근처에 연 약국이 있을까?"_

이런 질문을 던졌을 때 자연스럽게 떠오르는 서비스가 되는 것. 그게 동네지도가 지향해야 할 지점이라고 생각합니다.

대형 지도 서비스(네이버 지도, 카카오맵)와 비교했을 때, 당근 동네지도의 차별점은 **비즈 프로필을 통한 서비스–매장 간의 강한 결합력**에 있습니다. 이를 활용하면 단순히 매장이 어디 있는지를 알려주는 지도가 아니라, **동네 가게의 실시간 상태**를 전달하는 지도를 만들 수 있습니다.

이 프로젝트는 그 방향성을 검증해보기 위한 토이 프로젝트입니다. 지도 위에서 가게의 정보를 어떻게 보여줄 수 있을지, 그리고 그 과정에서 발생하는 **매장 노출과 사용자 경험 사이의 트레이드오프**를 직접 다뤄봤습니다.

---

## ✨ 핵심 기능

### 1. 트렌드 재고 필터
유행 주기가 짧은 트렌드 식품의 특성을 고려하여, 데이터베이스 스키마 변경 없이도 신규 품목을 유연하게 추가할 수 있는 확장형 재고 관리 시스템을 설계했습니다.

### 2. 실시간 새 소식
가게가 올린 최신 소식이 지도 위에 **버블 형태로 등장**합니다. 조회·좋아요 데이터를 기반으로 인기 소식 랭킹을 제공해, 동네에서 지금 무슨 일이 벌어지고 있는지 한눈에 파악할 수 있습니다.

### 3. 게이미피케이션 기반 쿠폰
지도의 특정 지역에 도착하면 **가게 쿠폰이 발급**됩니다. 쿠폰을 단순 제공하는 방식 대비 성취감을 더해, 실제 매장 방문으로 이어지는 전환율을 높이는 것을 목표로 한 실험입니다.

---

## 📱 서비스 화면

<table>
  <tr>
    <td align="center"><b>메인화면</b></td>
    <td align="center"><b>새소식 탭</b></td>
    <td align="center"><b>새소식 순위</b></td>
  </tr>
  <tr>
    <td><img width="200" height="480" alt="메인화면" src="https://github.com/user-attachments/assets/47e5a1c2-bdc1-4cd0-9090-64470a86217c" /></td>
    <td><img width="200" height="480" alt="새소식 탭" src="https://github.com/user-attachments/assets/8efacbea-6cf5-4265-b1ff-eadb48067979" /></td>
    <td><img width="200" height="480" alt="새소식 순위" src="https://github.com/user-attachments/assets/18259230-caa3-4ea2-a039-ff0eea8cdd2b" /></td>
  </tr>
  <tr>
    <td align="center"><b>보물상자 마커</b></td>
    <td align="center"><b>쿠폰 발견</b></td>
    <td align="center"><b>쿠폰 수령</b></td>
  </tr>
  <tr>
    <td><img width="200" height="480" alt="보물상자 마커" src="https://github.com/user-attachments/assets/54d46b33-fae1-4982-8fb6-b5b3509e14b5" /></td>
    <td><img width="200" height="480" alt="쿠폰 발견" src="https://github.com/user-attachments/assets/f58c003a-22a7-4648-92c1-7631125bcb96" /></td>
    <td><img width="200" height="480" alt="Screenshot_1777258581" src="https://github.com/user-attachments/assets/2f3d98ff-d2ea-458f-827f-ee49adc98f4f" /></td>
  </tr>
   <tr>
    <td align="center"><b>트렌드 음식 토글</b></td>
     <td align="center"><b>매장 정보</b></td>
     <td align="center"><b>매장 상세 정보</b></td>
  </tr>
  <tr>
    <td><img width="200" height="480" alt="트렌드 음식 토글" src="https://github.com/user-attachments/assets/e095beed-dd6b-4b21-90bb-0956b2ef5586" /></td>
    <td><img width="200" height="480" alt="Screenshot_1777266723" src="https://github.com/user-attachments/assets/9cc5fbe4-b70c-40d8-aa0f-ad42692b3c4f" /></td>
    <td><img width="200" height="480" alt="Screenshot_1777266714" src="https://github.com/user-attachments/assets/e2572c39-20d8-409d-ae71-e670de92d90e" /></td>
  </tr>
</table>

---

## 🔬 A/B 시안 비교

핵심 기능들에 대해 UX 가설을 세우고 두 가지 구현안을 직접 비교했습니다.

---

### 1. 새 소식 버블 — 포커스 시 확장 vs. 항상 노출

**가설:** 소식 버블을 포커스 없이 항상 보여주면 사용자가 소식을 발견할 가능성이 높아진다.

<table>
  <tr>
    <td align="center"><b>A — 포커스 시 버블 등장</b></td>
    <td align="center"><b>B — 항상 모든 버블을 노출</b></td>
  </tr>
  <tr>
    <td><img width="200" height="480" alt="새소식 버블 A" src="https://github.com/user-attachments/assets/47e5a1c2-bdc1-4cd0-9090-64470a86217c" /></td>
    <td><img width="200" height="480" alt="새소식 버블 B" src="https://github.com/user-attachments/assets/01a45c90-ec43-41d6-bdd9-6d7f07bbc993" /></td>
  </tr>
</table>

- **A안:** 지도 중앙에 가게가 들어올 때만 버블 노출. 지도가 깔끔하지만 사용자가 소식 정보를 얻지 않고 넘어갈 수 있음
- **B안:** 소식 있는 가게는 처음부터 모든 버블을 항상 표시. 소식 발견율은 높아지지만 마커가 많을수록 지도가 복잡해짐, 사용자가 버블을 읽을 가능성이 낮아짐(정보 과다)
- **트레이드오프:** Discovery 빈도 vs. 지도 가독성

---

### 2. 바텀시트 진입 깊이 — 요약 vs. 전체 직행

**가설:** 마커 클릭 시 전체 상세로 바로 진입하면 매장 정보 탐색 완료까지 인터랙션 수가 줄어든다.

<table>
  <tr>
    <td align="center"><b>A — 클릭 → 요약(snap 1)</b></td>
    <td align="center"><b>B — 클릭 → 전체(snap 2) 직행</b></td>
  </tr>
  <tr>
    <td><img width="200" height="480" alt="바텀시트 A" src="https://github.com/user-attachments/assets/40d5848b-22d9-40a9-9db2-d8cd666783c0" /></td>
    <td><img width="200" height="480" alt="바텀시트 B" src="https://github.com/user-attachments/assets/569aa5e9-ffc6-4e8e-ad1f-9be6b8174afb" /></td>
  </tr>
</table>

- **A안:** 클릭 후 snap 1(요약)에 머물며 지도도 계속 볼 수 있음. 여러 가게를 빠르게 훑는 탐색 패턴에 적합, 매장 영업 정보 등 코어 정보를 상단에 배치하면 효과가 높아질 것으로 예상
- **B안:** 클릭 즉시 snap 2(전체 상세) 진입. 이미 가게를 고른 의도로 클릭한 경우라면 단계를 줄여줌
- **트레이드오프:** 탐색 편의성 vs. 정보 접근 속도

---

### 3. 보물 마커 노출 — 항상 표시 vs. 필터 선택 시만 표시

**가설:** 보물 마커를 숨겨두면 탐험 동기가 생기고, 필터를 통해 의도적으로 찾는 경험이 게이미피케이션 효과를 높인다.

<table>
  <tr>
    <td align="center"><b>A — 기본 지도에 항상 표시</b></td>
    <td align="center"><b>B — 보물찾기 필터 선택 시만 표시</b></td>
  </tr>
  <tr>
    <td><img width="200" height="480" alt="보물찾기 A" src="https://github.com/user-attachments/assets/54d46b33-fae1-4982-8fb6-b5b3509e14b5" /></td>
    <td><img width="200" height="480" alt="보물찾기 B" src="https://github.com/user-attachments/assets/5faeccde-bac3-47a7-bf6f-aebfff58c364" /></td>
  </tr>
</table>

- **A안:** 지도를 탐색하다 자연스럽게 보물을 발견. 별도 진입 없이 접근 가능하지만 지도의 UI 복잡도가 높아짐
- **B안:** 카테고리 필터에서 보물찾기를 선택해야만 마커 노출. 능동적 탐험 경험을 유도하고, 일반 탐색 시 지도 노이즈를 줄임
- **트레이드오프:** 자연 발견율 vs. 지도 복잡도 완화

---

## 🏛️ 아키텍처

```
Carrot-Clone-Native/   ← React Native (Expo) — 모바일 셸
carrot-clone-web/      ← Next.js — 지도 레이어 (WebView로 임베드)
```

네이티브 앱이 WebView로 Next.js 웹 앱을 띄우고, 둘 사이를 **커스텀 브릿지**로 연결하는 구조입니다.

- 지도 렌더링과 API 서버 역할은 웹 레이어가 담당
- 바텀시트, 카테고리 필터, 쿠폰 모달 등 네이티브 UI는 앱 레이어가 담당
- 지도에서 발생하는 이벤트(마커 클릭, 포커스 변경 등)는 `postMessage`로 네이티브에 전달

```
[Native] ──── WebView ────▶ [Web/KakaoMap]
   ▲                              │
   └──── postMessage ─────────────┘
```

---

## 🛠️ 기술 스택

### 웹 (`carrot-clone-web`)
| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 지도 | Kakao Maps JavaScript API |
| DB | Prisma + SQLite (`better-sqlite3`) |
| 스타일 | Tailwind CSS v4 |
| UI 문서 | Storybook 10 |

### 네이티브 (`Carrot-Clone-Native`)
| 항목 | 내용 |
|------|------|
| 프레임워크 | Expo (SDK 54) + Expo Router |
| 언어 | TypeScript |
| 지도 연결 | `react-native-webview` |
| 애니메이션 | React Native `Animated` API |
| 제스처 | `react-native-gesture-handler` |

---

## 데이터베이스 스키마

> SQLite / Prisma ORM 사용

### Store (가게)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| name | String | ✓ | 가게 이름 |
| category | String | ✓ | 카테고리 |
| lat | Float | ✓ | 위도 |
| lng | Float | ✓ | 경도 |
| address | String | ✓ | 주소 |
| phone | String | ✓ | 전화번호 |
| instagramUrl | String? | | 인스타그램 URL |
| description | String? | | 가게 설명 |
| ownerName | String | ✓ | 사장님 이름 |
| ownerProfileImageUrl | String? | | 사장님 프로필 이미지 URL |
| followerCount | Int | ✓ | 팔로워 수 (기본값: 0) |
| createdAt | DateTime | ✓ | 생성 일시 |

### StoreImage (가게 이미지)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| storeId | Int | ✓ | Store FK |
| url | String | ✓ | 이미지 URL |
| order | Int | ✓ | 이미지 순서 |

### StoreHours (영업 시간)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| storeId | Int | ✓ | Store FK |
| dayOfWeek | Int | ✓ | 요일 (0=일 ~ 6=토) |
| openTime | String | ✓ | 오픈 시간 |
| closeTime | String | ✓ | 마감 시간 |
| isClosed | Boolean | ✓ | 휴무 여부 (기본값: false) |

### MenuItem (메뉴)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| storeId | Int | ✓ | Store FK |
| name | String | ✓ | 메뉴 이름 |
| price | Int | ✓ | 가격 |
| description | String? | | 메뉴 설명 |
| imageUrl | String? | | 메뉴 이미지 URL |

### Review (리뷰)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| storeId | Int | ✓ | Store FK |
| userId | String | ✓ | 작성자 ID |
| userProfileImageUrl | String? | | 작성자 프로필 이미지 URL |
| rating | Int | ✓ | 별점 |
| content | String | ✓ | 리뷰 내용 |
| likeCount | Int | ✓ | 좋아요 수 (기본값: 0) |
| createdAt | DateTime | ✓ | 작성 일시 |

### ReviewImage (리뷰 이미지)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| reviewId | Int | ✓ | Review FK |
| url | String | ✓ | 이미지 URL |

### StoreNews (소식)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| storeId | Int | ✓ | Store FK |
| content | String | ✓ | 소식 내용 |
| likeCount | Int | ✓ | 좋아요 수 (기본값: 0) |
| viewCount | Int | ✓ | 조회수 (기본값: 0) |
| createdAt | DateTime | ✓ | 작성 일시 |

### Coupon (쿠폰)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| storeId | Int | ✓ | Store FK |
| title | String | ✓ | 쿠폰 제목 |
| description | String? | | 쿠폰 설명 |
| imageUrl | String? | | 쿠폰 이미지 URL |
| expiresAt | DateTime? | | 만료 일시 |
| isActive | Boolean | ✓ | 활성 여부 (기본값: true) |
| createdAt | DateTime | ✓ | 생성 일시 |

### TreasureSpot (쿠폰 보물 위치)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| lat | Float | ✓ | 위도 |
| lng | Float | ✓ | 경도 |
| couponId | Int | ✓ | Coupon FK |
| isActive | Boolean | ✓ | 활성 여부 (기본값: true) |
| createdAt | DateTime | ✓ | 생성 일시 |

### UserCoupon (유저 쿠폰 발급 이력)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| userId | String | ✓ | 유저 ID |
| couponId | Int | ✓ | Coupon FK |
| claimedAt | DateTime | ✓ | 발급 일시 |
| usedAt | DateTime? | | 사용 일시 |

> (userId, couponId) 복합 유니크 제약 — 중복 발급 불가

### TrendingItem (트렌딩 아이템)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| slug | String | ✓ | URL 슬러그 (유니크) |
| name | String | ✓ | 아이템 이름 |
| emoji | String | ✓ | 이모지 |
| description | String? | | 설명 |
| isActive | Boolean | ✓ | 활성 여부 (기본값: true) |
| startedAt | DateTime | ✓ | 트렌딩 시작 일시 |
| endedAt | DateTime? | | 트렌딩 종료 일시 |

### StoreInventory (가게별 트렌딩 아이템 재고)
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| id | Int | ✓ | 고유 식별자 (PK) |
| storeId | Int | ✓ | Store FK |
| trendingItemId | Int | ✓ | TrendingItem FK |
| quantity | Int | ✓ | 재고 수량 (기본값: 0) |
| note | String? | | 비고 |
| updatedAt | DateTime | ✓ | 최종 수정 일시 |

## ⚙️ 로컬 실행

### 사전 조건
- Node.js 20+, pnpm
- 카카오 디벨로퍼스 앱 키 (JavaScript 키)
- Expo CLI (`npm i -g expo-cli`)

### 웹 서버 실행

```bash
cd carrot-clone-web
pnpm install
cp .env.example .env.local  # NEXT_PUBLIC_KAKAO_MAP_API_KEY 입력
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed
pnpm dev
```

### 네이티브 앱 실행

```bash
cd Carrot-Clone-Native
npm install
npx expo start
```
