import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const ProgressBar = () => {
  const { currentStage } = useGame();
  const progress = (currentStage / 4) * 100;

  const stages = [
    { number: 1, label: '입사' },
    { number: 2, label: '업무' },
    { number: 3, label: '휴가' },
    { number: 4, label: '회고' },
  ];

  return (
    <div className="w-full bg-white shadow-md px-6 py-4 relative z-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          {stages.map((stage) => (
            <div
              key={stage.number}
              className="flex flex-col items-center"
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStage >= stage.number
                    ? 'bg-kakao-yellow text-kakao-brown'
                    : 'bg-gray-200 text-gray-400'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: stage.number * 0.1 }}
              >
                {stage.number}
              </motion.div>
              <span className={`text-xs mt-1 ${
                currentStage >= stage.number ? 'text-kakao-brown font-semibold' : 'text-gray-400'
              }`}>
                {stage.label}
              </span>
            </div>
          ))}
        </div>

        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-kakao-yellow"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
