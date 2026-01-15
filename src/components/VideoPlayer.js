import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const STAGE_TRANSITIONS = {
  1: {
    title: 'Day 1 Complete',
    subtitle: '첫 출근 성공! 판교어 기초를 익혔습니다.',
    nextStage: '내일은 본격적인 업무가 시작됩니다...',
    video: '/assets/video/stage-clear.mp4',
  },
  2: {
    title: 'Week 1 Complete',
    subtitle: '업무 우선순위 조정 성공! 소통의 달인이 되어가고 있습니다.',
    nextStage: '이제 휴가를 준비할 시간입니다...',
    video: '/assets/video/stage-clear.mp4',
  },
  3: {
    title: 'Project Complete',
    subtitle: '프로젝트 완료! 성공적으로 휴가 준비를 마쳤습니다.',
    nextStage: '이제 마지막 회의만 남았습니다...',
    video: '/assets/video/stage-clear.mp4',
  },
  4: {
    title: 'Onboarding Complete!',
    subtitle: '축하합니다! 판교 생존 과정을 모두 마쳤습니다.',
    nextStage: '당신은 이제 진정한 판교인입니다!',
    video: '/assets/video/stage-clear.mp4',
  },
};

const VideoPlayer = () => {
  const { completeTransition, currentStage } = useGame();
  const videoRef = useRef(null);

  const stageInfo = STAGE_TRANSITIONS[currentStage] || STAGE_TRANSITIONS[1];
  const videoPath = stageInfo.video;

  useEffect(() => {
    const checkVideo = async () => {
      try {
        const response = await fetch(videoPath, { method: 'HEAD' });
        if (response.ok) {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error('Video play error:', err);
              completeTransition(); // 재생 실패 시 바로 다음 스테이지
            });
          }
        } else {
          completeTransition(); // 비디오 없으면 바로 다음 스테이지
        }
      } catch (err) {
        console.error('Video check error:', err);
        completeTransition(); // 에러 시 바로 다음 스테이지
      }
    };

    checkVideo();
  }, [videoPath, completeTransition]);

  const handleVideoEnd = () => {
    completeTransition();
  };

  const handleSkip = () => {
    completeTransition();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-kakao-gray via-black to-kakao-brown z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      
      {/* 비디오 */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={handleVideoEnd}
          onError={handleVideoEnd}
          playsInline
          muted
          autoPlay
        >
          <source src={videoPath} type="video/mp4" />
        </video>

        {/* 스킵 버튼 */}
        <motion.button
          className="absolute bottom-8 right-8 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold backdrop-blur-sm transition-all border-2 border-white/30"
          onClick={handleSkip}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05, borderColor: 'rgba(254, 229, 0, 0.8)' }}
          whileTap={{ scale: 0.95 }}
        >
          건너뛰기 →
        </motion.button>

        {/* Stage 번호 표시 */}
        <motion.div
          className="absolute top-8 left-8 text-white/50 font-bold text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          STAGE {currentStage} / 4
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
