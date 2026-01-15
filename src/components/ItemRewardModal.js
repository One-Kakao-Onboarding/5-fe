import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const ItemRewardModal = () => {
  const { showItemModal, newItem, closeItemModal } = useGame();

  return (
    <AnimatePresence>
      {showItemModal && newItem && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 배경 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeItemModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 모달 콘텐츠 */}
          <motion.div
            className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* 별빛 효과 */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-kakao-yellow text-2xl"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>

            {/* 아이템 정보 */}
            <div className="text-center relative z-10">
              <motion.div
                className="text-7xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                {newItem.icon}
              </motion.div>

              <h2 className="text-2xl font-bold text-kakao-brown mb-2">
                아이템 획득!
              </h2>

              <p className="text-xl font-semibold text-gray-800 mb-2">
                {newItem.name}
              </p>

              <p className="text-sm text-gray-600 mb-6">
                {newItem.description}
              </p>

              <motion.button
                className="bg-kakao-yellow text-kakao-brown font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition-colors"
                onClick={closeItemModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                확인
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ItemRewardModal;
