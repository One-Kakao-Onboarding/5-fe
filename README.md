# 🖥️ 우리 컴 할래...?

> **신입 사원 온보딩을 위한 게이미피케이션 웹 서비스**  
> 🎮 디지털 커뮤니케이션 코치
<img width="2752" height="1536" alt="메인화면 춘식이" src="https://github.com/user-attachments/assets/857aefad-125c-4d81-a63f-858b70b2cf7e" />


## 📌 프로젝트 소개

**우리 컴 할래**는  
신입 사원이 IT 업계의 은어(일명 *판교어*)와  
업무 상황별 **올바른 디지털 커뮤니케이션 방식**을  
게임을 통해 자연스럽게 익힐 수 있도록 돕는 **인터랙티브 온보딩 서비스**입니다.

NPC와의 대화를 통해 실제 업무 상황을 시뮬레이션하고, 플레이로 **커뮤니케이션 역량**을 키워보세요!

---

## 레포지토리 링크
- 🖥️ **Frontend**  
  https://github.com/One-Kakao-Onboarding/5-fe

- ⚙️ **Backend**  
  https://github.com/One-Kakao-Onboarding/5-be

- 🧩 **Extension**  
  https://github.com/One-Kakao-Onboarding/5-extension

## 주요 기능

### 4단계 스테이지 시스템
1. **Stage 1 - 입사**: 회의 인비 요청에 응답하기
2. **Stage 2 - 업무**: 급한 업무 요청에 우선순위 조정하기
3. **Stage 3 - 휴가**: 부재중 메일 작성하기
4. **Stage 4 - 회의**: 프로젝트 회의록 작성하기

### 게이미피케이션 요소
- 채팅형 인터페이스로 자연스러운 대화
- 아이템 수집 시스템 (사전, 메일 도우미, 돋보기, 웰컴 키트)
- 스테이지 클리어 시 전환 영상 재생
- 화려한 아이템 획득 애니메이션

### 학습 콘텐츠
- **판교어 사전**: 클릭 한 번으로 IT 업계 은어 검색
- **메일 번역기**: AI 기반 판교어 ↔ 일반어 실시간 번역
  - 판교어로 작성된 메일을 일반 한국어로 번역
  - 일반 한국어를 판교어가 적절히 포함된 업무 메일로 변환
- **판교어 돋보기**: 텍스트 선택 시 실시간 단어 설명
- 실제 업무 상황 시뮬레이션
- 즉각적인 피드백 시스템

## 기술 스택

- **React 18**: Functional Components & Hooks
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Framer Motion**: 부드러운 애니메이션
- **Context API**: 전역 상태 관리

## 프로젝트 구조

```
pangyo-survival/
├── public/
│   ├── index.html
│   └── assets/
│       ├── npc/              # NPC 캐릭터 이미지
│       │   ├── stage1.png
│       │   ├── stage2.png
│       │   ├── stage3.png
│       │   └── stage4.png
│       └── video/            # 전환 영상
│           └── level_up.mp4
├── src/
│   ├── App.js               # 메인 컨트롤러
│   ├── index.js             # 엔트리 포인트
│   ├── index.css            # 전역 스타일
│   ├── context/
│   │   └── GameContext.js   # 전역 상태 관리
│   ├── components/
│   │   ├── GameContainer.js    # 게임 메인 컨테이너
│   │   ├── ChatInterface.js    # 채팅 인터페이스
│   │   ├── InventoryBar.js     # 아이템 인벤토리
│   │   ├── VideoPlayer.js      # 전환 영상 플레이어
│   │   ├── ProgressBar.js      # 진행 상황 표시
│   │   ├── ItemRewardModal.js  # 아이템 획득 모달
│   │   └── stages/
│   │       ├── Stage1.js
│   │       ├── Stage2.js
│   │       ├── Stage3.js
│   │       └── Stage4.js
│   └── constants/
│       └── items.js         # 아이템 및 사전 데이터
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm start
```

### 3. 프로덕션 빌드

```bash
npm run build
```
