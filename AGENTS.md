## 프로젝트 개요

이 프로젝트는 당근마켓 로컬 비즈니스 팀 인턴 지원을 위한 지도 Discovery 여정 학습용 토이 프로젝트야

## 아키텍쳐

- Carrot-Clone-Native(React Native Expo)
- carrot-clone-web(Next.js)

Next.js는 풀스택 웹 서버 역할을 할거고, 카카오맵 api를 통해 지도를 Webview로 띄울거야
React Native Expo에는 지도 영역과 하단에 그래버로 올릴 수 있는 가게 정보 바텀 시트가 있어

## 디자인 시스템

Carrot-Clone-Native/design-system 폴더 하위 파일들을 참고

## 요구사항

./docs/map-store-feature-plan.md 파일 참고

어플을 열면 페이지는 단 하나야, 당근마켓 동네지도처럼 지도와 가게 정보를 볼 수 있는 바텀 시트, 상단엔 검색창과 찾고 싶은 가게 정보 카테고리 선택 버튼들
Next.js 웹 서버는 ui는 지도와 마커, 텍스트만 띄울거고, 나머지 ui 요소는 없어
ui 외에는 서버 역할을 해야해 어떤 역할을 할지는 아직 미정이야