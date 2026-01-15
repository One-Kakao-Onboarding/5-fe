import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const StartVideo = () => {
  const { completeStartVideo } = useGame();
  const videoRef = useRef(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const videoPath = '/assets/video/start.mp4';

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
        completeStartVideo();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [videoPath, showFallback, completeStartVideo]);

  const handleVideoEnd = () => {
    completeStartVideo();
  };

  const handleSkip = () => {
    completeStartVideo();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 비디오 또는 폴백 컨텐츠 */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {hasVideo && !showFallback ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={handleVideoEnd}
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
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 로고/아이콘 */}
              <motion.div
                className="text-9xl mb-8"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                💼
              </motion.div>

              {/* 타이틀 */}
              <motion.h1
                className="text-6xl font-bold text-kakao-yellow mb-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                판교 생존기
              </motion.h1>

              {/* 서브타이틀 */}
              <motion.p
                className="text-2xl text-white"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                당신의 판교 적응기가 시작됩니다...
              </motion.p>

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
                  transition={{ duration: 2, ease: 'linear' }}
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
      </div>
    </motion.div>
  );
};

export default StartVideo;
