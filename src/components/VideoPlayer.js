import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [hasVideo, setHasVideo] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const stageInfo = STAGE_TRANSITIONS[currentStage] || STAGE_TRANSITIONS[1];
  const videoPath = stageInfo.video;

  useEffect(() => {
    // 비디오 존재 여부 확인
    const checkVideo = async () => {
      try {
        const response = await fetch(videoPath, { method: 'HEAD' });
        if (response.ok) {
          setHasVideo(true);
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error('Video play error:', err);
              setShowFallback(true);
            });
          }
        } else {
          setShowFallback(true);
        }
      } catch (err) {
        console.error('Video check error:', err);
        setShowFallback(true);
      }
    };

    checkVideo();

    // 비디오가 없으면 3초 후 자동 전환
    if (showFallback) {
      const timer = setTimeout(() => {
        completeTransition();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [videoPath, showFallback, completeTransition]);

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
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-kakao-yellow/20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0.6, 0.3],
              y: [0, -100, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 비디오 또는 폴백 컨텐츠 */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {hasVideo && !showFallback ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"            onEnded={handleVideoEnd}
            onError={() => setShowFallback(true)}
            playsInline
            muted
            autoPlay
          >
            <source src={videoPath} type="video/mp4" />
          </video>
        ) : (
          // 폴백 애니메이션
          <AnimatePresence>
            <motion.div
              className="text-center px-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stage Clear 아이콘 */}
              <motion.div
                className="text-9xl mb-8"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                🎉
              </motion.div>

              {/* 타이틀 */}
              <motion.h1
                className="text-6xl font-bold text-kakao-yellow mb-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {stageInfo.title}
              </motion.h1>

              {/* 서브타이틀 */}
              <motion.p
                className="text-2xl text-white mb-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {stageInfo.subtitle}
              </motion.p>

              {/* 다음 스테이지 힌트 */}
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 inline-block"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-lg text-kakao-yellow font-semibold mb-2">
                  다음 미션
                </p>
                <p className="text-white text-base">
                  {stageInfo.nextStage}
                </p>
              </motion.div>

              {/* 로딩 바 */}
              <motion.div
                className="mt-12 w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  className="h-full bg-kakao-yellow"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

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
