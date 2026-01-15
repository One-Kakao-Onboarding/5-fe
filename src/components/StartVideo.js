import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const StartVideo = () => {
  const { completeStartVideo } = useGame();
  const videoRef = useRef(null);

  const videoPath = '/assets/video/start.mp4';

  useEffect(() => {
    const checkVideo = async () => {
      try {
        const response = await fetch(videoPath, { method: 'HEAD' });
        if (!response.ok) {
          completeStartVideo();
        }
      } catch (err) {
        console.error('Video check error:', err);
        completeStartVideo();
      }
    };

    checkVideo();
  }, [videoPath, completeStartVideo]);

  const handleVideoEnd = () => {
    completeStartVideo();
  };

  const handleVideoError = () => {
    completeStartVideo();
  };

  const handleSkip = () => {
    completeStartVideo();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 비디오 */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        onEnded={handleVideoEnd}
        onError={handleVideoError}
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
    </motion.div>
  );
};

export default StartVideo;
