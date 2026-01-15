// 각 스테이지별 NPC 캐릭터 위치 설정
export const STAGE_CONFIG = {
  1: {
    title: '입사 첫날',
    npcName: '팀장님',
    npcPosition: {
      x: '20%', // 좌우 위치 (왼쪽부터)
      y: '40%', // 상하 위치 (위부터)
    },
    bubblePosition: 'right', // 말풍선 방향: 'left' 또는 'right'
  },
  2: {
    title: '업무 요청',
    npcName: '시니어 개발자',
    npcPosition: {
      x: '25%',
      y: '45%',
    },
    bubblePosition: 'right',
  },
  3: {
    title: '휴가 신청',
    npcName: 'HR 담당자',
    npcPosition: {
      x: '30%',
      y: '40%',
    },
    bubblePosition: 'right',
  },
  4: {
    title: '프로젝트 회의',
    npcName: '프로젝트 리더',
    npcPosition: {
      x: '20%',
      y: '45%',
    },
    bubblePosition: 'right',
  },
};
