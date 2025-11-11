<p align="center">
  
<img src="https://github.com/user-attachments/assets/729ed744-6589-4dc5-a7f2-b004d8dc1019" width=60% />
</p>

<br/>

  <p align="center"> 👉🏻[✨RoomE 배포](https://www.roome.io.kr)👈🏻 </p>

## 🎥 시연 연상
<div width="30%">
  
[![RoomE Main](https://github.com/user-attachments/assets/9a2fa9c6-2d4c-4c72-9f9c-91e3b4f9cbe7
)](https://www.youtube.com/watch?v=cfqYWgZEVag)
</div>


<br/>

# ☁️ 나를 찾는 디지털 힐링 공간 RoomE
Roome은 3D 공간을 기반으로 사용자가 자신의 방을 꾸미고, 다른 사용자와 소통하며 디지털 힐링을 경험할 수 있는 커뮤니티 플랫폼입니다.

## 기획 배경 
- 바쁘고 복잡한 일상 속에서 ‘나’를 잘 알지 못하고, 휴식과 정서적 치유의 공간이 부족하다는 문제의식에서 시작되었습니다.
- 단순히 콘텐츠를 소비하는 서비스가 아니라, 개인의 취향과 감정을 드러내고 정리할 수 있는 상호작용적 공간을 제공하고자 했습니다.
- 사용자가 방을 꾸미고, 친구와 소통하며 자기 이해와 관계 형성을 동시에 경험할 수 있도록 기획했습니다.

## 서비스 컨셉
- 3D 인터랙션 중심 UI: React-Three-Fiber와 Three.js를 활용하여 공간을 직접 꾸미고 탐색할 수 있는 인터랙티브 경험 제공
- 자연스러운 애니메이션 경험: Framer Motion을 활용해 화면 전환과 요소 동작을 부드럽게 구현, 사용자 몰입도를 강화

<br />

## 📍 기술 스택

### Front-End
<div>
  <img src="https://skillicons.dev/icons?i=react,ts,tailwind,threejs" />
  <img src="https://github.com/user-attachments/assets/f7d7593a-aac1-4a7b-961e-6bc66171df3b" width="50px" />
  <img src="https://github.com/user-attachments/assets/9e0815e0-ec6a-457d-9ea2-7365bd887b5b" width="50px" />
  <img src="https://github.com/user-attachments/assets/8006a7df-dbe0-4a9c-8436-fd8dbab2bdc8" width="50px" />
  <img src="https://github.com/user-attachments/assets/64344e16-f943-44ef-be67-257dcca718fd" width="50px" />
  <img src="https://github.com/user-attachments/assets/c2c596cf-2f71-4680-86ed-a3b735c62152" width="50px" />
</p>

### ETC
<div>
  <img src="https://skillicons.dev/icons?i=blender,ai,figma,git,github,githubactions,jenkins,notion" />
</p>
</div>

<br />

## 📍 기여 포인트
### 1. 3D 및 인터랙션 구현
- React-Three-Fiber와 Three.js로 3D 공간 및 오브젝트 구현
- Blender로 low-poly 모델링 제작 및 최적화 적용
- Framer Motion으로 UI 레벨 애니메이션 구현, 3D 씬과 자연스럽게 연결

### 2. UI/UX 설계 전반 및 리소스 제작
- 서비스 전체 화면 흐름과 사용자 여정 직접 설계
- Figma로 와이어프레임 및 시각 디자인 가이드 제작
- Illustrator와 Blender를 활용해 커스텀 아이콘, 텍스처, UI 그래픽 제작


<br />

## 📍 리팩토링
### 1. 소셜 로그인 보안 강화

[Before]
- 소셜 OAuth Access Token을 클라이언트 측 쿠키에 저장 → XSS / CSRF 취약점 존재
- 클라이언트에서 직접 토큰 처리를 하다 보니 인증 흐름이 노출 위험 많음

[After]
- 토큰 저장 방식 변경: 쿠키 저장 → 인메모리 저장 방식으로 전환 → 클라이언트 측에서 토큰 노출 가능성 최소화
- 백엔드 중계 구조 도입:
  -  클라이언트는 OAuth 로그인 후 받은 tempCode를 서버에 전송
  -   서버가 소셜 Access Token을 받아 검증 + 자체 임시 토큰을 발급
  -  클라이언트는 이 임시 토큰과 교환해서 최종 JWT를 발급받음
  -  이 구조 덕분에 클라이언트가 직접 소셜 Access Token을 다루는 일이 사라지고, 인증 흐름이 더 안전해짐

### 2. CD Rack 리팩토링
[Before]
- CD 목록은 Swiper 기반 2D 슬라이더로 구현되어, 좌우 전환만 가능한 단순한 UI
- 데이터 요청 로직이 비효율적이라 불필요한 렌더링과 API 호출 발생
- UI와 데이터, 렌더링 로직이 한 컴포넌트에 섞여 있어 구조가 복잡하고 유지보수 어려움
- 사용자 경험 측면에서 호버/라벨, 시각적 피드백이 부족하여 몰입감이 떨어짐

[After]
- 3D CD 랙 구조 전환: 2D 슬라이더를 3D CD Rack으로 재구성하여, CD가 회전·이동하는 듯한 입체적 인터랙션 경험 구현
- 스크롤/휠 기반 탐색: 사용자의 입력에 따라 CD가 회전·이동하여 탐색 경험 강화
- 데이터 패칭 최적화: 중복 API 호출 제거, 로딩/에러 상태 관리 개선
- 구조 분리 및 모듈화: 3D 모델 로딩, 재질 설정, 유틸 함수 등을 분리해 코드 가독성·유지보수성 향상
- UX 개선:
  - 마우스 호버 시 앨범 정보 라벨 표시
  - CD 이동/삭제 시 모달과 애니메이션으로 피드백 제공
  - 단순 리스트가 아닌 몰입감 있는 인터랙션 경험 제공

| Before | After |
|--------|-------|
| ![Before Screenshot](이미지-URL) |  <img width="1677" height="865" alt="스크린샷 2025-09-26 오전 1 59 16" src="https://github.com/user-attachments/assets/88ca0147-6447-4cf1-b3ad-e99b275d2e07" /> |
 
### 3. CD 리팩토링
[Before]
- CD 페이지는 고정된 레이아웃 구조라서 창을 이동하거나 위치를 조정할 수 없는 상태
- 레이아웃 자체가 반응형으로 확장하기 어려운 구조였음 → 모바일/태블릿 대응이 불완전
- UI 계층이 단순 고정 배치 중심이라 사용성 및 확장성 부족

[After]
- 이동 가능한 창 UI 도입 : CD 플레이어 창을 사용자가 직접 드래그해서 이동할 수 있도록 개선
- PC 환경에서는 자유롭게 이동 가능한 창, 모바일 환경에서는 하단 시트 형태로 UX 차별화
- 레이아웃 구조 개선 : Grid/Flex 기반으로 레이아웃을 재구성해 반응형 대응 강화
- 모바일, 태블릿, 데스크탑 환경에서 자연스럽게 UI가 재배치되도록 수정

| Before | After |
|--------|-------|
| ![Before Screenshot](이미지-URL) | ![After Screenshot](이미지-URL) |

<hr />

<div align='center'>
  <a href="https://desqb38rc2v50.cloudfront.net/">
    <img src="https://github.com/user-attachments/assets/fbd61d4b-096a-4f1b-aa5e-4c3d7babee83" width="340" />
  </a>
</div>
