

<p align="center">
  <img src="https://tech-stack.wontory.dev/api/badge?slug=react&text=React&highlight=true&textColor=59c7e6&iconColor=59c7e6&bgColor=042539" alt="React" />
  <img src="https://tech-stack.wontory.dev/api/badge?slug=typescript&text=Typescript&highlight=true&textColor=3178c6&iconColor=3178c6&bgColor=05091a" alt="Typescript" />
  <img src="https://tech-stack.wontory.dev/api/badge?text=zustand&highlight=true&textColor=e69e5c&iconColor=a4540a&bgColor=241300" alt="zustand" />
  <img src="https://tech-stack.wontory.dev/api/badge?slug=tailwindcss&text=Tailwind+CSS&highlight=true&textColor=09b6d4&iconColor=09b6d4&bgColor=041b34" alt="Tailwind CSS" />
  <img src="https://tech-stack.wontory.dev/api/badge?slug=framer&text=Framer-motion&highlight=true&textColor=ffffff&iconColor=ffffff&bgColor=303030" alt="Framer-motion" />
</p>
<p align="center">
  <img src="https://tech-stack.wontory.dev/api/badge?slug=threedotjs&text=Three.js&highlight=true&textColor=ffffff&iconColor=ffffff&bgColor=393d41" alt="Three.js" />
  <img src="https://tech-stack.wontory.dev/api/badge?text=React-three-Fiber&highlight=true&textColor=09b6d4&iconColor=09b6d4&bgColor=041b34" alt="React-three-Fiber" />
  <img src="https://tech-stack.wontory.dev/api/badge?text=%40react-three%2Fdrei&highlight=true&textColor=09b6d4&iconColor=09b6d4&bgColor=041b34" alt="@react-three/drei" />
  </p>


<br />

## 📍 기여 포인트
### 1. 3D 및 인터랙션 구현
- React-Three-Fiber와 Three.js로 3D 공간 및 오브젝트 구현
- 3D씬과 React 렌더링 간극을 학습하고 동기화 및 성능 최적화 적용
- Blender로 low-poly 모델링 제작 및 최적화 적용
- Framer Motion으로 UI 레벨 애니메이션 구현, 3D 씬과 자연스럽게 연결

### 2. UI/UX 설계 전반 및 리소스 제작
- 서비스 전체 화면 흐름과 사용자 여정 직접 설계
- Figma로 와이어프레임 및 시각 디자인 가이드 제작
- Illustrator와 Blender를 활용해 커스텀 아이콘, 텍스처, UI 그래픽 제작

### 3. 담당 기능
| 메인 페이지 | 방 페이지 | 공통 UX | 인증/인가 | 콘텐츠 페이지 |
|---|---|---|---|---|
| 랭킹, 프리뷰 | 방 테마 설정, 가구 설정, 방명록 | 로딩 애니메이션, 가이드 애니메이션 | 소셜 로그인 리팩토링 | CD 랙 페이지, CD 페이지 |

<br />


## 📍 리팩토링
### 1. 소셜 로그인 보안 강화

| 구분 | Before | After |
|---|---|---|
| 토큰 저장 방식 | Access Token을 클라이언트 측 쿠키에 저장 | 인메모리 저장 방식으로 전환 |
| 토큰 전달 방식 | URL로 토큰 전달 | OAuth 로그인 후 토큰 대신 `tempCode`로 전달 |
| 최종 인증 흐름 | 클라이언트 중심 인증 처리 | 클라이언트는 서버의 임시 토큰과 교환해 최종 JWT 발급 |
| 보안 리스크 개선 | 인증 흐름 노출 위험이 크고 XSS / CSRF 취약점 존재 | 클라이언트가 직접 소셜 Access Token을 다루지 않아 토큰 노출 가능성 감소 |

<br />

