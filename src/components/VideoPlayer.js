import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const VideoPlayer = () => {
  const { completeTransition, currentStage } = useGame();
  const videoRef = useRef(null);

  // 비디오 경로 (플레이스홀더)
  const videoPath = '/assets/video/level_up.mp4';

  useEffect(() => {
    // 비디오가 로드되면 자동 재생
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Video play error:', err);
      });
    }
  }, []);

  const handleVideoEnd = () => {
    completeTransition();
  };

  const handleSkip = () => {
    completeTransition();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 비디오 플레이어 */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          className="max-w-full max-h-full"
          onEnded={handleVideoEnd}
          playsInline
        >
          <source src={videoPath} type="video/mp4" />
          <div className="text-white text-center">
            <p className="text-2xl mb-4">비디오를 로드할 수 없습니다.</p>
            <button
              onClick={handleSkip}
              className="bg-kakao-yellow text-kakao-brown px-6 py-3 rounded-full font-bold"
            >
              다음으로
            </button>
          </div>
        </video>

        {/* 스킵 버튼 */}
        <motion.button
          className="absolute bottom-8 right-8 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-full font-semibold backdrop-blur-sm transition-all"
          onClick={handleSkip}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          건너뛰기 →
        </motion.button>

        {/* 스테이지 정보 */}
        <motion.div
          className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-kakao-yellow text-kakao-brown px-8 py-4 rounded-full font-bold text-xl shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Stage {currentStage} Clear! 🎉
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
