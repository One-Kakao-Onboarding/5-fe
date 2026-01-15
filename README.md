# 판교 생존기 (Pangyo Survival)

신입 사원 온보딩을 위한 게이미피케이션 웹 서비스 - 디지털 커뮤니케이션 코치

## 프로젝트 소개

"판교 생존기"는 신입 사원이 IT 업계의 은어(판교어)를 재미있게 익히고, 업무 환경에 빠르게 적응할 수 있도록 돕는 인터랙티브 게임입니다. NPC와의 대화를 통해 실제 업무 상황을 시뮬레이션하고, 적절한 커뮤니케이션 방법을 학습할 수 있습니다.

## 주요 기능

### 4단계 스테이지 시스템
1. **Stage 1 - 입사**: 회의 인비 요청에 응답하기
2. **Stage 2 - 업무**: 급한 업무 요청에 우선순위 조정하기
3. **Stage 3 - 휴가**: 부재중 메일 작성하기
4. **Stage 4 - 회고**: 프로젝트 회고 작성하기

### 게이미피케이션 요소
- 채팅형 인터페이스로 자연스러운 대화
- 아이템 수집 시스템 (사전, 메일 도우미, 돋보기, 웰컴 키트)
- 스테이지 클리어 시 전환 영상 재생
- 실시간 진행 상황 표시
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

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

### 3. API 키 설정 (메일 번역기 기능)

메일 번역기 아이템 기능을 사용하려면 OpenAI API 키가 필요합니다.

1. `.env.example` 파일을 복사하여 `.env` 파일을 생성:
```bash
cp .env.example .env
```

2. `.env` 파일을 열고 OpenAI API 키를 입력:
```
REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. OpenAI API 키 발급 방법:
   - [OpenAI Platform](https://platform.openai.com/api-keys)에 접속
   - 계정 생성 및 로그인
   - API Keys 메뉴에서 새 키 생성
   - 생성된 키를 `.env` 파일에 입력

**참고**: API 키가 설정되지 않으면 메일 번역기 기능을 사용할 수 없지만, 다른 게임 기능은 정상적으로 작동합니다.

**API 사용 비용**: OpenAI API는 사용량에 따라 과금됩니다. GPT-4o-mini 모델을 사용하여 비용을 최소화했습니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

## 애셋(Assets) 준비

### NPC 이미지
다음 경로에 각 스테이지별 NPC 이미지를 배치하세요:
- `public/assets/npc/stage1.png`
- `public/assets/npc/stage2.png`
- `public/assets/npc/stage3.png`
- `public/assets/npc/stage4.png`

권장 사양: 512x512px, PNG 형식

### 전환 영상
스테이지 클리어 시 재생될 영상을 배치하세요:
- `public/assets/video/level_up.mp4`

권장 사양: 1920x1080px, MP4 형식, 3-5초 길이

## 커스터마이징

### 브랜드 컬러 변경
`tailwind.config.js`에서 브랜드 컬러를 수정할 수 있습니다:

```javascript
colors: {
  kakao: {
    yellow: '#FEE500',    // 메인 컬러
    brown: '#3C1E1E',     // 텍스트 컬러
    gray: '#191919',      // 다크 컬러
    lightGray: '#F5F5F5', // 배경 컬러
  }
}
```

### 판교어 사전 확장
`src/constants/items.js`의 `PANGYO_DICTIONARY`에 새로운 단어를 추가할 수 있습니다:

```javascript
'새단어': {
  word: '새단어',
  full: 'New Word',
  meaning: '의미 설명',
  example: '사용 예시'
}
```

### 스테이지 추가
1. `src/components/stages/` 폴더에 새 스테이지 컴포넌트 생성
2. `src/components/GameContainer.js`의 `renderStage()` 함수에 케이스 추가
3. `src/constants/items.js`에 새 아이템 정의

## 주요 상태 관리

GameContext를 통해 다음 상태들을 관리합니다:

- `currentStage`: 현재 진행 중인 단계 (1-4)
- `inventory`: 획득한 아이템 목록
- `isTransitioning`: 스테이지 전환 영상 재생 여부
- `dialogueHistory`: 현재 스테이지의 대화 로그
- `showItemModal`: 아이템 획득 모달 표시 여부

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 라이선스

이 프로젝트는 학습 및 포트폴리오 목적으로 제작되었습니다.

## 개발자

신입 사원 온보딩을 위한 게이미피케이션 웹 서비스

---

**Note**: 실제 배포 전에 NPC 이미지와 전환 영상을 준비해주세요. 현재는 플레이스홀더로 설정되어 있습니다.
