# 당근 동네지도 클론 프로젝트

당근 로컬 비즈니스 S&D 팀 지원을 위해 진행한 프로젝트입니다.  
지도 Discovery 여정을 직접 구현하며 이해하는 것을 목표로 했습니다.

---

## 왜 이 프로젝트인가

> _"근처 OO 파는 곳 없나?"_  
> _"지금 시간이 늦었는데… 근처에 연 약국이 있을까?"_

이런 질문을 던졌을 때 자연스럽게 떠오르는 서비스가 되는 것. 그게 동네지도가 지향해야 할 지점이라고 생각했습니다.

현재 경쟁 서비스인 대형 지도 서비스(네이버 지도, 카카오맵)와 비교할 때, 당근 동네지도가 가진 차별점은 **비즈 프로필을 통한 서비스-매장 간의 강한 결합력.**이라고 생각합니다.
  
당근은 이미 매장과 사용자 사이의 로컬 신뢰 네트워크를 갖고 있습니다. 단순히 "어디 있나"를 알려주는 지도가 아니라, 동네 가게가 지금 어떤 상태인지를 실시간으로 전달할 수 있는 지도를 만들 수 있습니다.

이 프로젝트에서 구현한 두 가지 핵심 차별 기능:
- **트렌드 재고 필터** — 지금 두쫀쿠 있는 카페가 어디인지 지도 위에서 바로 확인
- **실시간 새 소식** — 가게가 올린 최신 소식이 지도 위에 버블로 등장, 조회·좋아요 기반 인기 소식 랭킹

---

## 서비스 화면

<!-- 이미지 추가 예정 -->

---

## 아키텍처

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

## 기술 스택

### 웹 (`carrot-clone-web`)
| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 지도 | Kakao Maps JavaScript API |
| DB | Prisma + SQLite (`better-sqlite3`) |
| 스타일 | Tailwind CSS v4 |
| 테스트 | Vitest + Playwright |
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

## 로컬 실행

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
---

## 참고

- [당근 로컬 비즈니스 팀 소개](https://about.daangn.com/blog/archive/당근-로컬비즈니스-몰입-채용-팀문화/)
- [지원 JD](https://about.daangn.com/jobs/7702533003/)
