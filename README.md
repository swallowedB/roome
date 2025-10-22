![Thumbnail](https://github.com/user-attachments/assets/2b64a918-ded2-4f52-8a87-f5c711cfea7b)

<br/>

- 프로젝트 기간 : 2025.02.06 ~ 2025.03.14
- 리팩토링 기간 : 2025.05.20 ~ 2025.09.19
- 배포 URL : [roome.io.kr](https://www.roome.io.kr)
- [1차 개발 레포](https://github.com/prgrms-web-devcourse-final-project/WEB2_3_CUBE_FE)


<hr/>

## 🎥 시연 연상
<div width="30%">
  
[![RoomE Main](https://github.com/user-attachments/assets/9a2fa9c6-2d4c-4c72-9f9c-91e3b4f9cbe7
)](https://www.youtube.com/watch?v=cfqYWgZEVag)
</div>


<br/>

## ☁️ 프로젝트 소개 - 나를 찾는 디지털 힐링 공간 RoomE
- RoomE(루미)는 바쁜 일상 속에서 자신을 잃어가는 현대인들에게 자아 탐색과 심리적 안정을 위한 공간을 제공합니다.
- 사용자는 개성과 취향을 자유롭게 표현하며, 같은 관심사를 가진 사람들과 자연스럽게 연결될 수 있는 디지털 힐링 & 커뮤니티 플랫폼입니다.
- 책장, CD 플레이어, 테마 등을 활용해 나만의 감성과 취향이 담긴 공간을 자유롭게 꾸밀 수 있습니다.
- 자신을 더 깊이 이해하고 감정을 치유하는 특별한 경험을 제공합니다.
- 취향 공유를 넘어 공통 관심사를 기반으로 사람들과 매칭되고, 정서적 공감을 나누는 커뮤니티를 지원합니다.

<br />

## 기술 스택

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
  <img src="https://skillicons.dev/icons?i=blender,ai,figma,git,github,githubactions,notion" />
</p>
</div>

<br />

## RoomE_팀 FE 구성원
|<img src="https://avatars.githubusercontent.com/u/155376060?v=4" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/165476198?v=4" width="150" height="150"/>|
|:-:|:-:|
|권윤슬<br/>[@miseullang](https://github.com/miseullang)|최보아 <br/>[@swallowedB](https://github.com/swallowedB)|
| 담당 기능 | 담당 기능 |
| 도서 페이지 <br> 프로필 <br> 결제 <br> 알림/친구목록 <br> ✨ 반응형 리팩토링 <br> ✨ 도서 리팩토링 | 메인/룸 페이지 <br> 방명록 <br> 랭킹 <br> ✨ CD 랙 리팩토링 <br> ✨ 로그인 리팩토링 |

<br />

## 🔧 리팩토링 내역

- **소셜 로그인 보안 강화**
  - **토큰 저장 방식 변경**: 기존 쿠키 저장 → 클라이언트 JS 인메모리 저장으로 전환하여 XSS/CSRF 공격 표면 최소화
  - **백엔드 중계 구조 도입**: 소셜 OAuth Access Token을 백엔드에서 1차 수신 후, 자체 임시 토큰을 발급  
    → 클라이언트는 해당 임시 토큰을 다시 백엔드와 교환해 최종 JWT 획득

- **모바일 환경 최적화**
  - 반응형 UI/UX 적용
  - 다양한 화면 크기 및 기기에서 레이아웃 호환성 개선

- **결제 시스템 제거**
  - 상용화 전 고려 사항으로 기존 결제 기능 제거
  - 포인트 관련 기능은 이벤트/활동 기반으로 대체

- **성능 최적화**
  - 컴포넌트 렌더링 최적화
  - 불필요한 리렌더링 방지 및 코드 스플리팅 적용
  - 리소스 사용량 최소화 및 사용자 경험 향상
 
- **CD Rack**
  - 기존 2D 스와이퍼 기반 UI를 3D CD Case & Rack 구조로 전환  
  - 스크롤/휠 이벤트를 활용해 CD가 선반에서 회전·이동하는 인터랙션 구현  
  - React Three Fiber 기반으로 몰입감 있는 3D 전환 효과 제공 

<br/>

## ✅ 주요 기능

### 1. 로그인 기능
- **소셜 로그인**: 사용자는 소셜 계정을 통해 간편하게 서비스에 가입하고 로그인 가능
  - 카카오톡 / 네이버 / 구글

### 2. 메인 기능
- **방 프리뷰**: 사용자의 방을 중심으로 하우스메이트로 추가한 이웃의 방 시각화
- **내 방 설정**: 나의 방으로 이동하여 취향 설정 및 테마 설정 가능

### 3. 방 기능
- **개인화된 방 생성**: 자신만의 디지털 공간 생성
- **테마 설정**: 다양한 테마(베이직, 포레스트, 마린 등) 선택 가능
- **콘텐츠 진열**: 책장, CD 플레이어 등을 활용하여 문화 콘텐츠 진열
- **방문 시스템**: 다른 사용자의 방 방문 및 탐색
- **방명록 시스템**: 다른 사용자의 방에 방명록 남기기

### 4. 도서 관련 기능
- **도서 기록**: 독서 기록 추가 및 관리, 레벨 업 시 더 많은 기록 가능
- **서평 작성**
  - 읽은 책에 대한 감상/리뷰 작성 및 아카이빙
  - 테마(빨강, 파랑, 초록) 선택 가능
  - 실시간 프리뷰 확인 가능
  - 작성한 서평 수정 및 삭제 가능

### 5. 음악 관련 기능
- **음악 재생**: 저장한 음악 재생 및 감상
- **타임스탬프 댓글**
  - 특정 구간에 코멘트 작성
  - 다른 사용자 코멘트로 공감대 형성 및 소통
- **CD 컬렉션**: 좋아하는 음악을 CD 앨범 형태로 수집 및 진열
- **감상 템플릿**: 간단한 템플릿 작성으로 나의 취향 파악 및 공유

<br/>

## ✅ 부가 기능

### 6. 포인트 기능
- **게이미피케이션**: 특정 액션 수행 시 포인트 보상
- 포인트 소모로 추가 권한 해제, 사용자 활동 유도

### 7. 랭킹 기능
- 주간 방문자 수 누적 집계 후 랭킹 확인
- 10위 내 선정 시 포인트 지급 및 유저 간 활발한 교류 유도

### 8. 이벤트 기능
- **타임어택 이벤트**
  - 이벤트 시간 접속 시 참여 가능, 선착순 포인트 지급
- **출석 이벤트**
  - 출석 시 랜덤 포인트(1~50) 지급

### 9. 결제 기능
- 포인트 충전을 통해 서비스 범위 확장

<br/>

<hr />

<div align='center'>
  <a href="https://desqb38rc2v50.cloudfront.net/">
    <img src="https://github.com/user-attachments/assets/fbd61d4b-096a-4f1b-aa5e-4c3d7babee83" width="340" />
  </a>
</div>
