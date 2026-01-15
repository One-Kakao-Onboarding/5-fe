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

  const allStagesCompleted = hasCompletedAllStages();

  const handleStartGame = () => {
    // 첫 플레이 시 바로 Stage 1부터 시작
    setStage(1);
    startGame();
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
                <img src={item.icon}></img>
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
          </motion.div>

          {/* 게임 시작 버튼 또는 스테이지 선택 */}
          <AnimatePresence mode="wait">
            {!allStagesCompleted ? (
              // 모든 스테이지 클리어 전: 게임 시작 버튼만 표시
              <motion.button
            key="start-button"
            className="
              fixed
              bottom-20
              px-12 py-5
              bg-kakao-yellow text-kakao-brown
              text-2xl font-bold
              rounded-full shadow-2xl
              hover:bg-yellow-400
              transition-all duration-300
            "
            onClick={handleStartGame}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 40 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            게임 시작
          </motion.button>
            ) : (
              // 모든 스테이지 클리어 후: 스테이지 선택 버튼 바로 표시
              <motion.div
                key="stage-select"
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <p className="text-white text-xl font-semibold text-center mb-6 drop-shadow-lg">
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
                      transition={{ delay: 0.7 + stage * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Stage {stage}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 애니메이션 효과 - 펄스 */}
          {!allStagesCompleted && (
            <motion.div
              className="absolute bottom-20 text-white/70 text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              클릭하여 시작하기
            </motion.div>
          )}
        </div>
      </div>

      {/* 모달들 */}
      <DictionaryModal />
      <EmailTranslator />
    </>
  );
};

export default MainScreen;
