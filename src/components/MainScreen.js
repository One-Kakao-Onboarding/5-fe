import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const MainScreen = () => {
  const { startGame } = useGame();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/assets/image/main-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 오버레이 - 버튼 가독성 향상 */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* 타이틀 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            판교 생존기
          </h1>
          <p className="text-2xl text-white/90 drop-shadow-lg">
            당신의 판교 생활을 시작해보세요
          </p>
        </motion.div>

        {/* 게임 시작 버튼 */}
        <motion.button
          className="px-12 py-5 bg-kakao-yellow text-kakao-brown text-2xl font-bold rounded-full shadow-2xl hover:bg-yellow-400 transition-all duration-300"
          onClick={startGame}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          게임 시작
        </motion.button>

        {/* 애니메이션 효과 - 펄스 */}
        <motion.div
          className="absolute bottom-20 text-white/70 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          클릭하여 시작하기
        </motion.div>
      </div>

      {/* 데코레이션 요소들 */}
      <motion.div
        className="absolute top-10 left-10 text-6xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        💼
      </motion.div>

      <motion.div
        className="absolute top-20 right-20 text-5xl"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      >
        💻
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-20 text-5xl"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      >
        📱
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-32 text-6xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.8,
        }}
      >
        ☕
      </motion.div>
    </div>
  );
};

export default MainScreen;
