import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import DictionaryModal from './DictionaryModal';
import EmailTranslator from './EmailTranslator';

const MainScreen = () => {
  const {
    startGame,
    setStage,
    inventory,
    hasItem,
    openDictionary,
    openEmailTranslator,
    hasCompletedAllStages,
  } = useGame();

  const [showStageSelect, setShowStageSelect] = useState(false);
  const allStagesCompleted = hasCompletedAllStages();

  const handleStartGame = () => {
    if (allStagesCompleted) {
      // 모든 스테이지 완료 시 스테이지 선택 UI 표시
      setShowStageSelect(true);
    } else {
      // 첫 플레이 시 바로 Stage 1부터 시작
      setStage(1);
      startGame();
    }
  };

  const handleStageSelect = (stage) => {
    setStage(stage);
    startGame();
  };

  return (
    <>
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

        {/* 인벤토리 표시 - 우측 상단 (모든 스테이지 완료 시에만) */}
        {allStagesCompleted && inventory.length > 0 && (
          <motion.div
            className="absolute top-8 right-8 z-20 flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {inventory.map((item, index) => (
              <motion.button
                key={item.id}
                className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl flex items-center justify-center text-3xl hover:scale-110 hover:bg-kakao-yellow transition-all"
                onClick={() => {
                  if (item.id === 'dictionary') openDictionary();
                  if (item.id === 'email-helper') openEmailTranslator();
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                title={item.name}
              >
                {item.icon}
              </motion.button>
            ))}
          </motion.div>
        )}

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
          <AnimatePresence mode="wait">
            {!showStageSelect ? (
              <motion.button
                className="px-12 py-5 bg-kakao-yellow text-kakao-brown text-2xl font-bold rounded-full shadow-2xl hover:bg-yellow-400 transition-all duration-300"
                onClick={handleStartGame}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                {allStagesCompleted ? '연습 모드' : '게임 시작'}
              </motion.button>
            ) : (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <p className="text-white text-xl font-semibold text-center mb-6">
                  연습할 스테이지를 선택하세요
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((stage) => (
                    <motion.button
                      key={stage}
                      className="px-8 py-4 bg-white/90 backdrop-blur-sm text-kakao-brown text-lg font-bold rounded-2xl shadow-xl hover:bg-kakao-yellow transition-all"
                      onClick={() => handleStageSelect(stage)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: stage * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Stage {stage}
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  className="w-full mt-4 px-6 py-3 bg-white/50 text-white text-sm font-semibold rounded-xl hover:bg-white/70 transition-all"
                  onClick={() => setShowStageSelect(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  뒤로 가기
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 애니메이션 효과 - 펄스 */}
          {!showStageSelect && (
            <motion.div
              className="absolute bottom-20 text-white/70 text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              클릭하여 시작하기
            </motion.div>
          )}
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

      {/* 모달들 */}
      <DictionaryModal />
      <EmailTranslator />
    </>
  );
};

export default MainScreen;