### 2. CD Rack 리팩토링
| 비교 | Before | After |
|---|---|---|
| 화면 | <img width="350px" alt="Image" src="https://github.com/user-attachments/assets/d189b91c-209b-4283-9d9f-df6662abb6a8" /> | <img width="350px" alt="After Screenshot" src="https://github.com/user-attachments/assets/88ca0147-6447-4cf1-b3ad-e99b275d2e07" /> |
| UI 구조 | Swiper 기반 2D 슬라이더 | 3D CD Rack 구조로 전환 |
| 탐색 방식 | 좌우 전환 중심의 단순 탐색 | 스크롤/휠 기반의 회전·이동 인터랙션 |
| 데이터 처리 | 비효율적인 요청 로직으로 불필요한 렌더링 및 API 호출 발생 | 중복 API 호출 제거 및 로딩/에러 상태 관리 개선 |
| 코드 구조 | UI, 데이터, 렌더링 로직이 한 컴포넌트에 혼재 | 3D 모델 로딩, 재질 설정, 유틸 함수 분리로 모듈화 |
| 사용자 경험 | 호버/라벨, 시각적 피드백 부족 | 호버 라벨, 모달, 애니메이션으로 피드백 강화 |
| 결과 | 단순한 2D 목록형 UI | 몰입감 있는 3D 인터랙션 기반 탐색 경험 |

<br />

### 3. CD 리팩토링
| 비교 | Before | After |
|---|---|---|
| 화면 | <img width="350px"  alt="Image" src="https://github.com/user-attachments/assets/fa924710-63f6-4812-84f5-3d9673e00086" /> | <img width="350px" alt="Image" src="https://github.com/user-attachments/assets/859b4bc5-c7d4-4740-b2d3-2e3d3ad713f6" /> |
| 레이아웃 | 고정된 레이아웃 구조 | 드래그 가능한 창 UI 도입 |
| 사용 방식 | 창 이동 및 위치 조정 불가 | 사용자가 직접 CD 플레이어 창 이동 가능 |
| 반응형 대응 | 모바일/태블릿 확장에 불리한 구조 | PC에서는 자유 이동형 창, 모바일에서는 하단 시트 형태 적용 |
| 레이아웃 | 고정 배치 중심 구조 | Grid/Flex 기반으로 재구성 |
| 결과 | 사용성 및 확장성 부족 | 반응형 대응 및 사용성 향상 ||


<br/>

## 📍 RoomE 주요 기능 한 눈에 보기

<table>
  <tr>
    <td align="center" valign="top" width="50%">
      <b>진입</b><br/>
      가이드 애니메이션<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/70b4436e-bc6d-4bfa-b81d-d7e7cc16421d" alt="가이드 애니메이션" />
    </td>
    <td align="center" valign="top" width="50%">
      <b>메인</b><br/>
      프리뷰<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/f4009945-0cf8-450b-8336-3faa19ae8400" alt="프리뷰" />
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <b>방</b><br/>
      테마 설정<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/ab894069-3690-46a7-96ef-ad98218cc0c6" alt="테마 설정" />
    </td>
    <td align="center" valign="top">
      <b>방</b><br/>
      가구 설정<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/675d2837-5c45-4edf-a78d-ca1df0746b7b" alt="가구 설정" />
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <b>방</b><br/>
      포인트<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/5aefefe3-2761-42ed-8c94-623461ed45d0" alt="포인트" />
    </td>
    <td align="center" valign="top">
      <b>방</b><br/>
      방명록<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/01b767ca-ed58-4865-9efc-99b007eb8a0a" alt="방명록" />
    </td>
  </tr>
  <tr>


  </tr>
  <tr>
    <td align="center" valign="top">
      <b>도서</b><br/>
      책장<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/0b9ee98c-9df9-49c4-af65-5a7c44fda441" alt="책장" />
    </td>
    <td align="center" valign="top">
      <b>도서</b><br/>
      서평 작성<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/e8e8dad5-475a-44d5-8be1-dbad5177c0c5" alt="서평 작성" />
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <b>음악</b><br/>
      CD Rack<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/ba7ef312-8e7e-4182-8ae4-7fe731f27943" alt="CD Rack" />
    </td>
    <td align="center" valign="top">
      <b>음악</b><br/>
      플레이<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/7466297e-d82c-4b44-b643-664b793dacc1" alt="음악 추가" />
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <b>소셜</b><br/>
      알림<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/f5b0a7b8-9e64-460c-97f9-6ef619171fa7" alt="친구목록 및 알림 확인" />
    </td>
    <td align="center" valign="top">
      <b>소셜</b><br/>
      친구 목록<br/><br/>
      <img width="350px" src="https://github.com/user-attachments/assets/6b7207ba-c819-4509-bfc9-a6f05e3a0ff9" alt="친구목록 및 알림 확인" />
    </td>
  </tr>
</table>


